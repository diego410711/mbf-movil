import { IonContent, IonIcon, IonText, IonTitle } from "@ionic/react";
import "./ExploreContainer.css";
import {
  bluetoothOutline,
  buildOutline,
  calendarOutline,
  clipboardOutline,
  documentsOutline,
  qrCodeOutline,
  readerOutline,
  receiptOutline,
} from "ionicons/icons";
import { useHistory } from "react-router-dom";

export default function ExploreContainer(props: { role: string }) {
  const history = useHistory();
  const redirectPages = (route: string) => {
    history.push(route);
  };
  return (
    <IonContent className="ion-padding">
      <h4 className="text-center">{props.role}</h4>
      {props.role === "Cliente" ? (
        <div className="profile-grid">
          {[
            { name: "Cronograma", icon: calendarOutline, route: "/schedule" },
            {
              name: "Fichas técnicas",
              icon: readerOutline,
              route: "/technicaldatasheet",
            },
            { name: "Inventario", icon: receiptOutline, route: "/inventory" },
            {
              name: "Solicitar servicio técnico",
              icon: buildOutline,
              route: "/technicalservice",
            },
            {
              name: "Servicios técnicos solicitados",
              icon: clipboardOutline,
              route: "/report",
            },
            { name: "Escaneo de QR", icon: qrCodeOutline, route: "/qrscan" },
            {
              name: "Báscula por bluetooth",
              icon: bluetoothOutline,
              route: "/bluetooth",
            },
          ].map((item) => {
            return (
              <div
                className="profile-container"
                onClick={(e) => redirectPages(item.route)}
              >
                <div className="image-container">
                  <div className="custom-image">
                    <IonIcon className="custom-icon-explore" icon={item.icon} />
                  </div>
                </div>
                <p>{item.name}</p>
              </div>
            );
          })}
        </div>
      ) : props.role === "Administrador" ? (
        <div className="profile-grid">
          {[
            { name: "Cronograma", icon: calendarOutline, route: "/schedule" },
            {
              name: "Fichas técnicas",
              icon: readerOutline,
              route: "/technicaldatasheet",
            },
            { name: "Inventario", icon: receiptOutline, route: "/inventory" },
            {
              name: "Solicitar servicio técnico",
              icon: buildOutline,
              route: "/technicalservice",
            },
            {
              name: "Servicios técnicos solicitados",
              icon: clipboardOutline,
              route: "/report",
            },
            { name: "Escaneo de QR", icon: qrCodeOutline, route: "/qrscan" },
            {
              name: "Báscula por bluetooth",
              icon: bluetoothOutline,
              route: "/bluetooth",
            },
            {
              name: "Preagendados",
              icon: documentsOutline,
              route: "/preagends",
            },
          ].map((item) => {
            return (
              <div
                className="profile-container"
                onClick={(e) => redirectPages(item.route)}
              >
                <div className="image-container">
                  <div className="custom-image">
                    <IonIcon className="custom-icon-explore" icon={item.icon} />
                  </div>
                </div>
                <p>{item.name}</p>
              </div>
            );
          })}
        </div>
      ) : props.role === "Tecnico" ? (
        <div className="profile-grid">
          {[
            { name: "Cronograma", icon: calendarOutline, route: "/schedule" },
            {
              name: "Fichas técnicas",
              icon: readerOutline,
              route: "/technicaldatasheet",
            },
            { name: "Inventario", icon: receiptOutline, route: "/inventory" },
            {
              name: "Solicitar servicio técnico",
              icon: buildOutline,
              route: "/technicalservice",
            },
            {
              name: "Servicios técnicos solicitados",
              icon: clipboardOutline,
              route: "/report",
            },
            { name: "Escaneo de QR", icon: qrCodeOutline, route: "/qrscan" },
            {
              name: "Báscula por bluetooth",
              icon: bluetoothOutline,
              route: "/bluetooth",
            },
            {
              name: "Preagendados",
              icon: documentsOutline,
              route: "/preagends",
            },
          ].map((item) => {
            return (
              <div
                className="profile-container"
                onClick={(e) => redirectPages(item.route)}
              >
                <div className="image-container">
                  <div className="custom-image">
                    <IonIcon className="custom-icon-explore" icon={item.icon} />
                  </div>
                </div>
                <p>{item.name}</p>
              </div>
            );
          })}
        </div>
      ) : (
        "Este usuario no tiene un rol asignado"
      )}
    </IonContent>
  );
}
