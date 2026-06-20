import { Geolocation } from '@capacitor/geolocation';
import type { Coordinates, GeolocationService } from './GeolocationService';
import { LocationPermissionDeniedError } from './GeolocationService';

export class CapacitorGeolocationService implements GeolocationService {
  async getCurrentPosition(): Promise<Coordinates> {
    try {
      const position = await Geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 10000 });
      return { latitude: position.coords.latitude, longitude: position.coords.longitude };
    } catch {
      throw new LocationPermissionDeniedError();
    }
  }
}
