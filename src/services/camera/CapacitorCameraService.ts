import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import type { CameraService, PhotoResult } from './CameraService';
import { CameraPermissionDeniedError } from './CameraService';

// Cap stored photo resolution so IndexedDB doesn't balloon with full-sensor
// camera output (e.g. 4000x3000+ on modern phones).
const MAX_DIMENSION = 1600;

function isCancelled(err: unknown): boolean {
  const message = (err as { message?: string } | undefined)?.message ?? '';
  return message.toLowerCase().includes('cancel');
}

// `webPath` is a blob: URL the WebView can `fetch()` directly — this is the
// long-documented, battle-tested way to turn a Capacitor Camera result into
// a Blob (unlike the newer takePhoto/chooseFromGallery APIs, whose `uri` +
// `convertFileSrc` path proved unreliable for full-resolution images on
// Android in testing — images came back unreadable).
async function webPathToPhotoResult(webPath: string | undefined, format: string): Promise<PhotoResult | null> {
  if (!webPath) {
    return null;
  }
  const response = await fetch(webPath);
  const blob = await response.blob();
  return { blob, mimeType: blob.type || `image/${format}` };
}

export class CapacitorCameraService implements CameraService {
  async takePhoto(): Promise<PhotoResult | null> {
    try {
      const photo = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        quality: 90,
        width: MAX_DIMENSION,
        height: MAX_DIMENSION,
      });
      return await webPathToPhotoResult(photo.webPath, photo.format);
    } catch (err) {
      if (isCancelled(err)) {
        return null;
      }
      throw new CameraPermissionDeniedError();
    }
  }

  async pickFromGallery(): Promise<PhotoResult | null> {
    try {
      const photo = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos,
        quality: 90,
        width: MAX_DIMENSION,
        height: MAX_DIMENSION,
      });
      return await webPathToPhotoResult(photo.webPath, photo.format);
    } catch (err) {
      if (isCancelled(err)) {
        return null;
      }
      throw new CameraPermissionDeniedError();
    }
  }

  async pickMultipleFromGallery(): Promise<PhotoResult[]> {
    try {
      const { photos } = await Camera.pickImages({
        quality: 90,
        width: MAX_DIMENSION,
        height: MAX_DIMENSION,
      });
      const results = await Promise.all(photos.map((photo) => webPathToPhotoResult(photo.webPath, photo.format)));
      return results.filter((result): result is PhotoResult => result !== null);
    } catch (err) {
      if (isCancelled(err)) {
        return [];
      }
      throw new CameraPermissionDeniedError();
    }
  }
}
