import { createContext, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const CitiesContext = createContext();

function CitiesProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [currentCity, setCurrentCity] = useState({});

  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    async function getCities() {
      try {
        setIsLoading(true);
        const res = await fetch("http://localhost:8000/cities");

        if (!res.ok) {
          throw new Error(`Server Error: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        setCities(data);
      } catch (err) {
        console.error("Error fetching cities:", err.message);
      } finally {
        setIsLoading(false);
      }
    }

    getCities();
  }, []);

  async function getCity(id) {
    try {
      setIsLoading(true);
      const res = await fetch(`http://localhost:8000/cities/${id}`);

      if (!res.ok) {
        throw new Error(`Server Error: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();

      setCurrentCity(data);
    } catch (err) {
      console.error("Error fetching cities:", err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <CitiesContext.Provider value={{ cities, isLoading, currentCity, getCity }}>
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  return useContext(CitiesContext);
}

export { CitiesProvider, useCities };
