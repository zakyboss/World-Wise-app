import React from "react";
import styles from "./CityItem.module.css";
import { Link } from "react-router-dom";
import { useCities } from "../contexts/CitiesContext";
const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));

export default function CityItem({ item }) {
  const { cityName, emoji, date, id, position } = item;
  const { lat, lng } = position;
  const { currentCity } = useCities();
  console.log(position);
  const isSelected = currentCity.id === id;
  console.log(isSelected);
  return (
    <li>
      <Link
        className={`${styles.cityItem} ${
          isSelected ? styles["cityItem--active"] : ""
        }`}
        to={`${id}?lat=${lat}&lng=${lng}`}
      >
        <span className={styles.emoji}>{emoji}</span>
        <h3 className={styles.name}>{cityName}</h3>
        <time className={styles.date}>{formatDate(date)}</time>
      </Link>
    </li>
  );
}
