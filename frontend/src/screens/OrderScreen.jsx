import Axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { PayPalButton } from "react-paypal-button-v2";
import {
  deliverOrder,
  detailsOrder,
  payOrder,
  cancelOrder,
} from "../actions/orderActions";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import {
  ORDER_CANCEL_RESET,
  ORDER_DELIVER_RESET,
  ORDER_PAY_RESET,
} from "../constants/orderConstants";
import { formatDateDayHour } from "../utils";

export default function OrderScreen(props) {
  const dispatch = useDispatch();

  const orderId = props.match.params.id;

  const [sdkReady, setSdkReady] = useState(false);

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const orderDetails = useSelector((state) => state.orderDetails);
  const { loading, order, error } = orderDetails;
  const orderPay = useSelector((state) => state.orderPay);
  const {
    loading: loadingPay,
    success: successPay,
    error: errorPay,
  } = orderPay;
  const orderDeliver = useSelector((state) => state.orderDeliver);
  const {
    loading: loadingDeliver,
    success: successDeliver,
    error: errorDeliver,
  } = orderDeliver;
  const orderCancel = useSelector((state) => state.orderCancel);
  const {
    loading: loadingCancel,
    success: successCancel,
    error: errorCancel,
  } = orderCancel;

  if (!userInfo) {
    props.history.push(`/signin?redirect=order/${orderId}`);
  }

  useEffect(() => {
    const addPaypalScript = async () => {
      const { data } = await Axios.get("/api/config/paypal");
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `https://www.paypal.com/sdk/js?client-id=${data}&currency=EUR`;
      script.async = true;
      script.onload = () => {
        setSdkReady(true);
      };
      document.body.appendChild(script);
    };
    if (
      !order ||
      successPay ||
      successDeliver ||
      successCancel ||
      (order && order._id !== orderId)
    ) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch({ type: ORDER_DELIVER_RESET });
      dispatch({ type: ORDER_CANCEL_RESET });
      dispatch(detailsOrder(orderId));
    } else {
      if (!order.isPaid) {
        if (!window.paypal) {
          addPaypalScript();
        } else {
          setSdkReady(true);
        }
      }
    }
  }, [
    dispatch,
    orderId,
    userInfo,
    order,
    sdkReady,
    successPay,
    successDeliver,
    successCancel,
  ]);

  const successPaymentHandler = (paymentResult) => {
    dispatch(payOrder(order, paymentResult));
  };

  const deliverHandler = () => {
    if (window.confirm(`Deliver order ${order._id}?`)) {
      dispatch(deliverOrder(order._id));
    }
  };

  const cancelHandler = () => {
    if (window.confirm(`Cancel order ${order._id}?`)) {
      dispatch(cancelOrder(order._id));
    }
  };

  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <>
      <h1>Order {order._id}</h1>
      {loadingCancel && <LoadingBox />}
      {errorCancel && <MessageBox variant="danger">{errorCancel}</MessageBox>}
      {order.status === "CANCELED" && (
        <MessageBox variant="danger">This order was canceled</MessageBox>
      )}
      <div className="row top">
        <div className="col-2">
          <ul>
            <li>
              <div className="card card-body">
                <h2>Shipping</h2>
                <p>
                  <strong>Name: </strong> {order.shippingAddress.fullName}{" "}
                  <br />
                  <strong>Address: </strong> {order.shippingAddress.address},
                  {order.shippingAddress.city},{" "}
                  {order.shippingAddress.postalCode},{" "}
                  {order.shippingAddress.country}
                </p>
                {order.isDelivered ? (
                  <MessageBox variant="success">
                    Delivered at {formatDateDayHour(order.deliveredAt)}
                  </MessageBox>
                ) : (
                  <MessageBox variant="danger">Not delivered</MessageBox>
                )}
              </div>
            </li>
            <li>
              <div className="card card-body">
                <h2>Payment</h2>
                {order.isPaid ? (
                  <MessageBox variant="success">
                    Paid at {formatDateDayHour(order.paidAt)}
                  </MessageBox>
                ) : (
                  <MessageBox variant="danger">Not paid</MessageBox>
                )}
              </div>
            </li>
            <li>
              <div className="card card-body">
                <h2>Order Items</h2>
                <ul>
                  {order.orderItems.map((item) => (
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
                          {item.qty} x{" "}
                          {item.finalPrice
                            ? item.finalPrice.toFixed(2)
                            : item.finalPrice}
                          € ={" "}
                          {item.qty * item.finalPrice
                            ? (item.qty * item.finalPrice).toFixed(2)
                            : item.qty * item.finalPrice}
                          €
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
                  <div>
                    {order.itemsPrice
                      ? order.itemsPrice.toFixed(2)
                      : order.itemsPrice}
                    €
                  </div>
                </div>
              </li>
              <li>
                <div className="row">
                  <div>Shipping</div>
                  <div>
                    {order.shippingPrice
                      ? order.shippingPrice.toFixed(2)
                      : order.shippingPrice}
                    €
                  </div>
                </div>
              </li>
              <li>
                <div className="row">
                  <div>
                    <strong>Order Total</strong>
                  </div>
                  <div>
                    <strong>
                      {order.totalPrice
                        ? order.totalPrice.toFixed(2)
                        : order.totalPrice}
                      €
                    </strong>
                  </div>
                </div>
              </li>
              {order.status !== "CANCELED" && !order.isPaid && (
                <li>
                  {!sdkReady ? (
                    <LoadingBox />
                  ) : (
                    <>
                      {errorPay && (
                        <MessageBox variant="danger">{errorPay}</MessageBox>
                      )}
                      {loadingPay && <LoadingBox />}
                      <PayPalButton
                        currency="EUR"
                        amount={order.totalPrice}
                        onSuccess={successPaymentHandler}
                      />
                    </>
                  )}
                </li>
              )}
              {userInfo.isAdmin &&
                order.isPaid &&
                !order.isDelivered &&
                order.status !== "CANCELED" && (
                  <li>
                    {loadingDeliver && <LoadingBox />}
                    {errorDeliver && (
                      <MessageBox variant="danger">{errorDeliver}</MessageBox>
                    )}
                    <button
                      type="button"
                      className="primary block"
                      onClick={deliverHandler}
                    >
                      Deliver Order
                    </button>
                  </li>
                )}
              {order.status !== "CANCELED" && !order.isDelivered && (
                <li>
                  <button
                    type="button"
                    className="block"
                    onClick={cancelHandler}
                  >
                    Cancel Order
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
