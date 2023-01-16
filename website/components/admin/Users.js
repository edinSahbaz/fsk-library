import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { db } from "../../lib/firebase";

const Users = () => {
    const [users, setUsers] = useState([])

    useEffect(() => {
        const usersRef = collection(db, 'users')

        const unsub = onSnapshot(usersRef, colSnap => {
            const temp = []
            colSnap.forEach(user => {
                const data = user.data();
                data.email = user.id;

                if(user.id !== 'biblioteka@fsk.unsa.ba') temp.push(data);
            })  
            setUsers(temp)
        })

        return () => {
            unsub();
        }
    }, [])

    return ( <div>
        <h1>Članovi</h1>

        <div>
            {
                users && users.map(user => (
                    <div key={user.email}>
                        {user.name} {user.surname} ({user.index}) - {user.email}
                    </div>
                ))
            }
        </div>
    </div> );
}
 
export default Users;