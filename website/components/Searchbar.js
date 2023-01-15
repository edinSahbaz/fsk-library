import styles from "../styles/Searchbar.module.css";
import Image from "next/image";

const Searchbar = () => {
  return (
    <div className={styles.searchbar_element}>
      <div>
        <h1 className={styles.headline}>Online Biblioteka</h1>
      </div>

      <div className={styles.main}>
        <div className={styles.searchbar_main}>
          <input
            className={styles.searchbar}
            placeholder="Pretraži biblioteku..."
          ></input>

          <div className={styles.radio_toolbar}>
            <input type="radio" id="radio1" name="radios" defaultChecked />
            <label for="radio1">Sva polja</label>

            <input type="radio" id="radio2" name="radios" />
            <label for="radio2">Pisci</label>

            <input type="radio" id="radio3" name="radios" />
            <label for="radio3">Naslovi</label>
          </div>
        </div>
        <button className={styles.btn_search}>
          <Image
            className={styles.search_icon}
            alt="search"
            width="30px"
            height="30px"
            src="/Search.png"
          />
        </button>
      </div>
      <div className={styles.dropdown_main}>
        <select name="authors">
          <option value="Pisac">Pisac</option>
          <option value="PisacX">PisacX</option>
          <option value="PisacX">PisacX</option>
          <option value="PisacX">PisacX</option>
          <option value="PisacX">PisacX</option>
          <option value="PisacX">PisacX</option>
        </select>

        <select name="Dodati poslije">
          <option value="Pisac">Dodati poslije</option>
          <option value="PisacX">PisacX</option>
          <option value="PisacX">PisacX</option>
          <option value="PisacX">PisacX</option>
          <option value="PisacX">PisacX</option>
          <option value="PisacX">PisacX</option>
        </select>
      </div>
    </div>
  );
};

export default Searchbar;
