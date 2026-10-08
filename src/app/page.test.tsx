import { describe, it, expect } from 'vitest';
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
 */
describe('Home page — end-to-end privacy', () => {
  it('the home address never appears in the rendered HTML', () => {
    const html = renderToString(<Home />);
    const address = cvDataRaw.personal_information.address;
    const fragments = address.split(/,\s*/).map(s => s.trim());
    for (const fragment of fragments) {
      expect(html).not.toContain(fragment);
    }
  });

  it('all 9 section ids are present (or the conditional ones are hidden by data)', () => {
    const html = renderToString(<Home />);
    // Always-rendered sections:
    expect(html).toContain('id="top"');
    expect(html).toContain('id="about"');
    expect(html).toContain('id="experience"');
    expect(html).toContain('id="skills"');
    expect(html).toContain('id="contact"');
    // Conditional sections (data-dependent): with this CV they all have entries,
    // so all 4 conditional ids should be present too. If the data changes,
    // the conditional sections will return null and these will fail — that
    // is correct behavior, the test will remind us to update the nav too.
    expect(html).toContain('id="education"');
    expect(html).toContain('id="certifications"');
    expect(html).toContain('id="languages"');
    expect(html).toContain('id="honors"');
  });

  it('the rendered HTML contains the candidate name', () => {
    const html = renderToString(<Home />);
    expect(html).toContain('Sanjit Majumdar');
  });
});
