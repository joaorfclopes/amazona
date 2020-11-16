import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendResetPasswordMail } from "../actions/userActions";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";

export default function ForgotPasswordScreen() {
  const dispatch = useDispatch();

  const userForgotPassword = useSelector((state) => state.userForgotPassword);
  const { loading, success, error } = userForgotPassword;

  const [email, setEmail] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch(sendResetPasswordMail(email));
  };

  return (
    <>
      <form className="form" onSubmit={submitHandler}>
        <div>
          <h1>Reset Password</h1>
        </div>
        {error && <MessageBox variant="danger">{error}</MessageBox>}
        {success && (
          <MessageBox variant="success">Reset password link sent</MessageBox>
        )}
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>
        <div>
          <label />
          {loading && <LoadingBox />}
          {!success ? (
            !error && (
              <button className="primary" type="submit">
                Reset Password
              </button>
            )
          ) : (
            <>
              <button type="button">Back</button>
              <label />
              <button type="submit">Resend Email</button>
            </>
          )}
          {error && (
            <>
              <button type="button">Back</button>
              <label />
              <button type="submit">Try Again</button>
            </>
          )}
        </div>
      </form>
    </>
  );
}
