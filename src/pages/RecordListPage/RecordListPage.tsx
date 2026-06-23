import { useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import {
  IonAlert,
  IonButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonList,
  IonPage,
  IonSpinner,
  IonTitle,
  IonToast,
  IonToolbar,
} from '@ionic/react';
import { add, cloudUploadOutline, downloadOutline, informationCircleOutline } from 'ionicons/icons';
import { TARGET_PLACES_COUNT, todayIsoDate } from '../../domain/record';
import { useRecords } from '../../state/useRecords';
import { fileExportService } from '../../services/platform';
import { RecordCard } from './RecordCard';

// IonAlert's `message` prop accepts (sanitized) HTML, not markdown.
const ABOUT_MESSAGE_HTML = `
  <p><strong>1P2 — Koupání v řekách, rybnících, ...</strong></p>
  <p><strong>VL + ML</strong></p>
  <ul>
    <li>Koupej se¹⁴ ve <strong>100</strong> řekách, jezerech, potocích, rybnících, přehradách, mořích⁷ — <strong>ČIN</strong></li>
    <li>Koupej se¹⁴ ve <strong>200</strong> řekách, jezerech, potocích, rybnících, přehradách, mořích⁷ — <strong>VELKÝ ČIN</strong></li>
  </ul>
  <p><strong>ML:</strong> Koupej se ve 3× tolika řekách, jezerech, potocích, rybnících, přehradách, kolik je ti let.</p>
  <p><strong>Vysvětlivky</strong></p>
  <p><strong>⁷ Evidence</strong><br>(nachozené km, noci v přírodě apod.): nutno předložit záznamy, které budou u každé položky obsahovat minimálně datum, místo a počet (km, nocí, …).</p>
  <p><strong>¹⁴ Koupej se</strong><br>ponoř se do vody celý až po krk a pokud možno udělej alespoň 2 tempa.</p>
`;

export function RecordListPage() {
  const { records, loading, error, deleteRecord, exportToJson, importFromJson } = useRecords();
  const history = useHistory();
  const location = useLocation<{ toast?: string }>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(location.state?.toast ?? null);
  const [showAbout, setShowAbout] = useState(false);

  function handleOpen(id: string) {
    history.push(`/records/view/${id}`);
  }

  function handleDeleteRequest(id: string) {
    setPendingDeleteId(id);
  }

  async function handleConfirmDelete() {
    if (pendingDeleteId) {
      await deleteRecord(pendingDeleteId);
      setToastMessage('Záznam byl smazán.');
    }
    setPendingDeleteId(null);
  }

  async function handleExport() {
    try {
      const json = await exportToJson();
      await fileExportService.exportFile(`moje-plavani-${todayIsoDate()}.json`, json, 'application/json');
    } catch {
      setToastMessage('Export se nezdařil.');
    }
  }

  function handleImportClick() {
    fileInputRef.current?.click();
  }

  async function handleImportFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) {
      return;
    }
    try {
      const text = await file.text();
      const count = await importFromJson(text);
      setToastMessage(`Bylo importováno záznamů: ${count}.`);
    } catch (err) {
      setToastMessage(err instanceof Error ? err.message : 'Import se nezdařil.');
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => setShowAbout(true)} aria-label="O aplikaci">
              <IonIcon slot="icon-only" icon={informationCircleOutline} />
            </IonButton>
          </IonButtons>
          <IonTitle>
            {records.length}/{TARGET_PLACES_COUNT}
          </IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleExport} aria-label="Exportovat záznamy">
              <IonIcon slot="icon-only" icon={downloadOutline} />
            </IonButton>
            <IonButton onClick={handleImportClick} aria-label="Importovat záznamy">
              <IonIcon slot="icon-only" icon={cloudUploadOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}>
            <IonSpinner />
          </div>
        )}

        {!loading && error && (
          <div style={{ textAlign: 'center', padding: 32, color: 'var(--ion-color-danger)' }}>{error}</div>
        )}

        {!loading && !error && records.length === 0 && (
          <div style={{ textAlign: 'center', padding: 32 }}>
            <h2>Zatím žádné záznamy</h2>
            <p>Přidejte svůj první zápis o koupání.</p>
          </div>
        )}

        {!loading && !error && records.length > 0 && (
          <IonList>
            {records.map((record, index) => (
              <RecordCard
                key={record.id}
                record={record}
                position={index + 1}
                onOpen={handleOpen}
                onDelete={handleDeleteRequest}
              />
            ))}
          </IonList>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          style={{ display: 'none' }}
          onChange={handleImportFile}
        />

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => history.push('/records/new')}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>

      <IonAlert
        isOpen={pendingDeleteId !== null}
        header="Smazat záznam?"
        message="Tato akce je nevratná. Opravdu chcete tento záznam smazat?"
        buttons={[
          { text: 'Zrušit', role: 'cancel', handler: () => setPendingDeleteId(null) },
          { text: 'Smazat', role: 'destructive', handler: handleConfirmDelete },
        ]}
        onDidDismiss={() => setPendingDeleteId(null)}
      />

      <IonToast
        isOpen={toastMessage !== null}
        message={toastMessage ?? ''}
        duration={2000}
        onDidDismiss={() => setToastMessage(null)}
      />

      <IonAlert
        isOpen={showAbout}
        header="Koupačka 100"
        subHeader={`Verze ${__APP_VERSION__}`}
        message={ABOUT_MESSAGE_HTML}
        buttons={['OK']}
        onDidDismiss={() => setShowAbout(false)}
      />
    </IonPage>
  );
}
