declare module "react-qr-scanner" {
  import React from "react";

  interface QrScannerProps {
    delay?: number | false;
    onScan: (data: string | null) => void;
    onError?: (error: Error) => void;
    style?: React.CSSProperties;
    facingMode?: "user" | "environment";
    resolution?: number;
  }

  const QrScanner: React.FC<QrScannerProps>;
  export default QrScanner;
}
