import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import styles from "../../styles/Users.module.css";

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const usersRef = collection(db, "users");

    const unsub = onSnapshot(usersRef, (colSnap) => {
      const temp = [];
      colSnap.forEach((user) => {
        const data = user.data();
        data.email = user.id;

        if (user.id !== "biblioteka@fsk.unsa.ba") temp.push(data);
      });
      setUsers(temp);
    });

    return () => {
      unsub();
    };
  }, []);

  return (
    <div className={styles.main}>
      <h1>Članovi</h1>

      <div>
        <table className={styles.table} id="books">
          <thead>
            <tr>
              <th className={styles.th}>Ime i Prezime Studenta</th>
              <th className={styles.th}>Broj Indexa</th>
              <th className={styles.th}>Email</th>
            </tr>
          </thead>
          <tbody>
            {users &&
              users.map((user) => (
                <tr>
                  <td className={`${styles.td}`}>{user.name}</td>
                  <td className={`${styles.td}`}>{user.index}</td>
                  <td className={`${styles.td}`}>{user.email}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
