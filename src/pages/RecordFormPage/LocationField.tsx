import { useState } from 'react';
import { IonButton, IonIcon, IonItem, IonLabel, IonNote, IonSpinner } from '@ionic/react';
import { locateOutline } from 'ionicons/icons';
import { geolocationService } from '../../services/platform';
import { LocationPermissionDeniedError } from '../../services/geolocation/GeolocationService';

interface LocationFieldProps {
  latitude: number | null;
  longitude: number | null;
  onChange: (latitude: number | null, longitude: number | null) => void;
}

export function LocationField({ latitude, longitude, onChange }: LocationFieldProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGetLocation() {
    setLoading(true);
    setError(null);
    try {
      const coords = await geolocationService.getCurrentPosition();
      onChange(coords.latitude, coords.longitude);
    } catch (err) {
      if (err instanceof LocationPermissionDeniedError) {
        setError('Přístup k poloze byl odepřen. Zkuste to znovu nebo zadejte souřadnice později.');
      } else {
        setError('Poloha se nepodařilo zjistit.');
      }
    } finally {
      setLoading(false);
    }
  }

  const hasLocation = latitude !== null && longitude !== null;

  return (
    <IonItem lines="none">
      <IonLabel>
        <p>GPS poloha</p>
        {hasLocation ? (
          <p>
            {latitude!.toFixed(6)}, {longitude!.toFixed(6)}
          </p>
        ) : (
          <p>Poloha není nastavena.</p>
        )}
        {error && <IonNote color="danger">{error}</IonNote>}
        <div style={{ marginTop: 8 }}>
          <IonButton size="small" fill="outline" onClick={handleGetLocation} disabled={loading}>
            {loading ? (
              <IonSpinner name="dots" />
            ) : (
              <>
                <IonIcon slot="start" icon={locateOutline} />
                {hasLocation ? 'Zkusit znovu' : 'Získat polohu'}
              </>
            )}
          </IonButton>
        </div>
      </IonLabel>
    </IonItem>
  );
}
