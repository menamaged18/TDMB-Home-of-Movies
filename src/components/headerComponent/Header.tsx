import styles from "./HeaderStyle.module.css";
import Link from "next/link";
import React from "react";

interface HeaderProps {
  children?: React.ReactNode;
}

function Header(props: HeaderProps) {
    return (
      <nav className={styles.navbar}>
        <div className={styles["navbar-brand"]}>
            <Link href="/">TDMB home of Movies</Link> 
        </div>
        <div className={styles["navbar-right"]}>
          {/* <div className={styles["navbar-search"]}>
            <input type="text" placeholder="Search..." />
          </div> */}
          <div className={styles["navbar-favourites"]}>
            <Link href="/Favourites"> Favourites</Link>
          </div>
            {props.children}
        </div>
      </nav>
    );
}

export default Header;