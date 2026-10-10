import { describe, it, expect } from 'vitest';
import { getNavLinks, getFlatNavLinks } from './navLinks';
import type { CvData } from '@/lib/cv-types';
import type { ProjectMd } from '@/lib/projects-md';

function makeCv(overrides: Partial<CvData> = {}): CvData {
  return {
    personal_information: {
      name: 'Test',
      current_title: 'Engineer',
      headline: 'h',
      location: 'l',
      phone: '1',
      email: 'a@b.c',
      address: 'secret',
      linkedin: 'l',
      website: 'w',
    },
    summary: 's',
    top_skills: ['x'],
    experience: [],
    education: [],
    certifications: [],
    languages: [],
    honors_awards: [],
    recommendations: [],
    ...overrides,
  } as CvData;
}

const project: ProjectMd = {
  name: 'Demo Project',
  role: 'Lead',
  year: '2024',
  scope: 'A demo project',
  contributions: ['Built it'],
  stack: ['TypeScript'],
};

describe('getNavLinks', () => {
  it('always puts Home, Experience, and Contact in primary', () => {
    const { primary } = getNavLinks([], makeCv());
    const ids = primary.map(l => l.id);
    expect(ids).toContain('top');
    expect(ids).toContain('experience');
    expect(ids).toContain('contact');
  });

  it('places Home first and Contact last inside primary', () => {
    const { primary } = getNavLinks([], makeCv());
    expect(primary[0]?.id).toBe('top');
    expect(primary[primary.length - 1]?.id).toBe('contact');
  });

  it('does NOT include Projects in primary when projects is empty', () => {
    const { primary } = getNavLinks([], makeCv());
    expect(primary.find(l => l.id === 'projects')).toBeUndefined();
  });

  it('includes Projects in primary when projects has at least one entry', () => {
    const { primary } = getNavLinks([project], makeCv());
    expect(primary.find(l => l.id === 'projects')).toBeDefined();
  });

  it('places Projects between Home and Experience when present', () => {
    const { primary } = getNavLinks([project], makeCv());
    const ids = primary.map(l => l.id);
    expect(ids.indexOf('projects')).toBeGreaterThan(ids.indexOf('top'));
    expect(ids.indexOf('projects')).toBeLessThan(ids.indexOf('experience'));
  });

  it('always includes Profile and Skills in secondary (summary and top_skills are required)', () => {
    const { secondary } = getNavLinks([], makeCv());
    expect(secondary.find(l => l.id === 'about')).toBeDefined();
    expect(secondary.find(l => l.id === 'skills')).toBeDefined();
  });

  it('secondary group contains only Profile and Skills when CV has no other extras', () => {
    const { secondary } = getNavLinks([], makeCv());
    expect(secondary.map(l => l.id)).toEqual(['about', 'skills']);
  });

  it('does NOT include Education, Certifications, Languages, Honors, or Recommendations when their data is empty', () => {
    const { secondary } = getNavLinks([], makeCv());
    const ids = secondary.map(l => l.id);
    expect(ids).not.toContain('education');
    expect(ids).not.toContain('certifications');
    expect(ids).not.toContain('languages');
    expect(ids).not.toContain('honors');
    expect(ids).not.toContain('recommendations');
  });

  it('includes Education when education has at least one entry', () => {
    const { secondary } = getNavLinks([], makeCv({ education: [{ institution: 'X', degree: 'B.Sc.' }] }));
    expect(secondary.find(l => l.id === 'education')).toBeDefined();
  });

  it('includes Certifications when certifications has at least one entry', () => {
    const { secondary } = getNavLinks([], makeCv({ certifications: ['Cert A'] }));
    expect(secondary.find(l => l.id === 'certifications')).toBeDefined();
  });

  it('includes Languages when languages has at least one entry', () => {
    const { secondary } = getNavLinks(
      [],
      makeCv({ languages: [{ language: 'English', proficiency: 'Native' }] }),
    );
    expect(secondary.find(l => l.id === 'languages')).toBeDefined();
  });

  it('includes Honors when honors_awards has at least one entry', () => {
    const { secondary } = getNavLinks([], makeCv({ honors_awards: ['Best Engineer'] }));
    expect(secondary.find(l => l.id === 'honors')).toBeDefined();
  });

  it('includes Recommendations when recommendations has at least one entry', () => {
    const { secondary } = getNavLinks(
      [],
      makeCv({
        recommendations: [
          {
            name: 'X',
            relationship: 'Y',
            date: '2025-01-01',
            body: ['Z'],
          },
        ],
      }),
    );
    expect(secondary.find(l => l.id === 'recommendations')).toBeDefined();
  });

  it('preserves the secondary order: Profile → Skills → Education → Certifications → Languages → Honors → Recommendations', () => {
    const { secondary } = getNavLinks(
      [],
      makeCv({
        summary: 's',
        education: [{ institution: 'X', degree: 'B.Sc.' }],
        certifications: ['A'],
        languages: [{ language: 'L', proficiency: 'P' }],
        honors_awards: ['H'],
        recommendations: [{ name: 'N', relationship: 'R', date: 'd', body: ['b'] }],
      }),
    );
    expect(secondary.map(l => l.id)).toEqual([
      'about',
      'skills',
      'education',
      'certifications',
      'languages',
      'honors',
      'recommendations',
    ]);
  });
});

describe('getFlatNavLinks', () => {
  it('returns primary followed by secondary in display order (no projects)', () => {
    const flat = getFlatNavLinks(
      [],
      makeCv({
        summary: 's',
        education: [{ institution: 'X', degree: 'B.Sc.' }],
      }),
    );
    expect(flat.map(l => l.id)).toEqual(['top', 'experience', 'contact', 'about', 'skills', 'education']);
  });

  it('returns primary followed by secondary in display order (with projects)', () => {
    const flat = getFlatNavLinks(
      [project],
      makeCv({
        education: [{ institution: 'X', degree: 'B.Sc.' }],
      }),
    );
    expect(flat.map(l => l.id)).toEqual([
      'top',
      'projects',
      'experience',
      'contact',
      'about',
      'skills',
      'education',
    ]);
  });
});
