import React, { useState, useEffect } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSearchbar,
  IonGrid,
  IonRow,
  IonCol,
  IonLabel,
  IonSpinner,
  IonButtons,
  IonMenuButton,
  IonItem,
  IonButton,
  IonModal,
  IonText,
  IonTextarea,
  IonInput,
  useIonToast,
} from "@ionic/react";
import {
  fetchPDFServices,
  getEquipment,
  updateEquipment,
} from "../../services/equipmentService";
import "./Report.css";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { FileOpener } from "@ionic-native/file-opener";

interface Equipment {
  _id: string;
  name: string;
  brand: string;
  model: string;
  serial: string;
  issue: string;
  photos?: string | string[]; // Puede ser un string o un array de URLs
  technicalDataSheet?: string;
  diagnosis?: string;
  invoice?: string; // Factura
  assignedTechnician?: string; // Técnico asignado
}

export default function Report(props: { role: string }) {
  const [searchText, setSearchText] = useState<string>("");
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [editingEquipment, setEditingEquipment] = useState<{ [key: string]: string }>({});
  const [isEditing, setIsEditing] = useState<Record<string, boolean>>({});
  const [presentToast] = useIonToast();

  useEffect(() => {
    setIsEditing(prevState => ({
      ...prevState,
      ...Object.fromEntries(equipmentList.map(equipment => [equipment._id, prevState[equipment._id] ?? false]))
    }));
  }, [equipmentList]);


  const isTechnician = props.role === 'Tecnico';//modifcar este valor con el que viene desde el endpoint de login

  const handleInputChange = (id: string, field: string, value: string) => {
    setEditingEquipment({ ...editingEquipment, [`${id}-${field}`]: value });
  };


  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const data = await getEquipment();
        setEquipmentList(data);
      } catch (err) {
        setError("No se pudo cargar la lista de equipos. Inténtalo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, []);

  const handleViewPdf = async (id: string, fileName: string): Promise<void> => {
    try {
      // Obtener el PDF en formato Base64 desde el backend
      const base64 = await fetchPDFServices(id);

      // Guardar el archivo en el dispositivo
      const savedFile = await Filesystem.writeFile({
        path: fileName,
        data: base64,
        directory: Directory.External,
      });

      console.log("Archivo guardado en:", savedFile.uri);
      alert("Archivo guardado correctamente");

      // Abrir el archivo guardado
      await openFile(savedFile.uri);
    } catch (error) {
      console.error("Error al descargar o guardar el archivo:", error);
      alert("No se pudo guardar el archivo");
    }
  };

  const generateBlobUrl = async (
    base64: string,
    fileName: string
  ): Promise<void> => {
    try {
      // Guardar el archivo en el dispositivo
      const savedFile = await Filesystem.writeFile({
        path: fileName,
        data: base64,
        directory: Directory.External,
      });

      console.log("Archivo guardado en:", savedFile.uri);
      alert("Archivo guardado correctamente");

      // Abrir el archivo guardado
      await openFile(savedFile.uri);
    } catch (error) {
      console.error("Error al descargar o guardar el archivo:", error);
      alert("No se pudo guardar el archivo");
    }
  };

  const openFile = async (filePath: string) => {
    try {
      await FileOpener.open(filePath, "application/pdf");
      console.log("Archivo abierto correctamente");
    } catch (error) {
      console.error("Error al abrir el archivo:", error);
      alert("No se pudo abrir el archivo");
    }
  };

  // Filtrar los equipos según el texto de búsqueda
  const filteredEquipment = equipmentList.filter((equipment) =>
    Object.values(equipment)
      .join(" ")
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

  const handleImageClick = (photoUrl: string) => {
    setSelectedImage(photoUrl);
    setIsModalOpen(true);
  };

  // Guardar cambios en el equipo editado
  const handleSave = async (_id: string): Promise<void> => {
    try {
      // Obtener los datos editados
      const updatedData: Partial<Equipment> = {};
      Object.keys(editingEquipment).forEach((key) => {
        if (key.startsWith(_id)) {
          const field = key.split("-")[1]; // Extraer el nombre del campo
          updatedData[field as keyof Equipment] = editingEquipment[key];
        }
      });

      // Enviar actualización al backend
      await updateEquipment(_id, updatedData);

      // Actualizar la lista con los nuevos valores
      setEquipmentList((prevList) =>
        prevList.map((equipment) =>
          equipment._id === _id ? { ...equipment, ...updatedData } : equipment
        )
      );

      // Restablecer estado de edición
      setIsEditing((prev) => ({ ...prev, [_id]: false }));
      setEditingEquipment((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((key) => {
          if (key.startsWith(_id)) delete updated[key];
        });
        return updated;
      });
      presentToast({
        message: "Equipo actualizado con éxito.",
        duration: 2000,
        color: "success",
      });
    } catch (error) {
      console.error("Error al guardar:", error);
      presentToast({ message: "Error al actualizar equipo", duration: 2000, color: "danger" });
    }
  };

  // Cancelar edición y restaurar valores originales
  const handleCancel = (_id: string): void => {
    setIsEditing((prev) => ({ ...prev, [_id]: false }));
    setEditingEquipment((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((key) => {
        if (key.startsWith(_id)) delete updated[key];
      });
      return updated;
    });
  };


  function handleAddPhoto(_id: string): void {
    throw new Error("Function not implemented.");
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Informe</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonSearchbar
          value={searchText}
          onIonInput={(e) => setSearchText(e.detail.value!)}
          placeholder="Buscar equipo..."
          className="custom-input-search"
        />
        {searchText.trim() && filteredEquipment.length > 0 && (
          <IonText className="records-count">
            {filteredEquipment.length} registro
            {filteredEquipment.length !== 1 ? "s" : ""} encontrado
            {filteredEquipment.length !== 1 ? "s" : ""}
          </IonText>
        )}
        {searchText.trim() && filteredEquipment.length === 0 && (
          <IonText className="records-count records-count-none">
            No se encontraron resultados para "{searchText.trim()}".
          </IonText>
        )}
        {loading ? (
          <IonSpinner name="crescent" className="ion-text-center" />
        ) : (
          <IonGrid>
            {/* Encabezados en pantallas grandes */}
            <IonRow className="ion-hide-sm-down">
              {[
                "Nombre",
                "Marca",
                "Modelo",
                "Serial",
                "Falla",
                "Foto",
                "Ficha Técnica",
                "Diagnóstico",
                "Factura",
                "Técnico Asignado",
              ].map((header) => (
                <IonCol key={header} size="2">
                  <strong>{header}</strong>
                </IonCol>
              ))}
            </IonRow>

            {/* Filas dinámicas */}
            {filteredEquipment.map((equipment) => (
              <IonItem key={equipment._id} className="custom-item border-item">
                <IonRow>
                  {[
                    { label: "Nombre", field: "name", value: equipment.name || "" },
                    { label: "Marca", field: "brand", value: equipment.brand || "" },
                    { label: "Modelo", field: "model", value: equipment.model || "" },
                    { label: "Serial", field: "serial", value: equipment.serial || "" },
                    { label: "Falla", field: "issue", value: equipment.issue || "" },
                    { label: "Foto", field: "photos", value: equipment.photos },
                    {
                      label: "Ficha Técnica",
                      field: "technicalDataSheet",
                      value: equipment.technicalDataSheet || "No disponible",
                    },
                    {
                      label: "Diagnóstico",
                      field: "diagnosis",
                      value: equipment.diagnosis || "No disponible",
                    },
                    {
                      label: "Factura",
                      value: equipment.invoice ? (
                        <IonButton
                          onClick={() =>
                            equipment.invoice &&
                            generateBlobUrl(
                              equipment.invoice,
                              `Factura_${equipment.name || "desconocido"}.pdf`
                            )
                          }
                        >
                          Descargar factura
                        </IonButton>
                      ) : (
                        "No disponible"
                      ),
                    },
                    {
                      label: "Técnico Asignado",
                      field: "assignedTechnician",
                      value: equipment.assignedTechnician || "No asignado",
                    },
                  ].map((field, index) => (
                    <IonCol key={index} size="12" size-sm="2">
                      {field.label === "Foto" ? (
                        Array.isArray(field.value) && field.value.length > 0 ? (
                          <>
                            {!isEditing[equipment._id] ? <strong className="ion-hide-sm-up">{field.label}</strong> : <IonLabel position="floating" className="custom-label">{field.label}</IonLabel>}:
                            <div>
                              {field.value.map((photoUrl, index) => (
                                <img
                                  key={index}
                                  src={`data:image/png;base64,${photoUrl}`}
                                  alt={`Foto de ${equipment.name} ${index + 1}`}
                                  style={{
                                    width: "50px",
                                    height: "50px",
                                    objectFit: "cover",
                                    borderRadius: "4px",
                                    margin: "5px",
                                  }}
                                  onClick={() => handleImageClick(photoUrl)}
                                />
                              ))}
                            </div>
                          </>
                        ) : (
                          <>
                            {!isEditing[equipment._id] && (!editingEquipment?.photos || editingEquipment.photos.length === 0) ? (
                              <strong className="ion-hide-sm-up">{field.label}: </strong>
                            ) : (
                              <IonLabel position="floating" className="custom-label">{field.label}: </IonLabel>
                            )}

                            {!editingEquipment?.photos || editingEquipment.photos.length === 0 ? (
                              isEditing[equipment._id] ? ( // Solo mostrar cuando está en edición
                                <>
                                  <IonButton onClick={() => handleAddPhoto(equipment._id)}>Agregar foto</IonButton>
                                </>
                              ) : (
                                <IonLabel>No disponible</IonLabel>
                              )
                            ) : null}
                          </>


                        )
                      ) : field.label === "Factura" ? (
                        <>
                          {!isEditing[equipment._id] ? <strong className="ion-hide-sm-up">{field.label}:</strong> : <IonLabel position="floating" className="custom-label">{field.label}: </IonLabel>} {field.value}
                        </>
                      ) : (
                        <>
                          {isEditing[equipment._id] ? <IonLabel position="floating">{field.label}:</IonLabel> : <strong className="ion-hide-sm-up">{field.label}: </strong>}
                          {isEditing[equipment._id] ? ( // Si está en edición, usar inputs
                            field.label === "Ficha Técnica" || field.label === "Diagnóstico" ? (
                              <IonTextarea
                                value={
                                  editingEquipment[`${equipment._id}-${field.field}`] ??
                                  field.value?.toString() ??
                                  ""
                                }
                                onIonInput={(e) =>
                                  handleInputChange(equipment._id, field.field!, e.detail.value ?? "")
                                }
                                className="custom-input"
                              />
                            ) : (
                              <IonInput
                                value={
                                  editingEquipment[`${equipment._id}-${field.field}`] ??
                                  field.value?.toString() ??
                                  ""
                                }
                                onIonInput={(e) =>
                                  handleInputChange(equipment._id, field.field!, e.detail.value ?? "")
                                }
                                className="custom-input"
                              />
                            )
                          ) : (
                            <IonText>{field.value?.toString() ?? "No disponible"}</IonText> // Modo solo lectura
                          )}
                        </>
                      )}
                    </IonCol>
                  ))}

                  {/* Mostrar botones SOLO si ese equipo está en edición */}
                  {isEditing[equipment._id] && (
                    <IonCol size="12">
                      <div className="margin-button-report">  <IonButton onClick={() => handleSave(equipment._id)}>Guardar</IonButton>
                        <IonButton color="danger" onClick={() => handleCancel(equipment._id)}>Cancelar</IonButton></div>
                    </IonCol>
                  )}
                </IonRow>


                <div className="botones-fixed">
                  {!isEditing[equipment._id] && (
                    <>
                      <IonButton
                        color="primary"
                        onClick={() => handleViewPdf(equipment._id, `FichaTecnica_${equipment.name || "desconocido"}.pdf`)}
                      >
                        Ver PDF
                      </IonButton>

                      {isTechnician &&
                        <IonButton
                          color="secondary"
                          onClick={() =>
                            setIsEditing((prev) => ({
                              ...prev,
                              [equipment._id]: !prev[equipment._id], // Alternar estado edición
                            }))
                          }
                        >
                          Editar
                        </IonButton>}</>)}
                </div>
              </IonItem>
            ))}
          </IonGrid>
        )}
        <IonModal
          isOpen={isModalOpen}
          onDidDismiss={() => setIsModalOpen(false)}
        >
          <IonContent>
            <div className="flex-modal">
              <div>
                <div className="flex">
                  {selectedImage && (
                    <img
                      src={`data:image/png;base64,${selectedImage}`}
                      alt="Imagen ampliada"
                      className="img-modal"
                    />
                  )}
                </div>
                <div className="container-button">
                  <IonButton
                    onClick={() => setIsModalOpen(false)}
                    className="custom-button margin-button"
                    color={"danger"}
                  >
                    Cerrar
                  </IonButton>
                </div>
              </div>
            </div>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

