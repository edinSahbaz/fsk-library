import Navbar from "./Navbar";
import Footer from "./Footer";
import AuthForm from "./AuthForm";
import { authContext } from "./../lib/context/AuthContext";
import { useState, useEffect, useContext, createContext } from "react";
import { onAuthStateChanged, sendEmailVerification } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { doc, getDoc, collection, limit, query, onSnapshot } from "firebase/firestore";
import Preloader from "./Preloader";
import { toast, Toaster } from "react-hot-toast";

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
    const booksCollRef = collection(db, "books");
    const q = query(booksCollRef, limit(10))

    let temp = []
    const unsub = onSnapshot(q, qSnap => {
      qSnap.forEach(book => {
        const data = book.data();
        data.id = book.id;

        temp.push(data);
      })
    })

    setBooks(temp);

    return () => {
      unsub();
    }
  }, []);

  useEffect(() => {
    if (userDB === null) return;
    setLoading(false);
  }, [userDB]);

  const sendReq = () => {
    if(!user) return;

    toast.success("Zahtjev poslan!");
    sendEmailVerification(user);
  }

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
                  {
                    user.emailVerified ? (
                      <>
                        <Navbar />
                        <Toaster position="top-right" />
                        {children}
                        <Footer />
                      </>
                    ) : (
                      <>
                        <Navbar />
                        <Toaster position="top-right" />
                        <div className="unauthorized">
                          <h2>Potvrdite svoju email adresu!</h2>
                          <p>Ukoliko ne vidite email za potvrdu adrese, provjerite spam ili <span onClick={sendReq} className="linkAuth">pošaljite zahtjev ponovo.</span></p>
                        </div>
                        <Footer />
                      </>
                    )
                  }
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
