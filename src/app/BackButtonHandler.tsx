import { useEffect, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { IonAlert } from '@ionic/react';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

const ROOT_PATH = '/records';

// Capacitor's default Android back behavior (hardware key, 3-button nav, and
// the gesture swipe all funnel through the same JS event) is: go back in the
// WebView if possible, otherwise minimize the app. That doesn't match how
// this app's screen stack should behave, and it skips the "do you want to
// quit?" confirmation on the main screen, so we take over the event
// entirely rather than relying on the default.
export function BackButtonHandler() {
  const history = useHistory();
  const location = useLocation();
  const pathnameRef = useRef(location.pathname);
  const [confirmExit, setConfirmExit] = useState(false);

  useEffect(() => {
    pathnameRef.current = location.pathname;
  }, [location.pathname]);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    const listenerPromise = App.addListener('backButton', () => {
      if (pathnameRef.current === ROOT_PATH || pathnameRef.current === '/') {
        setConfirmExit(true);
      } else {
        history.goBack();
      }
    });

    return () => {
      listenerPromise.then((listener) => listener.remove());
    };
  }, [history]);

  return (
    <IonAlert
      isOpen={confirmExit}
      header="Zavřít aplikaci?"
      message="Opravdu chcete aplikaci Koupačka 100 zavřít?"
      buttons={[
        { text: 'Zrušit', role: 'cancel', handler: () => setConfirmExit(false) },
        { text: 'Zavřít', role: 'destructive', handler: () => App.exitApp() },
      ]}
      onDidDismiss={() => setConfirmExit(false)}
    />
  );
}
