import React, { useState } from "react";
import Wrapper from "../../assets/wrappers/DashboardFormPage.js";
import { Alert } from "../../components";
import FormRow from "../../components/FormRow";
import { useAppContext } from "../../context/appContext";
import Authlink from "../Authlink.js";

const Profile = () => {
  const { isLoading, showAlert, displayAlert, users, updateUser } =
    useAppContext();
  const [name, setName] = useState(users.name);
  const [email, setEmail] = useState(users.email);
  const [lastname, setLastname] = useState(users.lastname);
  const [location, setLocation] = useState(users.location);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !name || !lastname || !location) {
      displayAlert();
      return;
    }
    const currentUser = { name, email, lastname, location };
    updateUser(currentUser, { alertText: "Update Successfully!" });
  };
  return (
    <>
      {/* <Authlink> */}
      <Wrapper>
        <form className="form" onSubmit={handleSubmit}>
          <h3>Profile</h3>
          {showAlert && <Alert />}
          <div className="form-center">
            <FormRow
              type="text"
              name="name"
              value={name}
              handleChange={(e) => setName(e.target.value)}
            />
            <FormRow
              type="text"
              name="lastname"
              value={lastname}
              handleChange={(e) => setLastname(e.target.value)}
            />
            <FormRow
              type="text"
              name="email"
              value={email}
              handleChange={(e) => setEmail(e.target.value)}
            />
            <FormRow
              type="text"
              name="location"
              value={location}
              handleChange={(e) => setLocation(e.target.value)}
            />
            <button
              className="btn btn-block"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Please Wait..." : "Save Change"}
            </button>
          </div>
        </form>
      </Wrapper>
      {/* </Authlink> */}
    </>
  );
};

export default Profile;
