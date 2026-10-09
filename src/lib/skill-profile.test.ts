import { describe, it, expect } from 'vitest';
import {
  parseMonthYear,
  computeYearsOfUse,
  getSkillProfile,
  TECHNICAL_SKILLS,
  PROFICIENCY_LABELS,
} from './skill-profile';
import type { CvData } from './cv-types';

// Minimal CV fixture — only the fields computeYearsOfUse reads.
const cvFixture: CvData = {
  personal_information: {
    name: 'Test User',
    current_title: 'Senior Engineer',
    headline: 'Test',
    location: 'Test City',
    phone: '0000000000',
    email: 'test@example.com',
    address: 'private',
    linkedin: 'linkedin.com/in/test',
    website: 'test.example.com',
  },
  summary: 'Test summary',
  top_skills: [],
  languages: [],
  certifications: [],
  honors_awards: [],
  experience: [
    {
      company: 'Brain Station 23',
      title: 'Senior Software Engineer II',
      start_date: 'November 2018',
      end_date: 'Present',
      duration: '7 years 11 months',
      location: 'Dhaka',
      responsibilities: [
        'Designed backend systems using C# .NET Core with SQL Server.',
        'Built REST APIs and Angular frontends with TypeScript.',
        'Delivered Android applications and client integrations.',
      ],
    },
    {
      company: '2BitTechnology Ltd.',
      title: 'Project Manager',
      start_date: 'December 2017',
      end_date: 'Present',
      duration: '8 years',
      location: 'Dhaka',
      responsibilities: ['Led multiple client projects from planning to delivery.'],
    },
  ],
  education: [],
};

describe('parseMonthYear', () => {
  it('parses "Month YYYY" strings', () => {
    const d = parseMonthYear('November 2018');
    expect(d).not.toBeNull();
    expect(d!.getFullYear()).toBe(2018);
    expect(d!.getMonth()).toBe(10); // November is 10
  });

  it('is case-insensitive', () => {
    const d = parseMonthYear('november 2018');
    expect(d).not.toBeNull();
    expect(d!.getFullYear()).toBe(2018);
  });

  it('trims whitespace', () => {
    const d = parseMonthYear('  November 2018  ');
    expect(d).not.toBeNull();
  });

  it('returns null for invalid month names', () => {
    expect(parseMonthYear('Smarch 2020')).toBeNull();
  });

  it('returns null for missing year', () => {
    expect(parseMonthYear('November')).toBeNull();
  });

  it('returns null for missing month', () => {
    expect(parseMonthYear('2018')).toBeNull();
  });

  it('returns null for empty / non-string input', () => {
    expect(parseMonthYear('')).toBeNull();
    // @ts-expect-error testing runtime guard
    expect(parseMonthYear(null)).toBeNull();
    // @ts-expect-error testing runtime guard
    expect(parseMonthYear(123)).toBeNull();
  });

  it('returns null for "Present" / unparseable LinkedIn values', () => {
    expect(parseMonthYear('Present')).toBeNull();
  });
});

describe('computeYearsOfUse', () => {
  it('returns integer years for a literal anchor', () => {
    // November 2018 → at least 7 years in 2026
    const years = computeYearsOfUse(cvFixture, { kind: 'literal', start: 'November 2018' });
    expect(years).not.toBeNull();
    expect(years!).toBeGreaterThanOrEqual(7);
  });

  it('returns null for an unparseable literal anchor', () => {
    expect(computeYearsOfUse(cvFixture, { kind: 'literal', start: 'invalid' })).toBeNull();
  });

  it('finds the earliest matching experience for a keyword anchor', () => {
    const years = computeYearsOfUse(cvFixture, {
      kind: 'keyword',
      keywords: ['C#', '.NET'],
    });
    expect(years).not.toBeNull();
    expect(years!).toBeGreaterThanOrEqual(7);
  });

  it('returns null when no experience matches the keywords', () => {
    const years = computeYearsOfUse(cvFixture, {
      kind: 'keyword',
      keywords: ['Rust', 'Elixir'],
    });
    expect(years).toBeNull();
  });

  it('handles kind: "all" by taking the earliest start_date', () => {
    const years = computeYearsOfUse(cvFixture, { kind: 'all' });
    expect(years).not.toBeNull();
    // December 2017 is the earliest → ~8 years in 2026
    expect(years!).toBeGreaterThanOrEqual(8);
  });

  it('respects a custom "now" date for deterministic tests', () => {
    // 2024-06-15 → November 2018 = 5 years (anniversary Nov 1 hasn't passed in June)
    const now = new Date(2024, 5, 15);
    const years = computeYearsOfUse(cvFixture, { kind: 'literal', start: 'November 2018' }, now);
    expect(years).toBe(5);
  });
});

describe('getSkillProfile', () => {
  it('returns all 7 technical categories with at least one skill each', () => {
    const profile = getSkillProfile();
    expect(profile.technical).toHaveLength(7);
    for (const cat of profile.technical) {
      const skills = TECHNICAL_SKILLS[cat.label];
      expect(skills, `category ${cat.label} missing from TECHNICAL_SKILLS`).toBeDefined();
      expect(skills.length).toBeGreaterThan(0);
    }
  });

  it('returns at least 5 professional skills, each with icon + context', () => {
    const profile = getSkillProfile();
    expect(profile.professional.length).toBeGreaterThanOrEqual(5);
    for (const p of profile.professional) {
      expect(p.icon).toBeDefined();
      expect(p.context.length).toBeGreaterThan(0);
    }
  });

  it('every technical skill has a valid proficiency', () => {
    const valid: ReadonlyArray<string> = ['expert', 'proficient', 'working'];
    for (const list of Object.values(TECHNICAL_SKILLS)) {
      for (const s of list) {
        expect(valid).toContain(s.proficiency);
      }
    }
  });
});

describe('PROFICIENCY_LABELS', () => {
  it('has an entry for every proficiency level', () => {
    expect(PROFICIENCY_LABELS.expert).toBeDefined();
    expect(PROFICIENCY_LABELS.proficient).toBeDefined();
    expect(PROFICIENCY_LABELS.working).toBeDefined();
  });
});
