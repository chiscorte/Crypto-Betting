import logo from "./logo.svg";
import "./App.css";
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Play from "./components/Play";
import LandingPage from "./components/LandingPage";
import Deposit from "./components/Deposit";
import Signin from "./components/Signin";
import Signup from "./components/Signup";
import CashPage from "./components/CashPage/cash";
import Setting from "./components/Setting";

function App({ socket }) {
  return (
    <>
      <Router>
        <Routes>
        <Route path={"/"} element={<Signin />}></Route>
          <Route path={"/home"} element={<LandingPage />}></Route>
          <Route path={"/deposit"} element={<Deposit />}></Route>
          <Route path={"/play"} element={<Play socket={socket} />}></Route>
          <Route path={"/signin"} element={<Signin />}></Route>
          <Route path={"/signup"} element={<Signup />}></Route>
          <Route path={"/cash"} element={<CashPage socket={socket} />}></Route>
          <Route path={"/setting"} element={<Setting />}></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
