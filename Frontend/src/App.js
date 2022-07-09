import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/headers";
import HomePage from "./Screen/HomePage";
import AddSong from "./Screen/AddSong";
import AllArtistScreen from "./Screen/AllArtistScreen";
import Login from "./Screen/Login";
import UserRegister from "./Screen/UserRegister";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<UserRegister />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/addsong" element={<AddSong />} />
        <Route path="/allartist" element={<AllArtistScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
