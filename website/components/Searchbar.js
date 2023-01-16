import styles from "../styles/Searchbar.module.css";
import Image from "next/image";
import { useState } from "react";

const Searchbar = ({setSearch, setField}) => {
  const [searchTerm, setSearchTerm] = useState('')

  const search = (e) => {
    if(e.key !== 'Enter') return;

    setSearch(searchTerm);
  }

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
            onChange={e => setSearchTerm(e.target.value)}
            onKeyDown={search}
          ></input>

          <div className={styles.radio_toolbar}>
            <input type="radio" id="radio3" name="radios" value='name' onChange={e => setField(e.target.value)}/>
            <label htmlFor="radio3">Naslovi</label>

            <input type="radio" id="radio2" name="radios" value='author' onChange={e => setField(e.target.value)} />
            <label htmlFor="radio2">Pisci</label>
          </div>
        </div>
        <button className={styles.btn_search} onClick={() => setSearch(searchTerm)}>
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
        {/* <select name="authors">
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
        </select> */}
      </div>
    </div>
  );
};

export default Searchbar;
