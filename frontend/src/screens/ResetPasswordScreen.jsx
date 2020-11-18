import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../actions/userActions";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";

export default function ResetPasswordScreen(props) {
  const dispatch = useDispatch();

  const userId = props.match.params.id;

  const userResetPassword = useSelector((state) => state.userResetPassword);
  const { loading, success, error } = userResetPassword;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [disableTyping, setDisableTyping] = useState(false);

  useEffect(() => {
    if (success) {
      setDisableTyping(true);
    }
  }, [success]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      const passwordError = document.getElementById("passwordError");
      passwordError.style.display = "block";
    } else {
      const passwordError = document.getElementById("passwordError");
      passwordError.style.display = "none";
      dispatch(resetPassword({ password }, userId));
    }
  };

  return (
    <>
      <form className="form" onSubmit={submitHandler}>
        <div>
          <h1>Reset Password</h1>
        </div>
        {loading && <LoadingBox />}
        {error && <MessageBox variant="danger">{error}</MessageBox>}
        {success && (
          <MessageBox variant="success">
            Password changed. You will be redirected, please wait...
          </MessageBox>
        )}
        <div id="passwordError" style={{ display: "none" }}>
          <MessageBox variant="danger">Passwords don't match</MessageBox>
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            minlength="5"
            placeholder="Enter password"
            required
            onChange={(e) => setPassword(e.target.value)}
            disabled={disableTyping}
          />
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm password</label>
          <input
            type="password"
            id="confirmPassword"
            placeholder="Confirm password"
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={disableTyping}
          />
        </div>
        <div>
          <label />
          <button className="primary" type="submit">
            Reset Password
          </button>
        </div>
      </form>
    </>
  );
}
