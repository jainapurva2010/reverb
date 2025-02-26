import React from "react";
import { Link } from "react-router-dom";
import styles from "./NavBar.module.css"; // Import CSS module

const NavBar: React.FC = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>🎵 Reverb</div>
      <div className={styles.links}>
        <Link to="/" className={styles.link}>Home</Link>
        <Link to="/search" className={styles.link}>Search</Link>
        <Link to="/profile" className={styles.link}>Profile</Link>
      </div>
    </nav>
  );
};

export default NavBar;
