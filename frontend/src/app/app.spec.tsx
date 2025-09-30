import { screen } from '@testing-library/react';
import { App } from './app';
import { renderWithProviders } from '../test-utils';

describe('App', () => {
  it('renders the hero headline', () => {
    renderWithProviders(<App />);
    expect(
      screen.getByText('Immerse yourself in the gallery of living light', {
        exact: false,
      }),
    ).toBeInTheDocument();
  });

  it('shows at least one spotlight card', () => {
    renderWithProviders(<App />);
    const cards = screen.getAllByText(/Gallery price/i);
    expect(cards.length).toBeGreaterThan(0);
  });
});
