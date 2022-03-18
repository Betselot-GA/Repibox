import "./App.css";
import Recipes from "./Recipes.js";
import Headers from "./components/Header.js";
import Footers from "./components/Footer.js";

function App() {
  return (
    <>
      <Headers header={true}/>
      <Recipes />
      <Footers />
    </>
  );
}

export default App;
