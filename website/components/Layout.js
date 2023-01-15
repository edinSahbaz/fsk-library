import Navbar from "./Navbar";
import Footer from "./Footer";
import AuthForm from "./AuthForm";
import { authContext } from "./../lib/context/AuthContext";
import { useState, useEffect, useContext, createContext } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { doc, getDoc, collection, getDocs, limit, query } from "firebase/firestore";
import Preloader from "./Preloader";
import { Toaster } from "react-hot-toast";

const Context = createContext();

const Layout = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userDB, setUserDB] = useState(null);

  const [books, setBooks] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (userVar) => {
      if (userVar) {
        setLoading(true);
        setUser(userVar);
      } else {
        setLoading(false);
        setUser(null);
        setUserDB(null);
      }
    });
  }, []);

  useEffect(() => {
    if (!user) return;

    const userRef = doc(db, "users", user.email);

    const getUserDBInfo = async () => {
      const userDBinfo = await getDoc(userRef);

      if (userDBinfo.exists()) {
        const { name, surname, index } = userDBinfo.data();
        const email = user.email;

        setUserDB({ name, surname, index, email });
      } else {
        setUserDB(null);
      }
    };

    getUserDBInfo();
  }, [user]);

  // Get the collection of books from firebase
  useEffect(() => {
    (async () => {
      const booksCollRef = collection(db, "books");
      const q = query(booksCollRef, limit(10))
      const bookSnapshots = await getDocs(q);
      const docs = bookSnapshots.docs.map((doc) => {
        const data = doc.data();
        data.id = doc.id;
        return data;
      });
      setBooks(docs);
    })();
  }, []);

  useEffect(() => {
    if (userDB === null) return;
    setLoading(false);
  }, [userDB]);

  // expose to the context
  const exposedToContext = { books };

  return (
    <>
      <authContext.Provider value={{ user, userDB }}>
        <Context.Provider value={exposedToContext}>
          {!loading && (
            <>
              {!user ? (
                <AuthForm />
              ) : (
                <>
                  <Navbar />
                  <Toaster position="top-right" />
                  {children}
                  <Footer />
                </>
              )}
            </>
          )}
          {loading && <Preloader />}
        </Context.Provider>
      </authContext.Provider>
    </>
  );
};

// export useBooks hook
export const useBooks = () => useContext(Context);
export const useUser = () => useContext(authContext);

export default Layout;
