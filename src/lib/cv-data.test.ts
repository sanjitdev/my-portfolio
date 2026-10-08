import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadCvData, getDisplayContact, formatDateRange, computeBuildTimestamp } from './cv-data';
import cvDataRaw from '../../docs/LinkedIn_CV.json';
import { CvDataSchema, PublicContactSchema } from './cv-types';

describe('cv-data', () => {
  describe('loadCvData', () => {
    it('returns a valid CvData object', () => {
      const cv = loadCvData();
      expect(cv).toBeDefined();
      expect(cv.personal_information).toBeDefined();
      expect(cv.personal_information.name).toBe('Sanjit Majumdar');
    });

    it('has all required top-level fields', () => {
      const cv = loadCvData();
      expect(cv.summary).toBeTypeOf('string');
      expect(Array.isArray(cv.top_skills)).toBe(true);
      expect(Array.isArray(cv.experience)).toBe(true);
      expect(Array.isArray(cv.education)).toBe(true);
      expect(Array.isArray(cv.certifications)).toBe(true);
      expect(Array.isArray(cv.languages)).toBe(true);
      expect(Array.isArray(cv.honors_awards)).toBe(true);
    });

    it('matches the source JSON via Zod validation', () => {
      const result = CvDataSchema.safeParse(cvDataRaw);
      expect(result.success).toBe(true);
    });

    it('returns a non-empty experience list', () => {
      const cv = loadCvData();
      expect(cv.experience.length).toBeGreaterThan(0);
    });

    it('returns a non-empty skills list', () => {
      const cv = loadCvData();
      expect(cv.top_skills.length).toBeGreaterThan(0);
    });
  });

  describe('getDisplayContact (privacy)', () => {
    it('does NOT include the address field', () => {
      const cv = loadCvData();
      const contact = getDisplayContact(cv);
      expect(contact).not.toHaveProperty('address');
    });

    it('includes all other contact fields', () => {
      const cv = loadCvData();
      const contact = getDisplayContact(cv);
      expect(contact).toHaveProperty('name');
      expect(contact).toHaveProperty('email');
      expect(contact).toHaveProperty('phone');
      expect(contact).toHaveProperty('linkedin');
      expect(contact).toHaveProperty('website');
      expect(contact).toHaveProperty('current_title');
      expect(contact).toHaveProperty('headline');
      expect(contact).toHaveProperty('location');
    });

    it('preserves the same values as PersonalInfo for non-address fields', () => {
      const cv = loadCvData();
      const contact = getDisplayContact(cv);
      expect(contact.name).toBe(cv.personal_information.name);
      expect(contact.email).toBe(cv.personal_information.email);
      expect(contact.phone).toBe(cv.personal_information.phone);
    });

    it('PublicContactSchema.omit enforces address exclusion at type level', () => {
      // This is a type-level test. If it compiles, the contract holds.
      const contact = PublicContactSchema.parse(loadCvData().personal_information);
      // @ts-expect-error - address should not be on PublicContact
      const _checkAddress = contact.address;
      expect(_checkAddress).toBeUndefined();
    });
  });

  describe('formatDateRange', () => {
    it('formats "Present" as the end date with an en-dash', () => {
      expect(formatDateRange('January 2026', 'Present')).toBe('January 2026 – Present');
    });

    it('handles lowercase "present"', () => {
      expect(formatDateRange('January 2026', 'present')).toBe('January 2026 – Present');
    });

    it('formats two specific date ranges with an en-dash', () => {
      expect(formatDateRange('January 2026', 'February 2026')).toBe('January 2026 – February 2026');
    });

    it('handles months at the start of the year', () => {
      expect(formatDateRange('January 2014', 'December 2017')).toBe('January 2014 – December 2017');
    });
  });

  describe('computeBuildTimestamp', () => {
    it('returns a valid ISO 8601 string', () => {
      const ts = computeBuildTimestamp();
      expect(ts).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/);
    });

    it('returns a date close to "now"', () => {
      const before = Date.now();
      const ts = computeBuildTimestamp();
      const after = Date.now();
      const tsMs = new Date(ts).getTime();
      expect(tsMs).toBeGreaterThanOrEqual(before - 5); // 5ms tolerance
      expect(tsMs).toBeLessThanOrEqual(after + 5);
    });
  });

  describe('address privacy in built output', () => {
    it('the home address string does NOT appear in the built index.html', () => {
      // The build output is at .next/server/app/index.html after `bun run build`.
      // This test enforces the privacy guarantee at the rendered-output level.
      const builtHtmlPath = resolve(process.cwd(), '.next/server/app/index.html');
      if (!existsSync(builtHtmlPath)) {
        // Skip if build hasn't been run yet (e.g., during initial test runs in CI before build)
        return;
      }
      const builtHtml = readFileSync(builtHtmlPath, 'utf-8');
      const address = cvDataRaw.personal_information.address;
      // The address contains parts (street, area, district); search for any one of them.
      const addressFragments = address.split(/,\s*/).map(s => s.trim());
      for (const fragment of addressFragments) {
        expect(builtHtml).not.toContain(fragment);
      }
    });
  });
});
