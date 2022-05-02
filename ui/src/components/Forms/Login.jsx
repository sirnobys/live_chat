import * as React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Button from "@mui/material/Button";
import { useContext } from "react";
import { FormContext } from "../../context/FormContext";

const Login = () => {
  const { socket, room, setEmail } = useContext(FormContext);
  const { loginWithRedirect, isAuthenticated, isLoading, user } = useAuth0();
 
  if (isLoading) {
    return "loading";
  }
  if (!isAuthenticated && !isLoading) {
    return (
      <div>
        <Button onClick={() => [loginWithRedirect()]}>login</Button>
      </div>
    );
  }
};

export default Login;
