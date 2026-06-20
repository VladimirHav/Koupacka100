import { IonItem, IonLabel, IonRange } from '@ionic/react';
import type { RangeCustomEvent } from '@ionic/react';
import type { CSSProperties } from 'react';

interface RatingInputProps {
  label: string;
  value: number;
  max?: number;
  minLabel: string;
  maxLabel: string;
  onChange: (value: number) => void;
}

const edgeLabelStyle: CSSProperties = {
  fontSize: 12,
  color: 'var(--ion-color-medium)',
  padding: '10px 6px',
  cursor: 'pointer',
  userSelect: 'none',
  WebkitTapHighlightColor: 'transparent',
};

// Slider with snap-to-integer + visible pin is the fastest one-handed way to
// pick 1 of N discrete values on a phone — faster and more accurate than
// tapping one of N small buttons. minLabel/maxLabel give the two ends of the
// scale a plain-language meaning (e.g. "worst"/"best"), and tapping them
// nudges the value one step in that direction — useful on small phone
// screens where dragging the knob precisely by a single step is fiddly.
export function RatingInput({ label, value, max = 10, minLabel, maxLabel, onChange }: RatingInputProps) {
  return (
    <IonItem lines="none">
      <IonLabel>
        {label}: <strong>{value}</strong>/{max}
      </IonLabel>
      <IonRange
        aria-label={label}
        min={1}
        max={max}
        step={1}
        snaps
        pin
        ticks
        value={value}
        onIonChange={(e: RangeCustomEvent) => onChange(e.detail.value as number)}
      >
        <div slot="start" role="button" style={edgeLabelStyle} onClick={() => onChange(Math.max(1, value - 1))}>
          {minLabel}
        </div>
        <div slot="end" role="button" style={edgeLabelStyle} onClick={() => onChange(Math.min(max, value + 1))}>
          {maxLabel}
        </div>
      </IonRange>
    </IonItem>
  );
}
