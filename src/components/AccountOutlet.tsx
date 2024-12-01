import { IonRouterLink } from '@ionic/react';
import React from 'react';
import { useLocation } from 'react-router';

enum AccountEnum {
  REFERRAL = 'referral',
  LANGUAGE = 'language',
}

const AccountOutlet: React.FC<TAccountOutlet> = ({ children }) => {
  const { pathname } = useLocation();

  return (
    <div
      id="account-outlet"
      className="relative h-screen w-screen bg-[#020D2F]">
      {/* Tab Buttons */}
      <div className="flex justify-center py-6 max-w-screen-2xl px-6">
        <IonRouterLink
          routerLink="/account/referrals"
          className={`flex-grow px-4 py-2 font-bold rounded-l-lg
            ${pathname.includes(AccountEnum.REFERRAL) ? 'bg-[#203A68] text-[#FBFCFE]' : 'bg-[#D0EAF0] text-black'}`}>
          <p>Referral</p>
        </IonRouterLink>
        <IonRouterLink
          routerLink="/account/language"
          className={`flex-grow px-4 py-2 font-bold  rounded-r-lg
            ${pathname.includes(AccountEnum.LANGUAGE) ? 'bg-[#203A68] text-[#FBFCFE]' : 'bg-[#D0EAF0] text-black'}`}>
          <p>Language</p>
        </IonRouterLink>
      </div>
      {children}
    </div>
  );
};

type TAccountOutlet = {
  children: React.ReactNode;
};

export default AccountOutlet;
