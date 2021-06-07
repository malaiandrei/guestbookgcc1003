import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";
import GBList from "./GBList/GBList";

import AppContainer from "./AppContainer.js";

class App extends Component {
  render() {
    return (
      <Router>
        <AppContainer>
          <Route exact path="/" component={GBList} />
        </AppContainer>
      </Router>
    );
  }
}

App.displayName = "App";
export default App;
