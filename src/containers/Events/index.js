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
  const [currentPage, setCurrentPage] = useState(1); // ajout d'un state react pour gérer les evnts

  if (error) return <div>An error occurred</div>; // Déplacé avant le return + simplifié)
  if (!data) return "loading"; // Déplacé avant le return et simplifié)

  // Modif : filtrage + découpage remplacés en 1 une seule opération
  const allFilteredEvents = (data?.events || []).filter(
    (event) => type == null || event.type === type
  );

  // Ajout : logique pagination avec .slice
  const start = (currentPage - 1) * PER_PAGE; // ajout : calcul de index de début
  const paginatedEvents = allFilteredEvents.slice(start, start + PER_PAGE); // ajout : découpage des événements pour page actuelle
   
  const totalPages = Math.ceil(allFilteredEvents.length / PER_PAGE); // Ajout pour calcul nbre total pages

  // Modif : changeType réinitialise aussi la page en cours
  const changeType = (evtType) => {
    setCurrentPage(1); // Ajout : réinitialise page courante à 1
    setType(evtType); // Modif :changeType prend paramètre evtType
  };

  // Modif : typeList transformé en tableau avec Array.from
  const typeList = Array.from(new Set(data.events.map((event) => event.type))); 

  return (
    <>
      <h3 className="SelectTitle">Catégories</h3>
      <Select
        selection={typeList} // utilisation de typeList
        onChange={(value) => (value ? changeType(value) : changeType(null))}
      />

      <div id="events" className="ListContainer">
        {paginatedEvents.map((event) => ( // Modif (remplace filteredEvents)
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
            n={0} // Modifié : "n" = index de la page
            href="#events"
            onClick={() => setCurrentPage(n + 1)}
            className={currentPage === n + 1 ? "active" : ""} // AJOUTE : pour style "actif"
          >
            {n + 1}
          </a>
        ))}
      </div>
    </>
  );
};

export default EventList;
