import React, { useEffect, useState } from "react";
import styles from "./Map.module.css";
import "leaflet/dist/leaflet.css";
import { useCities } from "../contexts/CitiesContext";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useNavigate, useSearchParams } from "react-router-dom";
export default function Map() {
  const [searchParams] = useSearchParams();
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const { currentCity } = useCities();
  const { cities } = useCities();
  const [position, setPosition] = useState([40, 0]);
  console.log(currentCity);
  useEffect(
    function () {
      if (!lat && !lng) {
        return;
      } else {
        setPosition([lat, lng]);
        console.log(lat, lng);
      }
    },
    [lat, lng]
  );
  return (
    <div className={styles.mapContainer}>
      <MapContainer
        center={position}
        zoom={8}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap/.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city, index) => (
          <Marker key={index} position={[city.position.lat, city.position.lng]}>
            <Popup>
              {" "}
              {city.emoji} <br />
              {city.cityName}
            </Popup>
          </Marker>
        ))}
        <ChangeMapCenter position={position} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}

function ChangeMapCenter({ position }) {
  const map = useMap();
  map.setView(position);
}
function DetectClick() {
  const navigate = useNavigate();
  useMapEvents({
    click: function (e) {
      navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
    },
  });
}
