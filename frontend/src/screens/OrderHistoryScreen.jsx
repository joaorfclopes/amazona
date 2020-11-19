import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listOrder } from "../actions/orderActions";
import { formatDateDay } from "../utils";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";

export default function OrderHistoryScreen(props) {
  const dispatch = useDispatch();
  const orderList = useSelector((state) => state.orderList);
  const { loading, orders, error } = orderList;

  useEffect(() => {
    dispatch(listOrder());
  }, [dispatch]);

  return (
    <>
      <h1>Order History</h1>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{formatDateDay(order.createdAt)}</td>
                <td>
                  {order.totalPrice
                    ? order.totalPrice.toFixed(2)
                    : order.totalPrice}
                  €
                </td>
                <td>{order.isPaid ? formatDateDay(order.paidAt) : "No"}</td>
                <td>
                  {order.isDelivered ? formatDateDay(order.deliveredAt) : "No"}
                </td>
                <td>{order.status}</td>
                <td>
                  <button
                    type="button"
                    className="small"
                    onClick={() => {
                      props.history.push(`/order/${order._id}`);
                    }}
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
