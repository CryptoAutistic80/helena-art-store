import { AccentLink, GlassCard } from '@helena-art-store/ui';
import { FeaturedGallery } from '../../catalog/components/featured-gallery';
import { HeroCanvas } from './hero-canvas';

const uspItems = [
  {
    title: 'Vault provenance',
    description: 'Each piece ships with cryptographic provenance and render settings.',
  },
  {
    title: 'Curated releases',
    description: 'Limited drops hand-picked by Helena with bespoke lighting rigs.',
  },
  {
    title: 'Collector services',
    description: 'White-glove installation, projection calibration, and archival prints.',
  },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0424] via-[#12073a] to-[#090212] text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-20 px-4 py-16 sm:px-8">
        <header className="grid gap-12 lg:grid-cols-[1.2fr,0.8fr] lg:items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.4em] text-white/70">
              Helena Art Store
            </span>
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
              Volumetric dreamscapes handcrafted in neon light
            </h1>
            <p className="max-w-xl text-base text-white/70 sm:text-lg">
              Explore Helena&apos;s latest collection of real-time rendered sculptures and
              immersive canvases. Each release is tuned for projection, holographic
              displays, and ambient gallery lighting.
            </p>
            <div className="flex flex-wrap gap-4">
              <AccentLink href="https://example.com/commissions">
                Commission a piece
              </AccentLink>
              <AccentLink href="https://example.com/portfolio">
                View portfolio
              </AccentLink>
            </div>
          </div>
          <div className="rounded-[2.5rem] border border-white/10 bg-white/5 p-2 backdrop-blur-xl">
            <HeroCanvas />
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-3">
          {uspItems.map((usp) => (
            <GlassCard key={usp.title} className="h-full">
              <h3 className="text-lg font-semibold text-white">{usp.title}</h3>
              <p>{usp.description}</p>
            </GlassCard>
          ))}
        </section>

        <section>
          <FeaturedGallery />
        </section>

        <footer className="flex flex-col items-center gap-4 border-t border-white/10 py-10 text-center text-sm text-white/60">
          <p>© {new Date().getFullYear()} Helena Nova Studio. All rights reserved.</p>
          <p>Crafted with volumetric rendering, motion capture, and a touch of neon stardust.</p>
        </footer>
      </div>
    </div>
  );
}
