import React from "react";

import './App.css';
import CssBaseline from "@material-ui/core/CssBaseline";
import { BrowserRouter } from "react-router-dom";
import {useRoutes} from "./routes";
import {useAuth} from "./context/AuthContext";
import {NavBar} from "./components/NavBar";

function App() {
  const {loading, currentUser } = useAuth();
  const routes = useRoutes(currentUser);

  return (
      <BrowserRouter>
        <CssBaseline />
        {loading ? 'Loading' : (
          <React.Fragment>
          {currentUser && <NavBar />}
          <div className="container">
            {routes}
          </div>
        </React.Fragment>)}
      </BrowserRouter>
  );
};

export default App;
