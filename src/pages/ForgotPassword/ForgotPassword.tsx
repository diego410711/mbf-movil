import { useState } from "react";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToast,
  IonToolbar,
} from "@ionic/react";
import "./ForgotPassword.css";
import { useHistory } from "react-router-dom";
import { handleForgot } from "../../services/authService";

export default function ForgotPassword(props: {
  email: string;
  setEmail: (arg0: string) => void;
}) {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const history = useHistory();

  const handleForgotPassword = async () => {
    try {
      const responseForgot = await handleForgot(props.email);
      if (responseForgot.status === 201) {
        setToastMessage("Correo enviado para recuperación de contraseña");
        setShowToast(true);
        history.push("/resetpassword");
      } else {
        setToastMessage(
          "Error inesperado al solicitar recuperación de contraseña"
        );
        setShowToast(true);
      }
    } catch (error) {
      setToastMessage("Error al solicitar recuperación de contraseña");
      setShowToast(true);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Recuperación de contraseña</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem className="custom-item">
          <IonLabel position="floating">Correo electrónico</IonLabel>
          <IonInput
            placeholder="Ingrese su correo"
            value={props.email}
            onIonInput={(e) => props.setEmail(e.detail.value!)}
            className="custom-input"
          />
        </IonItem>
        <div className="container-button">
          <IonButton
            onClick={(e) => {
              handleForgotPassword();
            }}
            className="custom-button margin-button"
            color={"danger"}
          >
            Enviar Código
          </IonButton>
        </div>
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2000}
        />
      </IonContent>
    </IonPage>
  );
}
