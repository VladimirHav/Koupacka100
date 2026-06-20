import type { Coordinates, GeolocationService } from './GeolocationService';
import { LocationPermissionDeniedError } from './GeolocationService';

export class WebGeolocationService implements GeolocationService {
  async getCurrentPosition(): Promise<Coordinates> {
    if (!('geolocation' in navigator)) {
      throw new LocationPermissionDeniedError();
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            reject(new LocationPermissionDeniedError());
          } else {
            reject(error);
          }
        },
        { enableHighAccuracy: true, timeout: 10000 },
      );
    });
  }
}
