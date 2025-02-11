import React from "react";
import Spinner from "./Spinner";
import styles from "./CountryList.module.css";
import Message from "./Message";
import CountryItem from "./CountryItem";
import { useCities } from "../contexts/CitiesContext";
export default function CountriesList() {
  const { cities, isLoading } = useCities();
  const countries = cities.reduce((acc, city) => {
    if (!acc.some((item) => item.country === city.country)) {
      acc.push(city);
    }
    return acc;
  }, []);
  return (
    <>
      {isLoading && <Spinner />}
      {!cities.length && (
        <Message message="Add your first City By Clicking on A City On the Map" />
      )}
      <ul className={styles.countriesList}>
        {countries.map((country) => (
          <CountryItem country={country} key={country.cityName} />
        ))}
      </ul>
      ;
    </>
  );
}
