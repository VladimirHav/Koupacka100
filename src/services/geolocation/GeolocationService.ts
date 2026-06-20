export interface Coordinates {
  latitude: number;
  longitude: number;
}

export class LocationPermissionDeniedError extends Error {
  constructor() {
    super('Location permission denied');
    this.name = 'LocationPermissionDeniedError';
  }
}

// Web (v1) implements this via navigator.geolocation.
// A future Capacitor build implements it via @capacitor/geolocation, same interface.
export interface GeolocationService {
  getCurrentPosition(): Promise<Coordinates>;
}
