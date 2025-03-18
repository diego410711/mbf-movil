// src/components/register.tsx
import React, { useState } from "react";
import {
  IonContent,
  IonPage,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonToast,
  IonRadioGroup,
  IonRadio,
  IonImg,
  IonRouterLink,
  IonIcon,
  IonSpinner,
} from "@ionic/react";
import "./Register.css";
import { Link, useHistory } from "react-router-dom";
import { logoGoogle, logoFacebook } from "ionicons/icons";
import validateEmail from "../../utils/validateEmail";
import { register } from "../../services/authService";
import ReCAPTCHA from "react-google-recaptcha";

export default function Register(props: {
  setIsLogged: (arg0: boolean) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [lastname, setLastname] = useState("");
  const [position, setPosition] = useState("");
  const [doc, setDoc] = useState("");
  const [company, setCompany] = useState("");
  const [confirmpass, setConfirmpass] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [check, setCheck] = useState(0);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const history = useHistory();

  const handleRegister = async () => {
    if (!captchaToken) {
      setToastMessage("Por favor, completa el recaptcha.");
      setShowToast(true);
      return;
    }
    // Validaciones
    if (
      !name ||
      !lastname ||
      !company ||
      !doc ||
      !position ||
      !email ||
      !password ||
      !confirmpass ||
      check === 0
    ) {
      setToastMessage("Por favor, complete todos los campos.");
      setShowToast(true);
      return;
    }

    if (!validateEmail(email)) {
      setToastMessage("Por favor, introduce un correo electrónico válido.");
      setShowToast(true);
      return;
    }

    if (password !== confirmpass) {
      setToastMessage("Las contraseñas deben ser iguales.");
      setShowToast(true);
      return;
    }

    try {
      setIsLoading(true); // Activa el loader
      await register(
        name,
        lastname,
        company,
        doc,
        position,
        email,
        password,
        confirmpass,
        check,
        captchaToken,
        phone,
        address
      );
      setToastMessage("Registro exitoso!");
      history.push("/login");
      setIsLoading(false); // Desactiva el loader
    } catch (error: any) {
      setToastMessage(error.message);
    } finally {
      setShowToast(true);
      setIsLoading(false); // Desactiva el loader
    }
  };

  function handleGoogleLogin(): void {
    throw new Error("Function not implemented.");
  }

  function handleFacebookLogin(): void {
    throw new Error("Function not implemented.");
  }

  const onRecaptchaChange = (token: string | null) => {
    setCaptchaToken(token);
  };

  return (
    <IonPage>
      {/* <IonHeader>
        <IonToolbar>
          <IonTitle>Registrarse</IonTitle>
        </IonToolbar>
      </IonHeader> */}
      <IonContent className="ion-padding">
        <IonImg src="/images/logo.webp" alt="Logo" className="custom-img" />
        {[
          { text: "Nombre", value: name, set: setName },
          { text: "Apellido", value: lastname, set: setLastname },
          { text: "Nombre empresa", value: company, set: setCompany },
          { text: "Nit o C.C.", value: doc, set: setDoc },
          { text: "Cargo", value: position, set: setPosition },
          { text: "Correo Electrónico", value: email, set: setEmail },
          { text: "Celular", value: phone, set: setPhone },
          { text: "Dirección", value: address, set: setAddress },
          { text: "Contraseña", value: password, set: setPassword },
          {
            text: "Confirmar contraseña",
            value: confirmpass,
            set: setConfirmpass,
          },
          {
            text: "Su empresa tiene contratado servicios técnicos pre-agendados?",
            value: check,
            set: setName,
          },
        ].map((item, index) => {
          return (
            <IonItem className="custom-item" key={index}>
              <IonLabel
                position="floating"
                className={index === 10 ? "custom-label" : ""}
              >
                {item.text}
              </IonLabel>
              {index === 10 ? (
                <IonRadioGroup
                  value={check}
                  onIonChange={(e) => setCheck(e.detail.value)}
                >
                  <IonItem className="custom-item">
                    <IonRadio className="custom-radio" slot="start" value={1} />
                    <IonLabel>Sí</IonLabel>
                  </IonItem>
                  <IonItem className="custom-item">
                    <IonRadio className="custom-radio" slot="start" value={2} />
                    <IonLabel>No</IonLabel>
                  </IonItem>
                </IonRadioGroup>
              ) : (
                <IonInput
                  type={
                    index === 3
                      ? "number"
                      : index === 8 || index === 9
                      ? "password"
                      : "text"
                  }
                  value={item.value}
                  onIonInput={(e) => item.set(e.detail.value!)}
                  className="custom-input"
                  placeholder={item.text}
                />
              )}
            </IonItem>
          );
        })}
        <div className="container-button">
          <IonButton
            color={"danger"}
            className="custom-button-register"
            onClick={handleRegister}
          >
            {isLoading ? <IonSpinner /> : "Registrarse"}
          </IonButton>
        </div>
        <ReCAPTCHA
          sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" // Tu clave de sitio
          onChange={onRecaptchaChange}
          className="custom-captcha"
        />
        <IonItem className="custom-item">
          <IonLabel className="custom-label-login">Ó regístrate con</IonLabel>
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
          <IonLabel className="sign-center">
            Si ya tienes una cuenta, <Link to="/login"> inicia sesión</Link>
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
