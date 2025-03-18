import {
  IonButtons,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  useIonToast,
} from "@ionic/react";
import { useState } from "react";
import { updateUser } from "../../services/authService"; // Importa tu servicio de actualización
import "./ProfileData.css";

export default function (props: {
  name: string;
  email: string;
  phone: string;
  address: string;
  userId: string;
}) {
  const [profileData, setProfileData] = useState({
    name: props.name,
    email: props.email,
    phone: props.phone,
    address: props.address,
  });

  const [presentToast] = useIonToast(); // Para mostrar notificaciones

  const handleInputChange = (key: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      // Supongamos que `props.userId` contiene el ID del usuario
      if (!props.userId) {
        throw new Error("ID de usuario no proporcionado");
      }

      const response = await updateUser(props.userId, profileData);
      presentToast({
        message: "Datos actualizados con éxito",
        duration: 2000,
        color: "success",
      });
      console.log("Datos guardados:", response);
    } catch (error: any) {
      presentToast({
        message: error.message || "Error al actualizar los datos",
        duration: 2000,
        color: "danger",
      });
      console.error("Error al guardar datos:", error);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Datos de perfil</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <form>
          <IonItem className="custom-item">
            <IonLabel position="floating">Nombre</IonLabel>
            <IonInput
              value={profileData.name}
              onIonInput={(e) =>
                handleInputChange("name", e.detail.value || "")
              }
              className="custom-input"
            />
          </IonItem>
          <IonItem className="custom-item">
            <IonLabel position="floating">Correo</IonLabel>
            <IonInput
              value={profileData.email}
              type="email"
              onIonInput={(e) =>
                handleInputChange("email", e.detail.value || "")
              }
              className="custom-input"
            />
          </IonItem>
          <IonItem className="custom-item">
            <IonLabel position="floating">Teléfono</IonLabel>
            <IonInput
              value={profileData.phone}
              type="tel"
              onIonInput={(e) =>
                handleInputChange("phone", e.detail.value || "")
              }
              className="custom-input"
            />
          </IonItem>
          <IonItem className="custom-item">
            <IonLabel position="floating">Dirección</IonLabel>
            <IonInput
              value={profileData.address}
              onIonInput={(e) =>
                handleInputChange("address", e.detail.value || "")
              }
              className="custom-input"
            />
          </IonItem>
          <div className="container-button">
            <IonButton
              expand="block"
              onClick={handleSave}
              className="custom-button margin-button"
              color={"danger"}
            >
              Guardar Cambios
            </IonButton>
          </div>
        </form>
      </IonContent>
    </IonPage>
  );
}
