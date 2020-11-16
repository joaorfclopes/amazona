import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { sendResetPasswordMail } from "../actions/userActions";

export default function ForgotPasswordScreen() {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch(sendResetPasswordMail(email));
  };

  return (
    <div>
      <form className="form" onSubmit={submitHandler}>
        <div>
          <h1>Reset Password</h1>
        </div>
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
          <button className="primary" type="submit">
            Reset Password
          </button>
        </div>
      </form>
    </div>
  );
}
