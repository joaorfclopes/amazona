import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Link, Route, Switch } from "react-router-dom";
import CartScreen from "./screens/CartScreen";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import SigninScreen from "./screens/SigninScreen";
import { signout } from "./actions/userActions";
import { emptyCart } from "./actions/cartActions";
import RegisterScreen from "./screens/RegisterScreen";
import ShippingScreen from "./screens/ShippingScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
import OrderScreen from "./screens/OrderScreen";
import OrderHistoryScreen from "./screens/OrderHistoryScreen";
import ProfileScreen from "./screens/ProfileScreen";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import ProductListScreen from "./screens/ProductListScreen";
import ProductEditScreen from "./screens/ProductEditScreen";
import NotFoundScreen from "./screens/NotFoundScreen";
import OrderListScreen from "./screens/OrderListScreen";
import { formatName } from "./utils";

function App() {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;

  const signoutHandler = () => {
    dispatch(signout());
    dispatch(emptyCart());
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
              {userInfo && userInfo.isAdmin && (
                <div className="dropdown">
                  <Link to="#admin">
                    Admin <FontAwesomeIcon icon={faCaretDown} />
                  </Link>
                  <ul className="dropdown-content">
                    <li>
                      <Link to="/productlist">Products</Link>
                    </li>
                    <li>
                      <Link to="/orderlist">Orders</Link>
                    </li>
                  </ul>
                </div>
              )}
              {userInfo ? (
                <div className="dropdown">
                  <Link to="/#">
                    {formatName(userInfo.name)}{" "}
                    <FontAwesomeIcon icon={faCaretDown} />
                  </Link>
                  <ul className="dropdown-content">
                    <li>
                      <Link to="/profile">Profile</Link>
                    </li>
                    <li>
                      <Link to="/orderhistory">Orders</Link>
                    </li>
                    <li>
                      <a href="/" onClick={signoutHandler}>
                        Sign Out
                      </a>
                    </li>
                  </ul>
                </div>
              ) : (
                <Link to="/signin">Sign In</Link>
              )}
            </div>
          </header>
          <main>
            <Switch>
              <AdminRoute path="/orderlist" component={OrderListScreen} />
              <AdminRoute
                path="/product/:id/edit"
                component={ProductEditScreen}
                exact
              />
              <AdminRoute path="/productlist" component={ProductListScreen} />
              <PrivateRoute path="/profile" component={ProfileScreen} />
              <PrivateRoute
                path="/orderhistory"
                component={OrderHistoryScreen}
              />
              <PrivateRoute path="/order/:id" component={OrderScreen} />
              <PrivateRoute path="/placeorder" component={PlaceOrderScreen} />
              <PrivateRoute path="/shipping" component={ShippingScreen} />
              <Route path="/register" component={RegisterScreen} />
              <Route path="/signin" component={SigninScreen} />
              <Route path="/cart/:id?" component={CartScreen} />
              <Route path="/product/:id" component={ProductScreen} exact />
              <Route path="/" component={HomeScreen} exact />
              <Route component={NotFoundScreen} />
            </Switch>
          </main>
          <footer className="row center">All right reserved</footer>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
