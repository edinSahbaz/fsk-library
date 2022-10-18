import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import styles from "../../styles/BookDetails.module.css";
import { db } from "../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
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
        alert("Book not found!");
      }
    })();
  }, []);

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
          <p className={styles.about_book}>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Fugiat
            impedit maxime rerum, ab eum consequatur illo assumenda natus. Animi
            quas consequuntur eligendi dolores possimus corporis iure iste quis
            laudantium voluptatum.
          </p>
          <div className={styles.line}></div>

          <div className={styles.quantity_div}>
            <div className={styles.quantity_text}>
              <label>Kolicina</label>
              <p>{book && book.quantity}</p>
            </div>
            <div className={styles.btn_reserve_book_div}>
              <button>Posudi knjigu</button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.bottom_div}>
        <div className={styles.about_book_div}>
          <h4>O Knjizi: {}</h4>
          <p>Broj stranica: {}</p>
          <p>Izdavač: {}</p>
          <p>ISBN: {}</p>
        </div>
        <div className={styles.about_author_div}>
          <h4>O Piscu</h4>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore et
            laboriosam consectetur voluptates ut dolorem eaque dolor, amet est
            accusamus! Magnam veniam magni at quod ab ratione harum adipisci
            tenetur.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
