import styles from "./../styles/AuthForm.module.css";
import { useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../lib/firebase";
import Link from "next/link";
import Image from "next/image";
import { doc, setDoc } from "firebase/firestore";

const AuthForm = () => {
  const [currentYear, setCurrentYear] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [index, setIndex] = useState("");
  const [passwrod, setPassword] = useState("");
  const [confirmPasswrod, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [method, setMethod] = useState("login");

  const register = () => {
    if (
      name.length < 1 ||
      surname.length < 1 ||
      email.length < 1 ||
      index.length < 1 ||
      passwrod.length < 1
    ) {
      alert("Popunite sva polja!");
      return;
    }

    if (passwrod !== confirmPasswrod) return;

    var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@fsk.unsa.ba$/;
    if (!email.match(validRegex)) {
      alert("Koristite službenu @fsk.unsa.ba email adresu!");
      return;
    }

    setError("");

    createUserWithEmailAndPassword(auth, email, passwrod)
      .then((res) => console.log(res.user))
      .catch((err) => setError(err));

    const userData = { name, surname, index };

    const userDoc = doc(db, "users", email);
    setDoc(userDoc, userData);
  };

  const login = () => {
    signInWithEmailAndPassword(auth, email, passwrod)
      .then((res) => console.log(res.user))
      .catch((err) => setError(err));
  };

  useEffect(() => {
    if (error) {
      alert(error);
    }
  }, [error]);

  useEffect(() => {
    const year = new Date().getFullYear();
    setCurrentYear(year);
  }, []);

  useEffect(() => {
    if (passwrod !== confirmPasswrod) {
    }
  }, [passwrod, confirmPasswrod]);

  return (
    <>
      <div className={`${styles.main} animate__animated animate__slideInDown`}>
        <div className={`${styles.container}`}>
          <h1 className={`${styles.title}`}>FSK - eBiblioteka</h1>
          <div>
            <h2 className={styles.subtitle}>Dobrodošli</h2>
            <p>
              Dobrodošli na website biblioteke{" "}
              <strong>Fakulteta za saobraćaj i komunikacije</strong>.
              <br />
              Unesite svoje podatke da bi ste nastavili dalje.
            </p>
            <p className={styles.notice}>
              NAPOMENA: Potrebno je koristiti službenu email adresu fakulteta!
            </p>
          </div>

          <div>
            {method === "login" ? (
              <h2 className={styles.subtitle}>Prijavi se</h2>
            ) : (
              <h2 className={styles.subtitle}>Registruj se</h2>
            )}
            {method === "login" ? (
              <p className={styles.prompt}>
                Nemaš korisnički račun?{" "}
                <span
                  className={styles.link}
                  onClick={() => setMethod("register")}
                >
                  Registruj se!
                </span>
              </p>
            ) : (
              <p className={styles.prompt}>
                Već imaš korisnički račun?{" "}
                <span
                  className={styles.link}
                  onClick={() => setMethod("login")}
                >
                  Prijavi se!
                </span>
              </p>
            )}
          </div>

          <form
            className={styles.authForm}
            onSubmit={(e) => e.preventDefault()}
          >
            {method === "register" && (
              <div className={styles.nameSurname}>
                <input
                  required
                  className={styles.inputs}
                  type="text"
                  placeholder="Ime"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  required
                  className={styles.inputs}
                  type="text"
                  placeholder="Prezime"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                />
              </div>
            )}

            <input
              required
              className={styles.inputs}
              type="email"
              placeholder="Službena @fsk.unsa.ba email adresa"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {method === "register" && (
              <input
                required
                className={styles.inputs}
                type="text"
                placeholder="Broj indeksa"
                value={index}
                onChange={(e) => setIndex(e.target.value)}
              />
            )}
            <input
              required
              className={styles.inputs}
              type="password"
              placeholder="Lozinka"
              value={passwrod}
              onChange={(e) => setPassword(e.target.value)}
            />
            {method === "register" && (
              <>
                <input
                  required
                  className={styles.inputs}
                  type="password"
                  placeholder="Potvrda lozinke"
                  value={confirmPasswrod}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {passwrod !== confirmPasswrod && (
                  <p className={styles.passwords}>Lozinke se ne podudaraju!</p>
                )}
              </>
            )}
            {method === "login" ? (
              <button className={styles.btn} onClick={login}>
                Prijavi se
              </button>
            ) : (
              <button className={styles.btn} onClick={register}>
                Registruj se
              </button>
            )}
          </form>
        </div>

        <div className={`${styles.container}`}>
          <div className={styles.imageContainer}>
            <Image
              className="animate__animated animate__pulse animate__infinite animate__slower"
              src="/Logo.png"
              alt="logo"
              width="340"
              height="300"
            />
          </div>
        </div>
      </div>

      <p className={`${styles.copyright} animate__animated animate__slideInUp`}>
        © Fakultet za saobraćaj i komunikacije UNSA {currentYear}
      </p>
    </>
  );
};

export default AuthForm;
