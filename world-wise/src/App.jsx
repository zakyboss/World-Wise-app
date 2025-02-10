import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Product from "./pages/Product";
import Pricing from "./pages/Pricing";
import HomePage from "./pages/HomePage";
import PageNotFound from "./pages/PageNotFound";
import AppLayout from "./pages/AppLayout";
import Login from "./pages/Login";
import CityList from "./Components/CityList";
import { useEffect, useState } from "react";
import CountriesList from "./Components/CountriesList";
import City from "./Components/City";
import Form from "./Components/Form";
import FetchData from "./Components/FetchData";
export default function App() {
  const [cities, setCities] = useState([]);
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
        // console.log(data);
        setCities(data);
      } catch (err) {
        console.error("Error fetching cities:", err.message);
      } finally {
        setIsLoading(false);
      }
    }

    getCities();
  }, []);
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="product" element={<Product />} />
          <Route path="login" element={<Login />} />
          <Route path="data" element={<FetchData />} />
          <Route path="*" element={<PageNotFound />} />

          {/* Define "app" as the parent route */}
          <Route path="app" element={<AppLayout />}>
            <Route index element={<Navigate replace to="cities" />} />
            <Route
              path="cities"
              element={<CityList cities={cities} isLoading={isLoading} />}
            />
            <Route path="cities/:id" element={<City />} />
            <Route
              path="countries"
              element={<CountriesList cities={cities} isLoading={isLoading} />}
            />
            <Route path="form" element={<Form />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}
