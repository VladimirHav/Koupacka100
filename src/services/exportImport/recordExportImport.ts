import type { SwimRecord } from '../../domain/record';
import { DEFAULT_WATER_TEMPERATURE } from '../../domain/record';
import { base64ToBlob, blobToBase64 } from './blobBase64';

// On-disk JSON shape. Photos are stored as base64 + mimeType since JSON
// cannot carry a Blob directly.
interface ExportedPhoto {
  mimeType: string;
  base64: string;
}

interface ExportedRecordV2 {
  id: string;
  date: string;
  placeName: string;
  latitude: number | null;
  longitude: number | null;
  waterRating: number;
  accessRating: number;
  waterTemperature: number;
  comment: string;
  photos: ExportedPhoto[];
  createdAt: string;
  updatedAt: string;
}

// v1 export shape (single optional photo, no waterTemperature/comment) — kept
// for backward-compatible import of files exported before this version.
interface ExportedRecordV1 {
  id: string;
  date: string;
  placeName: string;
  latitude: number | null;
  longitude: number | null;
  waterRating: number;
  accessRating: number;
  photo: ExportedPhoto | null;
  createdAt: string;
  updatedAt: string;
}

interface ExportFileV2 {
  app: 'swim-log';
  version: 2;
  exportedAt: string;
  records: ExportedRecordV2[];
}

interface ExportFileV1 {
  app: 'swim-log';
  version: 1;
  exportedAt: string;
  records: ExportedRecordV1[];
}

const CURRENT_VERSION = 2;

async function toExportedRecord(record: SwimRecord): Promise<ExportedRecordV2> {
  return {
    id: record.id,
    date: record.date,
    placeName: record.placeName,
    latitude: record.latitude,
    longitude: record.longitude,
    waterRating: record.waterRating,
    accessRating: record.accessRating,
    waterTemperature: record.waterTemperature,
    comment: record.comment,
    photos: await Promise.all(
      record.photos.map(async (photo) => ({ mimeType: photo.type, base64: await blobToBase64(photo) })),
    ),
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

function fromExportedRecordV2(exported: ExportedRecordV2): SwimRecord {
  return {
    id: exported.id,
    date: exported.date,
    placeName: exported.placeName,
    latitude: exported.latitude,
    longitude: exported.longitude,
    waterRating: exported.waterRating,
    accessRating: exported.accessRating,
    waterTemperature: exported.waterTemperature,
    comment: exported.comment,
    photos: exported.photos.map((photo) => base64ToBlob(photo.base64, photo.mimeType)),
    createdAt: exported.createdAt,
    updatedAt: exported.updatedAt,
  };
}

function fromExportedRecordV1(exported: ExportedRecordV1): SwimRecord {
  return {
    id: exported.id,
    date: exported.date,
    placeName: exported.placeName,
    latitude: exported.latitude,
    longitude: exported.longitude,
    waterRating: exported.waterRating,
    accessRating: exported.accessRating,
    waterTemperature: DEFAULT_WATER_TEMPERATURE,
    comment: '',
    photos: exported.photo ? [base64ToBlob(exported.photo.base64, exported.photo.mimeType)] : [],
    createdAt: exported.createdAt,
    updatedAt: exported.updatedAt,
  };
}

export async function exportRecordsToJson(records: SwimRecord[]): Promise<string> {
  const file: ExportFileV2 = {
    app: 'swim-log',
    version: CURRENT_VERSION,
    exportedAt: new Date().toISOString(),
    records: await Promise.all(records.map(toExportedRecord)),
  };
  return JSON.stringify(file, null, 2);
}

export class ImportFileError extends Error {}

export function parseRecordsFromJson(json: string): SwimRecord[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new ImportFileError('Soubor není platný JSON.');
  }

  if (
    typeof parsed !== 'object' ||
    parsed === null ||
    (parsed as ExportFileV2 | ExportFileV1).app !== 'swim-log' ||
    !Array.isArray((parsed as ExportFileV2 | ExportFileV1).records)
  ) {
    throw new ImportFileError('Soubor neobsahuje platná data záznamů.');
  }

  const file = parsed as ExportFileV2 | ExportFileV1;
  if (file.version === 1) {
    return file.records.map(fromExportedRecordV1);
  }
  return (file as ExportFileV2).records.map(fromExportedRecordV2);
}
