import styles from "../styles/BookDisplay.module.css";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { db, storage } from "../lib/firebase";
import { getDownloadURL, ref } from "firebase/storage";
import { collection, getDocs, limit, onSnapshot, orderBy, query, where } from "firebase/firestore";
import Searchbar from "./Searchbar";

const BookDisplay = () => {
  const [books, setBooks] = useState([]);
  const [bookImgs, setBookImgs] = useState({});
  const [amount, setAmount] = useState(10);
  const [search, setSearch] = useState('');
  const [field, setField] = useState('name');

  useEffect(() => {
    const colRef = collection(db, 'books');
    const booksQ = search.length > 0 ? query(colRef, where(field, '>=', search), where(field, '<', search + '\uf8ff'), limit(amount)) : 
                    query(colRef, orderBy(field), limit(amount));
    
    const unsub = onSnapshot(booksQ, qSnap => {
      let temp = [];
      qSnap.forEach(book => {
        const data = book.data();
        data.id = book.id;

        temp.push(data);
      })
      setBooks(temp);
    })

    return () => {
      unsub();
    }
  }, [amount, search, field])

  useEffect(() => {
    let temp = {};
    books.forEach(async (book) => {
      if (book.image) {
        const imgName = book.image;
        const bookImgRef = ref(storage, `books/${book.id}/${imgName}`);

        const url = await getDownloadURL(bookImgRef);
        setBookImgs((prev) => {
          return { ...prev, [book.id]: url };
        });
      }
    });

    setBookImgs(temp);
    return () => {};
  }, [books]);

  const increment = () => {
    setAmount(prev => prev + 10);
  }

  return (
    <>
      <Searchbar setSearch={setSearch} setField={setField} />
      <div className={styles.main}>
        {books &&
          books.map((book) => (
            <Link href={"/knjige/" + book.id} key={book.id}>
              <div
                className={`${styles.book_card} animate__animated animate__fadeIn animate__faster`}
              >
                <div className={styles.book_photo}>
                  <Image
                    src={
                      bookImgs[book.id] ? bookImgs[book.id] : "/TempBookImage.jpg"
                    }
                    width="250px"
                    alt="img"
                    height="240px"
                    objectFit="contain"
                  ></Image>
                </div>
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
            </Link>
          ))}
      </div>
    </>
  );
};

export default BookDisplay;
