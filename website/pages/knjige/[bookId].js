import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import styles from "../../styles/BookDetails.module.css";

import { db } from "../../lib/firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";

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
      <div className={styles.left_div}></div>
      <div className={styles.right_div}></div>
    </div>
  );
};

export default BookDetails;
