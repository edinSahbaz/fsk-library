import styles from "./../styles/AuthForm.module.css";
import { useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "./../lib/firebase";
import Link from "next/link";

const AuthForm = ({ setShow }) => {
  const [email, setEmail] = useState("");
  const [passwrod, setPassword] = useState("");
  const [error, setError] = useState("");
  const [method, setMethod] = useState("login");

  const register = () => {
    setError("");

    createUserWithEmailAndPassword(auth, email, passwrod)
      .then((res) => console.log(res.user))
      .catch((err) => setError(err));

    setEmail("");
    setPassword("");
  };

  const login = () => {
    signInWithEmailAndPassword(auth, email, passwrod);
  };

  useEffect(() => {
    if (error) {
      alert(error);
    }
  }, [error]);

  return (
    <div
      className={`${styles.shadow} animate__animated animate__fadeIn animate__faster`}
      onClick={() => setShow(false)}
    >
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        {method === "login" ? <h2>Prijavi se</h2> : <h2>Registruj se</h2>}

        <input
          className={styles.inputs}
          type="email"
          placeholder="Službena @fsk.unsa.ba email adresa"
        />
        {method === "register" && (
          <input
            className={styles.inputs}
            type="text"
            placeholder="Broj indeksa"
          />
        )}
        <input
          className={styles.inputs}
          type="password"
          placeholder="Lozinka"
        />
        {method === "register" && (
          <input
            className={styles.inputs}
            type="password"
            placeholder="Potvrda lozinke"
          />
        )}
        <button onClick={login}>Prijavi se</button>
        {method === "register" && (
          <button onClick={register}>Registruj se</button>
        )}
        {method === "login" && (
          <p className={styles.prompt}>
            Nemaš korisnički račun?
            <span className={styles.link}> Registruj se!</span>
          </p>
        )}
        {method === "register" && (
          <p className={styles.prompt}>
            Već imaš korisnički račun?
            <span className={styles.link}> Prijavi se!</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
