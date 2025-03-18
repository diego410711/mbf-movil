import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSearchbar,
  IonItem,
  IonLabel,
  IonSpinner,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react";
import { useState, useEffect } from "react";
import { getAllUsers } from "../../services/authService";
import "./Preagends.css";

const Preagends: React.FC = () => {
  const [searchText, setSearchText] = useState(""); // Estado para el texto de búsqueda
  const [users, setUsers] = useState([]); // Estado para la lista de usuarios
  const [loading, setLoading] = useState(true); // Estado para el indicador de carga
  const [error, setError] = useState<string | null>(null); // Estado para los errores

  useEffect(() => {
    // Cargar los usuarios al montar el componente
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers(); // Llamada al servicio para obtener usuarios
        setUsers(data); // Guardar los usuarios en el estado
      } catch (err: any) {
        setError(err.message || "Error al cargar los usuarios");
      } finally {
        setLoading(false); // Detener el indicador de carga
      }
    };
    fetchUsers();
  }, []);

  // Filtrar usuarios basados en el texto de búsqueda y user.check === "1"
  const filteredUsers = users.filter(
    (user: any) =>
      user.check === "1" &&
      (user.name + " " + user.lastname)
        .toLowerCase()
        .includes(searchText.toLowerCase())
  );

  // Definir los campos a mostrar dinámicamente
  const fields = [
    { label: "Nombre", value: (user: any) => `${user.name} ${user.lastname}` },
    { label: "Correo", value: (user: any) => user.username },
    { label: "Empresa", value: (user: any) => user.company },
    { label: "Documento", value: (user: any) => user.doc },
    { label: "Posición", value: (user: any) => user.position },
    { label: "Rol", value: (user: any) => user.role },
    {
      label: "Dirección",
      value: (user: any) => user.address || "No disponible",
    },
    {
      label: "Celular",
      value: (user: any) => user.phone || "No disponible",
    },
  ];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Preagendados</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {/* Campo de búsqueda */}
        <IonSearchbar
          value={searchText}
          onIonInput={(e: any) => setSearchText(e.target.value)}
          placeholder="Buscar usuario"
          className="custom-input-search"
        ></IonSearchbar>

        {/* Mostrar indicador de carga, errores o lista de usuarios */}
        {loading ? (
          <IonSpinner name="crescent" />
        ) : error ? (
          <IonItem className="custom-item">
            <IonLabel className="custom-label">{error}</IonLabel>
          </IonItem>
        ) : filteredUsers.length > 0 ? (
          filteredUsers.map((user: any, index: number) => (
            <div key={user._id}>
              <IonGrid className="custom-grid">
                {fields.map((field, idx) => (
                  <IonRow key={idx}>
                    <IonCol size="4">
                      <IonLabel className="custom-label-bold">
                        {field.label}:
                      </IonLabel>
                    </IonCol>
                    <IonCol>
                      <IonLabel>{field.value(user)}</IonLabel>
                    </IonCol>
                  </IonRow>
                ))}
              </IonGrid>
              {/* Línea divisoria */}
              {index < filteredUsers.length - 1 && <hr className="custom-hr" />}
            </div>
          ))
        ) : (
          <IonItem className="custom-item">
            <IonLabel>No se encontraron usuarios</IonLabel>
          </IonItem>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Preagends;
