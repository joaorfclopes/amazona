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
          <h1>Forgot Password?</h1>
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
            <button className="primary" type="submit">
              Request Email
            </button>
          ) : (
            <>
              <button type="submit">Resend Email</button>
            </>
          )}
        </div>
      </form>
    </>
  );
}
