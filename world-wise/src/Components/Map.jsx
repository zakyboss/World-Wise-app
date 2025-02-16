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
import { useGeolocation } from "../hooks/useGeolocation";
import Button from "./Button";
import { useUrlPosition } from "../hooks/useUrlPosition";
export default function Map() {
    const {lat, lng}= useUrlPosition()
  const { currentCity } = useCities();
  const { cities } = useCities();
  const [position, setPosition] = useState([40, 0]);
  console.log(currentCity);

  const {
    isLoading: isLoadingPosition,
    position: geoLocationPosition,
    getPosition,
  } = useGeolocation();

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
  useEffect(
    function () {
      if (!geoLocationPosition) {
        return;
      } else {
        setPosition([geoLocationPosition.lat, geoLocationPosition.lng]);
      }
    },
    [geoLocationPosition]
  );
  return (
    <div className={styles.mapContainer}>
      {geoLocationPosition ? (
        ""
      ) : (
        <Button type="position" onClick={getPosition}>
          {isLoadingPosition ? "Loading" : "use your position"}
        </Button>
      )}

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
