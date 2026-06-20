export interface SwimRecord {
  id: string;
  date: string; // ISO date, e.g. "2026-06-20"
  placeName: string;
  latitude: number | null;
  longitude: number | null;
  waterRating: number; // 1-10
  accessRating: number; // 1-10
  waterTemperature: number; // 1-5
  comment: string; // up to 500 characters
  photos: Blob[];
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
}

// Fields the user actually edits in the form; id/timestamps are derived by the repository.
export type SwimRecordInput = Omit<SwimRecord, 'id' | 'createdAt' | 'updatedAt'>;

export const DEFAULT_RATING = 5;
export const DEFAULT_WATER_TEMPERATURE = 3;
export const COMMENT_MAX_LENGTH = 500;

// Personal goal: a target list of 100 swim places to visit.
export const TARGET_PLACES_COUNT = 100;

export function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export interface RecordValidationErrors {
  placeName?: string;
  date?: string;
  waterRating?: string;
  accessRating?: string;
  waterTemperature?: string;
  comment?: string;
}

export function validateRecordInput(input: SwimRecordInput): RecordValidationErrors {
  const errors: RecordValidationErrors = {};

  if (!input.placeName.trim()) {
    errors.placeName = 'Zadejte název místa.';
  }

  if (!input.date) {
    errors.date = 'Datum je povinné.';
  }

  if (input.waterRating < 1 || input.waterRating > 10) {
    errors.waterRating = 'Vyberte hodnocení od 1 do 10.';
  }

  if (input.accessRating < 1 || input.accessRating > 10) {
    errors.accessRating = 'Vyberte hodnocení od 1 do 10.';
  }

  if (input.waterTemperature < 1 || input.waterTemperature > 5) {
    errors.waterTemperature = 'Vyberte hodnocení od 1 do 5.';
  }

  if (input.comment.length > COMMENT_MAX_LENGTH) {
    errors.comment = `Komentář může mít nejvýše ${COMMENT_MAX_LENGTH} znaků.`;
  }

  return errors;
}

export function hasValidationErrors(errors: RecordValidationErrors): boolean {
  return Object.keys(errors).length > 0;
}
