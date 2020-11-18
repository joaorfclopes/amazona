import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { detailsUser, updateUser } from "../actions/userActions";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { USER_UPDATE_RESET } from "../constants/userConstants";
import bcrypt from "bcryptjs";

export default function ProfileScreen() {
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [changePassword, setChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const userDetails = useSelector((state) => state.userDetails);
  const { loading, user, error } = userDetails;
  const userUpdate = useSelector((state) => state.userUpdate);
  const {
    loading: loadingUpdate,
    success: successUpdate,
    error: errorUpdate,
  } = userUpdate;

  useEffect(() => {
    if (!user || successUpdate) {
      dispatch(detailsUser(userInfo._id));
      dispatch({ type: USER_UPDATE_RESET });
    } else {
      setName(user.name);
      setEmail(user.email);
    }
  }, [dispatch, userInfo, user, successUpdate]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (newPassword) {
      if (newPassword !== confirmNewPassword) {
        const newPasswordError = document.getElementById("newPasswordError");
        newPasswordError.style.display = "block";
        const oldPasswordError = document.getElementById("oldPasswordError");
        oldPasswordError.style.display = "none";
      } else {
        if (bcrypt.compareSync(oldPassword, user.password)) {
          dispatch(
            updateUser({ userId: user._id, name, email, password: newPassword })
          );
        } else {
          const newPasswordError = document.getElementById("newPasswordError");
          newPasswordError.style.display = "none";
          const oldPasswordError = document.getElementById("oldPasswordError");
          oldPasswordError.style.display = "block";
        }
      }
    } else {
      dispatch(updateUser({ userId: user._id, name, email }));
    }
  };

  return (
    <>
      <form className="form" onSubmit={submitHandler}>
        <div>
          <h1>User Profile</h1>
        </div>
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <>
            {loadingUpdate && <LoadingBox />}
            {errorUpdate && (
              <MessageBox variant="danger">{errorUpdate}</MessageBox>
            )}
            {successUpdate && (
              <MessageBox variant="success">
                Profile updated successfully
              </MessageBox>
            )}
            <div id="oldPasswordError" style={{ display: "none" }}>
              <MessageBox variant="danger">Old Password don't match</MessageBox>
            </div>
            <div id="newPasswordError" style={{ display: "none" }}>
              <MessageBox variant="danger">Passwords don't match</MessageBox>
            </div>
            <div>
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                placeholder="Enter name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
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
              <button
                type="button"
                onClick={() => setChangePassword(!changePassword)}
              >
                Change Password
              </button>
            </div>
            {changePassword && (
              <>
                <div>
                  <label htmlFor="oldPassword">Old Password</label>
                  <input
                    type="password"
                    id="oldPassword"
                    placeholder="Enter password"
                    onChange={(e) => {
                      setOldPassword(e.target.value);
                    }}
                  />
                </div>
                <div>
                  <label htmlFor="newPassword">New Password</label>
                  <input
                    type="password"
                    id="newPassword"
                    minlength="5"
                    placeholder="Enter password"
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                    }}
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword">Confirm New Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    placeholder="Confirm password"
                    onChange={(e) => {
                      setConfirmNewPassword(e.target.value);
                    }}
                  />
                </div>
              </>
            )}
            <div>
              <label />
              <button className="primary" type="submit">
                Update
              </button>
            </div>
          </>
        )}
      </form>
    </>
  );
}
