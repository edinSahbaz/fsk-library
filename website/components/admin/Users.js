import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import styles from "../../styles/Users.module.css";
import Image from "next/image";
import React from "react";

const Users = () => {
  const [users, setUsers] = useState([]);
  //This copy allways has original requests
  const [usersCopy, setUsersCopy] = useState([]);
  const [numberOfUsersToShow, setnumberOfUsersToShow] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [numberOfPages, setNumberOfPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const usersRef = collection(db, "users");

    const unsub = onSnapshot(usersRef, (colSnap) => {
      const temp = [];
      colSnap.forEach((user) => {
        const data = user.data();
        data.email = user.id;

        if (user.id !== "biblioteka@fsk.unsa.ba") temp.push(data);
      });
      setUsers(temp);
      setUsersCopy(temp);
      setNumberOfPages(Math.ceil(temp.length / numberOfUsersToShow));
    });

    return () => {
      unsub();
    };
  }, []);

  //
  //
  //
  //
  //
  // makes the body not scrollable if the mouse is ona div
  // that is scrollable.
  const ref = React.useRef(null);
  useEffect(() => {
    const handleMouseOver = () => {
      const divHeight = ref.current.getBoundingClientRect().height;
      if (divHeight < ref.current.scrollHeight) {
        document.body.style.overflow = "hidden";
      }
    };

    const handleMouseOut = () => {
      document.body.style.overflow = "auto";
    };

    ref.current.addEventListener("mouseover", handleMouseOver);
    ref.current.addEventListener("mouseout", handleMouseOut);
    return () => {
      if (ref.current) {
        ref.current.removeEventListener("mouseover", handleMouseOver);
        ref.current.removeEventListener("mouseout", handleMouseOut);
      }
    };
  }, []);

  const resetShowingRequests = () => {
    const startIndex = (currentPage - 1) * numberOfUsersToShow;
    const endIndex = startIndex + numberOfUsersToShow;
    const displayedRequests = usersCopy.slice(startIndex, endIndex);
    setUsers(displayedRequests);
  };

  const goToFirstPage = () => {
    setCurrentPage(1);
    resetShowingRequests();
  };

  const goToLastPage = () => {
    setCurrentPage(numberOfPages);
    resetShowingRequests();
  };

  useEffect(() => {
    resetShowingRequests();
  }, [numberOfUsersToShow, usersCopy]);

  const increasePageNumber = () => {
    if (currentPage !== numberOfPages) {
      setCurrentPage(++currentPage);
      const startIndex = (currentPage - 1) * numberOfUsersToShow;
      const endIndex = startIndex + numberOfUsersToShow;
      const displayedRequests = usersCopy.slice(startIndex, endIndex);
      setUsers(displayedRequests);
    }
  };

  const decreasePageNumber = () => {
    if (currentPage >= 2) {
      setCurrentPage(--currentPage);
      const startIndex = (currentPage - 1) * numberOfUsersToShow;
      const endIndex = startIndex + numberOfUsersToShow;
      const displayedRequests = usersCopy.slice(startIndex, endIndex);
      setUsers(displayedRequests);
    }
  };

  useEffect(() => {
    setNumberOfPages(Math.ceil(usersCopy.length / numberOfUsersToShow));
  }, [numberOfUsersToShow]);

  useEffect(() => {
    console.log(searchTerm.length);
    if (searchTerm.length > 0) {
      const searchedUsers = usersCopy.filter((o) => {
        const name = o.name + " " + o.surname;
        return name.toLowerCase().includes(searchTerm);
      });
      setUsers(searchedUsers);
      console.log(searchedUsers);
    } else {
      resetShowingRequests();
    }
  }, [searchTerm]);

  return (
    <div ref={ref} className={styles.main}>
      <h2>Članovi</h2>
      <div className={styles.topDiv}>
        <div className={styles.numberOfRequestsDiv}>
          <p>Prikazi</p>
          <select
            defaultValue="5"
            onChange={(e) => setnumberOfUsersToShow(parseInt(e.target.value))}
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="10">10</option>
          </select>{" "}
          <p>zahtjeva</p>
        </div>
        <div className={styles.searchBarDiv}>
          <input
            type="text"
            placeholder="Pretrazi studente..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className={styles.btn_search}>
            <Image
              className={styles.search_icon}
              alt="search"
              width="20px"
              height="20px"
              src="/Search.png"
            />
          </button>
        </div>
      </div>
      <div>
        <table className={styles.table} id="books">
          <thead>
            <tr>
              <th className={styles.th}>Ime i Prezime Studenta</th>
              <th className={styles.th}>Broj Indexa</th>
              <th className={styles.th}>Email</th>
            </tr>
          </thead>
          <tbody>
            {usersCopy &&
              users.map((user) => (
                <tr key={user.index}>
                  <td className={`${styles.td}`}>
                    {user.name} {user.surname}
                  </td>
                  <td className={`${styles.td}`}>{user.index}</td>
                  <td className={`${styles.td}`}>{user.email}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className={styles.bottomDiv}>
        <div className={styles.numberOfPagesDetails}>
          <p>
            Prikazano{" "}
            {currentPage * numberOfUsersToShow - numberOfUsersToShow + 1} do{" "}
            {currentPage * numberOfUsersToShow <= usersCopy.length
              ? currentPage * numberOfUsersToShow
              : usersCopy.length}{" "}
            od {usersCopy.length} clana.
          </p>
        </div>
        <div className={styles.pageButtons}>
          <button onClick={goToFirstPage}>Prva</button>
          <button onClick={decreasePageNumber}>Prethodna</button>
          <p>{currentPage}</p>
          <button onClick={increasePageNumber}>Sljedeca</button>
          <button onClick={goToLastPage}>Zadnja</button>
        </div>
      </div>
    </div>
  );
};

export default Users;
