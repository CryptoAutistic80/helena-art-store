import { render, screen } from '@testing-library/react';
import { GlassPanel } from './glass-panel';

describe('GlassPanel', () => {
  it('renders children inside a stylised container', () => {
    render(<GlassPanel tone="accent">Content</GlassPanel>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});
