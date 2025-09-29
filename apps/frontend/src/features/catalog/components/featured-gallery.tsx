import { GlassCard, SectionHeading } from '@helena-art-store/ui';
import { useFeaturedGallery } from '../hooks/use-featured-gallery';

export function FeaturedGallery() {
  const { artworks, isLoading, isError } = useFeaturedGallery();

  if (isLoading) {
    return (
      <SectionHeading
        align="center"
        eyebrow="Featured"
        title="Curating luminous canvases"
        description="Loading the latest luminous canvases from the Helena vault."
      />
    );
  }

  if (isError) {
    return (
      <SectionHeading
        align="center"
        eyebrow="Featured"
        title="Curating luminous canvases"
        description="We were unable to load the featured catalogue. Please try again in a moment."
      />
    );
  }

  return (
    <div className="space-y-12">
      <SectionHeading
        align="center"
        eyebrow="Featured"
        title="Curated releases"
        description="Each piece is rendered in real-time volumetrics and shipped with provenance metadata."
      />
      <div className="grid gap-6 md:grid-cols-3">
        {artworks.map((artwork) => (
          <GlassCard
            key={artwork.id}
            className="flex h-full flex-col"
            footer={`by ${artwork.artist}`}
          >
            <div className="overflow-hidden rounded-2xl">
              <img
                src={artwork.imageUrl}
                alt={artwork.title}
                className="h-48 w-full object-cover transition duration-500 hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="space-y-3 pt-4">
              <div className="flex items-center justify-between gap-2 text-white">
                <h3 className="text-lg font-semibold">{artwork.title}</h3>
                <span className="text-sm text-emerald-300">
                  {artwork.available ? 'Available' : 'Reserved'}
                </span>
              </div>
              <p className="text-sm text-white/70">{artwork.description}</p>
              <div className="flex flex-wrap gap-2 text-xs uppercase tracking-wide text-white/60">
                {artwork.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-white/10 px-3 py-1 text-white/70"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-sm font-medium text-white/80">
                {artwork.price.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                })}
              </p>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
