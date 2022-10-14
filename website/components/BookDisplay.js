import styles from "../styles/BookDisplay.module.css";
import { db } from "../lib/firebase";
import { collection, doc, getDocs } from "firebase/firestore";
import { useState, useEffect, useContext } from "react";
import { async } from "@firebase/util";

const BookDisplay = () => {
  const [books, setBooks] = useState(null);

  useEffect(() => {
    (async () => {
      const booksCollRef = collection(db, "books");
      const bookSnapshots = await getDocs(booksCollRef);
      const docs = bookSnapshots.docs.map((doc) => {
        const data = doc.data();
        data.id = doc.id;
        return data;
      });
      setBooks(docs);
    })();
  }, []);

  return (
    <div className={styles.main}>
      {books &&
        books.map((book) => (
          <div key={book.id}>
            <h1>{book.name}</h1>
          </div>
        ))}
    </div>
  );
};

export default BookDisplay;
