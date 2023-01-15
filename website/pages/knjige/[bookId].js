import { useRouter } from "next/router";
import { useState, useEffect, cloneElement } from "react";
import styles from "../../styles/BookDetails.module.css";
import { db } from "../../lib/firebase";
import { collection, doc, getDoc, addDoc, Timestamp, updateDoc, query, where, getDocs, onSnapshot } from "firebase/firestore";
import Image from "next/image";

import { useUser } from "../../components/Layout";
import { toast } from "react-hot-toast";

const BookDetails = () => {
  const router = useRouter();
  const { bookId } = router.query;
  const [book, setBook] = useState(null);
  const { userDB } = useUser();
  const userId = userDB.email;

  // Get the current book
  useEffect(() => {
    const bookRef = doc(db, "books", bookId);

    const unsub = onSnapshot(bookRef, bookSnapshot => {
      if (bookSnapshot.exists()) {
        setBook(bookSnapshot.data());
      } else {
        alert("Knjiga ne postoji!");
      }
    })

    return () => {
      unsub();
    }
  }, []);

  //Send the current book to bookRequests
  const requestBook = () => {
    (async () => {
      if(book.quantity < 1 || typeof book.quantity !== 'number') {
        toast.error("Knjiga nije dostupna!");
        return;
      }

      // Check if already requested
      const bookRequestsRef = collection(db, "bookRequests");
      const reqQ = query(bookRequestsRef, where('userId', '==', userId), where('bookId', '==', bookId));

      const reqData = await getDocs(reqQ);
      if(reqData.docs[0]?.exists()) {
        toast.error("Zathejv za knjigu već postoji!");
        return;
      }

      // Check if already leased
      const leasedBooksRef = collection(db, "leasedBooks");
      const leasedQ = query(leasedBooksRef, where('userId', '==', userId), where('bookId', '==', bookId));

      const leasedData = await getDocs(leasedQ);
      if(leasedData.docs[0]?.exists()) {
        toast.error("Knjiga već izdata!");
        return;
      }

      addDoc(bookRequestsRef, {
        bookId,
        userId,
        addedTime: Timestamp.now(),
      }).then(() => {
        toast.success("Zathejv za knjigu poslan!");
      }).catch((error) => {
        toast.error(error.message);
      });
    })();
  };

  return (
    <>
      {
        book ? (
          <div className={styles.root_div}>
            <div className={styles.top_div}>
              <div className={styles.left_div}>
                <Image
                  className={styles.book_image}
                  src="/TempBookImage.jpg"
                  width="250px"
                  height="240px"
                  objectFit="contain"
                  alt="slika"
                ></Image>
              </div>
              <div className={styles.right_div}>
                <div className={styles.title_div}>
                  <label>Naziv knjige</label>
                  <span className="inputContainer">
                    <input value={book.name} type='text' className='controlledInput large'/>
                  </span>
                </div>

                <div className={styles.author_div}>
                  <label>Pisac</label>
                  <span className="inputContainer">
                    <input value={book.author} type='text' className='controlledInput normal'/>
                  </span>
                </div>

                <div className={styles.line}></div>
                <p className={styles.about_book}>
                  <span className="inputContainer">
                    <input value={book.aboutBook} type='text' className='controlledInput normal'/>
                  </span>
                </p>
                
                <div className={styles.line}></div>

                <div className={styles.quantity_div}>
                  <div className={styles.quantity_text}>
                    <label>Kolicina</label>
                    <span className="inputContainer">
                      <input value={book.quantity} type='number' className='controlledInput normal'/>
                    </span>
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
                <p>Broj stranica: 
                  <span className="inputContainer">
                    <input value={book.numberOfPages} type='number' className='controlledInput normal'/>
                  </span>
                </p>
                <p>ISBN: 
                  <span className="inputContainer">
                    <input value={book.ISBN} type='text' className='controlledInput normal'/>
                  </span>
                </p>
                <p>Izdavač: 
                  <span className="inputContainer">
                    <input value={book.publisher} type='text' className='controlledInput normal'/>
                  </span>
                </p>
              </div>
              <div className={styles.about_author_div}>
                <h4>O Piscu</h4>
                <span className="inputContainer">
                  <input value={book.aboutAuthor} type='text' className='controlledInput normal'/>
                </span>
              </div>
            </div>
          </div>
        ) : null
      }
    </>
  );
};

export default BookDetails;
