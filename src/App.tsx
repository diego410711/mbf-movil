import {
  IonApp,
  IonRouterOutlet,
  IonSplitPane,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router-dom";
import Menu from "./components/Menu/Menu";
import Page from "./pages/Page/Page";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import "@ionic/react/css/palettes/dark.system.css";

/* Theme variables */
import "./theme/variables.css";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import { useState } from "react";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/Resetpassword/Resetpassword";
import Schedule from "./pages/Schedule/Schedule";
import TechnicalDataSheet from "./pages/TechnicalDataSheet/TechnicalDataSheet";
import TechnicalService from "./pages/TechnicalService/TechnicalService";
import Report from "./pages/Report/Report";
import QRScan from "./pages/QRScan/QRScan";
import Bluetooth from "./pages/Bluetooth/Bluetooth";
import IngePro from "./pages/IngePro/IngePro";
import Notifications from "./pages/Notifications/Notifications";
import ProfileData from "./pages/ProfileData/ProfileData";
import Inventory from "./pages/Inventory/Inventory";
import Preagends from "./pages/Preagends/Preagends";
import Language from "./pages/Language/Language";

setupIonicReact();

const App: React.FC = () => {
  const [isLogged, setIsLogged] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [userId, setUserId] = useState("");

  return (
    <IonApp>
      <IonReactRouter>
        <IonSplitPane contentId="main">
          {isLogged && (
            <Menu email={email} setIsLogged={setIsLogged} name={name} />
          )}
          <IonRouterOutlet id="main">
            <Route path="/" exact={true}>
              <Redirect to="/login" />
            </Route>
            <Route path="/login" exact={true}>
              <Login
                email={email}
                setEmail={setEmail}
                setIsLogged={setIsLogged}
                setRole={setRole}
                setName={setName}
                setPhone={setPhone}
                setAddress={setAddress}
                setUserId={setUserId}
                setFirstname={setFirstname}
                setLastname={setLastname}
              />
            </Route>
            <Route path="/page" exact={true}>
              <Page role={role} />
            </Route>

            <Route path="/register" exact={true}>
              <Register setIsLogged={setIsLogged} />
            </Route>
            <Route path="/forgotpassword" exact={true}>
              <ForgotPassword email={email} setEmail={setEmail} />
            </Route>
            <Route path="/resetpassword" exact={true}>
              <ResetPassword email={email} />
            </Route>
            <Route path="/schedule" exact={true}>
              <Schedule />
            </Route>
            <Route path="/technicaldatasheet" exact={true}>
              <TechnicalDataSheet />
            </Route>
            <Route path="/technicalservice" exact={true}>
              <TechnicalService role={role} />
            </Route>
            <Route path="/report" exact={true}>
              <Report role={role} name={name} />
            </Route>
            <Route path="/qrscan" exact={true}>
              <QRScan />
            </Route>
            <Route path="/bluetooth" exact={true}>
              <Bluetooth />
            </Route>
            <Route path="/ingepro" exact={true}>
              <IngePro />
            </Route>
            <Route path="/notifications" exact={true}>
              <Notifications />
            </Route>
            <Route path="/profiledata" exact={true}>
              <ProfileData
                firstname={firstname}
                lastname={lastname}
                email={email}
                phone={phone}
                address={address}
                userId={userId}
              />
            </Route>
            <Route path="/lang" component={Language} exact={true} />

            <Route path="/inventory" exact={true}>
              <Inventory
                firstname={firstname}
                lastname={lastname}
                email={email}
                phone={phone}
                address={address}
                userId={userId} />
            </Route>
            <Route path="/preagends" exact={true} component={Preagends} />
            {/* <Route path="/:name" exact={true}>
              <Page />
            </Route> */}
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
