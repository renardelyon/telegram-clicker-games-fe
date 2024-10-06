import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonRouterOutlet,
} from '@ionic/react';
import {
  cashOutline,
  checkboxOutline,
  podiumOutline,
  swapHorizontalOutline,
  personOutline,
} from 'ionicons/icons';
import EarnPage from './pages/EarnPage';
import TaskPage from './pages/TaskPage';
import { Redirect, Route } from 'react-router';
import { IonReactRouter } from '@ionic/react-router';
import LeaderboardPage from './pages/LeaderboardPage';

const TabRoute = () => {
  return (
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Redirect exact path="/" to="/earn" />
          <Route path="/earn" render={() => <EarnPage />} exact={true} />
          <Route path="/tasks" render={() => <TaskPage />} exact={true} />
          <Route
            path="/leaderboard"
            render={() => <LeaderboardPage />}
            exact={true}
          />
        </IonRouterOutlet>

        <IonTabBar className="py-4" slot="bottom">
          <IonTabButton tab="earn" className="tab-button" href="/earn">
            <IonIcon icon={cashOutline} />
            <span className="text-md">Earn</span>
          </IonTabButton>
          <IonTabButton tab="tasks" className="tab-button" href="/tasks">
            <IonIcon icon={checkboxOutline} className="text-5xl" />
            <span className="text-md">Tasks</span>
          </IonTabButton>
          <IonTabButton
            className="tab-button"
            tab="leaderboard"
            href="/leaderboard">
            <IonIcon icon={podiumOutline} className="text-5xl" />
            <span className="text-md">Leaderboard</span>
          </IonTabButton>
          <IonTabButton className="tab-button" tab="swap">
            <IonIcon icon={swapHorizontalOutline} className="text-5xl" />
            <span className="text-md">Swap</span>
          </IonTabButton>
          <IonTabButton className="tab-button" tab="account">
            <IonIcon icon={personOutline} className="text-5xl" />
            <span className="text-md">Account</span>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  );
};

export default TabRoute;
