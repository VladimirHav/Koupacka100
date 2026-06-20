import { Redirect, Route } from 'react-router-dom';
import { IonRouterOutlet } from '@ionic/react';
import { RecordListPage } from '../pages/RecordListPage/RecordListPage';
import { RecordFormPage } from '../pages/RecordFormPage/RecordFormPage';
import { RecordDetailPage } from '../pages/RecordDetailPage/RecordDetailPage';

// Single stack, no tab bar — this app has one entity type, so a tab bar
// would be empty ceremony. The FAB on the list page is the only secondary
// navigation target.
//
// IonRouterOutlet does not do exclusive (Switch-style) path matching, so
// overlapping patterns like "/records/new" and "/records/:id" are ambiguous
// regardless of declaration order. Routes are namespaced by segment
// (/records/new, /records/view/:id, /records/edit/:id) so no two patterns
// can ever match the same URL.
export function AppRoutes() {
  return (
    <IonRouterOutlet>
      <Route exact path="/records" component={RecordListPage} />
      <Route exact path="/records/new" component={RecordFormPage} />
      <Route exact path="/records/view/:id" component={RecordDetailPage} />
      <Route exact path="/records/edit/:id" component={RecordFormPage} />
      <Route exact path="/">
        <Redirect to="/records" />
      </Route>
    </IonRouterOutlet>
  );
}
