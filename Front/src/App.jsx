import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Home from "./components/Home/Home";
import Nav from "./components/Navbar/Nav";
import About from "./components/About/About";
import Form from "./components/Form/Form";
import Detail from "./components/Detail/Detail";
import axios from "axios";
import style from "./App.module.css";
import Favorites from "./components/Favorites/Favorites";

function App() {
  const navigate = useNavigate(); 
  const [access, setAccess] = React.useState(false);
  const [errorApi, seterrorApi] = React.useState(false);

  function logout() {
    setAccess(false);
  }

  async function login(userData) {
    const { email, password } = userData;
    const URL = "http://localhost:3001/user/login/";

    try {
      const backendLogin = await axios(
        URL + `?email=${email}&password=${password}`
      );
      const { data } = backendLogin;
      const { access } = data;
      setAccess(access);
      access && navigate("/home");
    } catch (error) {
      // No se pudo hacer la solicitud al backend.
      alert(error.message);
    }
   
  }

  useEffect(() => {
    !access && navigate("/");
    
  }, [access]);

  async function onSearch(dato) {
   

    try {
      const backRequest = await axios(
        `http://localhost:3001/character/${dato}`
      );
      if (backRequest.data.name) {
        seterrorApi(false);
        setCharacters((oldChars) => [...oldChars, backRequest.data]);
      } else {
        seterrorApi(true);
      }
    } catch (error) {
      seterrorApi(true);
    }
  }

  function onClose(id) {
 
    setCharacters(
      characters.filter((pj) => {
        return pj.id !== Number(id);
      })
    );
  }

  const [characters, setCharacters] = useState([]); // [{}]

  const location = useLocation();

  return (
    <div className={style.App}>
      {location.pathname !== "/" && <Nav onSearch={onSearch} out={logout} />}
      <Routes>
        <Route
          path="/home"
          element={
            !errorApi ? (
              <Home characters={characters} onClose={onClose} />
            ) : (
              <h1>Componente de error 404</h1>
            )
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="/detail/:id" element={<Detail />} />
        <Route path="/" element={<Form login={login} />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
    </div>
  );
}

export default App;