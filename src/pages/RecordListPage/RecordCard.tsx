import { IonCard, IonCardContent, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonThumbnail } from '@ionic/react';
import type { SwimRecord } from '../../domain/record';
import { useObjectUrl } from '../../shared/hooks/useObjectUrl';
import { formatDate } from '../../shared/formatDate';

interface RecordCardProps {
  record: SwimRecord;
  position: number; // 1-based sequence number shown on the card
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
}

export function RecordCard({ record, position, onOpen, onDelete }: RecordCardProps) {
  const thumbUrl = useObjectUrl(record.photos[0]);

  return (
    <IonItemSliding>
      <IonItem onClick={() => onOpen(record.id)} button detail={false} lines="none">
        <IonCard style={{ width: '100%', margin: '8px 0' }}>
          <IonCardContent style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                flexShrink: 0,
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: 'var(--ion-color-primary)',
                color: 'var(--ion-color-primary-contrast)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {position}
            </div>
            {thumbUrl && (
              <IonThumbnail style={{ position: 'relative' }}>
                <img src={thumbUrl} alt="" />
                {record.photos.length > 1 && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 2,
                      right: 2,
                      background: 'rgba(15, 23, 42, 0.75)',
                      color: '#fff',
                      fontSize: 10,
                      fontWeight: 600,
                      borderRadius: 6,
                      padding: '1px 4px',
                    }}
                  >
                    +{record.photos.length - 1}
                  </div>
                )}
              </IonThumbnail>
            )}
            <div>
              <div style={{ fontWeight: 600 }}>{record.placeName}</div>
              <div style={{ fontSize: 14, color: 'var(--ion-color-medium)' }}>{formatDate(record.date)}</div>
              <div style={{ fontSize: 13, marginTop: 4 }}>
                Voda: {record.waterRating}/10 &nbsp;·&nbsp; Přístup: {record.accessRating}/10
              </div>
            </div>
          </IonCardContent>
        </IonCard>
      </IonItem>
      <IonItemOptions side="end">
        <IonItemOption color="danger" onClick={() => onDelete(record.id)}>
          Smazat
        </IonItemOption>
      </IonItemOptions>
    </IonItemSliding>
  );
}
