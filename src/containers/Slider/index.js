import { useEffect, useState } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";

import "./style.scss";

const Slider = () => {
  const { data } = useData();
  // console.log(data)
  const [index, setIndex] = useState(0);
  const byDateDesc = data?.focus.sort((evtA, evtB) =>
    new Date(evtA.date) < new Date(evtB.date) ? -1 : 1
  );
const nextCard = () => {
  if (!byDateDesc || byDateDesc.length === 0) return;

  setTimeout(() => {
    setIndex(index < byDateDesc.length - 1 ? index + 1 : 0);
  }, 5000);
};

  useEffect(() => {
    nextCard();
  });
  return (
    <div className="SlideCardList">
      {byDateDesc?.map((event, idx) => (
        <div key={event.id ?? `${event.title}-${idx}`}>
          <div
            className={`SlideCard SlideCard--${
              index === idx ? "display" : "hide"
            }`}
          >
            <img src={event.cover} alt="forum" />
            <div className="SlideCard__descriptionContainer">
              <div className="SlideCard__description">
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <div>{getMonth(new Date(event.date))}</div>
              </div>
            </div>
          </div>
          <div className="SlideCard__paginationContainer">
            <div className="SlideCard__pagination">
              {byDateDesc.map((paginationEvent, i) => (
                <input
                  key={`pagination-${paginationEvent.id ?? i}`}
                  type="radio"
                  name="radio-button"
                  checked={index === i}
                  onChange={() => setIndex(i)}
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
export default Slider;
