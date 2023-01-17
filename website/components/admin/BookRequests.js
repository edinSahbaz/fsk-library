import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import Request from "../Request";
import styles from "../../styles/BookRequests.module.css";
import Image from "next/image";
//
import React from "react";

const BookRequests = () => {
  const [newestReq, setNewestReq] = useState(false);
  const [requests, setRequest] = useState([]);
  //This copy allways has original requests
  const [requestsCopy, setRequestCopy] = useState([]);
  const [numberOfRequestsToShow, setNumberOfRequestsToShow] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [numberOfPages, setNumberOfPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const reqRef = collection(db, "bookRequests");
    const reqQ = query(reqRef, orderBy("addedTime"));

    const unsubRequests = onSnapshot(reqQ, (colSnap) => {
      const temp = [];
      colSnap.forEach((req) => {
        temp.push({ id: req.id, ...req.data() });
      });

      setRequest(temp);
      setRequestCopy(temp);
      setNumberOfPages(Math.ceil(temp.length / numberOfRequestsToShow));
    });

    return () => {
      unsubRequests();
    };
  }, []);

  const changeSortReq = () => {
    setNewestReq((prev) => !prev);
    let temp = requests.reverse();

    setRequest(temp);
  };

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
    const startIndex = (currentPage - 1) * numberOfRequestsToShow;
    const endIndex = startIndex + numberOfRequestsToShow;
    const displayedRequests = requestsCopy.slice(startIndex, endIndex);
    setRequest(displayedRequests);
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
  }, [numberOfRequestsToShow, requestsCopy]);

  const increasePageNumber = () => {
    if (currentPage !== numberOfPages) {
      setCurrentPage(++currentPage);
      const startIndex = (currentPage - 1) * numberOfRequestsToShow;
      const endIndex = startIndex + numberOfRequestsToShow;
      const displayedRequests = requestsCopy.slice(startIndex, endIndex);
      setRequest(displayedRequests);
    }
  };

  const decreasePageNumber = () => {
    if (currentPage >= 2) {
      setCurrentPage(--currentPage);
      const startIndex = (currentPage - 1) * numberOfRequestsToShow;
      const endIndex = startIndex + numberOfRequestsToShow;
      const displayedRequests = requestsCopy.slice(startIndex, endIndex);
      setRequest(displayedRequests);
    }
  };

  useEffect(() => {
    setNumberOfPages(Math.ceil(requestsCopy.length / numberOfRequestsToShow));
  }, [numberOfRequestsToShow]);

  useEffect(() => {
    console.log(searchTerm.length);
    if (searchTerm.length > 0) {
      const searchedRequests = requestsCopy.filter((o) => {
        return o.userName.toLowerCase().includes(searchTerm);
      });
      setRequest(searchedRequests);
    } else {
      resetShowingRequests();
    }
  }, [searchTerm]);

  return (
    <div ref={ref} className={styles.main}>
      <h2>Zahtjevi za knjige</h2>
      <div className={styles.topDiv}>
        <div className={styles.numberOfRequestsDiv}>
          <p>Prikazi</p>
          <select
            defaultValue="5"
            onChange={(e) =>
              setNumberOfRequestsToShow(parseInt(e.target.value))
            }
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
        {requestsCopy ? (
          <>
            {requestsCopy.length > 0 ? (
              <>
                {/*  */}
                <div>
                  <table className={styles.table} id="books">
                    <thead>
                      <tr>
                        <th className={styles.th}>Ime i Prezime Studenta</th>
                        <th className={`${styles.naziv_knjige} ${styles.th}`}>
                          Naziv Knjige
                        </th>
                        <th className={styles.th}>ISBN</th>
                        <th className={styles.th}>Trenutno Stanje</th>
                        <th
                          className={`${styles.sortable} ${styles.th}`}
                          onClick={changeSortReq}
                        >
                          Datum Zahtjeva
                          <span
                            className={
                              newestReq ? styles.arrow : styles.reversed_arrow
                            }
                          ></span>
                        </th>
                        <th className={styles.th}>Datum Vracanja</th>
                        <th className={styles.th}>Opcije</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.map((req) => (
                        <Request key={req.id} {...req} />
                      ))}
                    </tbody>
                  </table>
                </div>

                {/*  */}
              </>
            ) : (
              <p>{!searchTerm ? "Nema novih zahtjeva za knjige." : "kraj"}</p>
            )}
          </>
        ) : (
          <p>{!searchTerm ? "Nema novih zahtjeva za knjige." : "kraj"}</p>
        )}
      </div>

      <div className={styles.bottomDiv}>
        <div className={styles.numberOfPagesDetails}>
          <p>
            Prikazano{" "}
            {currentPage * numberOfRequestsToShow - numberOfRequestsToShow + 1}{" "}
            do{" "}
            {currentPage * numberOfRequestsToShow <= requestsCopy.length
              ? currentPage * numberOfRequestsToShow
              : requestsCopy.length}{" "}
            od {requestsCopy.length} zahtjeva.
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

export default BookRequests;
