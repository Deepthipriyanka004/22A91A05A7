import { BrowserRouter, Routes, Route } from "react-router-dom";
import UrlForm from "./components/Url Shortener//Url";
import StatsPage from "./components/Url Shortener/Total";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UrlForm />} />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="/:shortcode" element={<UrlForm redirectOnly />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


