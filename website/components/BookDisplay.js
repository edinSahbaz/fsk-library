import styles from "../styles/BookDisplay.module.css";
import Link from "next/link";
import Image from "next/image";

import { useBooks } from "./Layout";

const BookDisplay = () => {
  const { books } = useBooks();

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
                  src={book.imgUrl ? book.imgUrl : "/TempBookImage.jpg"}
                  width="250px"
                  alt="img"
                  height="240px"
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
