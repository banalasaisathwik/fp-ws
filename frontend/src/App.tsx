import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Space from "./components/Spaceinfo";
import "./App.css"
function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/space/:id" element={<Space/>}/>
    </Routes>
    </BrowserRouter>
  );
}

export default App;