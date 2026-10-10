import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, within, fireEvent, cleanup } from '@testing-library/react';
import { ProjectsSection } from './ProjectsSection';
import { ProjectsCarouselClient } from './ProjectsCarouselClient';
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

const compactA: ProjectMd = {
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

const compactB: ProjectMd = {
  name: 'LionO CRM Integration in Nopcommerce',
  scope: 'Integrated LionO CRM with nopCommerce to sync customers and orders.',
  impact: 'Single source of truth for customer data across platforms.',
  contributions: ['Built sync APIs', 'Mapped fields between systems'],
  stack: ['Angular', '.NET', 'SQL Server'],
};

describe('ProjectsSection', () => {
  afterEach(() => cleanup());

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

  it('renders the section heading inside an accent-tinted anchor card', () => {
    render(<ProjectsSection projects={[hero]} />);
    const heading = screen.getByRole('heading', { name: /featured projects/i, level: 2 });
    const wrapper = heading.parentElement;
    expect(wrapper).not.toBeNull();
    expect(wrapper!.className).toMatch(/rounded-\[20px\]/);
    expect(wrapper!.className).toMatch(/border-accent-200/);
    expect(wrapper!.textContent).toMatch(/What I.{0,2}ve built/);
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

  it('does not render the carousel when there is only the hero (no rest)', () => {
    render(<ProjectsSection projects={[hero]} />);
    expect(screen.queryByTestId('projects-carousel')).toBeNull();
  });

  it('does not render the carousel with only one rest project', () => {
    render(<ProjectsSection projects={[hero, compactA]} />);
    expect(screen.queryByTestId('projects-carousel')).toBeNull();
  });

  it('renders the carousel for 2+ rest projects', () => {
    render(<ProjectsSection projects={[hero, compactA, compactB]} />);
    const carousel = screen.getByTestId('projects-carousel');
    expect(carousel).not.toBeNull();
    expect(
      within(carousel).getByRole('button', { name: /open details for nopCommerce/i }),
    ).toBeInTheDocument();
    expect(
      within(carousel).getByRole('button', { name: /open details for LionO CRM/i }),
    ).toBeInTheDocument();
  });

  it('links to the experience section as a follow-up path', () => {
    render(<ProjectsSection projects={[hero]} />);
    const link = screen.getByRole('link', { name: /experience timeline/i });
    expect(link.getAttribute('href')).toBe('#experience');
  });
});

describe('ProjectsCarouselClient', () => {
  let showModalSpy: ReturnType<typeof vi.fn>;
  let closeSpy: ReturnType<typeof vi.fn>;
  let hadShowModal: boolean;
  let hadClose: boolean;

  beforeEach(() => {
    // The native <dialog>.showModal / close methods aren't implemented
    // in jsdom; stub them so the component can call them. The
    // HTMLDialogElement constructor itself isn't always present
    // either, so guard the prototype access.
    const proto =
      typeof HTMLDialogElement !== 'undefined'
        ? HTMLDialogElement.prototype
        : ((document.createElement('dialog') as HTMLDialogElement)
            ?.constructor as { prototype: HTMLDialogElement } | undefined)?.prototype;

    showModalSpy = vi.fn(function (this: HTMLDialogElement & { open: boolean }) {
      this.open = true;
    });
    closeSpy = vi.fn(function (this: HTMLDialogElement & { open: boolean }) {
      this.open = false;
    });

    if (proto) {
      hadShowModal = 'showModal' in proto;
      hadClose = 'close' in proto;
      (proto as unknown as { showModal: typeof showModalSpy }).showModal = showModalSpy;
      (proto as unknown as { close: typeof closeSpy }).close = closeSpy;
    } else {
      hadShowModal = false;
      hadClose = false;
    }
  });

  afterEach(() => {
    cleanup();
    const proto =
      typeof HTMLDialogElement !== 'undefined'
        ? HTMLDialogElement.prototype
        : ((document.createElement('dialog') as HTMLDialogElement)
            ?.constructor as { prototype: HTMLDialogElement } | undefined)?.prototype;
    if (proto) {
      if (hadShowModal) {
        // Leave any original showModal in place — we don't have a
        // reliable reference to restore it, and the test run ends
        // before any other test cares.
      } else {
        delete (proto as { showModal?: unknown }).showModal;
      }
      if (!hadClose) {
        delete (proto as { close?: unknown }).close;
      }
    }
    vi.restoreAllMocks();
  });

  it('renders nothing when fewer than 2 projects are passed', () => {
    const { container } = render(<ProjectsCarouselClient projects={[compactA]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders a carousel card with a button that has aria-haspopup="dialog"', () => {
    render(<ProjectsCarouselClient projects={[compactA, compactB]} />);
    const trigger = screen.getByRole('button', { name: /open details for nopCommerce/i });
    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog');
  });

  it('shows the project name on the carousel card', () => {
    render(<ProjectsCarouselClient projects={[compactA, compactB]} />);
    expect(screen.getByText('nopCommerce Integration for Global Retail Clients')).toBeInTheDocument();
    expect(screen.getByText('LionO CRM Integration in Nopcommerce')).toBeInTheDocument();
  });

  it('exposes the stack tags on the carousel card', () => {
    render(<ProjectsCarouselClient projects={[compactA, compactB]} />);
    const trigger = screen.getByRole('button', { name: /open details for nopCommerce/i });
    expect(within(trigger).getByText('.NET')).toBeInTheDocument();
    expect(within(trigger).getByText('SQL Server')).toBeInTheDocument();
  });

  it('opens the dialog (calls showModal) when a carousel card is clicked', () => {
    render(<ProjectsCarouselClient projects={[compactA, compactB]} />);
    const trigger = screen.getByRole('button', { name: /open details for nopCommerce/i });
    fireEvent.click(trigger);
    expect(showModalSpy).toHaveBeenCalled();
  });

  it('renders the active project details inside the dialog after click', () => {
    render(<ProjectsCarouselClient projects={[compactA, compactB]} />);
    const trigger = screen.getByRole('button', { name: /open details for nopCommerce/i });
    fireEvent.click(trigger);
    const dialog = screen.getByTestId('project-dialog');
    expect(within(dialog).getByText(/Full-stack development for custom integrations/i)).toBeInTheDocument();
    expect(within(dialog).getByText(/20–40%/)).toBeInTheDocument();
    expect(within(dialog).getByText(/Built custom plugins/i)).toBeInTheDocument();
  });

  it('closes the dialog when the close button is clicked', () => {
    render(<ProjectsCarouselClient projects={[compactA, compactB]} />);
    fireEvent.click(screen.getByRole('button', { name: /open details for nopCommerce/i }));
    const closeBtn = screen.getByRole('button', { name: /close project details/i });
    fireEvent.click(closeBtn);
    expect(closeSpy).toHaveBeenCalled();
  });

  it('uses dark-mode-aware classes (dark: variants) on the carousel card', () => {
    render(<ProjectsCarouselClient projects={[compactA, compactB]} />);
    const trigger = screen.getByRole('button', { name: /open details for nopCommerce/i });
    // The trigger's className must include at least one dark: variant
    // to be dark-theme compatible.
    expect(trigger.className).toMatch(/dark:/);
  });
});
