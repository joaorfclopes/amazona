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
  const [qty, setQty] = useState(Number(urlParams.get("qty")) || 1);
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
  };

  const checkoutHandler = () => {
    props.history.push("/signin?redirect=shipping");
  };

  const setSizeAddCart = (id, itemQty, e) => {
    setSize(String(e.target.value));
    dispatch(addToCart(id, itemQty, String(e.target.value)));
  };

  const setQtyAddCart = (id, e, itemSize) => {
    setQty(Number(e.target.value));
    dispatch(addToCart(id, Number(e.target.value), itemSize));
  };

  const qtyArray = (val) => {
    return [...Array(val >= 5 ? 5 : val).keys()].map((x) => (
      <option key={x + 1} value={x + 1}>
        {x + 1}
      </option>
    ));
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
                        onChange={(e) =>
                          setSizeAddCart(item.product, item.qty, e)
                        }
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
                      onChange={(e) =>
                        setQtyAddCart(item.product, e, item.size)
                      }
                    >
                      {!item.isClothing
                        ? qtyArray(item.countInStock.stock)
                        : item.size === "XS"
                        ? qtyArray(item.countInStock.xs)
                        : item.size === "S"
                        ? qtyArray(item.countInStock.s)
                        : item.size === "M"
                        ? qtyArray(item.countInStock.m)
                        : item.size === "L"
                        ? qtyArray(item.countInStock.l)
                        : item.size === "XL"
                        ? qtyArray(item.countInStock.xl)
                        : item.size === "XXL" &&
                          qtyArray(item.countInStock.xxl)}
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
