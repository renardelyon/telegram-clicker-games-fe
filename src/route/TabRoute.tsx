import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonRouterOutlet,
  IonToast,
  isPlatform,
} from '@ionic/react';
import {
  cashOutline,
  checkboxOutline,
  podiumOutline,
  swapHorizontalOutline,
  personOutline,
} from 'ionicons/icons';
import EarnPage from '../pages/EarnPage';
import TaskPage from '../pages/TaskPage';
import { Redirect, Route } from 'react-router';
import { IonReactRouter } from '@ionic/react-router';
import LeaderboardPage from '../pages/LeaderboardPage';
import LanguagePage from '@/pages/LanguagePage';
import ReferralPage from '@/pages/ReferralPage';
import { useGetProfile, useUserSignIn } from '@/api/authUser';
import { useEffect, useState } from 'react';
import useBoundStore from '@/store/store';
import errorHandler from '@/utils/error';
import { useAddReferral } from '@/api/referral';
import { TWalletData, TWalletError } from '@/type/TWalletData';
import SwapPageMobile from '@/pages/SwapPageMobile';
import SwapPageDesktop from '@/pages/SwapPageDesktop';

const TabRoute = () => {
  const [signInSuccessStatus, setSignInSuccessStatus] = useState(false);
  const [walletConnectToastIsOpen, setwalletConnectToastIsOpen] =
    useState(false);
  const [walletConnectToastMessage, setwalletConnectToastMessage] =
    useState('');

  const resetErrorToast = useBoundStore.use.resetErrorToast();
  const setErrorToast = useBoundStore.use.setErrorToast();
  const setInitData = useBoundStore.use.setInitData();
  const setWalletData = useBoundStore.use.setWalletData();
  const setWalletStatus = useBoundStore.use.setWalletStatus();
  const resetWalletData = useBoundStore.use.resetWalletData();
  const errToastIsOpen = useBoundStore.use.isOpen();
  const errToastMsg = useBoundStore.use.message();

  const signInMutate = useUserSignIn({
    onSuccess: () => {
      setSignInSuccessStatus(true);
      resetErrorToast();
    },
    onError: err => {
      errorHandler({
        error: err,
        axiosErrorHandlerFn: errMsg => {
          setErrorToast({ isOpen: true, message: errMsg || '' });
        },
        generalErrorHandlerFn: err => {
          setErrorToast({ isOpen: true, message: err.message || '' });
        },
      });
    },
  });

  const referralMutate = useAddReferral({
    onSuccess: () => {
      resetErrorToast();
    },
    onError: err => {
      errorHandler({
        error: err,
        axiosErrorHandlerFn: errMsg => {
          setErrorToast({ isOpen: true, message: errMsg || '' });
        },
        generalErrorHandlerFn: err => {
          setErrorToast({ isOpen: true, message: err.message || '' });
        },
      });
    },
  });

  const init = async () => {
    if (typeof window == 'undefined') {
      return;
    }

    const WebApp = (await import('@twa-dev/sdk')).default;
    WebApp.ready();

    setInitData(WebApp.initData);
    signInMutate.mutate();

    const startParam = WebApp.initDataUnsafe.start_param;

    if (!startParam) {
      return;
    }

    try {
      const res = Buffer.from(startParam, 'base64').toString();

      const data: TWalletData | TWalletError = JSON.parse(res);
      if ('errorCode' in data || 'errorMessage' in data) {
        setErrorToast({ isOpen: true, message: data.errorMessage || '' });
      } else {
        setwalletConnectToastIsOpen(true);
        setwalletConnectToastMessage('Wallet successfully connected');
        setWalletData(data as TWalletData);
        setWalletStatus('connected');
      }
    } catch (e) {
      if (/disconnect/.test(startParam)) {
        resetWalletData();
        setWalletStatus('disconnected');
        setwalletConnectToastIsOpen(true);
        setwalletConnectToastMessage('Wallet successfully disconnected');
      } else if (/transaction_completed/.test(startParam)) {
        setwalletConnectToastIsOpen(true);
        setwalletConnectToastMessage('Transaction Succeed');
      } else {
        if (Number.isNaN(Number(WebApp.initDataUnsafe.start_param))) return;

        referralMutate.mutate({
          referred_by: Number(WebApp.initDataUnsafe.start_param),
        });
      }
    }
  };

  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    data: profileData,
    error: profileError,
    isError: profileIsError,
    isSuccess: profileIsSuccess,
  } = useGetProfile({ enabled: signInSuccessStatus });

  const setUserData = useBoundStore.use.setUserData();

  useEffect(() => {
    if (profileIsSuccess) {
      setUserData(profileData?.data?.data);
      resetErrorToast();
    }

    if (profileIsError) {
      errorHandler({
        error: profileError,
        axiosErrorHandlerFn: errMsg => {
          setErrorToast({ isOpen: true, message: errMsg || '' });
        },
        generalErrorHandlerFn: err => {
          setErrorToast({ isOpen: true, message: err.message || '' });
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, profileError, profileIsError, profileIsSuccess]);

  return (
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Redirect exact path="/" to="/earn" />
          <Redirect exact path="/account" to="/account/referrals" />
          <Route path="/earn" render={() => <EarnPage />} exact={true} />
          <Route path="/tasks" render={() => <TaskPage />} exact={true} />
          <Route
            path="/leaderboard"
            render={() => <LeaderboardPage />}
            exact={true}
          />
          <Route
            path="/swap"
            render={() =>
              isPlatform('desktop') ? <SwapPageDesktop /> : <SwapPageMobile />
            }
            exact={true}
          />
          <Route
            path="/account/language"
            exact={true}
            render={() => <LanguagePage />}
          />
          <Route
            path="/account/referrals"
            exact={true}
            render={() => <ReferralPage />}
          />
        </IonRouterOutlet>

        <IonTabBar className="py-4 bg-[#000F29] rounded-t-2xl" slot="bottom">
          <IonTabButton
            tab="earn"
            className="tab-button bg-[#000F29]"
            href="/earn">
            <IonIcon icon={cashOutline} className="text-5xl" />
            <span className="text-md">Earn</span>
          </IonTabButton>
          <IonTabButton
            tab="tasks"
            className="tab-button bg-[#000F29]"
            href="/tasks">
            <IonIcon icon={checkboxOutline} className="text-5xl" />
            <span className="text-md">Tasks</span>
          </IonTabButton>
          <IonTabButton
            className="tab-button bg-[#000F29]"
            tab="leaderboard"
            href="/leaderboard">
            <IonIcon icon={podiumOutline} className="text-5xl" />
            <span className="text-md">Leaderboard</span>
          </IonTabButton>
          <IonTabButton
            className="tab-button bg-[#000F29]"
            tab="swap"
            href="/swap">
            <IonIcon icon={swapHorizontalOutline} className="text-5xl" />
            <span className="text-md">Swap</span>
          </IonTabButton>
          <IonTabButton
            className="tab-button bg-[#000F29]"
            tab="account"
            href="/account">
            <IonIcon icon={personOutline} className="text-5xl" />
            <span className="text-md">Account</span>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
      <IonToast
        isOpen={errToastIsOpen}
        color="danger"
        message={errToastMsg}
        swipeGesture="vertical"
        position="top"
        onDidDismiss={() => {
          resetErrorToast();
        }}
        cssClass="toast-error"
      />
      <IonToast
        isOpen={walletConnectToastIsOpen}
        color="success"
        message={walletConnectToastMessage}
        swipeGesture="vertical"
        position="top"
        onDidDismiss={() => {
          resetErrorToast();
        }}
        cssClass="toast-error"
      />
    </IonReactRouter>
  );
};

export default TabRoute;
