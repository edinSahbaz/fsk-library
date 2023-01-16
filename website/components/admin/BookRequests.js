import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import Request from "../Request";

const BookRequests = () => {
    const [newestReq, setNewestReq] = useState(false);
    const [requests, setRequest] = useState([]);

    useEffect(() => {
        const reqRef = collection(db, "bookRequests");
        const reqQ = query(reqRef, orderBy("addedTime"));

        const unsubRequests = onSnapshot(reqQ, (colSnap) => {
        const temp = [];
        colSnap.forEach((req) => {
            temp.push({ id: req.id, ...req.data() });
        });

        setRequest(temp);
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

    return ( 
        <div>
            <h2>Zahtjevi za knjige</h2>
            <div>
                <label>
                Sortiraj
                <button onClick={changeSortReq}>
                    {newestReq ? "Najstariji prvo" : "Najnoviji prvo"}
                </button>
                </label>
            </div>
            <div>
                {requests ? (
                <>
                    {requests.length > 0 ? (
                    <>
                        {requests.map((req) => (
                        <Request key={req.id} {...req} />
                        ))}
                    </>
                    ) : (
                    <p>Nema novih zahtjeva za knjige.</p>
                    )}
                </>
                ) : (
                <p>Nema novih zahtjeva za knjige.</p>
                )}
            </div>
            </div>
     );
}
 
export default BookRequests;