import { useState } from "react";
import styles from "./../../styles/AddBook.module.css";
import { addDoc, collection } from "firebase/firestore";
import { db } from "./../../lib/firebase";
import toast from "react-hot-toast";

const AddBook = () => {
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [aboutBook, setAboutBook] = useState("");
  const [aboutAuthor, setAboutAuthor] = useState("");
  const [pages, setPages] = useState(0);
  const [publisher, setPublisher] = useState("");
  const [ISBN, setISBN] = useState("");
  const [quantity, setQuantity] = useState(0);

  const addBook = () => {
    const booksRef = collection(db, "books");

    const data = {
      name,
      author,
      aboutBook,
      aboutAuthor,
      pages,
      publisher,
      ISBN,
      quantity,
    };

    const loading = addDoc(booksRef, data).then(() => setShowModal(false));

    toast.promise(loading, {
      loading: "Dodavanje knjige...",
      success: "Knjiga uspješno dodana!",
      error: "Greška...",
    });
  };

  return (
    <div
      className={`${styles.form} ${styles.main}`}
      onClick={(e) => e.stopPropagation()}
    >
      <h2>Dodaj knjigu</h2>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        type="text"
        placeholder="Naziv knjige"
      />
      <input
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        type="text"
        placeholder="Autor knjige"
      />
      <textarea
        value={aboutBook}
        onChange={(e) => setAboutBook(e.target.value)}
        placeholder="O knjizi"
      />
      <textarea
        value={aboutAuthor}
        onChange={(e) => setAboutAuthor(e.target.value)}
        placeholder="O Autoru"
      />
      <p>Slika:</p>
      <input type="file" />

      <input
        value={pages}
        onChange={(e) => setPages(e.target.value)}
        type="number"
        placeholder="Broj stranica"
      />
      <input
        value={publisher}
        onChange={(e) => setPublisher(e.target.value)}
        type="text"
        placeholder="Izdavač"
      />
      <input
        value={ISBN}
        onChange={(e) => setISBN(e.target.value)}
        type="text"
        placeholder="ISBN"
      />
      <input
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        type="number"
        placeholder="Količina"
      />

      <div>
        <button onClick={addBook}>Dodaj knjigu</button>
        <button onClick={() => setShowModal(false)}>Odustani</button>
      </div>
    </div>
  );
};

export default AddBook;
