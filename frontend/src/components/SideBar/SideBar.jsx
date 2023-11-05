import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import s from "./style.module.css";

const resources = ["Notes", "Videos", "Quizzes", "Exams", "FAQ", "Tutors"];

function SideBar() {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // const toggleDrawer = (open) => (event) => {
  //   if (
  //     event.type === "keydown" &&
  //     (event.key === "Tab" || event.key === "Shift")
  //   ) {
  //     return;
  //   }

  //   setIsCollapsed(open);
  // };

  function handleClick() {
    setIsCollapsed((prev) => !prev);
  }

  const items = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      // onClick={() => toggleDrawer(false)}
      // onKeyDown={() => toggleDrawer(false)}
    >
      <List>
        {resources.map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton
              onClick={() => {
                navigate(`./../${text.toLowerCase()}`);
              }}
            >
              {/* <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon> */}
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      {/* <Divider />
      <List>
        {["All mail", "Trash", "Spam"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List> */}
    </Box>
  );

  return (
    <>
      {!isCollapsed && <div className={`${s.container}`}>{items()}</div>}
      <div
        className={`${s.btn_container} ${
          isCollapsed ? s.btn_collapsed : s.btn_expand
        }`}
        onClick={handleClick}
      >
        {`${isCollapsed ? ">" : "<"}`}
      </div>
    </>
  );
}

export default SideBar;