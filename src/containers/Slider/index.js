import { useEffect, useState } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";

import "./style.scss";

const Slider = () => {
  const { data } = useData();
  const [index, setIndex] = useState(0);
  const [timer, setTimer] = useState(null);

  // Vérifier que data?.focus est défini avant de trier
  const byDateDesc = data?.focus
    ? data.focus.sort((evtA, evtB) =>
        new Date(evtA.date) < new Date(evtB.date) ? -1 : 1
      )
    : [];

  const nextCard = () => {
    setIndex((prevIndex) => (prevIndex < byDateDesc.length - 1 ? prevIndex + 1 : 0));
  };

  useEffect(() => {
    const interval = setInterval(nextCard, 5000);
    setTimer(interval);

    return () => clearInterval(interval);
  }, []);

  const handlePaginationClick = (idx) => {
    // Arrêter le timer actuel
    clearInterval(timer);

    // Réinitialiser l'index
    setIndex(idx);

    // Redémarrer le timer
    const newTimer = setInterval(nextCard, 5000);
    setTimer(newTimer);
  };

  return (
    <div className="SlideCardList">
      {byDateDesc?.map((event, idx) => (
        <div
          key={event.title}
          className={`SlideCard SlideCard--${index === idx ? "display" : "hide"}`}
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
      ))}
      <div className="SlideCard__paginationContainer" key={Math.random()}>
        <div className="SlideCard__pagination">
          {byDateDesc.map((event, radioIdx) => (
            <input
              key={`radio-${Math.random(1, 1000000)}`}
              type="radio"
              name="radio-button"
              checked={index === radioIdx}
              onChange={() => handlePaginationClick(radioIdx)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;
