import styles from "../styles/BookDisplay.module.css";
import Link from "next/link";
import Image from "next/image";
import { useBooks } from "./Layout";
import { useEffect, useState } from "react";
import { storage } from "../lib/firebase";
import { getDownloadURL, ref } from "firebase/storage";

const BookDisplay = () => {
  const { books } = useBooks();
  const [bookImgs, setBookImgs] = useState({});

  useEffect(() => {
    if (!books) return;

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
    console.log(temp);

    return () => {};
  }, [books]);

  return (
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
  );
};

export default BookDisplay;
