import React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import LeftPane from "./LeftPane/LeftPane";
import MainPane from "./MainPane/MainPane";
import { useAuth0 } from "@auth0/auth0-react";
import { useContext } from "react";
import { FormContext } from "../context/FormContext";

function Main() {
  const { socket, curUser } = useContext(FormContext);
  return (
    <div>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <Box>
          <LeftPane />
        </Box>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          <MainPane />
        </Box>
      </Box>
    </div>
  );
}

export default Main;
