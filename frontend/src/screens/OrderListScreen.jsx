import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listOrders } from "../actions/orderActions";
import { formatDateDay } from "../utils";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";

export default function OrderListScreen(props) {
  const dispatch = useDispatch();
  const orderAdminList = useSelector((state) => state.orderAdminList);
  const { loading, orders, error } = orderAdminList;

  useEffect(() => {
    dispatch(listOrders());
  }, [dispatch]);

  const deleteHandler = (order) => {};

  return (
    <>
      <h1>Orders</h1>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user.name}</td>
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
                  <button
                    type="button"
                    className="small"
                    onClick={() => deleteHandler(order)}
                  >
                    Delete
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
