import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Logout from "../Forms/Logout";
import { useContext } from "react";
import { FormContext } from "../../context/FormContext";
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const getUser = (user) => {
  return (
    <div
      className="chat col-lg-12"
      style={{
        backgroundColor: "white",
      }}
    >
      <div class="chat-header clearfix">
        <div class="row">
          <div class="col-lg-6">
            <a href="#">
              <img src={user?.picture} alt="avatar" />
            </a>
            <span className="float-right">
              <Logout />
            </span>
            <div class="chat-about">
              <h6 class="mt-3" style={{ fontSize: "10px" }}>
                {user.display_name}<br/>
                {user.email.split("@")[0]}
              </h6>
            </div>
          </div>
          <div class="col-lg-6"></div>
        </div>
      </div>
    </div>
  );
};

const drawerWidth = 240;

export default function LeftPane() {
  const { socket, messages, user, setChatInfo, activeUsers, users } = useContext(FormContext);
  const name = `${user.name.split(" ")[0]} ${user.family_name}`;
  const filterUser = activeUsers.filter(e=>e.email!==user.email)
  user["display_name"] = name;
  React.useEffect(()=>{
    socket.emit("activate_user", user)
  },[])
  
  const email = () => {
    return (
      <div>
        <div class="row clearfix">
          <div class="col-lg-12">
            <div class="card">
              <div id="plist" class="people-list">
                <ul class="list-unstyled chat-list mt-2 mb-0">
                  {users.map((e,i) => (
                    e.email !==user.email &&
                    <li key={i} class="clearfix" onClick={() => setChatInfo(e)}>
                      <img
                        src="https://bootdey.com/img/Content/avatar/avatar1.png"
                        alt="avatar"
                      />
                      <div class="about">
                        <div class="name">{e.name}</div>
                        <div class="status">
                          <i class="fa fa-circle offline"></i> left 7 mins ago{" "}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const online_users = () => {
    // console.log(activeUsers);
    return (
      <div>
        <div class="row clearfix">
          <div class="col-lg-12">
            <div class="card">
              <div id="plist" class="people-list">
                <ul class="list-unstyled chat-list mt-2 mb-0">
                {filterUser.length>0? filterUser.map((e) => (
                    <li class="clearfix" onClick={() => setChatInfo(e)}>
                      <img
                        src={e.picture}
                        alt="avatar"
                      />
                      <div class="about">
                        <div class="name">{e.name}</div>
                        <div class="status">
                          <i class="fa fa-circle online"></i> online{" "}
                        </div>
                      </div>
                    </li>
                  )): "No online users"}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  function LeftPaneTab() {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    return (
      <Box sx={{ width: "100%" }}>
        <Box>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="Email" {...a11yProps(0)} />
            <Tab label="Online Status" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          {email()}
        </TabPanel>
        <TabPanel value={value} index={1}>
          {online_users()}
        </TabPanel>
      </Box>
    );
  }

  return (
    <>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        {getUser(user)}
        <LeftPaneTab />
      </Drawer>
    </>
  );
}
