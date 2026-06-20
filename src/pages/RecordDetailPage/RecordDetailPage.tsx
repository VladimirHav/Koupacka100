import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
  IonAlert,
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import type { SwimRecord } from '../../domain/record';
import { useRecords } from '../../state/useRecords';
import { useObjectUrl } from '../../shared/hooks/useObjectUrl';
import { formatDate, formatDateTime } from '../../shared/formatDate';

function DetailPhoto({ photo }: { photo: Blob }) {
  const url = useObjectUrl(photo);
  if (!url) {
    return null;
  }
  return (
    <img
      src={url}
      alt=""
      style={{
        height: 220,
        width: 'auto',
        flexShrink: 0,
        objectFit: 'cover',
        borderRadius: 12,
      }}
    />
  );
}

export function RecordDetailPage() {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const { getById, deleteRecord } = useRecords();

  const [record, setRecord] = useState<SwimRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    let active = true;
    getById(id).then((result) => {
      if (active) {
        setRecord(result ?? null);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [id, getById]);

  async function handleConfirmDelete() {
    await deleteRecord(id);
    history.replace('/records', { toast: 'Záznam byl smazán.' });
  }

  const mapsUrl =
    record?.latitude !== null && record?.longitude !== null && record
      ? `https://www.google.com/maps?q=${record.latitude},${record.longitude}`
      : null;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/records" text="Zpět" />
          </IonButtons>
          <IonTitle>Detail záznamu</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}>
            <IonSpinner />
          </div>
        )}

        {!loading && !record && <div style={{ padding: 32 }}>Záznam nebyl nalezen.</div>}

        {!loading && record && (
          <div style={{ padding: 16 }}>
            {record.photos.length > 0 && (
              <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 16 }}>
                {record.photos.map((photo, index) => (
                  <DetailPhoto key={index} photo={photo} />
                ))}
              </div>
            )}
            <h1 style={{ marginBottom: 4 }}>{record.placeName}</h1>
            <p style={{ color: 'var(--ion-color-medium)' }}>Datum plavání: {formatDate(record.date)}</p>
            <p style={{ color: 'var(--ion-color-medium)', fontSize: 13 }}>
              Záznam vytvořen: {formatDateTime(record.createdAt)}
            </p>

            <p>
              Kvalita vody: <strong>{record.waterRating}/10</strong>
            </p>
            <p>
              Přístup do vody: <strong>{record.accessRating}/10</strong>
            </p>
            <p>
              Teplota vody: <strong>{record.waterTemperature}/5</strong>
            </p>

            {record.comment && (
              <p style={{ whiteSpace: 'pre-wrap' }}>
                <strong>Komentář:</strong> {record.comment}
              </p>
            )}

            {mapsUrl ? (
              <p>
                <a href={mapsUrl} target="_blank" rel="noreferrer">
                  Otevřít v mapách
                </a>
              </p>
            ) : (
              <p style={{ color: 'var(--ion-color-medium)' }}>Poloha není nastavena.</p>
            )}

            <div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
              <IonButton onClick={() => history.push(`/records/edit/${id}`)}>Upravit</IonButton>
              <IonButton color="danger" fill="outline" onClick={() => setConfirmDelete(true)}>
                Smazat
              </IonButton>
            </div>
          </div>
        )}
      </IonContent>

      <IonAlert
        isOpen={confirmDelete}
        header="Smazat záznam?"
        message="Tato akce je nevratná. Opravdu chcete tento záznam smazat?"
        buttons={[
          { text: 'Zrušit', role: 'cancel', handler: () => setConfirmDelete(false) },
          { text: 'Smazat', role: 'destructive', handler: handleConfirmDelete },
        ]}
        onDidDismiss={() => setConfirmDelete(false)}
      />
    </IonPage>
  );
}
