import { IonModal, IonContent, IonIcon, IonButton } from '@ionic/react';
import { personCircleOutline, cashOutline } from 'ionicons/icons';
import '@/style/css/BoosterItemDetailModal.css';

const BoosterItemDetailModal: React.FC = () => {
  return (
    <IonModal
      id="booster-item-detail-modal"
      isOpen={true}
      className="multi-tap-modal"
      initialBreakpoint={1}
      breakpoints={[0, 1]}>
      <IonContent className="multi-tap-modal-content">
        {/* Body Content */}
        <div className="modal-body">
          <h2 className="title font-pixel">MULTITAP</h2>
          <div className="avatar">
            <IonIcon icon={personCircleOutline} />
          </div>
          <p className="description">
            Increase amount of TAP you can earn per one TAP
          </p>
          <p className="description-bold">+1 per TAP per each level</p>
          <div className="price">
            <IonIcon icon={cashOutline} />
            <span>1,000</span>
          </div>
          <IonButton expand="block" color="primary" className="get-now-button">
            Get Now
          </IonButton>
        </div>
      </IonContent>
    </IonModal>
  );
};

export default BoosterItemDetailModal;
