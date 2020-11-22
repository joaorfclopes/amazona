import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addToCart, removeFromCart } from "../actions/cartActions";
import MessageBox from "../components/MessageBox";
import { sizes } from "../utils";

export default function CartScreen(props) {
  const productId = props.match.params.id;
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const [qty, setQty] = useState(Number(urlParams.get("qty")));
  const [size, setSize] = useState(String(urlParams.get("size")));
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  const dispatch = useDispatch();
  useEffect(() => {
    if (productId) {
      dispatch(addToCart(productId, qty, size));
    }
  }, [dispatch, productId, qty, size]);

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
    props.history.push("/cart");
  };

  const checkoutHandler = () => {
    props.history.push("/signin?redirect=shipping");
  };

  const setSizeAddCart = (id, e) => {
    setSize(String(e.target.value));
    dispatch(addToCart(id, qty, String(e.target.value)));
  };

  const setQtyAddCart = (id, e) => {
    setQty(Number(e.target.value));
    dispatch(addToCart(id, Number(e.target.value), size));
  };
  return (
    <div className="row top">
      <div className="col-2">
        <h1>Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <MessageBox>
            Cart is empty. <Link to="/">Go Shopping</Link>
          </MessageBox>
        ) : (
          <ul>
            {cartItems.map((item) => (
              <li key={item.product}>
                <div className="row">
                  <div>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="small"
                    ></img>
                  </div>
                  <div className="min-30">
                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                  </div>
                  {item.isClothing && (
                    <div>
                      <select
                        value={item.size}
                        onChange={(e) => setSizeAddCart(item.product, e)}
                      >
                        {sizes.map((x) => (
                          <option key={x} value={x}>
                            {x}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div>
                    <select
                      value={item.qty}
                      onChange={(e) => setQtyAddCart(item.product, e)}
                    >
                      {[
                        ...Array(
                          !item.isClothing
                            ? item.countInStock.stock >= 5
                              ? 5
                              : item.countInStock.stock
                            : 5
                        ).keys(),
                      ].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    {item.finalPrice
                      ? item.finalPrice.toFixed(2)
                      : item.finalPrice}
                    €
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => removeFromCartHandler(item.product)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="col-1">
        <div className="card card-body">
          <ul>
            <li>
              <h2>
                Subtotal ({cartItems.reduce((a, c) => a + c.qty, 0)} items) :{" "}
                {cartItems.reduce((a, c) => a + c.finalPrice * c.qty, 0)
                  ? cartItems
                      .reduce((a, c) => a + c.finalPrice * c.qty, 0)
                      .toFixed(2)
                  : cartItems.reduce((a, c) => a + c.finalPrice * c.qty, 0)}
                €
              </h2>
            </li>
            <li>
              <button
                type="button"
                onClick={checkoutHandler}
                className="primary block"
                disabled={cartItems.length === 0}
              >
                Proceed to Checkout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
