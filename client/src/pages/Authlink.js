import { useEffect } from "react";
import { isExpired } from "react-jwt";
import { useNavigate } from "react-router-dom";

const Authlink = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const exp = isExpired(localStorage.getItem("token"));

    if (exp) {
      localStorage.clear();

      navigate("register");
    }
  }, [localStorage.getItem("token"), navigate]);

  return <>{children}</>;
};

export default Authlink;
