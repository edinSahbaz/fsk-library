import styles from "../../styles/Books.module.css";

const Books = () => {
  return (
    <div className={styles.root_div}>
      <h1>Knjige</h1>
      <div className={styles.remove_later}></div>
    </div>
  );
};

export default Books;
