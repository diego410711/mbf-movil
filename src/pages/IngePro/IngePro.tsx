import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import "./IngePro.css";

const IngePro: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Inge Pro</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <p className="custom-text">
          Próximamente podrás ver informes de la depreciación de tus equipos
          teniendo en cuenta si realizas los mantenimientos preventivos
        </p>
      </IonContent>
    </IonPage>
  );
};

export default IngePro;
