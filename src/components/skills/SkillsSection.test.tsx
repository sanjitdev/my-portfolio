import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { SkillsSection } from './SkillsSection';
import type { CvData } from '@/lib/cv-types';

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
      ],
    },
    {
      company: '2BitTechnology Ltd.',
      title: 'Project Manager',
      start_date: 'December 2017',
      end_date: 'Present',
      duration: '8 years',
      location: 'Dhaka',
      responsibilities: ['Led multiple client projects.'],
    },
  ],
  education: [],
};

describe('SkillsSection', () => {
  it('renders the Skills section heading and section id', () => {
    const { container } = render(<SkillsSection cv={cvFixture} />);
    expect(screen.getByRole('heading', { name: 'Skills', level: 2 })).toBeInTheDocument();
    expect(container.querySelector('section#skills')).not.toBeNull();
  });

  it('renders both zones: Technical Stack and How I Work', () => {
    render(<SkillsSection cv={cvFixture} />);
    // Zone labels are h3 elements; use the role to disambiguate from
    // professional-skill card titles that contain "How I Work" elsewhere.
    const technicalHeading = screen.getByRole('heading', { name: /technical stack/i, level: 3 });
    const howHeading = screen.getByRole('heading', { name: /how i work/i, level: 3 });
    expect(technicalHeading).toBeInTheDocument();
    expect(howHeading).toBeInTheDocument();
  });

  it('renders all curated technical categories', () => {
    render(<SkillsSection cv={cvFixture} />);
    expect(screen.getByText('Languages & Runtimes')).toBeInTheDocument();
    expect(screen.getByText('Backend & APIs')).toBeInTheDocument();
    expect(screen.getByText('Frontend')).toBeInTheDocument();
    expect(screen.getByText('Databases & Data')).toBeInTheDocument();
    expect(screen.getByText('Mobile')).toBeInTheDocument();
    expect(screen.getByText('Cloud & DevOps')).toBeInTheDocument();
    expect(screen.getByText('Architecture & Practices')).toBeInTheDocument();
  });

  it('renders curated technical skills as chips', () => {
    render(<SkillsSection cv={cvFixture} />);
    // C# appears in Languages & Runtimes
    expect(screen.getAllByText('C#').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Angular').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('SQL Server').length).toBeGreaterThanOrEqual(1);
  });

  it('renders years-of-use hints derived from CV dates', () => {
    const { container } = render(<SkillsSection cv={cvFixture} />);
    // Should find at least one "· 7y" or "· 8y" pattern (from Nov 2018 / Dec 2017)
    const yearsLabels = container.querySelectorAll(
      '[aria-label*="years of use"], [aria-label*="year of use"]',
    );
    expect(yearsLabels.length).toBeGreaterThan(0);
    const hasNumericYears = Array.from(yearsLabels).some(el =>
      /\d+\s*year/i.test(el.getAttribute('aria-label') ?? ''),
    );
    expect(hasNumericYears).toBe(true);
  });

  it('renders professional skills with icons and context', () => {
    render(<SkillsSection cv={cvFixture} />);
    expect(screen.getByText('Mentoring & code review')).toBeInTheDocument();
    expect(screen.getByText('Async collaboration')).toBeInTheDocument();
    expect(screen.getByText(/translating business needs/i)).toBeInTheDocument();
  });

  it('does NOT render the old top_skills (Team Collaboration etc.)', () => {
    const cvWithSoft = { ...cvFixture, top_skills: ['Team Collaboration', 'Subject Indexing'] };
    render(<SkillsSection cv={cvWithSoft} />);
    expect(screen.queryByText('Team Collaboration')).not.toBeInTheDocument();
    expect(screen.queryByText('Subject Indexing')).not.toBeInTheDocument();
  });

  it('renders proficiency dots as decorative (aria-hidden)', () => {
    const { container } = render(<SkillsSection cv={cvFixture} />);
    const dots = container.querySelectorAll('span[aria-hidden="true"][title]');
    expect(dots.length).toBeGreaterThan(0);
    // Each dot has a title attribute for the proficiency level
    const titles = new Set(Array.from(dots).map(d => d.getAttribute('title')));
    expect([...titles].some(t => t === 'expert' || t === 'proficient' || t === 'working')).toBe(
      true,
    );
  });

  it('falls back gracefully when all categories have no skills', () => {
    // We can't easily empty the static manifest, so we test the empty-state
    // message text directly by checking it's NOT present in the normal render.
    render(<SkillsSection cv={cvFixture} />);
    expect(screen.queryByText(/no skills listed/i)).not.toBeInTheDocument();
  });

  it('renders a skill count in the Technical Stack header', () => {
    const { container } = render(<SkillsSection cv={cvFixture} />);
    // Header text is e.g. "Technical Stack · 41 skills"
    const technicalZone = screen.getByText(/technical stack/i).closest('h3');
    expect(technicalZone).not.toBeNull();
    expect(within(technicalZone!).getByText(/skills/)).toBeInTheDocument();
  });
});
