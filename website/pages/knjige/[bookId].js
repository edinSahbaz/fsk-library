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
  const [canEdit, setCanEdit] = useState(false);

  // Book data
  const [name, setName] = useState(null);
  const [quantity, setQuantity] = useState(null);
  const [image, setImage] = useState(null);
  const [author, setAuthor] = useState(null);
  const [aboutBook, setAboutBook] = useState(null);
  const [ISBN, setISBN] = useState(null);
  const [numberOfPages, setNumberOfPages] = useState(null);
  const [publisher, setPublisher] = useState(null);
  const [aboutAuthor, setAboutAuthor] = useState(null);

  // Get the current book
  useEffect(() => {
    const bookRef = doc(db, "books", bookId);

    const unsub = onSnapshot(bookRef, bookSnapshot => {
      if (bookSnapshot.exists()) {
        setBook(bookSnapshot.data());
        const data = bookSnapshot.data();

        if (data.name) setName(data.name);
        if (data.quantity) setQuantity(data.quantity);
        if (data.image) setImage(data.image);
        if (data.author) setAuthor(data.author);
        if (data.aboutBook) setAboutBook(data.aboutBook);
        if (data.ISBN) setISBN(data.ISBN);
        if (data.numberOfPages) setNumberOfPages(data.numberOfPages);
        if (data.publisher) setPublisher(data.publisher);
        if (data.aboutAuthor) setAboutAuthor(data.aboutAuthor);

      } else {
        alert("Knjiga ne postoji!");
      }
    })

    return () => {
      unsub();
    }
  }, []);

  useEffect(() => { // Checks if user can edit book
    if(userId !== 'biblioteka@fsk.unsa.ba') return;

    setCanEdit(true);
  }, [])

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

  const updateBook = () => {
    const bookRef = doc(db, 'books', bookId);
    const loading = updateDoc(bookRef, {
      name,
      author,
      publisher,
      quantity,
      image,
      aboutAuthor,
      ISBN,
      numberOfPages,
      aboutBook
    });

    toast.promise(loading, {
      loading: "Spremanje promjena...",
      success: "Spremanje promjena...",
      error: "Spremanje promjena..."
    })
  }

  useEffect(() => {
    if(!canEdit) return;
    
    const temp = setTimeout(updateBook, 500);

    return () => {
      clearTimeout(temp);
    }
  }, [name, publisher, quantity, image, author, aboutAuthor, aboutBook, ISBN, numberOfPages])

  return (
    <>
      {
        book ? (
          <div className={styles.root_div}>
            <div className={styles.top_div}>
              <div className={styles.left_div}>
                <Image
                  className={styles.book_image}
                  src={book.image ? book.image : '/TempBookImage.jpg'}
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
                    <input 
                    disabled={!canEdit} 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    type='text' 
                    className='controlledInput large'/>
                  </span>
                </div>

                <div className={styles.author_div}>
                  <label>Pisac</label>
                  <span className="inputContainer">
                    <input 
                    disabled={!canEdit} 
                    value={author}
                    onChange={e => setAuthor(e.target.value)} 
                    type='text' 
                    className='controlledInput normal'/>
                  </span>
                </div>

                <div className={styles.line}></div>
                <p className={styles.about_book}>
                  <span className="inputContainer">
                    <input 
                    disabled={!canEdit} 
                    value={aboutBook}
                    onChange={e => setAboutBook(e.target.value)} 
                    type='text' 
                    className='controlledInput normal'/>
                  </span>
                </p>
                
                <div className={styles.line}></div>

                <div className={styles.quantity_div}>
                  <div className={styles.quantity_text}>
                    <label>Kolicina</label>
                    <span className="inputContainer">
                      <input 
                      disabled={!canEdit} 
                      value={quantity} 
                      onChange={e => setQuantity(e.target.value)} 
                      type='number' 
                      className='controlledInput normal'/>
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
                    <input disabled={!canEdit} value={book.numberOfPages} type='number' className='controlledInput normal'/>
                  </span>
                </p>
                <p>ISBN: 
                  <span className="inputContainer">
                    <input disabled={!canEdit} value={book.ISBN} type='text' className='controlledInput normal'/>
                  </span>
                </p>
                <p>Izdavač: 
                  <span className="inputContainer">
                    <input disabled={!canEdit} value={book.publisher} type='text' className='controlledInput normal'/>
                  </span>
                </p>
              </div>
              <div className={styles.about_author_div}>
                <h4>O Piscu</h4>
                <span className="inputContainer">
                  <input disabled={!canEdit} value={book.aboutAuthor} type='text' className='controlledInput normal'/>
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
