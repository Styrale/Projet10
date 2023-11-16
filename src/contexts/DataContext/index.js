import PropTypes from "prop-types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const DataContext = createContext({});

export const api = {
  loadData: async () => {
    const json = await fetch("/events.json");
    return json.json();
  },
};

export const DataProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [last, setLast] = useState(null);

  const getLast = (events) => {
    if (!events || events.length === 0) {
      return null; // Retourne null si la liste des projets est vide ou non définie
    }
  
    // Triez les projets par date dans l'ordre décroissant
    const sortedEvents = [...events].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB - dateA;
    });
    // Renvoie l'événement avec la date la plus récente (le premier élément du tableau trié)
    return sortedEvents[0];
  };

  const getData = useCallback(async () => {
    try {
      const events = await api.loadData();
      setData(events);
      setLast(getLast(events.events)); // Appel de la fonction getLast avec les données chargées
    } catch (err) {
      setError(err);
    }
  }, []);

  useEffect(() => {
    if (!data) {
      getData();
    }
  }, [data, getData]);

  const contextValue = useMemo(() => ({
    last,
    data,
    error,
  }), [last, data, error]);

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};

DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const useData = () => useContext(DataContext);

export default DataContext;
