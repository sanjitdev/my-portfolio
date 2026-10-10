import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { z } from 'zod';

/**
 * Curated Projects shape, parsed from `docs/projects.md`.
 *
 * Each project has:
 *  - `name`: the project title (from the first heading of the block)
 *  - `client` (optional): a parenthetical client/company hint from the title
 *    (e.g. "Enterprise Project Management Platform (Global Client)")
 *  - `scope` (optional): one-sentence framing of the project
 *  - `impact` (optional): one-sentence outcome / business result
 *  - `contributions`: list of concrete things the candidate did
 *  - `stack`: list of technologies (parsed from a comma-separated line)
 *
 * The parser supports two source formats and normalizes them:
 *
 *  1. **Structured**: explicit `Scope:`, `Impact:`, `Contributions:` lines
 *     followed by content (used by the nopCommerce entry).
 *  2. **Bullet-only**: a list of `* ...` lines (used by the Enterprise PM
 *     Platform entry). Bullets become `contributions`; `scope` and
 *     `impact` are left empty (the candidate can fill them in if they
 *     want to add that structure).
 */
export const ProjectMdSchema = z.object({
  name: z.string().min(1),
  client: z.string().optional(),
  role: z.string().optional(),
  year: z.string().optional(),
  scope: z.string().optional(),
  impact: z.string().optional(),
  contributions: z.array(z.string().min(1)),
  stack: z.array(z.string().min(1)),
  link: z
    .object({
      label: z.string().min(1),
      href: z.string().url(),
    })
    .optional(),
});

export type ProjectMd = z.infer<typeof ProjectMdSchema>;

const PROJECTS_MD_PATH = resolve(process.cwd(), 'docs/projects.md');

/**
 * Reads `docs/projects.md` and returns the curated projects array.
 *
 * Fails the build (throws) if the file is missing or malformed — a
 * portfolio with a broken Projects section is worse than one that fails
 * to build.
 */
export function loadProjectsFromMd(): ProjectMd[] {
  let raw: string;
  try {
    raw = readFileSync(PROJECTS_MD_PATH, 'utf-8');
  } catch (err) {
    throw new Error(
      `Could not read docs/projects.md — required for the Projects section. ${(err as Error).message}`,
    );
  }

  const blocks = splitIntoBlocks(raw);
  const projects: ProjectMd[] = [];
  for (const block of blocks) {
    const parsed = parseBlock(block);
    if (parsed) projects.push(parsed);
  }

  // Validate every project with Zod so the build fails loudly on malformed
  // data — same fail-fast principle as cv-data.ts.
  for (const p of projects) {
    const r = ProjectMdSchema.safeParse(p);
    if (!r.success) {
      throw new Error(
        `Parsed project failed validation: ${JSON.stringify(r.error.issues, null, 2)}`,
      );
    }
  }

  return projects;
}

interface RawProjectBlock {
  /** First line of the block — the project title. */
  title: string;
  /** Subsequent lines (after the title). */
  body: string[];
}

/**
 * Splits the markdown into project blocks. A "title" is a non-bullet,
 * non-blank line that is NOT one of the structured labels and that
 * satisfies at least one of:
 *
 *   - contains a parenthetical (e.g. "Project (Client)")
 *   - is followed (after possibly some blanks) by a `*` bullet or a
 *     `Scope:` / `Impact:` / `Contributions:` / `Stack:` label.
 *
 * The "followed by" check is what distinguishes a project title from a
 * stray comma-separated stack line (which would otherwise be ambiguous
 * with a short title).
 */
function splitIntoBlocks(raw: string): RawProjectBlock[] {
  const lines = raw.split('\n');
  const blocks: RawProjectBlock[] = [];
  let current: RawProjectBlock | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;
    const trimmed = line.trim();

    if (current === null) {
      // No current block — look for a title line.
      if (isTitleLine(trimmed, lines, i)) {
        current = { title: trimmed, body: [] };
      }
      continue;
    }

    // We have a current block. Add the line to its body, unless it
    // starts a new title.
    if (isTitleLine(trimmed, lines, i)) {
      blocks.push(current);
      current = { title: trimmed, body: [] };
    } else {
      current.body.push(line);
    }
  }
  if (current) blocks.push(current);

  return blocks;
}

/**
 * Returns true if `trimmed` is a project title line. A title line is:
 *  - non-blank
 *  - not a bullet (`* ...` / `- ...`)
 *  - not a structured label (`Scope:`, `Impact:`, `Contributions:`,
 *    `Stack:`)
 *  - either contains a parenthetical client name OR is followed
 *    (after possibly some blanks) by a bullet or a structured label.
 */
