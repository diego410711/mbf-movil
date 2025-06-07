import {
  IonButton,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonText,
  IonRow,
  IonCol,
  IonSearchbar,
  IonButtons,
  IonMenuButton,
  IonSpinner,
  useIonViewWillEnter,
  IonImg,
  IonModal, // ✅ AÑADIDO
} from "@ionic/react";
import { useState } from "react";
import { fetchInventory, fetchPDF, fetchQRCode } from "../../services/inventoryService";
import { Directory, Filesystem } from "@capacitor/filesystem";
import { FileOpener } from "@ionic-native/file-opener";
import "./TechnicalDataSheet.css";
import { API_URL } from "../../services/inventoryService";

const fields = [
  { label: "Nombre del equipo*", key: "name" },
  { label: "Marca*", key: "brand" },
  { label: "Modelo*", key: "model" },
  { label: "Serial*", key: "serialNumber" },
  { label: "Ubicación*", key: "location" },
  { label: "Fecha de compra", key: "purchaseDate", type: "date" },
  { label: "Voltaje del equipo", key: "voltage" },
  { label: "Potencia del equipo", key: "power" },
  { label: "Peso aprox. del equipo", key: "weight" },
  { label: "Capacidad", key: "capacity" },
  { label: "Material", key: "material" },
  { label: "Ficha técnica", key: "FT" },
];

const TechnicalDataSheet: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrImage, setQrImage] = useState<string | null>(null);

  const getInventory = async () => {
    try {
      const inventory = await fetchInventory();
      setData(inventory);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Cargar inventario cada vez que se entra a la vista
  useIonViewWillEnter(() => {
    setLoading(true);         // Mostrar spinner mientras se actualiza
    setSearchText("");        // Opcional: limpiar búsqueda cada vez que entras
    getInventory();
  });

  const filteredData = data.filter((item) =>
    fields.some((field) => {
      let value = item[field.key];
      if (field.type === "date") {
        value = new Intl.DateTimeFormat("es-ES").format(new Date(value));
      }
      return (
        typeof value === "string" &&
        value.toLowerCase().includes(searchText.toLowerCase())
      );
    })
  );

  const seeFTUrl = async (id: string, fileName: string): Promise<void> => {
    try {
      const base64 = await fetchPDF(id);
      const savedFile = await Filesystem.writeFile({
        path: fileName,
        data: base64,
        directory: Directory.External,
      });
      alert("Archivo guardado correctamente");
      await openFile(savedFile.uri);
    } catch (error) {
      console.error("Error al descargar o guardar el archivo:", error);
      alert("No se pudo guardar el archivo");
    }
  };

  const openFile = async (filePath: string) => {
    try {
      await FileOpener.open(filePath, "application/pdf");
    } catch (error) {
      console.error("Error al abrir el archivo:", error);
      alert("No se pudo abrir el archivo");
    }
  };

  const showQR = (id: string) => {
    const qrUrl = `${API_URL}/generate-qr/${id}`; // Usa tu dominio real o proxy
    setQrImage(qrUrl); // Sin base64, directo
    setShowQRModal(true);
  };



  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Fichas Técnicas</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonSearchbar
          value={searchText}
          onIonInput={(e) => setSearchText(e.detail.value!)}
          placeholder="Buscar por cualquier campo"
          className="custom-input-search"
        />
        {searchText.trim() && filteredData.length > 0 && (
          <IonText className="records-count">
            {filteredData.length} registro{filteredData.length !== 1 ? "s" : ""}{" "}
            encontrado{filteredData.length !== 1 ? "s" : ""}
          </IonText>
        )}
        {searchText.trim() && filteredData.length === 0 && (
          <IonText className="records-count records-count-none">
            No se encontraron resultados para "{searchText.trim()}"
          </IonText>
        )}
        {loading ? (
          <IonSpinner name="crescent" />
        ) : (
          <IonList className="custom-list">
            <IonRow className="ion-hide-sm-down">
              {fields.map((field) => (
                <IonCol key={field.key} size="2">
                  <strong>{field.label.replace("*", "")}</strong>
                </IonCol>
              ))}
            </IonRow>
            {filteredData.map((item, index) => (
              <IonItem key={index} className="custom-item border-item">
                <IonRow>
                  {fields.map((field) => (
                    <IonCol key={field.key} size="12" size-sm="2">
                      <strong className="ion-hide-sm-up">
                        {field.label.replace("*", "")}:
                      </strong>{" "}
                      {field.type === "date"
                        ? new Intl.DateTimeFormat("es-ES").format(new Date(item[field.key]))
                        : item[field.key]}
                    </IonCol>
                  ))}
                </IonRow>
                <IonButton onClick={() => showQR(item._id)}>Ver QR</IonButton>
                <IonButton
                  onClick={() =>
                    seeFTUrl(
                      item._id,
                      `FichaTecnica_${item.name || "desconocido"}.pdf`
                    )
                  }
                >
                  Ver PDF
                </IonButton>
              </IonItem>
            ))}
          </IonList>
        )}
        <IonModal isOpen={showQRModal} onDidDismiss={() => setShowQRModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Código QR</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            {qrImage ? (
              <IonImg src={qrImage} alt="Código QR" />
            ) : (
              <IonText>No se pudo cargar el QR</IonText>
            )}
            <IonButton expand="block" onClick={() => setShowQRModal(false)}>
              Cerrar
            </IonButton>
          </IonContent>
        </IonModal>
      </IonContent>

    </IonPage>
  );
};

export default TechnicalDataSheet;
