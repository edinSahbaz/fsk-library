import { useState } from "react";
import AddBook from "../components/AddBook";
import styles from "./../styles/Admin.module.css";

const Admin = () => {
  const [showModal, setShowModal] = useState(false);
  return (
    <div className={styles.container}>
      <div className={styles.heading}>
        <h1>Dashboard - Admin</h1>
        <button onClick={() => setShowModal(true)}>Dodaj knjigu</button>
        {showModal && <AddBook setShowModal={setShowModal} />}
      </div>

      <div>
        <div>
          <h2>Zahtjevi za knjige</h2>
          <div></div>
        </div>

        <div>
          <h2>Trenutno izdate knjige</h2>
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
