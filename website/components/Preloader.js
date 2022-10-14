import styles from "./../styles/Preloader.module.css";
import { Oval } from "react-loader-spinner";

const Preloader = () => {
  return (
    <div className={styles.container}>
      <Oval
        height={80}
        width={80}
        color="#377ab5"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
        ariaLabel="oval-loading"
        secondaryColor="#377ab5"
        strokeWidth={2}
        strokeWidthSecondary={2}
      />
    </div>
  );
};

export default Preloader;
