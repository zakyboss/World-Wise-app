import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useCallback,
} from "react";

const CitiesContext = createContext();
function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "cities/loaded":
      return {
        ...state,
        isLoading: false,
        cities: action.payload,
      };
    case "city/loaded":
      return { ...state, isLoading: false, currentCity: action.payload };
    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };
    case "city/deleted":
      return {
        ...state,
        cities: state.cities.filter((city) => city.id !== action.payload),
        isLoading: false,
      };
    case "rejected":
      return { ...state, isLoading: false, err: action.payload };
    default:
      throw new Error("Action unknown");
  }
}
const initalState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

function CitiesProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initalState);
  const { cities, isLoading, currentCity } = state;
  useEffect(() => {
    const getCities = async function getCities() {
      try {
        dispatch({ type: "loading" });
        const res = await fetch("http://localhost:8000/cities");

        if (!res.ok) {
          throw new Error(`Server Error: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        dispatch({ type: "cities/loaded", payload: data });
      } catch (err) {
        dispatch({
          type: "rejected",
          payload: "There was am error fetching the cities ",
        });
      }
    };

    getCities();
  }, []);

  const getCity = useCallback(
    async function getCity(id) {
      if (Number(id) === currentCity.id) {
        return;
      }
      try {
        dispatch({ type: "loading" });
        const res = await fetch(`http://localhost:8000/cities/${id}`);

        if (!res.ok) {
          throw new Error(`Server Error: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();

        // setCurrentCity(data);
        dispatch({ type: "city/loaded", payload: data });
      } catch (err) {
        dispatch({
          type: "rejected",
          payload: "There was am error fetching the city ",
        });
      } finally {
      }
    },
    [currentCity.id]
  );
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
      dispatch({ type: "loading" });

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
      // setCities((cities) => [...cities, data]);
      dispatch({ type: "city/created", payload: data });
    } catch (err) {
      dispatch({
        type: "rejected",
        payload: "There was am error fetching the data ",
      });
    }
  }
  async function deleteCity(id) {
    try {
      dispatch({ type: "loading" });
      const res = await fetch(`http://localhost:8000/cities/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error(`Server Error: ${res.status} ${res.statusText}`);
      }
      dispatch({ type: "city/deleted", payload: id });
    } catch (err) {
      console.error("Error deleting city:", err.message);
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
