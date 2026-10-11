import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderToString } from 'react-dom/server';
import Home from './page';
import cvDataRaw from '../../docs/LinkedIn_CV.json';

/**
 * Full-page privacy test: render the entire `Home` page to a string and
 * verify the home address (in any form) does NOT appear anywhere in the
 * rendered HTML. This is the strongest end-to-end privacy check.
 *
 * Unlike the build-artifact test in `lib/cv-data.test.ts`, this test does
 * not require `bun run build` to have been run — it just renders the React
 * tree to a string in-memory.
 *
 * The `Home` page is now async (Bolt 004 added a server-side LeetCode data
 * call). We mock the fetcher so the test is hermetic — the real LeetCode
 * endpoint is never contacted during unit tests.
 */

const originalFetch = globalThis.fetch;

beforeEach(() => {
  // Default mock: empty LeetCode response so the callout renders without a number.
  globalThis.fetch = vi.fn(async () => ({
    ok: true,
    status: 200,
    json: async () => ({ data: { matchedUser: null } }),
  })) as unknown as typeof fetch;
});

afterEach(() => {
  globalThis.fetch = originalFetch;
  vi.restoreAllMocks();
});

async function renderHome() {
  const element = await Home();
  return renderToString(element);
}

describe('Home page — end-to-end privacy', () => {
  it('the home address never appears in the rendered HTML', async () => {
    const html = await renderHome();
    const address = cvDataRaw.personal_information.address;
    const fragments = address.split(/,\s*/).map(s => s.trim());
    for (const fragment of fragments) {
      expect(html).not.toContain(fragment);
    }
  });

  it('all 11 section ids are present (or the conditional ones are hidden by data)', async () => {
    const html = await renderHome();
    // Always-rendered sections:
    expect(html).toContain('id="top"');
    expect(html).toContain('id="about"');
    expect(html).toContain('id="projects"');
    expect(html).toContain('id="experience"');
    expect(html).toContain('id="skills"');
    expect(html).toContain('id="leetcode-callout"');
    expect(html).toContain('id="contact"');
    // Conditional sections (data-dependent): with this CV they all have entries,
    // so all 5 conditional ids should be present too. If the data changes,
    // the conditional sections will return null and these will fail — that
    // is correct behavior, the test will remind us to update the nav too.
    expect(html).toContain('id="education"');
    expect(html).toContain('id="certifications"');
    expect(html).toContain('id="languages"');
    expect(html).toContain('id="honors"');
    expect(html).toContain('id="recommendations"');
  });

  it('the rendered HTML contains the candidate name', async () => {
    const html = await renderHome();
    expect(html).toContain('Sanjit Majumdar');
  });

  it('the home page contains a link to /leetcode (Bolt 004)', async () => {
    const html = await renderHome();
    expect(html).toContain('href="/leetcode"');
  });
});