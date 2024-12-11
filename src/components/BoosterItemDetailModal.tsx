import { IonModal, IonContent, IonButton } from '@ionic/react';
import CoinSVG from '@/assets/coin_pixel.svg?react';
import '@/style/css/BoosterItemDetailModal.css';
import UpgradeEnum from '@/enum/UpgradeEnum';
import { FaBoltLightning } from 'react-icons/fa6';
import { PiHandTapFill } from 'react-icons/pi';
import { TbRecharging } from 'react-icons/tb';
import { useBuyUpgrades } from '@/api/upgrades';
import useBoundStore from '@/store/store';
import errorHandler from '@/utils/error';

const BoosterItemDetailModal: React.FC<BoosterItemDetailModalProps> = ({
  setIsOpen,
  isOpen,
  id,
  name,
  description,
  amount,
  effect,
}) => {
  let upgradeIcon;
  switch (effect) {
    case UpgradeEnum.ENERGY_LIMIT:
      upgradeIcon = <FaBoltLightning className="w-24 h-24 mr-4" />;
      break;
    case UpgradeEnum.ENERGY_RECHARGE:
      upgradeIcon = <TbRecharging className="w-24 h-24 mr-4" />;
      break;
    case UpgradeEnum.MULTI_TAP:
      upgradeIcon = <PiHandTapFill className="w-24 h-24 mr-4" />;
  }

  const resetErrorToast = useBoundStore.use.resetErrorToast();
  const setErrorToast = useBoundStore.use.setErrorToast();

  const buyUpgradeMutate = useBuyUpgrades({
    successSideEffect: () => {
      resetErrorToast();
      setIsOpen(false);
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

  const handleBuy = () => {
    buyUpgradeMutate.mutate({ upgrade_id: id });
    setIsOpen(false);
  };

  return (
    <IonModal
      id="booster-item-detail-modal"
      isOpen={isOpen}
      className="multi-tap-modal"
      initialBreakpoint={1}
      breakpoints={[0, 1]}
      onDidDismiss={() => setIsOpen(false)}>
      <IonContent className="multi-tap-modal-content">
        {/* Body Content */}
        <div className="modal-body">
          <h2 className="title font-pixel">{name}</h2>
          <div className="avatar">{upgradeIcon}</div>
          <p className="description text-center">{description}</p>
          <div className="price">
            <CoinSVG className="w-6 h-6 mr-1" />
            <span>{amount}</span>
          </div>
          <IonButton
            expand="block"
            color="primary"
            className="get-now-button"
            onClick={handleBuy}>
            Get Now
          </IonButton>
        </div>
      </IonContent>
    </IonModal>
  );
};

export type BoosterItemDetailModalProps = {
  setIsOpen: (val: boolean) => void;
  isOpen: boolean;
  id: string;
  name: string;
  description: string;
  amount: string;
  effect: UpgradeEnum;
};

export default BoosterItemDetailModal;
