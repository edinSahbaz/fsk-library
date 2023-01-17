import Lease from "../Lease";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import styles from "../../styles/LeasedBooks.module.css";
import Image from "next/image";
//
import React from "react";

const LeasedBooks = () => {
  const [leases, setLeases] = useState([]);
  const [newestLeases, setNewestLeases] = useState(false);
  //
  const [leasesCopy, setLeasesCopy] = useState([]);
  const [numberOfLeasesToShow, setnumberOfLeasesToShow] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [numberOfPages, setNumberOfPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const leasedRef = collection(db, "leasedBooks");
    const leasedQ = query(leasedRef, orderBy("addedTime"));

    const unsubLeases = onSnapshot(leasedQ, (colSnap) => {
      const temp = [];
      colSnap.forEach((lease) => {
        temp.push({ id: lease.id, ...lease.data() });
      });

      setLeases(temp);
      setLeasesCopy(temp);
      setNumberOfPages(Math.ceil(temp.length / numberOfLeasesToShow));
    });

    return () => {
      unsubLeases();
    };
  }, []);

  const changeSortLeases = () => {
    setNewestLeases((prev) => !prev);
    let temp = leases.reverse();

    setLeases(temp);
  };

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
    const startIndex = (currentPage - 1) * numberOfLeasesToShow;
    const endIndex = startIndex + numberOfLeasesToShow;
    const displayedRequests = leasesCopy.slice(startIndex, endIndex);
    setLeases(displayedRequests);
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
  }, [numberOfLeasesToShow, leasesCopy]);

  const increasePageNumber = () => {
    if (currentPage !== numberOfPages) {
      setCurrentPage(++currentPage);
      const startIndex = (currentPage - 1) * numberOfLeasesToShow;
      const endIndex = startIndex + numberOfLeasesToShow;
      const displayedRequests = leasesCopy.slice(startIndex, endIndex);
      setLeases(displayedRequests);
    }
  };

  const decreasePageNumber = () => {
    if (currentPage >= 2) {
      setCurrentPage(--currentPage);
      const startIndex = (currentPage - 1) * numberOfLeasesToShow;
      const endIndex = startIndex + numberOfLeasesToShow;
      const displayedRequests = leasesCopy.slice(startIndex, endIndex);
      setLeases(displayedRequests);
    }
  };

  useEffect(() => {
    setNumberOfPages(Math.ceil(leasesCopy.length / numberOfLeasesToShow));
  }, [numberOfLeasesToShow]);

  useEffect(() => {
    console.log(searchTerm.length);
    if (searchTerm.length > 0) {
      const searchedRequests = leasesCopy.filter((o) => {
        return o.userName.toLowerCase().includes(searchTerm);
      });
      setLeases(searchedRequests);
    } else {
      resetShowingRequests();
    }
  }, [searchTerm]);

  return (
    <div ref={ref} className={styles.main}>
      <h2>Trenutno izdate knjige</h2>

      <div className={styles.topDiv}>
        <div className={styles.numberOfRequestsDiv}>
          <p>Prikazi</p>
          <select
            defaultValue="5"
            onChange={(e) => setnumberOfLeasesToShow(parseInt(e.target.value))}
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
        {leases ? (
          <>
            {leases.length > 0 ? (
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
                          onClick={changeSortLeases}
                        >
                          Datum Zahtjeva
                          <span
                            className={
                              newestLeases
                                ? styles.arrow
                                : styles.reversed_arrow
                            }
                          ></span>
                        </th>
                        <th className={styles.th}>Rok Vracanja</th>
                        <th className={styles.th}>Opcije</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leases.map((req) => (
                        <Lease key={req.id} {...req} />
                      ))}
                    </tbody>
                  </table>
                </div>
                {/*  */}
              </>
            ) : (
              <p>Nema trenutno izdatih knjiga.</p>
            )}
          </>
        ) : (
          <p>Nema trenutno izdatih knjiga.</p>
        )}
      </div>

      <div className={styles.bottomDiv}>
        <div className={styles.numberOfPagesDetails}>
          <p>
            Prikazano{" "}
            {currentPage * numberOfLeasesToShow - numberOfLeasesToShow + 1} do{" "}
            {currentPage * numberOfLeasesToShow <= leasesCopy.length
              ? currentPage * numberOfLeasesToShow
              : leasesCopy.length}{" "}
            od {leasesCopy.length} zahtjeva.
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

export default LeasedBooks;
{
  /* <Lease key={req.id} {...req} /> */
}
