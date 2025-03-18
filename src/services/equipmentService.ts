import axios from "axios";

export const API_URL = `${import.meta.env.VITE_API_URL_TEST}/equipment`;

export const getEquipment = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data; // La respuesta debe ser un arreglo de equipos
  } catch (error) {
    console.error("Error al obtener los equipos:", error);
    throw error;
  }
};

// Función para enviar los datos del formulario
export const submitTechnicalServiceRequest = async (formData: FormData) => {
  try {
    const response = await axios.post(`${API_URL}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Indica que se están enviando archivos
      },
    });
    return response.data; // Devuelve la respuesta del backend
  } catch (error) {
    console.error("Error while sending the request:", error);
    throw error; // Propaga el error para manejarlo en el componente
  }
};

// Función para obtener el PDF en formato Base64
export const fetchPDFServices = async (id: string): Promise<string> => {
  try {
    const response = await axios.get(`${API_URL}/generate-pdf/${id}`);
    return response.data.base64; // Devuelve el Base64 del PDF
  } catch (error) {
    console.error("Error fetching PDF:", error);
    throw new Error("Unable to fetch PDF");
  }
};
