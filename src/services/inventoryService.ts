import axios from "axios";

export const API_URL = `${import.meta.env.VITE_API_URL_TEST}/inventory`;

export const fetchInventory = async (): Promise<any[]> => {
  try {
    const response = await axios.get(API_URL);
    return response.data; // Devuelve los datos del inventario
  } catch (error) {
    console.error("Error fetching inventory:", error);
    throw new Error("Unable to fetch inventory");
  }
};

// Función para guardar un equipo
export const saveEquipment = async (equipment: any) => {
  try {
    const response = await axios.post(API_URL, equipment);
    console.log("Equipo guardado exitosamente:", response.data);
  } catch (error) {
    console.error("Error al guardar el equipo:");
    throw error;
  }
};

// Función para obtener el PDF en formato Base64
export const fetchPDF = async (id: string): Promise<string> => {
  try {
    const response = await axios.get(`${API_URL}/generate-pdf/${id}`);
    return response.data.base64; // Devuelve el Base64 del PDF
  } catch (error) {
    console.error("Error fetching PDF:", error);
    throw new Error("Unable to fetch PDF");
  }
};


export const fetchQRCode = async (id: string): Promise<string> => {
  const response = await axios.get(`/generate-qr/${id}`, {
    responseType: "arraybuffer",
  });

  // Convertir el arraybuffer a base64
  const base64 = btoa(
    new Uint8Array(response.data).reduce(
      (data, byte) => data + String.fromCharCode(byte),
      ""
    )
  );

  return base64;
}
