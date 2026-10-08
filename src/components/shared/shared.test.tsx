import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Container } from './Container';
import { Section } from './Section';
import { Heading } from './Heading';
import { Tag } from './Tag';
import { Card } from './Card';

describe('Shared UI primitives', () => {
  describe('Container', () => {
    it('renders children inside a centered wrapper', () => {
      const { container } = render(
        <Container>
          <span>content</span>
        </Container>,
      );
      const wrapper = container.querySelector('div');
      expect(wrapper).not.toBeNull();
      expect(wrapper?.className).toContain('max-w-5xl');
      expect(wrapper?.className).toContain('mx-auto');
      expect(screen.getByText('content')).toBeInTheDocument();
    });

    it('merges custom className', () => {
      const { container } = render(
        <Container className="my-8">
          <span>x</span>
        </Container>,
      );
      const wrapper = container.querySelector('div');
      expect(wrapper?.className).toContain('my-8');
    });
  });

  describe('Section', () => {
    it('renders a semantic <section> with the given id', () => {
      const { container } = render(
        <Section id="experience" ariaLabelledBy="exp-h">
          <h2 id="exp-h">Experience</h2>
        </Section>,
      );
      const section = container.querySelector('section#experience');
      expect(section).not.toBeNull();
      expect(section?.getAttribute('aria-labelledby')).toBe('exp-h');
    });

    it('applies scroll-mt offset for sticky nav', () => {
      const { container } = render(
        <Section id="about">
          <p>about</p>
        </Section>,
      );
      const section = container.querySelector('section');
      expect(section?.className).toContain('scroll-mt-');
    });
  });

  describe('Heading', () => {
    it('renders an h2 by default', () => {
      render(<Heading>About</Heading>);
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveTextContent('About');
    });

    it('renders an h1 when as="h1"', () => {
      render(<Heading as="h1">Name</Heading>);
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('Name');
    });

    it('renders an h3 when as="h3"', () => {
      render(<Heading as="h3">Subhead</Heading>);
      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toHaveTextContent('Subhead');
    });

    it('forwards the id prop', () => {
      render(
        <Heading id="about-h" as="h2">
          About
        </Heading>,
      );
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading.id).toBe('about-h');
    });
  });

  describe('Tag', () => {
    it('renders the label as a pill', () => {
      render(<Tag>React</Tag>);
      const tag = screen.getByText('React');
      expect(tag.className).toContain('rounded-full');
      expect(tag.className).toContain('inline-flex');
    });
  });

  describe('Card', () => {
    it('renders children inside a rounded surface', () => {
      const { container } = render(
        <Card>
          <p>card content</p>
        </Card>,
      );
      const card = container.querySelector('div');
      expect(card?.className).toContain('rounded-lg');
      expect(card?.className).toContain('border');
      expect(card?.className).toContain('shadow-sm');
      expect(screen.getByText('card content')).toBeInTheDocument();
    });
  });
});
