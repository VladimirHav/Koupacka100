import { useState } from 'react';
import { IonButton, IonIcon, IonItem, IonLabel, IonNote } from '@ionic/react';
import { cameraOutline, closeCircle, imagesOutline } from 'ionicons/icons';
import { cameraService } from '../../services/platform';
import { useObjectUrl } from '../../shared/hooks/useObjectUrl';

interface PhotoPickerProps {
  photos: Blob[];
  onChange: (photos: Blob[]) => void;
}

interface PhotoThumbnailProps {
  photo: Blob;
  onRemove: () => void;
}

function PhotoThumbnail({ photo, onRemove }: PhotoThumbnailProps) {
  const url = useObjectUrl(photo);
  return (
    <div style={{ position: 'relative', width: 88, height: 88 }}>
      {url && (
        <img
          src={url}
          alt="Náhled fotky"
          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }}
        />
      )}
      <button
        type="button"
        onClick={onRemove}
        aria-label="Odstranit fotku"
        style={{
          position: 'absolute',
          top: -8,
          right: -8,
          background: 'none',
          border: 'none',
          padding: 0,
          lineHeight: 0,
          cursor: 'pointer',
        }}
      >
        <IonIcon icon={closeCircle} color="danger" style={{ fontSize: 24, background: 'white', borderRadius: '50%' }} />
      </button>
    </div>
  );
}

export function PhotoPicker({ photos, onChange }: PhotoPickerProps) {
  const [error, setError] = useState<string | null>(null);

  async function handleTakePhoto() {
    setError(null);
    try {
      const result = await cameraService.takePhoto();
      if (result) {
        onChange([...photos, result.blob]);
      }
    } catch {
      setError('Přístup k fotoaparátu byl odepřen.');
    }
  }

  async function handlePickFromGallery() {
    setError(null);
    try {
      const results = await cameraService.pickMultipleFromGallery();
      if (results.length > 0) {
        onChange([...photos, ...results.map((r) => r.blob)]);
      }
    } catch {
      setError('Nepodařilo se vybrat fotky.');
    }
  }

  function handleRemove(index: number) {
    onChange(photos.filter((_, i) => i !== index));
  }

  return (
    <IonItem lines="none">
      <IonLabel>
        <p>Fotky</p>
        {photos.length > 0 && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
            {photos.map((photo, index) => (
              <PhotoThumbnail key={index} photo={photo} onRemove={() => handleRemove(index)} />
            ))}
          </div>
        )}
        {error && <IonNote color="danger">{error}</IonNote>}
        <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
          <IonButton size="small" fill="outline" onClick={handleTakePhoto}>
            <IonIcon slot="start" icon={cameraOutline} />
            Vyfotit
          </IonButton>
          <IonButton size="small" fill="outline" onClick={handlePickFromGallery}>
            <IonIcon slot="start" icon={imagesOutline} />
            Vybrat z galerie
          </IonButton>
        </div>
      </IonLabel>
    </IonItem>
  );
}
