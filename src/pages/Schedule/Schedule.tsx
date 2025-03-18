import React, { useEffect, useRef, useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonModal,
  IonInput,
  IonLabel,
  IonItem,
  IonList,
  IonListHeader,
  IonIcon,
  IonSelect,
  IonSelectOption,
  IonButtons,
  IonMenuButton,
} from "@ionic/react";
import "./Schedule.css";
import {
  add,
  chevronBack,
  chevronForward,
  create,
  createOutline,
  search,
  timeOutline,
  trash,
  trashOutline,
} from "ionicons/icons";
import { createGesture } from "@ionic/core";
import {
  createEvent,
  deleteEvent,
  getEvents,
  updateEvent,
} from "../../services/scheduleService";

interface Event {
  _id: string; // Identificador único del evento
  date: string; // Fecha en formato "YYYY-MM-DD"
  title: string;
  type: string; // Tipo de evento (meeting, holiday, etc.)
  time: string;
}

const Schedule: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedEvents, setSelectedEvents] = useState<Event[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventType, setEventType] = useState("Mantenimiento"); // Tipo de evento
  const calendarRef = useRef<HTMLDivElement>(null);
  const [animationDirection, setAnimationDirection] = useState<
    "left" | "right" | ""
  >("");
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Event[]>([]);
  const [isSearched, setIsSearched] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);

  const searchEvents = () => {
    const results = events.filter(
      (event) =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.date.includes(searchQuery)
    );
    setSearchResults(results);
    setIsSearched(true); // Marca que se ha realizado una búsqueda
  };

  const handleDeleteEvent = (event: Event) => {
    setEventToDelete(event);
    setShowDeleteConfirmation(true);
  };

  const confirmDeleteEvent = async () => {
    if (eventToDelete) {
      await removeEvent(eventToDelete._id); // Llamada a la función de eliminación
      setShowDeleteConfirmation(false); // Cierra el modal
      setEventToDelete(null); // Limpia el evento
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
    setEventToDelete(null);
  };

  // Generar los días del calendario
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    const days: { date: Date; isCurrentMonth: boolean }[] = [];

    // Días del mes anterior
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - i),
        isCurrentMonth: false,
      });
    }

    // Días del mes actual
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
      });
    }

    // Días del siguiente mes
    const remainingCells = 42 - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
      });
    }

    return days;
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const fetchedEvents = await getEvents();
        setEvents(fetchedEvents); // Asume que los datos tienen el formato adecuado
      } catch (error) {
        console.error("Error al obtener los eventos:", error);
      }
    };

    fetchEvents();
  }, []);

  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
    setAnimationDirection("right");
    setTimeout(() => {
      setCurrentDate(
        new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
      );
      setAnimationDirection("");
    }, 300); // Duración de la animación
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
    setAnimationDirection("left");
    setTimeout(() => {
      setCurrentDate(
        new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
      );
      setAnimationDirection("");
    }, 300); // Duración de la animación
  };

  const [eventTime, setEventTime] = useState("12:00"); // Estado para la hora del evento

  const addEvent = async () => {
    try {
      const newEvent = await createEvent({
        date: selectedDate || eventInputDate,
        title: eventTitle,
        type: eventType,
        time: eventTime,
      });

      // Asegúrate de que el _id esté presente en el evento recién creado
      if (newEvent && newEvent._id) {
        setEvents((prevEvents) => [...prevEvents, newEvent]);
        setShowModal(false); // Cierra el modal
      } else {
        console.error("Evento creado sin _id.");
      }
    } catch (error) {
      console.error("Error al crear el evento:", error);
    }
  };

  const [eventInputDate, setEventInputDate] = useState<string>("");

  const getEventsForDate = (date: string) =>
    events.filter((event) => event.date === date);

  const formatDate = (date: Date) =>
    `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;

  const handleDayClick = (date: Date) => {
    const formattedDate = formatDate(date);
    setSelectedDate(formattedDate); // Selecciona la fecha
    const eventsForDate = getEventsForDate(formattedDate); // Obtén los eventos para la fecha seleccionada

    // Si hay eventos, muestra la lista de eventos
    if (eventsForDate.length > 0) {
      setSelectedEvents(eventsForDate);
    } else {
      setSelectedEvents([]); // Si no hay eventos, limpia la lista
    }
  };

  const days = generateCalendarDays();

  useEffect(() => {
    const gesture = createGesture({
      el: calendarRef.current!, // Elemento objetivo del gesto
      gestureName: "calendar-swipe",
      onMove: (ev) => {
        if (ev.deltaX > 50) {
          goToPreviousMonth(); // Deslizar a la derecha
        } else if (ev.deltaX < -50) {
          goToNextMonth(); // Deslizar a la izquierda
        }
      },
    });
    gesture.enable();

    return () => gesture.destroy(); // Limpia el gesto al desmontar
  }, [currentDate]);

  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  // Al abrir el modal para edición
  const openEditModal = (event: Event) => {
    setEditingEvent(event);
    setEventTitle(event.title);
    setEventType(event.type);
    setEventTime(event.time);
    setEventInputDate(event.date);
    setShowModal(true);
  };

  const resetModalState = () => {
    setEventTitle("");
    setEventType("meeting");
    setEventTime("12:00");
    setEventInputDate("");
    setEditingEvent(null);
  };

  // Guardar cambios del evento
  const saveEventChanges = async () => {
    if (editingEvent && editingEvent._id) {
      try {
        // Llama a tu API para actualizar el evento
        const updatedEvent = await updateEvent(editingEvent._id, {
          title: eventTitle,
          type: eventType,
          time: eventTime,
          date: eventInputDate || editingEvent.date,
        });

        // Actualiza el estado para reflejar los cambios del evento
        setEvents((prevEvents) =>
          prevEvents.map((evt) =>
            evt._id === editingEvent._id ? updatedEvent : evt
          )
        );
        setSelectedEvents((prevEvents) =>
          prevEvents.map((event) =>
            event._id === updatedEvent._id ? updatedEvent : event
          )
        );
        // Cierra el modal y resetea el estado
        setShowModal(false);
        resetModalState();
      } catch (error) {
        console.error("Error al actualizar el evento:", error);
      }
    } else {
      console.error("No se puede actualizar, el evento no tiene un _id.");
    }
  };

  const removeEvent = async (eventId: string) => {
    if (eventId) {
      try {
        // Llama a tu API para eliminar el evento
        await deleteEvent(eventId);

        // Actualiza el estado para reflejar que el evento ha sido eliminado
        setEvents((prevEvents) =>
          prevEvents.filter((event) => event._id !== eventId)
        );
        // Actualiza el estado de la lista de eventos seleccionados
        setSelectedEvents((prevEvents) =>
          prevEvents.filter((event) => event._id !== eventId)
        );
      } catch (error) {
        console.error("Error al eliminar el evento:", error);
      }
    } else {
      console.error(
        "No se puede eliminar, el _id del evento no está definido."
      );
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Cronograma</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="calendar-controls">
          <IonIcon icon={chevronBack} onClick={goToPreviousMonth} />
          {currentDate.toLocaleDateString("es-ES", {
            month: "long",
            year: "numeric",
          })}
          <IonIcon icon={chevronForward} onClick={goToNextMonth} />
          <IonIcon icon={search} onClick={() => setShowSearchModal(true)} />
          <IonIcon icon={add} onClick={(e) => setShowModal(true)} />
        </div>
        <div
          ref={calendarRef}
          className={`calendar-container ${animationDirection}`}
        >
          <IonGrid>
            {/* Encabezados de días de la semana */}
            <IonRow>
              {["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"].map((day) => (
                <IonCol key={day} className="calendar-header">
                  {day}
                </IonCol>
              ))}
            </IonRow>

            {/* Generación de días */}
            {Array.from({ length: 6 }).map((_, rowIndex) => (
              <IonRow key={rowIndex} className="calendar-row">
                {days
                  .slice(rowIndex * 7, rowIndex * 7 + 7)
                  .map((dayObj, index) => (
                    <IonCol key={index}>
                      <div
                        className={`calendar-day ${
                          dayObj.isCurrentMonth ? "" : "calendar-day-outside"
                        }`}
                        onClick={() => handleDayClick(dayObj.date)}
                      >
                        <div
                          className={`${
                            selectedDate === formatDate(dayObj.date)
                              ? "selected-day"
                              : ""
                          }`}
                        >
                          {dayObj.date.getDate()}
                        </div>{" "}
                      </div>
                      {/* Mostrar las barras de eventos */}
                      <div className="event-bars">
                        {getEventsForDate(formatDate(dayObj.date)).map(
                          (event, idx) => (
                            <div
                              key={idx}
                              className={`event-bar ${event.type}`}
                            ></div>
                          )
                        )}
                      </div>
                    </IonCol>
                  ))}
              </IonRow>
            ))}
          </IonGrid>
        </div>
        {/* Lista de eventos debajo del calendario */}
        {selectedEvents.length > 0 && (
          <IonList>
            <IonListHeader>
              <IonLabel>
                <h3>Eventos del {selectedDate}</h3>
              </IonLabel>
            </IonListHeader>
            {selectedEvents.map((event, index) => (
              <IonItem key={event._id}>
                {/* Usa el _id para la clave única */}
                <IonLabel>
                  <h3>{event.title}</h3>
                  <p>Tipo: {event.type}</p>
                  <p>Hora: {event.time}</p>
                </IonLabel>
                <IonIcon
                  icon={createOutline}
                  onClick={() => openEditModal(event)}
                />
                <IonIcon
                  icon={trashOutline}
                  onClick={() => handleDeleteEvent(event)}
                />
              </IonItem>
            ))}
          </IonList>
        )}

        <IonModal isOpen={showDeleteConfirmation} onDidDismiss={cancelDelete}>
          <IonContent className="ion-padding">
            <h2>Confirmar Eliminación</h2>
            <p>¿Estás seguro de que deseas eliminar este evento?</p>
            <div className="container-button">
              <IonButton
                expand="block"
                color="danger"
                onClick={confirmDeleteEvent}
                className="custom-button"
              >
                Eliminar
              </IonButton>
            </div>
            <div className="container-button">
              <IonButton
                expand="block"
                color="medium"
                onClick={cancelDelete}
                className="custom-button"
              >
                Cancelar
              </IonButton>
            </div>
          </IonContent>
        </IonModal>

        {/* Modal para agregar eventos */}
        <IonModal
          isOpen={showModal}
          onDidDismiss={() => {
            setShowModal(false);
            resetModalState();
          }}
        >
          <IonContent className="ion-padding">
            <h2>{editingEvent ? "Editar Evento" : "Agregar Evento"}</h2>

            {!selectedDate && (
              <IonItem className="custom-item">
                <IonLabel position="floating">Fecha del Evento</IonLabel>
                <IonInput
                  type="date"
                  value={eventInputDate}
                  onIonInput={(e) => setEventInputDate(e.detail.value!)}
                  className="custom-input"
                />
              </IonItem>
            )}

            <IonItem className="custom-item">
              <IonLabel position="floating">Título del Evento</IonLabel>
              <IonInput
                value={eventTitle}
                onIonInput={(e) => setEventTitle(e.detail.value!)}
                placeholder="Ingrese el título del evento"
                className="custom-input"
              />
            </IonItem>

            <IonItem className="custom-item">
              <IonLabel position="floating">Tipo de Evento</IonLabel>
              <IonSelect
                value={eventType}
                onIonChange={(e) => setEventType(e.detail.value!)}
                className="custom-select"
              >
                <IonSelectOption value="Diagnostico">
                  Visita de diagnóstico técnico
                </IonSelectOption>
                <IonSelectOption value="Visita">
                  Visita comercial
                </IonSelectOption>
                <IonSelectOption value="Mantenimiento">
                  Mantenimiento preventivo
                </IonSelectOption>
                <IonSelectOption value="Reparacion">Reparación</IonSelectOption>
                <IonSelectOption value="Calibracion">
                  Calibración
                </IonSelectOption>
                <IonSelectOption value="Garantia">Garantía</IonSelectOption>
              </IonSelect>
            </IonItem>

            <IonItem className="custom-item">
              <IonLabel position="floating">Hora del Evento</IonLabel>
              <IonInput
                type="time"
                value={eventTime}
                onIonInput={(e) => setEventTime(e.detail.value!)}
                className="custom-input"
                placeholder="Select Time"
              ></IonInput>
            </IonItem>

            <div className="container-button">
              <IonButton
                expand="block"
                onClick={editingEvent ? saveEventChanges : addEvent}
                className="custom-button margin-button"
                color={"danger"}
              >
                {editingEvent ? "Guardar Cambios" : "Guardar"}
              </IonButton>
            </div>
            <div className="container-button">
              <IonButton
                expand="block"
                color="medium"
                onClick={() => {
                  setShowModal(false);
                  resetModalState();
                }}
                className="custom-button"
              >
                Cancelar
              </IonButton>
            </div>
          </IonContent>
        </IonModal>

        <IonModal
          isOpen={showSearchModal}
          onDidDismiss={() => setShowSearchModal(false)}
        >
          <IonContent className="ion-padding">
            <h2>Buscar Eventos</h2>
            <IonItem className="custom-item">
              <IonLabel position="floating">Criterio de Búsqueda</IonLabel>
              <IonInput
                value={searchQuery}
                onIonInput={(e) => setSearchQuery(e.detail.value!)}
                placeholder="Ingrese título, tipo o fecha (YYYY-MM-DD)"
                className="custom-input"
              />
            </IonItem>
            <div className="container-button">
              <IonButton
                expand="block"
                onClick={searchEvents}
                className="custom-button margin-button"
                color={"danger"}
              >
                Buscar
              </IonButton>
            </div>
            <div className="container-button">
              <IonButton
                expand="block"
                color="medium"
                onClick={() => setShowSearchModal(false)}
                className="custom-button"
              >
                Cerrar
              </IonButton>
            </div>
            {searchResults.length > 0 && (
              <IonList>
                <IonListHeader>
                  <h3>Resultados de la Búsqueda</h3>
                </IonListHeader>
                {searchResults.map((event, index) => (
                  <IonItem key={index}>
                    <IonLabel>
                      <h3>{event.title}</h3>
                      <p>Fecha: {event.date}</p>
                      <p>Tipo: {event.type}</p>
                      <p>Hora: {event.time}</p>
                    </IonLabel>
                  </IonItem>
                ))}
              </IonList>
            )}
            {searchResults.length === 0 && isSearched && searchQuery.trim() && (
              <p>
                No se encontraron eventos que coincidan con el criterio de
                búsqueda.
              </p>
            )}
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Schedule;
