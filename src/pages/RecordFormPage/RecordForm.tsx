import { useState } from 'react';
import {
  IonButton,
  IonDatetime,
  IonDatetimeButton,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonNote,
  IonTextarea,
} from '@ionic/react';
import type { SwimRecordInput, RecordValidationErrors } from '../../domain/record';
import {
  COMMENT_MAX_LENGTH,
  DEFAULT_RATING,
  DEFAULT_WATER_TEMPERATURE,
  hasValidationErrors,
  todayIsoDate,
  validateRecordInput,
} from '../../domain/record';
import { RatingInput } from './RatingInput';
import { PhotoPicker } from './PhotoPicker';
import { LocationField } from './LocationField';

interface RecordFormProps {
  initial?: SwimRecordInput;
  onSubmit: (input: SwimRecordInput) => Promise<void>;
}

function emptyInput(): SwimRecordInput {
  return {
    date: todayIsoDate(),
    placeName: '',
    latitude: null,
    longitude: null,
    waterRating: DEFAULT_RATING,
    accessRating: DEFAULT_RATING,
    waterTemperature: DEFAULT_WATER_TEMPERATURE,
    comment: '',
    photos: [],
  };
}

export function RecordForm({ initial, onSubmit }: RecordFormProps) {
  const [input, setInput] = useState<SwimRecordInput>(initial ?? emptyInput());
  const [errors, setErrors] = useState<RecordValidationErrors>({});
  const [saving, setSaving] = useState(false);

  function update<K extends keyof SwimRecordInput>(key: K, value: SwimRecordInput[K]) {
    setInput((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    const validationErrors = validateRecordInput(input);
    setErrors(validationErrors);
    if (hasValidationErrors(validationErrors)) {
      return;
    }
    setSaving(true);
    try {
      await onSubmit(input);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <IonList>
        <IonItem lines="full">
          <IonLabel>Datum</IonLabel>
          <IonDatetimeButton datetime="date-picker" slot="end" />
        </IonItem>
        <IonModal keepContentsMounted>
          <IonDatetime
            id="date-picker"
            presentation="date"
            locale="cs-CZ"
            value={input.date}
            onIonChange={(e) => update('date', (e.detail.value as string).slice(0, 10))}
          />
        </IonModal>

        <IonItem lines="full">
          <IonLabel position="stacked">Místo</IonLabel>
          <IonInput
            value={input.placeName}
            placeholder="Např. Bagr Poděbrady"
            onIonInput={(e) => update('placeName', e.detail.value ?? '')}
          />
        </IonItem>
        {errors.placeName && (
          <IonItem lines="none">
            <IonLabel color="danger">{errors.placeName}</IonLabel>
          </IonItem>
        )}

        <LocationField
          latitude={input.latitude}
          longitude={input.longitude}
          onChange={(latitude, longitude) => setInput((prev) => ({ ...prev, latitude, longitude }))}
        />

        <RatingInput
          label="Kvalita vody"
          value={input.waterRating}
          minLabel="Špatná"
          maxLabel="Dobrá"
          onChange={(value) => update('waterRating', value)}
        />

        <RatingInput
          label="Přístup do vody"
          value={input.accessRating}
          minLabel="Nejhorší"
          maxLabel="Nejlepší"
          onChange={(value) => update('accessRating', value)}
        />

        <RatingInput
          label="Teplota vody"
          value={input.waterTemperature}
          max={5}
          minLabel="Studená"
          maxLabel="Teplá"
          onChange={(value) => update('waterTemperature', value)}
        />

        <IonItem lines="full">
          <IonLabel position="stacked">Komentář</IonLabel>
          <IonTextarea
            value={input.comment}
            placeholder="Volitelná poznámka k plavání…"
            maxlength={COMMENT_MAX_LENGTH}
            autoGrow
            counter
            onIonInput={(e) => update('comment', e.detail.value ?? '')}
          />
        </IonItem>
        {errors.comment && (
          <IonItem lines="none">
            <IonNote color="danger">{errors.comment}</IonNote>
          </IonItem>
        )}

        <PhotoPicker photos={input.photos} onChange={(photos) => update('photos', photos)} />
      </IonList>

      <div style={{ padding: 16 }}>
        <IonButton expand="block" onClick={handleSave} disabled={saving}>
          Uložit
        </IonButton>
      </div>
    </>
  );
}
