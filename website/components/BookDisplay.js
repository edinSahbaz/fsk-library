import styles from "../styles/BookDisplay.module.css";
import { db } from "../lib/firebase";
import { collection, doc, getDocs } from "firebase/firestore";
import { useState, useEffect, useContext } from "react";
import { async } from "@firebase/util";

const BookDisplay = () => {
  const [books, setBooks] = useState(null);

  // Get the collection of books from firebase
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
          <div className={styles.book_card} key={book.id}>
            <div className={styles.book_photo}></div>
            <div className={styles.book_details}>
              <div>
                <label>Naziv knjige</label>
                <p>{book.name}</p>
              </div>
              <div>
                <label>Pisac</label>
                <p>{book.author}</p>
              </div>
              <div>
                <label>Kolicina</label>
                <p>{book.quantity}</p>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default BookDisplay;
