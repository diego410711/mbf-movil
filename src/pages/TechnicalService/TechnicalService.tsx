import { useRef, useState } from "react";
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonImg,
  useIonToast,
  IonTextarea,
} from "@ionic/react";
import { submitTechnicalServiceRequest } from "../../services/equipmentService";
import "./TechnicalService.css";

interface TechnicalServiceProps {
  role: string;
}

const TechnicalService: React.FC<TechnicalServiceProps> = (props) => {
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [serial, setSerial] = useState("");
  const [issue, setIssue] = useState("");
  const [photos, setPhotos] = useState<File[]>([]); // Para manejar múltiples fotos
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]); // Para las vistas previas
  const [assignedTechnician, setAssignedTechnician] = useState<string>("");
  const [invoice, setInvoice] = useState<File | null>(null);
  const [diagnosis, setDiagnosis] = useState("");
  const [technicalDataSheet, setTechnicalDataSheet] = useState("");

  const [presentToast] = useIonToast();

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setPhotos((prevPhotos) => [...prevPhotos, ...fileArray]);

      // Crear vistas previas de las fotos seleccionadas
      const previewUrls = fileArray.map((file) => URL.createObjectURL(file));
      setPhotoPreviews((prevPreviews) => [...prevPreviews, ...previewUrls]);
    }
  };

  const handleInvoiceChange = (event: any) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // Validar tamaño del archivo (5 MB)
        alert("El archivo es demasiado grande. El límite es de 5 MB.");
        return;
      }
      setInvoice(file);
    }
  };

  const handleSubmit = async () => {
    try {
      // Crear un FormData para enviar los datos
      const formData = new FormData();
      formData.append("name", name);
      formData.append("brand", brand);
      formData.append("model", model);
      formData.append("serial", serial);
      formData.append("issue", issue);

      // Agregar las fotos al FormData
      photos.forEach((photo, index) => {
        formData.append(`photo_${index}`, photo); // Asegurarse de usar un nombre único para cada foto
      });

      // Agregar la factura y técnico si es administrador
      if (props.role === "Administrador" && invoice) {
        formData.append("invoice", invoice);
        formData.append("assignedTechnician", assignedTechnician);
      }

      if (props.role === "Tecnico") {
        formData.append("diagnosis", diagnosis);
        formData.append("technicalDataSheet", technicalDataSheet);
      }

      // Verifica que todo el FormData esté bien antes de enviar
      console.log("FormData que se enviará:");
      formData.forEach((value, key) => {
        console.log(key, value);
      });

      // Enviar la solicitud
      await submitTechnicalServiceRequest(formData);

      // Mostrar un mensaje de éxito
      presentToast({
        message: "Solicitud enviada exitosamente.",
        duration: 2000,
        color: "success",
      });

      // Resetear los campos
      setName("");
      setBrand("");
      setModel("");
      setSerial("");
      setIssue("");
      setPhotos([]);
      setPhotoPreviews([]);
      setInvoice(null);
      setAssignedTechnician("");
      setDiagnosis("");
      setTechnicalDataSheet("");
      // Limpiar las URLs de las vistas previas
      photoPreviews.forEach((preview) => URL.revokeObjectURL(preview));
    } catch (error) {
      // Mostrar un mensaje de error
      presentToast({
        message: "Error al enviar la solicitud.",
        duration: 2000,
        color: "danger",
      });
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Servicio Técnico</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {[
          { label: "Nombre del equipo", value: name, setter: setName },
          { label: "Marca", value: brand, setter: setBrand },
          { label: "Modelo", value: model, setter: setModel },
          { label: "Serial", value: serial, setter: setSerial },
          { label: "Falla", value: issue, setter: setIssue },
          props.role === "Administrador" && {
            label: "Factura",
            setter: handleInvoiceChange,
          },
          props.role === "Administrador" && {
            label: "Asignar técnico",
            value: assignedTechnician,
            setter: setAssignedTechnician,
          },
          props.role === "Tecnico" && {
            label: "Diagnóstico ",
            value: diagnosis,
            setter: setDiagnosis,
          },
          props.role === "Tecnico" && {
            label: "Ficha Técnica",
            value: technicalDataSheet,
            setter: setTechnicalDataSheet,
          },
        ].map(
          (field, index) =>
            field && (
              <IonItem key={index} className="custom-item">
                <IonLabel position="floating">{field.label}</IonLabel>
                {index === 5 ? (
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={() => field.setter} // Usamos el handler de invoice
                    className="custom-input"
                  />
                ) : index == 7 ? (
                  <IonTextarea
                    value={field.value as string}
                    onIonInput={(e) => field.setter(e.detail.value!)}
                    className="custom-input"
                    placeholder={field.label}
                  />
                ) : (
                  <IonInput
                    value={field.value as string}
                    onIonInput={(e) => field.setter(e.detail.value!)}
                    className="custom-input"
                    placeholder={field.label}
                  />
                )}
              </IonItem>
            )
        )}

        <IonItem className="custom-item">
          <IonLabel position="floating">Agregar fotos</IonLabel>
          <div className="file-input-container">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoChange}
            />
          </div>
        </IonItem>

        {/* Mostrar las vistas previas de las fotos seleccionadas */}
        <div className="photo-previews">
          {photoPreviews.map((preview, index) => (
            <IonImg
              key={index}
              src={preview}
              alt={`Vista previa de la foto ${index + 1}`}
            />
          ))}
        </div>

        <div className="container-button">
          <IonButton
            expand="block"
            onClick={handleSubmit}
            className="custom-button"
            color={"danger"}
          >
            Enviar
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default TechnicalService;
