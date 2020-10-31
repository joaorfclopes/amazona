import React from "react";
import { useSelector } from "react-redux";
import { Route } from "react-router-dom";
import MessageBox from "./MessageBox";

export default function AdminRoute({ component: Component, ...rest }) {
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;

  return (
    <Route
      {...rest}
      render={(props) =>
        userInfo && userInfo.isAdmin ? (
          <Component {...props}></Component>
        ) : (
          <MessageBox variant="danger">
            You're not allowed to access this page
          </MessageBox>
        )
      }
    ></Route>
  );
}
