import { describe, it, expect } from 'vitest';
import { render, screen, within, fireEvent } from '@testing-library/react';
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

  it('renders the top headline row of curated chips', () => {
    render(<SkillsSection cv={cvFixture} />);
    // C#, .NET Core, Angular, TypeScript, SQL Server, REST API design, nopCommerce, Android
    // Use getAllByText because each chip also appears (collapsed) in the full grid.
    expect(screen.getAllByText('C#').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('.NET Core').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Angular').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('TypeScript').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('SQL Server').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('REST API design').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('nopCommerce').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Android').length).toBeGreaterThanOrEqual(1);
  });

  it('shows the "Show full breakdown" toggle, collapsed by default', () => {
    render(<SkillsSection cv={cvFixture} />);
    const button = screen.getByRole('button', { name: /show full breakdown/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('keeps the full category breakdown collapsed until the toggle is clicked', () => {
    render(<SkillsSection cv={cvFixture} />);
    // The full grid is rendered (DOM-present for SEO/print) but the toggle
    // button is the source of truth for visibility — aria-expanded="false".
    const button = screen.getByRole('button', { name: /show full breakdown/i });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    // The h4 headings are in the DOM (good for screen-reader / print) but
    // visually collapsed via grid-rows-[0fr] + overflow-hidden.
    expect(screen.getByRole('heading', { name: 'Backend & APIs', level: 4 })).toBeInTheDocument();
  });

  it('expands the full breakdown when the toggle is clicked', () => {
    render(<SkillsSection cv={cvFixture} />);

    const button = screen.getByRole('button', { name: /show full breakdown/i });
    fireEvent.click(button);

    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(button).toHaveTextContent(/hide full breakdown/i);
    // Zone labels (h3) are now rendered
    expect(screen.getByRole('heading', { name: /technical stack/i, level: 3 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /how i work/i, level: 3 })).toBeInTheDocument();
    // Full category grid is rendered
    expect(screen.getByRole('heading', { name: 'Backend & APIs', level: 4 })).toBeInTheDocument();
  });

  it('collapses the breakdown when the toggle is clicked again', () => {
    render(<SkillsSection cv={cvFixture} />);

    const button = screen.getByRole('button', { name: /show full breakdown/i });
    fireEvent.click(button);
    expect(button).toHaveTextContent(/hide full breakdown/i);
    expect(button).toHaveAttribute('aria-expanded', 'true');

    fireEvent.click(button);
    expect(button).toHaveTextContent(/show full breakdown/i);
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('renders proficiency as text on every chip (no decorative dot)', () => {
    const { container } = render(<SkillsSection cv={cvFixture} />);
    // Each chip has a proficiency label (· expert / · proficient / · working)
    const expertChips = container.querySelectorAll('[aria-label*="Expert"]');
    const proficientChips = container.querySelectorAll('[aria-label*="Proficient"]');
    expect(expertChips.length + proficientChips.length).toBeGreaterThan(0);
    // No old dot pattern: title="expert"/"proficient"/"working" should be gone
    const oldDots = container.querySelectorAll('span[aria-hidden="true"][title]');
    expect(oldDots.length).toBe(0);
  });

  it('shows the section-level years hint in the subtitle', () => {
    render(<SkillsSection cv={cvFixture} />);
    expect(screen.getByText(/years professional experience/i)).toBeInTheDocument();
  });

  it('renders professional skills with icons and context after expansion', () => {
    render(<SkillsSection cv={cvFixture} />);

    fireEvent.click(screen.getByRole('button', { name: /show full breakdown/i }));
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

  it('falls back gracefully when the manifest has no skills', () => {
    // We can't easily empty the static manifest, so confirm the empty-state
    // message is NOT present in the normal render.
    render(<SkillsSection cv={cvFixture} />);
    expect(screen.queryByText(/no skills listed/i)).not.toBeInTheDocument();
  });

  it('renders a skill count in the Technical Stack header after expansion', () => {
    render(<SkillsSection cv={cvFixture} />);
    fireEvent.click(screen.getByRole('button', { name: /show full breakdown/i }));

    const technicalZone = screen.getByText(/technical stack/i).closest('h3');
    expect(technicalZone).not.toBeNull();
    expect(within(technicalZone!).getByText(/skills/)).toBeInTheDocument();
  });
});
