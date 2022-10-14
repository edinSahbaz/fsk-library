import BookDisplay from "../components/BookDisplay";
import Searchbar from "../components/Searchbar";

export default function Home() {
  return (
    <div>
      <Searchbar />
      <BookDisplay />
      <div style={{ height: "100vh" }}></div>
    </div>
  );
}
