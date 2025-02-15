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
  async function addCity(newCity) {
    if (!newCity) return;

    // Check if the city already exists (case insensitive)
    if (
      cities.some(
        (city) => city.cityName.toLowerCase() === newCity.cityName.toLowerCase()
      )
    ) {
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/cities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCity),
      });

      if (!res.ok) {
        throw new Error(`Server Error: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();

      // Update state with the new city
      setCities((cities) => [...cities, data]);
    } catch (err) {
      console.error("Error adding city:", err.message);
    }
  }
  async function deleteCity(id) {
    try {
      setIsLoading(true);
      const res = await fetch(`http://localhost:8000/cities/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error(`Server Error: ${res.status} ${res.statusText}`);
      }

      // const data = await res.json();

      // Update state with the new city
      setCities((cities) => cities.filter((city) => city.id !== id));
    } catch (err) {
      console.error("Error deleting city:", err.message);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <CitiesContext.Provider
      value={{ cities, isLoading, currentCity, getCity, addCity, deleteCity }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  return useContext(CitiesContext);
}

export { CitiesProvider, useCities };
