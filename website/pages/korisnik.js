import { useEffect } from "react";
import { useUser } from "../components/Layout";
import styles from '../styles/User.module.css';

const User = () => {
    const user = useUser();

    useEffect(() => {

    }, [])

    useEffect(() => {

    }, [])

    return ( <div>
      {user && user.user.email !== "biblioteka@fsk.unsa.ba" ? (
        <div className={styles.container}>
          <p>Uskoro...</p>
          <p>Prikaz prihvaćenih i odbijenih zahtjeva i poruka.</p>
        </div>
      ) : (
        <div className="unauthorized">
          <h2>Page namijenjen za korisnike!</h2>
        </div>
      )}
    </div> );
}
 
export default User;