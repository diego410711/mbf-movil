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
} from "@ionic/react";
import { useEffect, useState } from "react";
import { fetchInventory, fetchPDF } from "../../services/inventoryService"; // Servicio para obtener el inventario
import { Directory, Filesystem } from "@capacitor/filesystem";
import { FileOpener } from "@ionic-native/file-opener";
import "./TechnicalDataSheet.css";

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

  // Obtener datos del backend al montar el componente
  useEffect(() => {
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

    getInventory();
  }, []);

  // Filtrar los datos según el texto de búsqueda
  const filteredData = data.filter((item) =>
    fields.some((field) => {
      let value = item[field.key];

      if (field.type === "date") {
        // Si es una fecha, convertirla a formato legible
        value = new Intl.DateTimeFormat("es-ES").format(new Date(value));
      }

      return (
        typeof value === "string" &&
        value.toLowerCase().includes(searchText.toLowerCase())
      );
    })
  );


  // Función para obtener y manejar el PDF
  const seeFTUrl = async (id: string, fileName: string): Promise<void> => {
    try {
      // Obtener el PDF en formato Base64 desde el backend
      const base64 = await fetchPDF(id);

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
                <IonButton
                  onClick={() =>
                    seeFTUrl(
                      item._id, // ID del inventario
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
      </IonContent>
    </IonPage>
  );
};

export default TechnicalDataSheet;
