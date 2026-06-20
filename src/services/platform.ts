import { Capacitor } from '@capacitor/core';
import type { StorageService } from './storage/StorageService';
import { IndexedDbStorageService } from './storage/IndexedDbStorageService';
import type { CameraService } from './camera/CameraService';
import { WebCameraService } from './camera/WebCameraService';
import { CapacitorCameraService } from './camera/CapacitorCameraService';
import type { GeolocationService } from './geolocation/GeolocationService';
import { WebGeolocationService } from './geolocation/WebGeolocationService';
import { CapacitorGeolocationService } from './geolocation/CapacitorGeolocationService';
import type { FileExportService } from './fileExport/FileExportService';
import { WebFileExportService } from './fileExport/WebFileExportService';
import { CapacitorFileExportService } from './fileExport/CapacitorFileExportService';

// Single chokepoint for picking browser vs. native implementations.
// IndexedDB works fine inside the Capacitor WebView on Android, so storage
// stays the same on both platforms — only camera/geolocation/file-export
// need a native implementation. No page or component should import a
// concrete service implementation directly.
const isNative = Capacitor.isNativePlatform();

export const storageService: StorageService = new IndexedDbStorageService();
export const cameraService: CameraService = isNative ? new CapacitorCameraService() : new WebCameraService();
export const geolocationService: GeolocationService = isNative
  ? new CapacitorGeolocationService()
  : new WebGeolocationService();
export const fileExportService: FileExportService = isNative
  ? new CapacitorFileExportService()
  : new WebFileExportService();
