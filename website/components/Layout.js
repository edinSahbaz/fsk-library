import Navbar from "./Navbar";
import Footer from "./Footer";
import AuthForm from "./AuthForm";
import { authContext } from "./../lib/context/AuthContext";
import { useState, useEffect, useContext } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

const Layout = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userDB, setUserDB] = useState(null);

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

  useEffect(() => {
    if (userDB === null) return;
    console.log(userDB);
    setLoading(false);
  }, [userDB]);

  return (
    <>
      <authContext.Provider value={{ user, userDB }}>
        <>
          {!loading && (
            <>
              {!user ? (
                <AuthForm />
              ) : (
                <>
                  <Navbar />
                  {children}
                  <Footer />
                </>
              )}
            </>
          )}
        </>
      </authContext.Provider>
    </>
  );
};

export default Layout;
