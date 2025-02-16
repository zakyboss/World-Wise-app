import { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./Form.module.css";
import Button from "./Button";
import Message from "./Message";
import Spinner from "./Spinner";
import ButtonBack from "./ButtonBack";
import { useUrlPosition } from "../hooks/useUrlPosition";
import DatePicker from "react-datepicker";
import { useCities } from "../contexts/CitiesContext";
import { useNavigate } from "react-router-dom";
export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}
const BaseUrl = "https://api.bigdatacloud.net/data/reverse-geocode-client";

function Form() {
  const [isLoadingGeoCoding, setIsLoadingGeoCoding] = useState(false);
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const { lat, lng } = useUrlPosition();
  const [emoji, setEmoji] = useState();
  const [geoCodeError, setGeoCodeError] = useState();
  const { addCity } = useCities();
  const navigate = useNavigate();
  useEffect(
    function () {
      if (!lat || !lng) {
        return;
      }
      if (!lat || !lng) {
        return <Message message="Start Clicking somewhere on the map" />;
      }
      async function fetchCityData() {
        try {
          setGeoCodeError("");
          setIsLoadingGeoCoding(true);

          const res = await fetch(
            `${BaseUrl}?latitude=${lat}&longitude=${lng}`
          );

          if (!res.ok) throw new Error("No response from geocoding API");

          const data = await res.json();

          if (!data || !data.countryCode) {
            setGeoCodeError(
              "It seems you clicked an unknown place, please try again."
            );
            return;
          }

          setCityName(data.city || data.locality || "Unknown City");
          setCountry(data.countryName || "Unknown Country");
          setEmoji(convertToEmoji(data.countryCode));
        } catch (err) {
          console.error(err.message);
          setGeoCodeError(err.message);
        } finally {
          setIsLoadingGeoCoding(false);
        }
      }

      fetchCityData();
    },
    [lat, lng]
  );
  if (geoCodeError) return geoCodeError && <Message message={geoCodeError} />;
  if (isLoadingGeoCoding) return <Spinner />;
  function handleSubmit(e) {
    e.preventDefault();
    if (!cityName || !date) return;
    const newCity = {
      cityName,
      country,
      emoji,
      date,
      position: { lat, lng },
      notes,
    };
    addCity(newCity);
    setCityName("");
    setNotes("");
    navigate("/app/cities");
    console.log(newCity);
  }
  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag} style={{ color: "orange" }}>
          {emoji}
        </span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        {/* <input
          id="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
        /> */}
        <DatePicker
          onChange={(date) => setDate(date)}
          selected={date}
          dateFormat={"dd/MM/yy"}
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <ButtonBack />
      </div>
    </form>
  );
}

export default Form;
