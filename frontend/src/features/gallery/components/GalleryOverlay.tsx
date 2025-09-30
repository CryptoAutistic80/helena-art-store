import { GradientText, GlassPanel, PrimaryButton, StatPill } from '@helena-art-store/ui';
import { useGalleryHighlight } from '../hooks/useGalleryHighlight';
import { ArtPieceCard } from './ArtPieceCard';
import styles from './GalleryOverlay.module.css';

export const GalleryOverlay = () => {
  const { hero, spotlight, metrics, isLoading } = useGalleryHighlight();

  return (
    <div className={styles.overlay}>
      <header className={styles.heroSection}>
        <GlassPanel className={styles.heroPanel}>
          <span className={styles.badge}>Helena Art Store — Digital originals</span>
          <GradientText as="h1" className={styles.heroTitle}>
            Immerse yourself in the gallery of living light
          </GradientText>
          <p className={styles.heroDescription}>
            Curated interactive artworks engineered with cutting-edge shader craft, sound-reactive sculptures,
            and generative textiles. Experience collections that adapt to the energy of every space.
          </p>
          <div className={styles.heroMetrics}>
            {metrics.map((metric) => (
              <StatPill key={metric.label} value={metric.value}>
                {metric.label}
              </StatPill>
            ))}
          </div>
          <div className={styles.heroActions}>
            <PrimaryButton icon={<span aria-hidden="true">→</span>}>Book a curator session</PrimaryButton>
            <a className={styles.secondaryLink} href="#spotlight">
              Explore collection highlights
            </a>
          </div>
        </GlassPanel>
        <figure className={styles.heroArtwork}>
          <img src={hero.imageUrl} alt={`${hero.title} by ${hero.artist}`} loading="lazy" />
          <figcaption>
            {hero.title} — {hero.artist}
          </figcaption>
        </figure>
      </header>

      <section id="spotlight" className={styles.spotlightSection}>
        <header className={styles.spotlightHeaderRow}>
          <div>
            <GradientText as="h2" className={styles.spotlightHeading}>
              Spotlight Commissions
            </GradientText>
            <p className={styles.spotlightSubheading}>
              Hand-picked immersive works ready for private residencies and experiential pop-ups.
            </p>
          </div>
          {!isLoading && <span className={styles.spotlightCount}>{spotlight.length} works available</span>}
        </header>
        <div className={styles.spotlightGrid}>
          {spotlight.map((piece) => (
            <ArtPieceCard key={piece.id} piece={piece} />
          ))}
        </div>
      </section>
    </div>
  );
};
