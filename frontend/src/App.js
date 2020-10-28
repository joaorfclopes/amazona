import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import CartScreen from "./screens/CartScreen";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <div className="grid-container">
          <header className="row">
            <div>
              <a className="brand" href="/">
                amazona
              </a>
            </div>
            <div>
              <a href="/cart">Cart</a>
              <a href="/signin">Sign In</a>
            </div>
          </header>
          <main>
            <Route path="/cart/:id?" component={CartScreen} />
            <Route path="/product/:id" component={ProductScreen} />
            <Route path="/" component={HomeScreen} exact />
          </main>
          <footer className="row center">All right reserved</footer>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
