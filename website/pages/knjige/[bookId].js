import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import styles from "../../styles/BookDetails.module.css";
import { db } from "../../lib/firebase";
import { collection, doc, getDoc, addDoc } from "firebase/firestore";
import Image from "next/image";

const BookDetails = () => {
  const router = useRouter();
  const { bookId } = router.query;
  const [book, setBook] = useState(null);

  useEffect(() => {
    const userRef = doc(db, "books", bookId);

    (async () => {
      const bookSnapshot = await getDoc(userRef);
      if (bookSnapshot.exists()) {
        setBook(bookSnapshot.data());
      } else {
        alert("Knjiga ne postoji!");
      }
    })();
  }, []);

  const requestBook = () => {
    (async () => {
      const bookRequestsRef = collection(db, "bookRequests");
      addDoc(bookRequestsRef, book).catch((error) => {
        alert("Nemoguce!");
      });
    })();
  };

  return (
    <div className={styles.root_div}>
      <div className={styles.top_div}>
        <div className={styles.left_div}>
          <Image
            className={styles.book_image}
            src="/TempBookImage.jpg"
            width="250px"
            height="240px"
            objectFit="contain"
          ></Image>
        </div>
        <div className={styles.right_div}>
          <div className={styles.title_div}>
            <label>Naziv knjige</label>
            <h2>{book && book.name}</h2>
          </div>

          <div className={styles.author_div}>
            <label>Pisac</label>
            <p>{book && book.author}</p>
          </div>

          <div className={styles.line}></div>
          <p className={styles.about_book}>{book && book.aboutBook}</p>
          <div className={styles.line}></div>

          <div className={styles.quantity_div}>
            <div className={styles.quantity_text}>
              <label>Kolicina</label>
              <p>{book && book.quantity}</p>
            </div>
            <div className={styles.btn_reserve_book_div}>
              <button onClick={requestBook}>Posudi knjigu</button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.bottom_div}>
        <div className={styles.about_book_div}>
          <h4>O Knjizi</h4>
          <p>Broj stranica: {book && book.numberOfPages}</p>
          <p>Izdavač: {book && book.publisher}</p>
          <p>ISBN: {book && book.ISBN}</p>
        </div>
        <div className={styles.about_author_div}>
          <h4>O Piscu</h4>
          <p>{book && book.aboutAuthor}</p>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
