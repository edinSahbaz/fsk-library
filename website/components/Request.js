import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { db } from "../lib/firebase";
import { useBooks } from "./Layout";

const Request = ({ bookId, userId, id }) => {
  const { books } = useBooks();
  const [user, setUser] = useState("");
  const [bookName, setBookName] = useState("");
  const [bookQuantity, setBookQuantity] = useState(0);

  const getUserName = async () => {
    const ref = doc(db, 'users', userId);
    const res = await getDoc(ref);

    if(!res.exists()) return;
    const {name, surname} = res.data();
    if(name && surname) setUser(`${name} ${surname}`);
  }

  useEffect(() => {
    getUserName();
  }, [])

  useEffect(() => {
    const book = books.filter((book) => book.id == bookId)[0];
    setBookName(book.name);
    setBookQuantity(book.quantity);
  }, []);

  const confirmLease = () => {
    const leasesRef = collection(db, "leasedBooks");
    const reqRef = doc(db, "bookRequests", id);

    const loading = addDoc(leasesRef, {
      bookId,
      userId,
      addedTime: Timestamp.now(),
    }).then(() => {
      if (bookQuantity > 0) {
        updateDoc(doc(db, "books", bookId), {
          quantity: bookQuantity - 1
        });
      } else {
        toast.error(`Knjiga ${bookName} nije dostupna!`)
      }
      
      deleteDoc(reqRef);
    });

    toast.promise(loading, {
      loading: "Odobravanje zahtjeva...",
      success: "Zahtjev uspješno odobren!",
      error: "Greška...",
    });
  };

  return (
    <div>
      <label>
        {user} ({userId}) - {bookName}
        <button onClick={confirmLease}>Odobri</button>
      </label>
    </div>
  );
};

export default Request;