function isTitleLine(trimmed: string, lines: string[], idx: number): boolean {
  if (trimmed === '') return false;
  if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) return false;
  if (
    /^(Scope|Impact|Contributions|Stack|Role|Year|Description|Responsibilities|Technologies)\s*:/i.test(
      trimmed,
    )
  ) {
    return false;
  }

  // Sentence-content filter: real project titles are short noun phrases
  // and don't contain the conjunctions "and" / "that". Lines like
  // "Lead Developer and Designer" or "Develop API and integrate that
  // in UI" are body content of a Responsibilities/Contributions block
  // — not a project title, even if a label happens to follow them.
  if (/\s+and\s+/i.test(trimmed) || /\s+that\s+/i.test(trimmed)) {
    return false;
  }

  // Heuristic A: parenthetical client name
  if (/\(.+\)/.test(trimmed)) return true;

  // Heuristic B: the next non-blank line is a bullet or structured label
  for (let j = idx + 1; j < lines.length; j++) {
    const t = lines[j]!.trim();
    if (t === '') continue;
    if (t.startsWith('* ') || t.startsWith('- ')) return true;
    if (
      /^(Scope|Impact|Contributions|Stack|Role|Year|Description|Responsibilities|Technologies)\s*:/i.test(
        t,
      )
    ) {
      return true;
    }
    // If the next non-blank line is just a comma-separated stack list
    // (e.g. ".NET, SQL Server, Razor Pages"), this is also a project
    // title (it's the nopCommerce pattern).
    if (/,/.test(t) && !/[a-z]/.test(t)) {
      // Pure uppercase / dots / commas — looks like a stack list, not
      // a title. So this line is NOT a title.
      return false;
    }
    return false;
  }
  return false;
}

/**
 * Parses a project title line. If the title contains a parenthetical
 * (e.g. "Project (Client)"), the client is extracted and the rest
 * becomes the name.
 */
function parseTitle(line: string): { name: string; client?: string } {
  const match = line.match(/^(.+?)\s*\(([^)]+)\)\s*$/);
  if (match) {
    return { name: match[1]!.trim(), client: match[2]!.trim() };
  }
  return { name: line.trim() };
}

/**
 * Parses a single project block into a `ProjectMd` (or returns null if
 * the block is too sparse to be a real project).
 */
function parseBlock(block: RawProjectBlock): ProjectMd | null {
  const { name, client } = parseTitle(block.title);
  const project: ProjectMd = {
    name,
    client,
    contributions: [],
    stack: [],
  };

  let i = 0;
  const lines = block.body;
  while (i < lines.length) {
    const raw = lines[i]!;
    const trimmed = raw.trim();

    if (trimmed === '') {
      i++;
      continue;
    }

    // `Scope: ...` or `Description: ...`
    const scopeMatch = trimmed.match(/^(Scope|Description)\s*:\s*(.+)$/i);
    if (scopeMatch) {
      project.scope = scopeMatch[2]!.trim();
      i++;
      continue;
    }

    // `Impact: ...`
    const impactMatch = trimmed.match(/^Impact\s*:\s*(.+)$/i);
    if (impactMatch) {
      project.impact = impactMatch[1]!.trim();
      i++;
      continue;
    }

    // `Role: ...` (optional metadata)
    const roleMatch = trimmed.match(/^Role\s*:\s*(.+)$/i);
    if (roleMatch) {
      project.role = roleMatch[1]!.trim();
      i++;
      continue;
    }

    // `Year: ...` (optional metadata)
    const yearMatch = trimmed.match(/^Year\s*:\s*(.+)$/i);
    if (yearMatch) {
      project.year = yearMatch[1]!.trim();
      i++;
      continue;
    }

    // `Contributions:` or `Responsibilities:` followed by bullets and/or
    // blank-separated paragraphs
    if (/^(Contributions|Responsibilities)\s*:?\s*$/i.test(trimmed)) {
      i++;
      while (i < lines.length) {
        const t = lines[i]!.trim();
        if (t === '') {
          if (i + 1 < lines.length && lines[i + 1]!.trim() !== '') {
            i++;
            continue;
          }
          break;
        }
        if (/^(Scope|Description|Impact|Stack|Contributions|Responsibilities|Technologies)\s*:/i.test(t))
          break;
        if (t.startsWith('* ') || t.startsWith('- ')) {
          project.contributions.push(t.replace(/^[*\-]\s+/, '').trim());
        } else {
          project.contributions.push(t);
        }
        i++;
      }
      continue;
    }

    // `* ...` bullet outside an explicit Contributions block
    if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
      project.contributions.push(trimmed.replace(/^[*\-]\s+/, '').trim());
      i++;
      continue;
    }

    // `Technologies: .NET Core, C#, ...` (one-line comma-separated stack)
    const techMatch = trimmed.match(/^Technologies\s*:\s*(.+)$/i);
    if (techMatch) {
      project.stack = techMatch[1]!
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
      i++;
      continue;
    }

    // Comma-separated stack line
    if (trimmed.includes(',')) {
      project.stack = trimmed
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
      i++;
      continue;
    }

    // Unknown content — skip
    i++;
  }

  if (
    project.contributions.length === 0 &&
    project.stack.length === 0 &&
    !project.role &&
    !project.year &&
    !project.scope &&
    !project.impact
  ) {
    return null;
  }

  return project;
}
