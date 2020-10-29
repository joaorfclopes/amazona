import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CheckoutSteps from "../components/CheckoutSteps";

export default function PlaceOrderScreen(props) {
  const cart = useSelector((state) => state.cart);
  const { cartItems, paymentMethod, shippingAddress } = cart;

  if (!paymentMethod) {
    props.history.push("/payment");
  }

  const toPrice = (num) => Number(num.toFixed(2));
  const itemsPrice = toPrice(
    cartItems.reduce((a, c) => a + c.qty * c.price, 0)
  );
  const shippingPrice = itemsPrice > 100 ? toPrice(0) : toPrice(10);
  const taxPrice = toPrice(0.15 * itemsPrice);
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const placeOrderHandler = () => {};

  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <div className="row top">
        <div className="col-2">
          <ul>
            <li>
              <div className="card card-body">
                <h2>Shipping</h2>
                <p>
                  <strong>Name: </strong> {shippingAddress.fullName} <br />
                  <strong>Address: </strong> {shippingAddress.address},
                  {shippingAddress.city}, {shippingAddress.postalCode},{" "}
                  {shippingAddress.country}
                </p>
              </div>
            </li>
            <li>
              <div className="card card-body">
                <h2>Payment</h2>
                <p>
                  <strong>Method: </strong> {paymentMethod} <br />
                </p>
              </div>
            </li>
            <li>
              <div className="card card-body">
                <h2>Order Items</h2>
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
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </div>
                        <div>
                          {item.qty} x {item.price}€ = {item.qty * item.price}€
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          </ul>
        </div>
        <div className="col-1">
          <div className="card card-body">
            <ul>
              <li>
                <h2>Order Summary</h2>
              </li>
              <li>
                <div className="row">
                  <div>Items</div>
                  <div>{itemsPrice.toFixed(2)}€</div>
                </div>
              </li>
              <li>
                <div className="row">
                  <div>Shipping</div>
                  <div>{shippingPrice.toFixed(2)}€</div>
                </div>
              </li>
              <li>
                <div className="row">
                  <div>Tax</div>
                  <div>{taxPrice.toFixed(2)}€</div>
                </div>
              </li>
              <li>
                <div className="row">
                  <div>
                    <strong>Order Total</strong>
                  </div>
                  <div>
                    <strong>{totalPrice.toFixed(2)}€</strong>
                  </div>
                </div>
              </li>
              <li>
                <button
                  type="button"
                  onClick={placeOrderHandler}
                  className="primary block"
                  disabled={cartItems.length === 0}
                >
                  Place Order
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
