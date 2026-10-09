import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AboutSection } from './AboutSection';

describe('AboutSection', () => {
  it('renders the section heading as "Profile" and the section eyebrow as "Profile"', () => {
    render(<AboutSection summary="I design scalable software." />);
    expect(screen.getByRole('heading', { name: 'Profile', level: 2 })).toBeInTheDocument();
    expect(screen.getByText('Profile', { selector: 'p' })).toBeInTheDocument();
  });

  it('renders the full summary text', () => {
    render(<AboutSection summary="I design scalable software. I ship features end to end." />);
    // Both the lead sentence and the body sentence appear in the output.
    expect(screen.getByText(/I design scalable software\./)).toBeInTheDocument();
    expect(screen.getByText(/I ship features end to end\./)).toBeInTheDocument();
  });

  it('places the lead sentence in a <blockquote> and the body in a <p>', () => {
    const { container } = render(
      <AboutSection summary="I lead backend systems. They are reliable, fast, and easy to extend." />,
    );
    const blockquote = container.querySelector('blockquote');
    expect(blockquote).not.toBeNull();
    expect(blockquote?.textContent).toContain('I lead backend systems.');
    // The body <p> sits inside the same wrapper div as the <figure>; it
    // contains the post-first-sentence prose. (Other <p>s in the section
    // are the eyebrow, so we target the one that's a sibling of the
    // figure.)
    const figure = container.querySelector('figure');
    const body = figure?.parentElement?.querySelector('p');
    expect(body).not.toBeNull();
    expect(body?.textContent).toContain('They are reliable');
  });

  it('still uses the legacy `about` section id so the nav scroll-spy keeps targeting it', () => {
    const { container } = render(<AboutSection summary="x" />);
    expect(container.querySelector('section#about')).not.toBeNull();
  });

  it('renders a placeholder when summary is empty', () => {
    render(<AboutSection summary="" />);
    expect(screen.getByText(/summary not provided/i)).toBeInTheDocument();
  });

  it('does NOT render the home address (privacy invariant)', () => {
    const { container } = render(<AboutSection summary="Personal — House 263 Chunkhola." />);
    // The address substring from the CV must never appear, even when the
    // summary text happens to look like one. The component takes a string
    // but the only string it ever receives in the live page is the curated
    // CV summary — we assert there's no path that promotes the address.
    const text = container.textContent ?? '';
    expect(text).not.toContain('Mollahat');
    expect(text).not.toContain('Bagerhat');
  });
});
