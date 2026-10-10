import { describe, it, expect } from 'vitest';
import { loadProjectsFromMd } from './projects-md';

describe('loadProjectsFromMd', () => {
  it('parses both projects from docs/projects.md', () => {
    const projects = loadProjectsFromMd();
    expect(projects.length).toBe(2);
  });

  it('extracts client name from parenthetical in the title', () => {
    const projects = loadProjectsFromMd();
    const enterprise = projects.find(p => p.name.includes('Enterprise Project Management'));
    expect(enterprise).toBeDefined();
    expect(enterprise!.client).toBe('Global Client');
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
    const nop = projects.find(p => p.name.includes('nopCommerce'))!;
    expect(nop.scope).toBeDefined();
    expect(nop.scope).toMatch(/full-stack/i);
    expect(nop.impact).toBeDefined();
    expect(nop.impact).toMatch(/20.*40%/);
    expect(nop.contributions.length).toBe(3);
    expect(nop.contributions[0]).toMatch(/plugins/i);
  });

  it('extracts comma-separated stack lines for both projects', () => {
    const projects = loadProjectsFromMd();
    const enterprise = projects.find(p => p.name.includes('Enterprise'))!;
    const nop = projects.find(p => p.name.includes('nopCommerce'))!;
    expect(enterprise.stack).toEqual(['Angular', 'Syncfusion', '.NET']);
    expect(nop.stack).toEqual(['.NET', 'SQL Server', 'Razor Pages']);
  });

  it('does not return blocks that are too sparse to be real projects', () => {
    const projects = loadProjectsFromMd();
    // All returned projects should have at least one contribution or stack item.
    for (const p of projects) {
      expect(p.contributions.length > 0 || p.stack.length > 0).toBe(true);
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
