export interface PhotoResult {
  blob: Blob;
  mimeType: string;
}

// Web (v1) implements this via <input type="file" capture>.
// A future Capacitor build implements it via @capacitor/camera, same interface.
// takePhoto/pickFromGallery return a single shot (matches how a native camera
// UI works); pickMultipleFromGallery lets the user batch-add from the gallery.
export interface CameraService {
  takePhoto(): Promise<PhotoResult | null>;
  pickFromGallery(): Promise<PhotoResult | null>;
  pickMultipleFromGallery(): Promise<PhotoResult[]>;
}

export class CameraPermissionDeniedError extends Error {
  constructor() {
    super('Camera permission denied');
    this.name = 'CameraPermissionDeniedError';
  }
}
