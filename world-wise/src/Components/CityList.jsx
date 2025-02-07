import React from "react";
import styles from "./CityList.module.css";
import Spinner from "./Spinner";
import CityItem from "./CityItem";
import Message from "./Message";
export default function CityList({ cities, isLoading }) {
  return (
    <>
      {isLoading && <Spinner />}
      {!cities.length && (
        <Message message="Add your first City By Clicking on A City On the Map" />
      )}
      <ul className={styles.cityList}>
        {cities.map((city) => (
          <CityItem item={city} key={city.cityName} />
        ))}
      </ul>
      ;
    </>
  );
}
