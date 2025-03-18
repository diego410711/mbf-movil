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
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
  useIonToast,
} from "@ionic/react";
import { useState } from "react";
import "./Inventory.css";
import { saveEquipment } from "../../services/inventoryService"; // Servicio de API
import React from "react";

const Inventory: React.FC = () => {
  interface FormData {
    [key: string]: string;
    name: string;
    brand: string;
    model: string;
    serialNumber: string;
    location: string;
    purchaseDate: string;
    voltage: string;
    power: string;
    weight: string;
    usage: string;
    capacity: string;
    material: string;
    technology: string;
    maintenancePriority: string;
    FT: string;
  }

  const initialFormData: FormData = {
    name: "",
    brand: "",
    model: "",
    serialNumber: "",
    location: "",
    purchaseDate: "",
    voltage: "",
    power: "",
    weight: "",
    usage: "Fijo",
    capacity: "",
    material: "",
    technology: "Neumatico",
    maintenancePriority: "Baja",
    FT: "",
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [presentToast] = useIonToast();

  const handleInputChange = (key: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const fields = [
    {
      label: "Nombre del equipo*",
      key: "name",
      placeholder: "Ingrese el nombre",
      type: "input",
    },
    {
      label: "Marca*",
      key: "brand",
      placeholder: "Ingrese la marca",
      type: "input",
    },
    {
      label: "Modelo*",
      key: "model",
      placeholder: "Ingrese el modelo",
      type: "input",
    },
    {
      label: "Serial*",
      key: "serialNumber",
      placeholder: "Ingrese el serial",
      type: "input",
    },
    {
      label: "Ubicación*",
      key: "location",
      placeholder: "Ingrese la ubicación",
      type: "input",
    },
    {
      label: "Fecha de compra",
      key: "purchaseDate",
      placeholder: "Seleccione una fecha",
      type: "date",
    },
    {
      label: "Voltaje del equipo",
      key: "voltage",
      placeholder: "Ingrese el voltaje",
      type: "input",
    },
    {
      label: "Potencia del equipo",
      key: "power",
      placeholder: "Ingrese la potencia",
      type: "input",
    },
    {
      label: "Peso aprox. del equipo",
      key: "weight",
      placeholder: "Ingrese el peso",
      type: "input",
    },
    {
      label: "Capacidad",
      key: "capacity",
      placeholder: "Ingrese la capacidad",
      type: "input",
    },
    {
      label: "Material",
      key: "material",
      placeholder: "Ingrese el material",
      type: "input",
    },
    {
      label: "Ficha técnica",
      key: "FT",
      placeholder: "Ingrese el número de ficha técnica",
      type: "input",
    },
  ];

  const selects = [
    {
      label: "De uso*",
      key: "usage",
      options: [
        { value: "Fijo", label: "Fijo" },
        { value: "Movil", label: "Móvil" },
      ],
    },
    {
      label: "Tecnología predominante*",
      key: "technology",
      options: [
        { value: "Mecanico", label: "Mecánico" },
        { value: "Electrico", label: "Eléctrico" },
        { value: "Hidraulico", label: "Hidráulico" },
        { value: "Electronico", label: "Electrónico" },
        { value: "Neumatico", label: "Neumático" },
      ],
    },
    {
      label: "Prioridad de mantenimiento*",
      key: "maintenancePriority",
      options: [
        { value: "Baja", label: "Baja" },
        { value: "Media", label: "Media" },
        { value: "Alta", label: "Alta" },
      ],
    },
  ];

  const handleSubmit = async () => {
    try {
      await saveEquipment(formData); // Envía los datos directamente al backend
      presentToast({
        message: "Equipo guardado exitosamente.",
        duration: 2000,
        color: "success",
      });
      setFormData(initialFormData); // Reinicia el formulario
    } catch (error) {
      presentToast({
        message: "Error al guardar el equipo.",
        duration: 2000,
        color: "danger",
      });
      console.error("Error saving:", error);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Inventario</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <form>
          {fields &&
            fields.map(
              (field) =>
                field && (
                  <IonItem key={field.key} className="custom-item">
                    <IonLabel position="floating">{field.label}</IonLabel>
                    {field.type === "date" ? (
                      <input
                        type="date"
                        value={formData[field.key]}
                        onChange={(e) =>
                          handleInputChange(field.key, e.target.value)
                        }
                        className="custom-date"
                        placeholder={field.placeholder}
                      />
                    ) : (
                      field && (
                        <IonInput
                          value={formData[field.key]}
                          onIonInput={(e) =>
                            handleInputChange(field.key, e.detail.value!)
                          }
                          className="custom-input"
                          placeholder={field.placeholder}
                        />
                      )
                    )}
                  </IonItem>
                )
            )}

          {selects.map((select) => (
            <IonItem key={select.key} className="custom-item">
              <IonLabel position="floating">{select.label}</IonLabel>
              <IonSelect
                value={formData[select.key]}
                onIonChange={(e) =>
                  handleInputChange(select.key, e.detail.value!)
                }
                className="custom-select"
              >
                {select.options.map((option) => (
                  <IonSelectOption
                    key={option.value}
                    value={option.value}
                    className="custom-option"
                  >
                    {option.label}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>
          ))}

          <div className="container-button">
            <IonButton
              onClick={handleSubmit}
              className="custom-button margin-button"
              color="danger"
            >
              Enviar
            </IonButton>
          </div>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default Inventory;
