import { useState } from "react";
import EventCard from "../../components/EventCard";
import Select from "../../components/Select";
import { useData } from "../../contexts/DataContext";
import Modal from "../Modal";
import ModalEvent from "../ModalEvent";

import "./style.css";

const PER_PAGE = 9;

const EventList = () => {
  const { data, error } = useData();
  const [type, setType] = useState();
  const [currentPage, setCurrentPage] = useState(1); // Ajout d'un state react pour gérer les evnts

  if (error) return <div>An error occurred</div>; // Déplacé avant le return + simplifié)
  if (!data) return "loading"; // Déplacé avant le return + simplifié)

  // Modifié : filtrage + découpage remplacés par une seule opération
  const allFilteredEvents = (data?.events || []).filter(
    (event) => type == null || event.type === type
  );

  // Ajout : logique de pagination avec slice()
  const start = (currentPage - 1) * PER_PAGE; // Ajout : calcul de l'index de début
  const paginatedEvents = allFilteredEvents.slice(start, start + PER_PAGE); // Ajout : découpage des événements pour la page actuelle
  // Ajout : calcul du nombre total de pages
  const totalPages = Math.ceil(allFilteredEvents.length / PER_PAGE); // Ajout

  // Modifié : changeType réinitialise aussi la page courante
  const changeType = (evtType) => {
    setCurrentPage(1); // Ajout pour réinitialiser la page courante à 1
    setType(evtType); // Modifié :changeType prend paramètre evtType
  };

  // Modifié : typeList devient un tableau avec Array.from
  const typeList = Array.from(new Set(data.events.map((event) => event.type))); 

  return (
    <>
      <h3 className="SelectTitle">Catégories</h3>
      <Select
        selection={typeList} // On utilise maintenant typeList
        onChange={(value) => (value ? changeType(value) : changeType(null))}
      />

      <div id="events" className="ListContainer">
        {paginatedEvents.map((event) => ( // Modifié (remplace filteredEvents)
          <Modal key={event.id} Content={<ModalEvent event={event} />}>
            {({ setIsOpened }) => (
              <EventCard
                onClick={() => setIsOpened(true)}
                imageSrc={event.cover}
                title={event.title}
                date={new Date(event.date)}
                label={event.type}
              />
            )}
          </Modal>
        ))}
      </div>

      <div className="Pagination">
        {[...Array(totalPages)].map((_, n) => ( // Modif : totalPages au lieu de pageNumber
          <a
          // key={0}
            n={0} // Modifié : n est l'index de la page
            href="#events"
            onClick={() => setCurrentPage(n + 1)}
            className={currentPage === n + 1 ? "active" : ""} // AJOUTÉ : pour style actif
          >
            {n + 1}
          </a>
        ))}
      </div>
    </>
  );
};

export default EventList;
