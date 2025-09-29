import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, expect, it } from 'vitest';
import { AccentLink, GlassCard, SectionHeading } from './libs';

describe('ui components', () => {
  it('renders glass card content', () => {
    const { getByText } = render(
      <GlassCard footer="Footer">Hello world</GlassCard>
    );

    expect(getByText('Hello world')).toBeInTheDocument();
    expect(getByText('Footer')).toBeInTheDocument();
  });

  it('renders section heading with eyebrow', () => {
    const { getByText } = render(
      <SectionHeading eyebrow="Featured" title="Title" description="Desc" />
    );

    expect(getByText('Featured')).toBeInTheDocument();
    expect(getByText('Title')).toBeInTheDocument();
    expect(getByText('Desc')).toBeInTheDocument();
  });

  it('renders accent link', () => {
    const { getByRole } = render(
      <AccentLink href="https://example.com">Shop now</AccentLink>
    );

    expect(getByRole('link', { name: /shop now/i })).toHaveAttribute(
      'href',
      'https://example.com'
    );
  });
});
