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
import "./Resetpassword.css";
import { handleReset } from "../../services/authService";
import { useHistory } from "react-router-dom";

export default function ResetPassword(props: { email: string }) {
  const [code, setCode] = useState(0);
  const [newPassword, setNewPassword] = useState("");
  const [ConfirmnewPassword, setConfirmNewPassword] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const history = useHistory();

  const handleResetPassword = async () => {
    if (!newPassword || !ConfirmnewPassword) {
      setToastMessage("Complete el campo de contraseña");
      setShowToast(true);
    } else {
      const responseReset = await handleReset(props.email, code, newPassword);

      if (responseReset.status === 201 && responseReset.data.success) {
        setToastMessage("Contraseña restablecida");
        setShowToast(true);
        history.push("/login");
      } else {
        setToastMessage("Código inválido o expirado");
        setShowToast(true);
      }
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Cambiar contraseña</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem className="custom-item">
          <IonLabel position="floating">Código</IonLabel>
          <IonInput
            placeholder="Ingrese el código"
            value={code === 0 ? "" : code}
            onIonInput={(e) => setCode(Number(e.detail.value!))}
            className="custom-input"
            type="number"
          />
        </IonItem>
        <IonItem className="custom-item">
          <IonLabel position="floating">Contraseña</IonLabel>
          <IonInput
            placeholder="Ingrese su nueva contraseña"
            type="password"
            value={newPassword}
            onIonInput={(e) => setNewPassword(e.detail.value!)}
            className="custom-input"
          />
        </IonItem>
        <IonItem className="custom-item">
          <IonLabel position="floating">Confirmar contraseña</IonLabel>
          <IonInput
            placeholder="Confirme su nueva contraseña"
            type="password"
            value={ConfirmnewPassword}
            onIonInput={(e) => setConfirmNewPassword(e.detail.value!)}
            className="custom-input"
          />
        </IonItem>
        <div className="container-button">
          <IonButton
            className="custom-button margin-button"
            onClick={(e) => handleResetPassword()}
            color={"danger"}
          >
            Actualizar Contraseña
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
