import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import styles from "./../../styles/Admin.module.css";

const Main = () => {
  const [messages, setMessages] = useState([])

  useEffect(() => {
    const colRef = collection(db, 'messages');

    const unsub = onSnapshot(colRef, colSnap => {
      const temp = []
      colSnap.forEach(msg => {
        if(msg.exists()) temp.push(msg.data())
      })
      setMessages(temp)
    });

    return () => {
      unsub();
    }
  }, [])

  return (
    <div className={styles.main}>
      <div className={styles.heading}>
        <h2>Dashboard - Admin</h2>
        <div>
          {
            messages.map((msg, i) => (
              <div key={i}>
                
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default Main;
