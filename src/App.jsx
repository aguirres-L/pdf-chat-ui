import { AosInit } from "./components/hooks_components/UseAOS.jsx";
import HomePage from "./components/pages/home/HomePage.jsx";

function App() {
  return (
    <>
      <AosInit configuracion={{ once: true }} />
      <HomePage />
    </>
  );
}

export default App;
