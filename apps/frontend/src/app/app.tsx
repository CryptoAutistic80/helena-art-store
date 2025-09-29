import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { LandingPage } from '../features/landing/components/landing-page';

export function App() {
  return (
    <Suspense fallback={<div className="text-white">Loading gallery…</div>}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </Suspense>
  );
}
