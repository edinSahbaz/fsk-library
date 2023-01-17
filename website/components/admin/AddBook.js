import { useState } from "react";
import styles from "./../../styles/AddBook.module.css";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db, storage } from "./../../lib/firebase";
import toast from "react-hot-toast";
import { ref, uploadBytes } from "firebase/storage";

const AddBook = () => {
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [aboutBook, setAboutBook] = useState("");
  const [aboutAuthor, setAboutAuthor] = useState("");
  const [pages, setPages] = useState(0);
  const [publisher, setPublisher] = useState("");
  const [ISBN, setISBN] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [image, setImage] = useState(null);

  const addBook = () => {
    const booksRef = collection(db, "books");

    const data = {
      name,
      author,
      aboutBook,
      aboutAuthor,
      numberOfPages: Number(pages),
      publisher,
      ISBN,
      quantity: Number(quantity),
    };

    const loading = addDoc(booksRef, data).then((retData) => {
      if(!image) return;

      const storageRef = ref(storage, `books/${retData.id}/${image.name}`)
      uploadBytes(storageRef, image).then(() => {
        const docRef = doc(db, 'books', retData.id);
        updateDoc(docRef, {
          image: image.name
        })
      });
    });

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
        rows={5}
        onChange={(e) => setAboutBook(e.target.value)}
        placeholder="O knjizi"
      />
      <textarea
        value={aboutAuthor}
        rows={2}
        onChange={(e) => setAboutAuthor(e.target.value)}
        placeholder="O Autoru"
      />
      
      <div>
      <p>Slika:</p>
      <input type="file" onChange={e => setImage(e.target.files[0])}/>
      </div>

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
      </div>
    </div>
  );
};

export default AddBook;
