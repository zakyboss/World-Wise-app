import React from "react";
import styles from "./Sidebar.module.css";
import AppNav from "./AppNav";
import Logo from "./Logo";
import { Outlet } from "react-router-dom";

export default function SideBar() {
  return (
    <div className={styles.sidebar}>
      <Logo />
      <AppNav />
      <Outlet />
      <p>List of cities</p>
      <footer className={styles.footer}>
        <p className={styles.copyright}>
          &copy; Copyright {new Date().getFullYear()} by WorldWise inc
        </p>
      </footer>
    </div>
  );
}
