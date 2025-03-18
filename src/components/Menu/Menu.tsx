import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
} from "@ionic/react";

import { useLocation } from "react-router-dom";
import {
  cardOutline,
  homeOutline,
  languageOutline,
  logOutOutline,
  notificationsCircleOutline,
  personCircleOutline,
} from "ionicons/icons";
import "./Menu.css";
import { logout } from "../../services/authService";

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
  click: any;
}

const labels = [
  { title: "Términos y condiciones" },
  { title: "Política de privacidad" },
  { title: "Autorización de tratamiento de datos personales" },
];

export default function Menu(props: {
  setIsLogged: any;
  email: any;
  name: string;
}) {
  const location = useLocation();

  const appPages: AppPage[] = [
    {
      title: "Inicio",
      url: "/page",
      iosIcon: homeOutline,
      mdIcon: homeOutline,
      click: "",
    },
    {
      title: "Datos de perifl",
      url: "/profiledata",
      iosIcon: personCircleOutline,
      mdIcon: personCircleOutline,
      click: "",
    },
    {
      title: "Inge Pro",
      url: "/ingepro",
      iosIcon: cardOutline,
      mdIcon: cardOutline,
      click: "",
    },
    {
      title: "Idioma",
      url: "/lang",
      iosIcon: languageOutline,
      mdIcon: languageOutline,
      click: "",
    },
    {
      title: "Notificaciones",
      url: "/notifications",
      iosIcon: notificationsCircleOutline,
      mdIcon: notificationsCircleOutline,
      click: "",
    },
    {
      title: "Cerrar sesión",
      url: "/login",
      iosIcon: logOutOutline,
      mdIcon: logOutOutline,
      click: props.setIsLogged,
    },
  ];

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="inbox-list">
          <IonListHeader>{props.name}</IonListHeader>
          <IonNote>{props.email}</IonNote>
          {appPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem
                  className={
                    location.pathname === appPage.url ? "selected" : ""
                  }
                  routerLink={appPage.url}
                  routerDirection="none"
                  lines="none"
                  detail={false}
                  onClick={(e) =>
                    index === 7 && (appPage.click(false), logout())
                  }
                >
                  <IonIcon
                    aria-hidden="true"
                    slot="start"
                    ios={appPage.iosIcon}
                    md={appPage.mdIcon}
                  />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
        </IonList>

        <IonList id="labels-list">
          <IonListHeader>Políticas y términos</IonListHeader>
          {labels.map((label, index) => (
            <IonItem lines="none" key={index} routerLink={label.title}>
              <IonLabel>{label.title}</IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonMenu>
  );
}
