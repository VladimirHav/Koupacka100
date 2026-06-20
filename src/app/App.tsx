import { IonApp, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { RecordsProvider } from '../state/RecordsContext';
import { AppRoutes } from './routes';

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

setupIonicReact();

export default function App() {
  return (
    <IonApp>
      <RecordsProvider>
        <IonReactRouter>
          <AppRoutes />
        </IonReactRouter>
      </RecordsProvider>
    </IonApp>
  );
}
