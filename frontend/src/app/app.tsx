import { GalleryOverlay } from '../features/gallery/components/GalleryOverlay';
import { ArtGalleryCanvas } from '../features/gallery/components/ArtGalleryCanvas';
import styles from './app.module.css';

export function App() {
  return (
    <div className={styles.root}>
      <ArtGalleryCanvas />
      <GalleryOverlay />
    </div>
  );
}
