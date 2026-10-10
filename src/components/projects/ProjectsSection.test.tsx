import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { ProjectsSection } from './ProjectsSection';
import type { ProjectMd } from '@/lib/projects-md';

const hero: ProjectMd = {
  name: 'Enterprise Project Management Platform',
  client: 'Global Client',
  role: 'Lead Engineer',
  year: '2024 – Present',
  scope:
    'A project management portal built for a global client, with task tracking, collaboration, and reporting.',
  impact: 'Shipping features in 2-week sprints with zero rollbacks.',
  contributions: [
    'Developed the frontend and backend services end-to-end',
    'Built scalable, maintainable features',
    'Ensured code quality through unit testing and CI',
  ],
  stack: ['Angular', 'Syncfusion', '.NET Core'],
};

const compact: ProjectMd = {
  name: 'nopCommerce Integration for Global Retail Clients',
  scope: 'Full-stack development for custom integrations between nopCommerce and third-party platforms.',
  impact: 'Helped multiple businesses transition online, boosting sales by 20–40% on average after launch.',
  contributions: [
    'Built custom plugins and RESTful APIs for platform sync',
    'Integrated payment gateways and ERP modules',
    'Designed scalable backend architecture for high-traffic clients',
  ],
  stack: ['.NET', 'SQL Server', 'Razor Pages'],
};

describe('ProjectsSection', () => {
  it('renders nothing when projects is undefined', () => {
    const { container } = render(<ProjectsSection projects={undefined} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when projects is an empty array', () => {
    const { container } = render(<ProjectsSection projects={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders a section with id="projects" and a heading', () => {
    render(<ProjectsSection projects={[hero]} />);
    expect(document.getElementById('projects')).not.toBeNull();
    expect(
      screen.getByRole('heading', { name: /featured projects/i, level: 2 }),
    ).toBeInTheDocument();
  });

  it('renders the first project as a hero card', () => {
    render(<ProjectsSection projects={[hero]} />);
    const heroCard = document.querySelector('[data-layout="hero"]');
    expect(heroCard).not.toBeNull();
    expect(
      within(heroCard as HTMLElement).getByRole('heading', { name: /Enterprise Project Management/i }),
    ).toBeInTheDocument();
  });

  it('renders the hero with scope, impact, contributions, and stack', () => {
    render(<ProjectsSection projects={[hero]} />);
    const heroCard = document.querySelector('[data-layout="hero"]') as HTMLElement;
    expect(within(heroCard).getByText(/project management portal/i)).toBeInTheDocument();
    expect(within(heroCard).getByText(/2-week sprints/i)).toBeInTheDocument();
    expect(within(heroCard).getByText(/Developed the frontend/i)).toBeInTheDocument();
    expect(within(heroCard).getByText('Angular')).toBeInTheDocument();
    expect(within(heroCard).getByText('.NET Core')).toBeInTheDocument();
  });

  it('renders the second project as a compact card', () => {
    render(<ProjectsSection projects={[hero, compact]} />);
    const compactCard = document.querySelector('[data-layout="compact"]');
    expect(compactCard).not.toBeNull();
    expect(
      within(compactCard as HTMLElement).getByRole('heading', { name: /nopCommerce/i }),
    ).toBeInTheDocument();
  });

  it('numbers hero contributions in order', () => {
    render(<ProjectsSection projects={[hero]} />);
    const heroCard = document.querySelector('[data-layout="hero"]') as HTMLElement;
    const list = within(heroCard).getByRole('list', { name: '' });
    // The contributions <ol> uses numbers 1, 2, 3
    expect(list.tagName).toBe('OL');
    const items = within(list).getAllByRole('listitem');
    expect(items.length).toBe(3);
    expect(items[0]?.textContent).toMatch(/^1/);
    expect(items[1]?.textContent).toMatch(/^2/);
  });

  it('truncates compact card contributions to first 3 and shows "+ N more" when more exist', () => {
    const manyContribs: ProjectMd = {
      ...compact,
      contributions: ['one', 'two', 'three', 'four', 'five'],
    };
    render(<ProjectsSection projects={[hero, manyContribs]} />);
    const compactCard = document.querySelector('[data-layout="compact"]') as HTMLElement;
    expect(within(compactCard).getByText(/\+ 2 more/)).toBeInTheDocument();
  });

  it('exposes a labeled list of "more" projects for assistive tech', () => {
    render(<ProjectsSection projects={[hero, compact]} />);
    expect(screen.getByRole('list', { name: /more projects/i })).toBeInTheDocument();
  });

  it('links to the experience section as a follow-up path', () => {
    render(<ProjectsSection projects={[hero]} />);
    const link = screen.getByRole('link', { name: /experience timeline/i });
    expect(link.getAttribute('href')).toBe('#experience');
  });
});
