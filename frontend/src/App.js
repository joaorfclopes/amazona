import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Link, Route } from "react-router-dom";
import CartScreen from "./screens/CartScreen";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import SigninScreen from "./screens/SigninScreen";
import { signout } from "./actions/userActions";
import { emptyCart } from "./actions/cartActions";
import RegisterScreen from "./screens/RegisterScreen";

function App() {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;

  const signoutHandler = () => {
    dispatch(signout());
    dispatch(emptyCart());
    window.location.href = "/";
  };

  return (
    <BrowserRouter>
      <div className="App">
        <div className="grid-container">
          <header className="row">
            <div>
              <Link className="brand" to="/">
                amazona
              </Link>
            </div>
            <div>
              <Link to="/cart">
                Cart{" "}
                {cartItems.length > 0 && (
                  <span className="badge">{cartItems.length}</span>
                )}
              </Link>
              {userInfo ? (
                <div className="dropdown">
                  <Link to="/#">
                    {userInfo.name} <FontAwesomeIcon icon={faCaretDown} />
                  </Link>
                  <ul className="dropdown-content">
                    <li>
                      <Link to="/" onClick={signoutHandler}>
                        Sign Out
                      </Link>
                    </li>
                  </ul>
                </div>
              ) : (
                <Link to="/signin">Sign In</Link>
              )}
            </div>
          </header>
          <main>
            <Route path="/register" component={RegisterScreen} />
            <Route path="/signin" component={SigninScreen} />
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
