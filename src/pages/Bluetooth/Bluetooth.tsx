import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonInput,
  IonButton,
  IonItem,
  IonLabel,
  IonButtons,
  IonMenuButton,
} from "@ionic/react";
import "./Bluetooth.css"; // Asegúrate de personalizar los estilos

const Bluetooth: React.FC = () => {
  // Simula datos en tiempo real
  const weight = 50;
  const records = [
    {
      index: 1,
      date: "2024-12-04",
      time: "14:05",
      weight: 50,
      price: 100,
      amount: 5000,
    },
    {
      index: 2,
      date: "2024-12-04",
      time: "14:10",
      weight: 20,
      price: 50,
      amount: 1000,
    },
  ];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Báscula por bluetooth</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonGrid>
          {/* Peso Actual */}
          <IonRow className="ion-text-center">
            <IonCol>
              <h1 style={{ fontSize: "4rem", color: "red" }}>{weight}</h1>
              <h2>kg</h2>
            </IonCol>
          </IonRow>

          {/* Indicadores de estado */}
          <IonRow>
            <IonCol className="ion-text-start">
              <IonLabel>Auto mode</IonLabel>
            </IonCol>
            <IonCol className="ion-text-end">
              <IonLabel style={{ color: "green" }}>Connected</IonLabel>
            </IonCol>
          </IonRow>

          {/* Formulario */}
          <IonRow>
            <IonCol size="4">
              <IonItem>
                <IonLabel position="stacked">Name</IonLabel>
                <IonInput placeholder="Enter name"></IonInput>
              </IonItem>
            </IonCol>
            <IonCol size="4">
              <IonItem>
                <IonLabel position="stacked">Product</IonLabel>
                <IonInput placeholder="Enter product"></IonInput>
              </IonItem>
            </IonCol>
            <IonCol size="4">
              <IonItem>
                <IonLabel position="stacked">Price</IonLabel>
                <IonInput type="number" placeholder="Enter price"></IonInput>
              </IonItem>
            </IonCol>
          </IonRow>

          {/* Botones */}
          <IonRow>
            <IonCol>
              <IonButton expand="block" color="danger">
                CLR
              </IonButton>
            </IonCol>
            <IonCol>
              <IonButton expand="block" color="primary">
                Zero
              </IonButton>
            </IonCol>
            <IonCol>
              <IonButton expand="block" color="secondary">
                Shut Down
              </IonButton>
            </IonCol>
          </IonRow>

          {/* Tabla de registros */}
          <IonRow>
            <IonCol>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Weight</th>
                    <th>Price</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => (
                    <tr key={record.index}>
                      <td>{record.index}</td>
                      <td>{record.date}</td>
                      <td>{record.time}</td>
                      <td>{record.weight} kg</td>
                      <td>${record.price}</td>
                      <td>${record.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Bluetooth;
