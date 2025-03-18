// services/eventService.ts
import axios from "axios";

export const API_URL = `${import.meta.env.VITE_API_URL_TEST}/events`;

// Obtener todos los eventos
export const getEvents = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data; // Devuelve los eventos obtenidos
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

// Crear un nuevo evento
export const createEvent = async (eventData: {
  date: string;
  title: string;
  type: string;
  time: string;
}) => {
  try {
    const response = await axios.post(API_URL, eventData);
    return response.data; // Devuelve el evento creado
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
};

// Actualizar un evento existente
export const updateEvent = async (
  eventId: string,
  updatedData: {
    date?: string;
    title?: string;
    type?: string;
    time?: string;
  }
) => {
  try {
    const response = await axios.put(`${API_URL}/${eventId}`, updatedData);
    return response.data; // Devuelve el evento actualizado
  } catch (error) {
    console.error("Error updating event:", error);
    throw error;
  }
};

// Eliminar un evento
export const deleteEvent = async (eventId: string) => {
  try {
    const response = await axios.delete(`${API_URL}/${eventId}`);
    return response.data; // Devuelve alguna confirmación de eliminación
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
};
