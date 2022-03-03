import React, { useState } from "react";
import Wrapper from "../assets/wrappers/Navbar";
import { FaAlignLeft, FaUserCircle, FaCaretDown } from "react-icons/fa";
import { Logo } from ".";
import { useAppContext } from "../context/appContext";
import Authlink from "../pages/Authlink";
const Navbar = () => {
  const [showLogout, setShowLogout] = useState(false);
  const { toggleSidebar, logoutUser, users } = useAppContext();
  return (
    <Authlink>
      <Wrapper>
        <div className="nav-center">
          <button className="toggle-btn" onClick={toggleSidebar}>
            <FaAlignLeft />
          </button>
          <div>
            <Logo />
            <h3 className="logo-text">dashboard</h3>
          </div>
          <div className="btn-container">
            <button
              type="button"
              className="btn"
              onClick={() => setShowLogout(!showLogout)}
            >
              <FaUserCircle />
              {users.name}
              <FaCaretDown />
            </button>

            <div className={showLogout ? "dropdown show-dropdown" : "dropdown"}>
              <button
                type="button"
                className="dropdown-btn"
                onClick={logoutUser}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </Wrapper>
    </Authlink>
  );
};

export default Navbar;
