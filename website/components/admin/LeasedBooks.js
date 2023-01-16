import Lease from "../Lease";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";

const LeasedBooks = () => {
    const [leases, setLeases] = useState([]);
    const [newestLeases, setNewestLeases] = useState(false);

    useEffect(() => {
        const leasedRef = collection(db, "leasedBooks");
        const leasedQ = query(leasedRef, orderBy("addedTime"));

        const unsubLeases = onSnapshot(leasedQ, (colSnap) => {
        const temp = [];
        colSnap.forEach((lease) => {
            temp.push({ id: lease.id, ...lease.data() });
        });

        setLeases(temp);
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

    return ( 
        <div>
        <h2>Trenutno izdate knjige</h2>
        <div>
          <label>
            Sortiraj
            <button onClick={changeSortLeases}>
              {newestLeases ? "Najstariji prvo" : "Najnoviji prvo"}
            </button>
          </label>
        </div>
        <div>
          {leases ? (
            <>
              {leases.length > 0 ? (
                <>
                  {leases.map((req) => (
                    <Lease key={req.id} {...req} />
                  ))}
                </>
              ) : (
                <p>Nema trenutno izdatih knjiga.</p>
              )}
            </>
          ) : (
            <p>Nema trenutno izdatih knjiga.</p>
          )}
        </div>
      </div>
     );
}
 
export default LeasedBooks;