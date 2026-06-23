import { IonApp, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { RecordsProvider } from '../state/RecordsContext';
import { AppRoutes } from './routes';
import { BackButtonHandler } from './BackButtonHandler';

// Ionic core CSS
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

// Optional Ionic CSS utils used by the components in this app
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/display.css';

import '../theme/variables.css';
import '../theme/global.css';

// Ionic escapes HTML in alert/toast message props by default (XSS hardening);
// the about dialog's message is static, locally-authored content, so it's
// safe to opt in and render it as actual HTML rather than literal text.
setupIonicReact({ innerHTMLTemplatesEnabled: true });

export default function App() {
  return (
    <IonApp>
      <RecordsProvider>
        <IonReactRouter>
          <AppRoutes />
          <BackButtonHandler />
        </IonReactRouter>
      </RecordsProvider>
    </IonApp>
  );
}
