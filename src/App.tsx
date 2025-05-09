import { IonApp, setupIonicReact } from '@ionic/react';
import './App.css';
/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Palette
 * -----------------------------------------------------
 * For more information, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

import '@ionic/react/css/palettes/dark.always.css';
// import '@ionic/react/css/palettes/dark.class.css';
// import '@ionic/react/css/palettes/dark.system.css';

import TabRoute from './route/TabRoute';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import setupGlobalAxiosInterceptor from './api/setupGlobalAxiosInterceptor';
import WalletContextProvider from './components/WalletContextProvider';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 300 * 1000 } },
});

setupIonicReact();

function App() {
  setupGlobalAxiosInterceptor();
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <WalletContextProvider>
          <IonApp>
            <TabRoute></TabRoute>
          </IonApp>
        </WalletContextProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  );
}

export default App;
