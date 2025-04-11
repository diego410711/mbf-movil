import axios from "axios";

export const API_URL = `${import.meta.env.VITE_API_URL_TEST}/equipment`;

export const getEquipment = async (
  technicianName?: string,
  email?: string
) => {
  try {
    const params = new URLSearchParams();
    if (technicianName) params.append('technicianName', technicianName);
    if (email) params.append('email', email);

    const url = `${API_URL}?${params.toString()}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error: any) {
    console.error("Error al obtener los equipos:", error.response?.data || error);
    throw error;
  }
};


// Enviar datos del formulario para solicitar un servicio técnico
export const submitTechnicalServiceRequest = async (formData: FormData) => {
  try {
    const response = await axios.post(API_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al enviar la solicitud:", error);
    throw error;
  }
};

// Obtener el PDF en formato Base64
export const fetchPDFServices = async (id: string): Promise<string> => {
  try {
    const response = await axios.get(`${API_URL}/generate-pdf/${id}`);
    return response.data.base64;
  } catch (error) {
    console.error("Error al obtener el PDF:", error);
    throw new Error("No se pudo obtener el PDF");
  }
};

// Actualizar equipo
export const updateEquipment = async (_id: string, data: Record<string, any>) => {
  try {
    const response = await axios.put(`${API_URL}/${_id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el equipo:", error);
    throw error;
  }
};

// Eliminar una foto de un equipo
export const deletePhotoFromEquipment = async (equipmentId: string, photoUrl: string) => {
  try {
    const response = await axios.patch(`${API_URL}/${equipmentId}/photo`, { photoUrl });
    return response.data;
  } catch (error) {
    console.error("Error al eliminar la foto:", error);
    throw error;
  }
};
