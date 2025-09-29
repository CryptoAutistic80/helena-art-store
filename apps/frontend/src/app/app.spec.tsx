import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { App } from './app';
import { AppProviders } from './providers';

class ResizeObserverPolyfill {
  constructor(_callback: ResizeObserverCallback) {}
  observe() {}
  unobserve() {}
  disconnect() {}
}

// @ts-expect-error jsdom polyfill
global.ResizeObserver = global.ResizeObserver ?? ResizeObserverPolyfill;

describe('App', () => {
  it('renders landing page headline', () => {
    const { getByText } = render(
      <AppProviders>
        <App />
      </AppProviders>
    );

    expect(
      getByText(/Volumetric dreamscapes handcrafted in neon light/i)
    ).toBeInTheDocument();
  });
});
