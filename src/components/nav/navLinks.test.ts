import { describe, it, expect } from 'vitest';
import { getNavLinks } from './navLinks';
import type { CvData } from '@/lib/cv-types';

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
    ...overrides,
  } as CvData;
}

describe('getNavLinks', () => {
  it('always includes Home, About, Experience, Skills, and Contact', () => {
    const links = getNavLinks(makeCv());
    const ids = links.map(l => l.id);
    expect(ids).toContain('top');
    expect(ids).toContain('about');
    expect(ids).toContain('experience');
    expect(ids).toContain('skills');
    expect(ids).toContain('contact');
  });

  it('does NOT include Education, Certifications, Languages, or Honors when their data is empty', () => {
    const links = getNavLinks(makeCv());
    const ids = links.map(l => l.id);
    expect(ids).not.toContain('education');
    expect(ids).not.toContain('certifications');
    expect(ids).not.toContain('languages');
    expect(ids).not.toContain('honors');
  });

  it('includes Education when education has at least one entry', () => {
    const links = getNavLinks(makeCv({ education: [{ institution: 'X', degree: 'B.Sc.' }] }));
    expect(links.find(l => l.id === 'education')).toBeDefined();
  });

  it('includes Certifications when certifications has at least one entry', () => {
    const links = getNavLinks(makeCv({ certifications: ['Cert A'] }));
    expect(links.find(l => l.id === 'certifications')).toBeDefined();
  });

  it('includes Languages when languages has at least one entry', () => {
    const links = getNavLinks(
      makeCv({ languages: [{ language: 'English', proficiency: 'Native' }] }),
    );
    expect(links.find(l => l.id === 'languages')).toBeDefined();
  });

  it('includes Honors when honors_awards has at least one entry', () => {
    const links = getNavLinks(makeCv({ honors_awards: ['Best Engineer'] }));
    expect(links.find(l => l.id === 'honors')).toBeDefined();
  });

  it('places Contact last', () => {
    const links = getNavLinks(makeCv());
    expect(links[links.length - 1]?.id).toBe('contact');
  });

  it('places Home first', () => {
    const links = getNavLinks(makeCv());
    expect(links[0]?.id).toBe('top');
  });
});
