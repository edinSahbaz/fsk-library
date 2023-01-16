import { useRouter } from "next/router";
import { useState, useEffect, cloneElement } from "react";
import styles from "../../styles/BookDetails.module.css";
import { db, storage } from "../../lib/firebase";
import {
  collection,
  doc,
  getDoc,
  addDoc,
  Timestamp,
  updateDoc,
  query,
  where,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import Image from "next/image";

import { useUser } from "../../components/Layout";
import { toast } from "react-hot-toast";
import ImageModal from "../../components/ImageModal";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const BookDetails = () => {
  const router = useRouter();
  const { bookId } = router.query;
  const [book, setBook] = useState(null);
  const { userDB } = useUser();
  const userId = userDB.email;
  const [canEdit, setCanEdit] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);
  const [showImgModal, setShowImgModal] = useState(false);

  // Book data
  const [name, setName] = useState(null);
  const [quantity, setQuantity] = useState(null);
  const [author, setAuthor] = useState(null);
  const [aboutBook, setAboutBook] = useState(null);
  const [ISBN, setISBN] = useState(null);
  const [numberOfPages, setNumberOfPages] = useState(null);
  const [publisher, setPublisher] = useState(null);
  const [aboutAuthor, setAboutAuthor] = useState(null);

  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  // Get the current book
  useEffect(() => {
    const bookRef = doc(db, "books", bookId);

    const unsub = onSnapshot(bookRef, (bookSnapshot) => {
      if (bookSnapshot.exists()) {
        setBook(bookSnapshot.data());
        const data = bookSnapshot.data();

        if (data.name) setName(data.name);
        if (data.quantity) setQuantity(data.quantity);
        if (data.image) setImageName(data.image);
        if (data.author) setAuthor(data.author);
        if (data.aboutBook) setAboutBook(data.aboutBook);
        if (data.ISBN) setISBN(data.ISBN);
        if (data.numberOfPages) setNumberOfPages(data.numberOfPages);
        if (data.publisher) setPublisher(data.publisher);
        if (data.aboutAuthor) setAboutAuthor(data.aboutAuthor);
      } else {
        alert("Knjiga ne postoji!");
      }
    });

    return () => {
      unsub();
    };
  }, []);

  useEffect(() => {
    // Checks if user can edit book
    if (userId !== "biblioteka@fsk.unsa.ba") return;

    setCanEdit(true);
  }, []);

  //Send the current book to bookRequests
  const requestBook = () => {
    (async () => {
      if (book.quantity < 1 || typeof book.quantity !== "number") {
        toast.error("Knjiga nije dostupna!");
        return;
      }

      // Check if already requested
      const bookRequestsRef = collection(db, "bookRequests");
      const reqQ = query(
        bookRequestsRef,
        where("userId", "==", userId),
        where("bookId", "==", bookId)
      );

      const reqData = await getDocs(reqQ);
      if (reqData.docs[0]?.exists()) {
        toast.error("Zathejv za knjigu već postoji!");
        return;
      }

      // Check if already leased
      const leasedBooksRef = collection(db, "leasedBooks");
      const leasedQ = query(
        leasedBooksRef,
        where("userId", "==", userId),
        where("bookId", "==", bookId)
      );

      const leasedData = await getDocs(leasedQ);
      if (leasedData.docs[0]?.exists()) {
        toast.error("Knjiga već izdata!");
        return;
      }

      addDoc(bookRequestsRef, {
        bookId,
        userId,
        addedTime: Timestamp.now(),
      })
        .then(() => {
          toast.success("Zathejv za knjigu poslan!");
        })
        .catch((error) => {
          toast.error(error.message);
        });
    })();
  };

  const updateBook = () => {
    const bookRef = doc(db, "books", bookId);
    const loading = updateDoc(bookRef, {
      name,
      author,
      publisher,
      quantity: Number(quantity),
      image: imageName,
      aboutAuthor,
      ISBN,
      numberOfPages: Number(numberOfPages),
      aboutBook,
    });

    if (image)
      toast.promise(loading, {
        loading: "Spremanje promjena...",
        success: "Spremanje promjena...",
        error: "Spremanje promjena...",
      });
  };

  useEffect(() => {
    if (!canEdit) return;
    if (firstLoad) {
      setFirstLoad(false);
      return;
    }

    const temp = setTimeout(updateBook, 500);

    return () => {
      clearTimeout(temp);
    };
  }, [
    name,
    imageName,
    publisher,
    quantity,
    author,
    aboutAuthor,
    aboutBook,
    ISBN,
    numberOfPages,
  ]);

  useEffect(() => {
    // Upload img
    if (!image) return;

    const bookImgRef = ref(storage, `books/${bookId}/${image.name}`);
    uploadBytes(bookImgRef, image).then(() => setImageName(image.name));
  }, [image]);

  useEffect(() => {
    // Get img link
    if (!imageName) return;

    const bookImgRef = ref(storage, `books/${bookId}/${imageName}`);
    getDownloadURL(bookImgRef).then((url) => setImageUrl(url));
  }, [imageName]);

  return (
    <>
      {book ? (
        <div className={styles.root_div}>
          {showImgModal && (
            <ImageModal
              image={image}
              setImage={setImage}
              setShowImgModal={setShowImgModal}
            />
          )}

          <div className={styles.top_div}>
            <div className={styles.left_div}>
              <Image
                className={styles.book_image}
                src={imageUrl ? imageUrl : "/TempBookImage.jpg"}
                width="250px"
                height="240px"
                objectFit="contain"
                alt="slika"
                onClick={() => setShowImgModal(true)}
              ></Image>
            </div>
            <div className={styles.right_div}>
              <div className={styles.title_div}>
                <label>Naziv knjige</label>
                <span className="inputContainer">
                  {canEdit ? (
                    <textarea
                      disabled={!canEdit}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      type="text"
                      className="controlledInput large"
                    />
                  ) : (
                    <span className={styles.text_area}>
                      <textarea
                        disabled={!canEdit}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        type="text"
                        className="controlledInput large"
                      />
                    </span>
                  )}
                </span>
              </div>

              <div className={styles.author_div}>
                <label>Pisac</label>
                <span className="inputContainer">
                  <input
                    disabled={!canEdit}
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    type="text"
                    className="controlledInput normal"
                  />
                </span>
              </div>

              <div className={styles.line}></div>
              <p className={styles.about_book}>
                <span className="inputContainer">
                  {canEdit ? (
                    <textarea
                      disabled={!canEdit}
                      value={aboutBook}
                      onChange={(e) => setAboutBook(e.target.value)}
                      type="text"
                      className="controlledInput normal"
                    />
                  ) : (
                    <span className={styles.text_area}>
                      <textarea
                        disabled={!canEdit}
                        value={aboutBook}
                        onChange={(e) => setAboutBook(e.target.value)}
                        type="text"
                        className="controlledInput normal"
                      />
                    </span>
                  )}
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
                      onChange={(e) => setQuantity(e.target.value)}
                      type="number"
                      className="controlledInput normal"
                    />
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
              <p>
                Broj stranica:
                <span className="inputContainer">
                  <input
                    disabled={!canEdit}
                    value={numberOfPages}
                    type="number"
                    onChange={(e) => setNumberOfPages(e.target.value)}
                    className="controlledInput normal"
                  />
                </span>
              </p>
              <p>
                ISBN:
                <span className="inputContainer">
                  <input
                    disabled={!canEdit}
                    value={ISBN}
                    type="text"
                    onChange={(e) => setISBN(e.target.value)}
                    className="controlledInput normal"
                  />
                </span>
              </p>
              <p>
                Izdavač:
                <span className="inputContainer">
                  <input
                    disabled={!canEdit}
                    value={publisher}
                    onChange={(e) => setPublisher(e.target.value)}
                    type="text"
                    className="controlledInput normal"
                  />
                </span>
              </p>
            </div>
            <div className={styles.about_author_div}>
              <h4>O Piscu</h4>
              <span className="inputContainer">
                {canEdit ? (
                  <textarea
                    disabled={!canEdit}
                    value={aboutAuthor}
                    type="text"
                    onChange={(e) => setAboutAuthor(e.target.value)}
                    className="controlledInput normal"
                  />
                ) : (
                  <span className={styles.text_area}>
                    <textarea
                      disabled={!canEdit}
                      value={aboutAuthor}
                      type="text"
                      onChange={(e) => setAboutAuthor(e.target.value)}
                      className="controlledInput normal"
                    />
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default BookDetails;
