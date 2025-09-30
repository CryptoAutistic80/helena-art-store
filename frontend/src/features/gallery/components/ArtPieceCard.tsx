import type { ArtPiece } from '@helena-art-store/api-types';
import { GlassPanel, GradientText, PrimaryButton, StatPill } from '@helena-art-store/ui';
import styles from './GalleryOverlay.module.css';

interface ArtPieceCardProps {
  piece: ArtPiece;
}

export const ArtPieceCard = ({ piece }: ArtPieceCardProps) => (
  <GlassPanel tone="accent" className={styles.spotlightCard}>
    <div className={styles.spotlightHeader}>
      <GradientText as="h3" className={styles.spotlightTitle}>
        {piece.title}
      </GradientText>
      <span className={styles.spotlightArtist}>{piece.artist}</span>
    </div>
    <p className={styles.spotlightDescription}>{piece.description}</p>
    <div className={styles.spotlightMeta}>
      <StatPill value={`$${piece.price.toLocaleString()}`}>Gallery price</StatPill>
      <StatPill value={piece.available ? 'Available' : 'Reserved'}>Status</StatPill>
    </div>
    <PrimaryButton className={styles.ctaButton}>Request a private viewing</PrimaryButton>
  </GlassPanel>
);
