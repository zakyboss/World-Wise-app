import React from "react";
import SideBar from "../Components/SideBar";
import styles from "./AppLayout.module.css";
import Map from "../Components/Map";
import User from "../Components/User";
import { useAuthContext } from "../contexts/FakeAuthContext";
export default function AppLayout() {
  const { isAuthenticated } = useAuthContext();
  return (
    <div className={styles.app}>
      <SideBar />
      <User />
      <Map />
    </div>
  );
}
