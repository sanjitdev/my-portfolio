import { describe, it, expect } from 'vitest';
import { loadProjectsFromMd } from './projects-md';

describe('loadProjectsFromMd', () => {
  it('parses every project block from docs/projects.md', () => {
    const projects = loadProjectsFromMd();
    // 2 fully-described projects + 7 sparse title-only projects added
    // from the candidate's project list (Title / Role / Year). The
    // first item in that list (Wellbook) was merged into the
    // Enterprise PM block as the client name, so the count is 9, not 10.
    expect(projects.length).toBe(9);
  });

  it('extracts client name from parenthetical in the title', () => {
    const projects = loadProjectsFromMd();
    const enterprise = projects.find(p => p.name.includes('Enterprise Project Management'));
    expect(enterprise).toBeDefined();
    // The Enterprise PM project is at Wellbook (per the candidate's
    // project list), so the client is "Wellbook".
    expect(enterprise!.client).toBe('Wellbook');
  });

  it('parses the bullet-only format (Enterprise PM Platform) into contributions', () => {
    const projects = loadProjectsFromMd();
    const enterprise = projects.find(p => p.name.includes('Enterprise Project Management'))!;
    expect(enterprise.contributions.length).toBeGreaterThanOrEqual(5);
    expect(enterprise.contributions[0]).toMatch(/project management portal/i);
    expect(enterprise.contributions.some(c => /CI|continuous integration/i.test(c))).toBe(true);
  });

  it('parses the structured format (nopCommerce) into scope, impact, contributions', () => {
    const projects = loadProjectsFromMd();
    // The structured nopCommerce project is the one that contains
    // "Global Retail Clients" in its name and has a full
    // Scope/Impact/Contributions block.
    const nop = projects.find(p => p.name.includes('Global Retail Clients'))!;
    expect(nop.scope).toBeDefined();
    expect(nop.scope).toMatch(/full-stack/i);
    expect(nop.impact).toBeDefined();
    expect(nop.impact).toMatch(/20.*40%/);
    expect(nop.contributions.length).toBe(3);
    expect(nop.contributions[0]).toMatch(/plugins/i);
  });

  it('parses Description: as scope', () => {
    const projects = loadProjectsFromMd();
    const liono = projects.find(p => p.name === 'LionO CRM Integration in NopCommerce')!;
    expect(liono.scope).toBeDefined();
    expect(liono.scope).toMatch(/Integrate LionO CRM/i);
    expect(liono.scope).toMatch(/6 plugins/i);
  });

  it('parses Responsibilities: as contributions', () => {
    const projects = loadProjectsFromMd();
    const liono = projects.find(p => p.name === 'LionO CRM Integration in NopCommerce')!;
    expect(liono.contributions).toContain('Lead Developer and Designer');

    const rma = projects.find(p => p.name === 'LionOBytes CRM RMA')!;
    expect(rma.contributions).toContain('Develop API and integrate that in UI');
  });

  it('parses Technologies: as a comma-separated stack', () => {
    const projects = loadProjectsFromMd();
    const liono = projects.find(p => p.name === 'LionO CRM Integration in NopCommerce')!;
    expect(liono.stack).toEqual(['.NET Core', 'C#', 'JavaScript', 'jQuery', 'Razor', 'SQL Server']);

    const rma = projects.find(p => p.name === 'LionOBytes CRM RMA')!;
    expect(rma.stack).toEqual(['.NET', 'Angular', 'PostgreSQL']);
  });

  it('does not split a Responsibilities body sentence into a new project title', () => {
    // Regression: "Lead Developer and Designer" and "Develop API and
    // integrate that in UI" appear as body content of Responsibilities
    // blocks, not as project titles. Without the conjunction filter
    // they would each be mis-detected as a new project (because the
    // next non-blank line is a Technologies: label).
    const projects = loadProjectsFromMd();
    expect(projects.find(p => p.name === 'Lead Developer and Designer')).toBeUndefined();
    expect(projects.find(p => p.name === 'Develop API and integrate that in UI')).toBeUndefined();
  });

  it('extracts comma-separated stack lines for both fully-described projects', () => {
    const projects = loadProjectsFromMd();
    const enterprise = projects.find(p => p.name.includes('Enterprise'))!;
    const nop = projects.find(p => p.name.includes('Global Retail Clients'))!;
    expect(enterprise.stack).toEqual(['Angular', 'Syncfusion', '.NET']);
    expect(nop.stack).toEqual(['.NET', 'SQL Server', 'Razor Pages']);
  });

  it('does not return blocks that are too sparse to be real projects', () => {
    const projects = loadProjectsFromMd();
    // All returned projects should have at least one contribution, stack
    // item, role, or year. A bare title with no other metadata is not a
    // project.
    for (const p of projects) {
      const hasContent =
        p.contributions.length > 0 ||
        p.stack.length > 0 ||
        Boolean(p.role) ||
        Boolean(p.year) ||
        Boolean(p.scope) ||
        Boolean(p.impact);
      expect(hasContent).toBe(true);
    }
  });

  it('every parsed project passes ProjectMdSchema validation', () => {
    const projects = loadProjectsFromMd();
    // Already validated at parse time — this is a smoke test that the
    // throw path isn't being hit.
    for (const p of projects) {
      expect(p.name.length).toBeGreaterThan(0);
    }
  });
});
