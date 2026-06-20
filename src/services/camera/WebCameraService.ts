import type { CameraService, PhotoResult } from './CameraService';

// Opens a native file picker. With `capture` set, mobile browsers route this
// straight to the camera app; without it, the OS gallery/file picker opens.
// The OS handles the camera permission prompt itself; we don't get a separate
// permission API on the web, so there is nothing to request up front.
function pickFile(capture: boolean, multiple: boolean): Promise<PhotoResult[]> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    if (capture) {
      input.capture = 'environment';
    }
    if (multiple) {
      input.multiple = true;
    }

    input.onchange = () => {
      const files = input.files ? Array.from(input.files) : [];
      resolve(files.map((file) => ({ blob: file, mimeType: file.type })));
    };

    // If the user dismisses the picker without choosing a file, no event
    // fires reliably across browsers, so we resolve([]) only via onchange.
    input.click();
  });
}

export class WebCameraService implements CameraService {
  async takePhoto(): Promise<PhotoResult | null> {
    const results = await pickFile(true, false);
    return results[0] ?? null;
  }

  async pickFromGallery(): Promise<PhotoResult | null> {
    const results = await pickFile(false, false);
    return results[0] ?? null;
  }

  async pickMultipleFromGallery(): Promise<PhotoResult[]> {
    return pickFile(false, true);
  }
}
