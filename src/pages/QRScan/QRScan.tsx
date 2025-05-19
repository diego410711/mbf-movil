import React, { useState, useEffect } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonMenuButton,
} from "@ionic/react";
import QrScanner from "react-qr-scanner";
import "./QRScan.css";
import { fetchPDF } from "../../services/inventoryService";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { FileOpener } from "@ionic-native/file-opener";


const QRScan: React.FC = () => {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cameraPermission, setCameraPermission] = useState<boolean>(false);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [activeCameraId, setActiveCameraId] = useState<string | null>(null);
  const [useFacingMode, setUseFacingMode] = useState<
    "environment" | "user" | null
  >("environment");

  // Solicitar permisos de cámara y obtener lista de dispositivos
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputDevices = devices.filter(
          (device) => device.kind === "videoinput"
        );

        if (videoInputDevices.length === 0) {
          setError("No se encontró ninguna cámara disponible.");
          return;
        }

        setVideoDevices(videoInputDevices);

        // Intentar seleccionar cámara trasera
        const rearCamera = videoInputDevices.find((device) =>
          device.label.toLowerCase().includes("back")
        );

        if (rearCamera) {
          setActiveCameraId(rearCamera.deviceId);
          setUseFacingMode(null); // Desactivar facingMode si tenemos un deviceId
        } else {
          // No se encontró cámara trasera, usar facingMode como respaldo
          setUseFacingMode("environment");
        }

        setCameraPermission(true);
      } catch (err) {
        if (err instanceof Error && err.name === "NotAllowedError") {
          setError(
            "Permiso de cámara denegado. Por favor habilítalo en configuración."
          );
        } else if (err instanceof Error && err.name === "NotFoundError") {
          setError("No se encontró una cámara disponible en este dispositivo.");
        } else if (err instanceof Error && err.name === "NotReadableError") {
          setError(
            "No se pudo acceder a la cámara. Verifique si ya está en uso."
          );
        } else {
          setError("Error desconocido al intentar acceder a la cámara.");
        }
        console.error(err);
      }
    };

    checkPermissions();
  }, []);

  const handleScan = (data: any) => {
    if (data) {
      const id = data.text;
      setScanResult(id);
      handleOpenPDF(id); // 👈 Abre el PDF automáticamente
    }
  };
  
  const handleError = (err: any) => {
    console.error("Error al escanear:", err);
    setError("Error al acceder a la cámara. Verifica los permisos.");
  };

  const resetScanner = () => {
    setScanResult(null);
    setError(null);
  };

  const handleOpenPDF = async (id: string) => {
    try {
      const base64 = await fetchPDF(id);
      const fileName = `FichaTecnica_${id}.pdf`;
      const savedFile = await Filesystem.writeFile({
        path: fileName,
        data: base64,
        directory: Directory.External,
      });
      alert("Archivo guardado correctamente");
      await FileOpener.open(savedFile.uri, "application/pdf");
    } catch (error) {
      console.error("Error al descargar o abrir el archivo:", error);
      alert("No se pudo abrir el archivo");
    }
  };
  

  const toggleCamera = () => {
    if (videoDevices.length > 1) {
      // Alternar entre cámaras disponibles
      const currentIndex = videoDevices.findIndex(
        (device) => device.deviceId === activeCameraId
      );
      const nextIndex = (currentIndex + 1) % videoDevices.length;
      setActiveCameraId(videoDevices[nextIndex].deviceId);
      setUseFacingMode(null); // Usar deviceId al alternar
    } else {
      setError("Solo se encontró una cámara disponible.");
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Escáner QR</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {cameraPermission ? (
          scanResult ? (
            <div>
              <h2>Resultado del QR:</h2>
              <p>{scanResult}</p>
              <IonButton expand="block" onClick={resetScanner}>
                Escanear otro código
              </IonButton>
            </div>
          ) : (
            <div>
              <h2>Apunta al código QR</h2>
              {error && <p className="color-error">{error}</p>}
              <QrScanner
                delay={300}
                onError={handleError}
                onScan={handleScan}
                style={{ width: "100%" }}
                {...{
                  constraints: {
                    video: activeCameraId
                      ? { deviceId: { exact: activeCameraId } }
                      : { facingMode: useFacingMode },
                  },
                }}
              />
            </div>
          )
        ) : (
          <p>{error || "Solicitando permisos para la cámara..."}</p>
        )}
      </IonContent>
    </IonPage>
  );
};

export default QRScan;
