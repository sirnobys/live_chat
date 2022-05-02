import * as React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import LogoutIcon from '@mui/icons-material/Logout';
import IconButton from '@mui/material/IconButton';
import { FormContext } from "../../context/FormContext";
const Logout = () => {
  const { logout } = useAuth0();
  const { socket, user } = React.useContext(FormContext);
  React.useEffect(()=>{
    socket.emit("deacivate_user", user)
  },[])
  return(
      <div>
          <IconButton onClick={()=>logout()}><LogoutIcon/></IconButton>
      </div>
  )
};

export default Logout;
