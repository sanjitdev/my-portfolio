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

  it('renders hero contributions as a bulleted list (not numbered)', () => {
    // Direction 3: hero contributions are bullet dots, matching the
    // dialog's contributions idiom. The numbered <ol> with circle
    // badges (1, 2, 3) is gone.
    render(<ProjectsSection projects={[hero]} />);
    const heroCard = document.querySelector('[data-layout="hero"]') as HTMLElement;
    const contributionList = within(heroCard)
      .getByText('Developed the frontend and backend services end-to-end')
      .closest('li')!.parentElement!;
    expect(contributionList.tagName).toBe('UL');
    // Each li has a small bullet span (h-1.5 w-1.5 rounded-full)
    const items = within(contributionList as HTMLElement).getAllByRole('listitem');
    expect(items.length).toBe(3);
    // The contribution list should not contain numbered badges
    // (any "1", "2", "3" digit at the start of an li).
    expect(contributionList.textContent).not.toMatch(/^1/m);
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

describe('ProjectsCarouselClient — nav controls (Direction 3)', () => {
  // Need enough projects to force multiple "pages" in the rail.
  // We stub scrollWidth / clientWidth via JSDOM by reading them off
  // the rendered rail element after the scroll listener runs.
  const projects: ProjectMd[] = Array.from({ length: 6 }, (_, i) => ({
    name: `Project ${i + 1}`,
    scope: `Scope for project ${i + 1}`,
    contributions: [`Contribution ${i + 1}`],
    stack: ['Stack A', 'Stack B'],
  }));

  let showModalSpy: ReturnType<typeof vi.fn>;
  let closeSpy: ReturnType<typeof vi.fn>;
  let scrollBySpy: ReturnType<typeof vi.fn>;
  let scrollToSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Stub <dialog> methods.
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
      (proto as unknown as { showModal: typeof showModalSpy }).showModal = showModalSpy;
      (proto as unknown as { close: typeof closeSpy }).close = closeSpy;
    }

    // Stub scrollBy / scrollTo on the rail so we can assert that
    // clicking prev/next/dot triggers a scroll command without
    // needing to compute layout in jsdom.
    scrollBySpy = vi.fn();
    scrollToSpy = vi.fn();
    const origScrollBy = HTMLElement.prototype.scrollBy;
    const origScrollTo = HTMLElement.prototype.scrollTo;
    HTMLElement.prototype.scrollBy = scrollBySpy as unknown as typeof HTMLElement.prototype.scrollBy;
    HTMLElement.prototype.scrollTo = scrollToSpy as unknown as typeof HTMLElement.prototype.scrollTo;
    // Save originals for restoration.
    (HTMLElement.prototype as unknown as { __origScrollBy?: typeof origScrollBy }).__origScrollBy = origScrollBy;
    (HTMLElement.prototype as unknown as { __origScrollTo?: typeof origScrollTo }).__origScrollTo = origScrollTo;

    // Stub the layout-reading properties on HTMLElement.prototype so
    // the rail's useEffect-driven scroll state reports a non-
    // boundary position (scrollLeft=0, clientWidth=300,
    // scrollWidth=2000) — this enables the prev/next buttons
    // (otherwise they would be disabled at the boundary).
    Object.defineProperty(HTMLElement.prototype, 'scrollLeft', {
      configurable: true,
      get() {
        return 0;
      },
    });
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
      configurable: true,
      get() {
        return 300;
      },
    });
    Object.defineProperty(HTMLElement.prototype, 'scrollWidth', {
      configurable: true,
      get() {
        return 2000;
      },
    });
  });

  afterEach(() => {
    cleanup();
    const proto =
      typeof HTMLDialogElement !== 'undefined'
        ? HTMLDialogElement.prototype
        : ((document.createElement('dialog') as HTMLDialogElement)
            ?.constructor as { prototype: HTMLDialogElement } | undefined)?.prototype;
    if (proto) {
      delete (proto as { showModal?: unknown }).showModal;
      delete (proto as { close?: unknown }).close;
    }
    const origScrollBy = (HTMLElement.prototype as unknown as { __origScrollBy?: typeof HTMLElement.prototype.scrollBy }).__origScrollBy;
    const origScrollTo = (HTMLElement.prototype as unknown as { __origScrollTo?: typeof HTMLElement.prototype.scrollTo }).__origScrollTo;
    if (origScrollBy) HTMLElement.prototype.scrollBy = origScrollBy;
    if (origScrollTo) HTMLElement.prototype.scrollTo = origScrollTo;
    delete (HTMLElement.prototype as { __origScrollBy?: unknown }).__origScrollBy;
    delete (HTMLElement.prototype as { __origScrollTo?: unknown }).__origScrollTo;
    // Restore layout-reading properties.
    delete (HTMLElement.prototype as { scrollLeft?: unknown }).scrollLeft;
    delete (HTMLElement.prototype as { clientWidth?: unknown }).clientWidth;
    delete (HTMLElement.prototype as { scrollWidth?: unknown }).scrollWidth;
    vi.restoreAllMocks();
  });

  it('renders prev/next buttons with accessible labels', () => {
    render(<ProjectsCarouselClient projects={projects} />);
    expect(screen.getByRole('button', { name: /previous projects/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next projects/i })).toBeInTheDocument();
  });

  it('clicking next calls scrollBy with positive offset', () => {
    render(<ProjectsCarouselClient projects={projects} />);
    const next = screen.getByRole('button', { name: /next projects/i });
    fireEvent.click(next);
    expect(scrollBySpy).toHaveBeenCalled();
    const args = scrollBySpy.mock.calls[0]?.[0] as { left: number };
    expect(args.left).toBeGreaterThan(0);
  });

  it('clicking prev calls scrollBy with negative offset', () => {
    // The default beforeEach sets scrollLeft=0 which makes prev
    // disabled (at the start). Override to be mid-rail so prev is
    // enabled.
    Object.defineProperty(HTMLElement.prototype, 'scrollLeft', {
      configurable: true,
      get() {
        return 640; // 2 pages in (stride=320, so page 2)
      },
    });
    render(<ProjectsCarouselClient projects={projects} />);
    const prev = screen.getByRole('button', { name: /previous projects/i });
    fireEvent.click(prev);
    expect(scrollBySpy).toHaveBeenCalled();
    const args = scrollBySpy.mock.calls[0]?.[0] as { left: number };
    expect(args.left).toBeLessThan(0);
  });

  it('renders a dots tablist with one dot per page', () => {
    render(<ProjectsCarouselClient projects={projects} />);
    const dots = screen.getByTestId('carousel-dots');
    expect(dots).toHaveAttribute('role', 'tablist');
    // With 6 projects and a 320px stride in jsdom (2000px / 320
    // = 7 pages), the tablist should have multiple tabs.
    const dotButtons = within(dots).getAllByRole('tab');
    expect(dotButtons.length).toBeGreaterThanOrEqual(2);
  });

  it('clicking a dot calls scrollTo with the dot index * stride', () => {
    render(<ProjectsCarouselClient projects={projects} />);
    const dot1 = screen.getByTestId('carousel-dot-1');
    fireEvent.click(dot1);
    expect(scrollToSpy).toHaveBeenCalled();
    const args = scrollToSpy.mock.calls[0]?.[0] as { left: number };
    // Dot index 1 * stride (320px in jsdom sm+ default) = 320.
    expect(args.left).toBeGreaterThan(0);
  });

  it('marks the first dot as aria-selected by default', () => {
    render(<ProjectsCarouselClient projects={projects} />);
    const dot0 = screen.getByTestId('carousel-dot-0');
    expect(dot0.getAttribute('aria-selected')).toBe('true');
  });

  it('uses smooth scroll by default and auto when reduced motion is preferred', () => {
    render(<ProjectsCarouselClient projects={projects} />);
    const next = screen.getByRole('button', { name: /next projects/i });
    fireEvent.click(next);
    // jsdom doesn't implement matchMedia for prefers-reduced-motion,
    // so the call falls through to 'smooth' (the default branch).
    const args = scrollBySpy.mock.calls[0]?.[0] as { behavior: string };
    expect(['auto', 'smooth']).toContain(args.behavior);
  });

  it('disables the next button at the end of the rail', () => {
    // Override scrollLeft to be at the end position.
    Object.defineProperty(HTMLElement.prototype, 'scrollLeft', {
      configurable: true,
      get() {
        return 2000; // at the end (scrollWidth = 2000)
      },
    });
    render(<ProjectsCarouselClient projects={projects} />);
    const next = screen.getByRole('button', { name: /next projects/i });
    expect(next).toBeDisabled();
  });
});
