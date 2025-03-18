// src/components/login.tsx
import { SetStateAction, useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import {
  IonContent,
  IonPage,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonToast,
  IonImg,
  IonIcon,
  isPlatform,
  IonSpinner,
} from "@ionic/react";
import "./Login.css";
import { logoGoogle, logoFacebook } from "ionicons/icons";
import validateEmail from "../../utils/validateEmail";
import { login } from "../../services/authService";
import ReCAPTCHA from "react-google-recaptcha";
import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth";
import axios from "axios";

export default function Login(props: {
  [x: string]: any;
  setIsLogged: (arg0: boolean) => void;
}) {
  const [password, setPassword] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [token, setToken] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const history = useHistory();

  const saveToken = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem("authToken", newToken); // Opcional, para persistencia
  };

  const handleLogin = async () => {
    if (!captchaToken) {
      setToastMessage("Por favor, completa el recaptcha.");
      setShowToast(true);
      return;
    }
    if (!props.email || !password) {
      setToastMessage("Por favor, complete todos los campos.");
      setShowToast(true);
    } else if (!validateEmail(props.email)) {
      setToastMessage("Por favor, introduce un correo electrónico válido.");
      setShowToast(true);
    } else {
      try {
        setIsLoading(true); // Activa el loader
        const data = await login(props.email, password, captchaToken);
        console.log("Logged in!", data);
        saveToken(data.access_token);
        props.setRole(data.role);
        props.setEmail(data.email);
        props.setName(`${data.name + " " + data.lastname}`);
        props.setPhone(data.phone);
        props.setAddress(data.address);
        props.setUserId(data.userId)
        setToastMessage("Inicio de sesión exitoso!");
        props.setIsLogged(true);
        setShowToast(true);
        history.push("/page");
        setIsLoading(false); // Desactiva el loader
      } catch (error) {
        setToastMessage("Usuario o contraseña incorrectos");
        setShowToast(true);
        setIsLoading(false); // Desactiva el loader
      }
    }
  };

  const onRecaptchaChange = (token: string | null) => {
    setCaptchaToken(token);
  };
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  // Cargar el script de Google para el navegador
  // useEffect(() => {
  //   if (!isPlatform("capacitor")) {
  //     const script = document.createElement("script");
  //     script.src = "https://accounts.google.com/gsi/client";
  //     script.async = true;
  //     document.body.appendChild(script);

  //     script.onload = () => {
  //       window.google?.accounts.id.initialize({
  //         client_id:
  //           "143084504266-m64qjq4oio23hrpc55s0qs86fq84o7sq.apps.googleusercontent.com",
  //         callback: handleCredentialResponse,
  //       });
  //     };
  //   }
  // }, []);

  const handleGoogleLogin = async () => {
    // if (isAuthenticating) return; // Previene múltiples solicitudes
    // setIsAuthenticating(true);
    // try {
    // if (isPlatform("capacitor")) {
    // Autenticación en dispositivos móviles
    // const googleUser = await GoogleAuth.signIn();
    // console.log("Usuario autenticado:", googleUser);
    // const idToken = googleUser.authentication.idToken;
    // await axios.post(`${process.env.API_URL}/google`, { idToken });
    alert("Inicio con Google");
    // } else {
    //   window.google?.accounts.id.prompt();
    // }
    // } catch (error) {
    //   console.error("Error al iniciar sesión con Google:", error);
    // }
    // } finally {
    //   setIsAuthenticating(false);
    // }
  };

  // Maneja la respuesta de autenticación de Google en el navegador
  const handleCredentialResponse = (response: any) => {
    console.log("Respuesta de Google en el navegador:", response);
    // Procesa la respuesta y envía el token al backend si es necesario
  };
  function handleFacebookLogin() {
    throw new Error("Function not implemented.");
  }

  return (
    <IonPage>
      {/* <IonHeader>
        <IonToolbar>
          <IonTitle>Iniciar Sesión</IonTitle>
        </IonToolbar>
      </IonHeader> */}
      <IonContent className="ion-padding">
        <IonImg src="/images/logo.webp" alt="Logo" className="custom-img" />
        <IonItem className="custom-item">
          <IonLabel position="floating">Correo Electrónico</IonLabel>
          <IonInput
            type="email"
            value={props.email}
            onIonInput={(e) => props.setEmail(e.detail.value!)}
            className="custom-input"
            placeholder="Correo Electrónico"
          />
        </IonItem>
        <IonItem className="custom-item">
          <IonLabel position="floating">Contraseña</IonLabel>
          <IonInput
            type="password"
            value={password}
            onIonInput={(e) => setPassword(e.detail.value!)}
            className="custom-input"
            placeholder="Contraseña"
          />
        </IonItem>
        <div className="centered-link">
          <Link to="/forgotpassword">¿Olvidaste tu contraseña?</Link>
        </div>
        <div className="container-button">
          <IonButton
            color={"danger"}
            className="custom-button"
            onClick={handleLogin}
          >
            {isLoading ? <IonSpinner /> : "Iniciar Sesión"}
          </IonButton>
        </div>
        <ReCAPTCHA
          sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" // Tu clave de sitio
          onChange={onRecaptchaChange}
          className="custom-captcha"
        />
        <IonItem className="custom-item">
          <IonLabel className="custom-label-login">
            Ó inicia sesión con
          </IonLabel>
        </IonItem>
        <div className="flex-icons">
          <div>
            <IonIcon
              className="custom-icon"
              onClick={handleGoogleLogin}
              icon={logoGoogle}
              slot="start"
            />
          </div>
          <div>
            <IonIcon
              className="custom-icon"
              onClick={handleFacebookLogin}
              icon={logoFacebook}
              slot="start"
            />
          </div>
        </div>
        <div className="centered-link">
          <IonLabel>
            Si no tienes una cuenta{" "}
            <Link className="custom-link" to="/register">
              regístrate aquí
            </Link>
          </IonLabel>
        </div>
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2000}
        />
      </IonContent>
    </IonPage>
  );
}
