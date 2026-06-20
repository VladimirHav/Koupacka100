import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import type { SwimRecord, SwimRecordInput } from '../../domain/record';
import { useRecords } from '../../state/useRecords';
import { RecordForm } from './RecordForm';

export function RecordFormPage() {
  const { id } = useParams<{ id?: string }>();
  const isEditMode = Boolean(id);
  const history = useHistory();
  const { getById, createRecord, updateRecord } = useRecords();

  const [initial, setInitial] = useState<SwimRecord | null>(null);
  const [loading, setLoading] = useState(isEditMode);

  useEffect(() => {
    if (!id) {
      return;
    }
    let active = true;
    getById(id).then((record) => {
      if (active && record) {
        setInitial(record);
      }
      if (active) {
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [id, getById]);

  async function handleSubmit(input: SwimRecordInput) {
    if (isEditMode && id) {
      await updateRecord(id, input);
    } else {
      await createRecord(input);
    }
    history.replace('/records', { toast: 'Záznam byl uložen.' });
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/records" text="Zpět" />
          </IonButtons>
          <IonTitle>{isEditMode ? 'Upravit záznam' : 'Nový záznam'}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}>
            <IonSpinner />
          </div>
        ) : (
          <RecordForm initial={initial ?? undefined} onSubmit={handleSubmit} />
        )}
      </IonContent>
    </IonPage>
  );
}
