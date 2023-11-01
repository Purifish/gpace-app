import { useContext, useState } from "react";

import { AuthContext } from "../../contexts/auth-context";
import s from "./style.module.css";
import Logo from "../Logo/Logo";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import { Avatar } from "@mui/material";

const pages = [];

function Header(props) {
  const auth = useContext(AuthContext);
  const { openModal } = props;

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const loggedOutSettings = [
    {
      text: "Login",
      handleClick: () => {
        openModal();
      },
    },
  ];
  const loggedInSettings = [
    {
      text: "Logout",
      handleClick: () => {
        auth.logout();
      },
    },
  ];

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static" sx={{ background: "#0174BE", height: "70px" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Logo />
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page.text}
                  onClick={() => {
                    handleCloseNavMenu();
                    page.handleClick();
                  }}
                >
                  <Typography textAlign="center">{page.text}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page.text}
                onClick={() => {
                  handleCloseNavMenu();
                  page.handleClick();
                }}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {page.text}
              </Button>
            ))}
          </Box>

          <Box sx={{ marginRight: "15px" }}>
            {auth.isLoggedIn && (
              <Typography textAlign="center">
                {auth.userName.split(" ")[0]}
              </Typography>
            )}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar alt="User" src="" />
            </IconButton>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {(auth.isLoggedIn ? loggedInSettings : loggedOutSettings).map(
                (setting) => (
                  <MenuItem
                    key={setting.text}
                    onClick={() => {
                      setting.handleClick();
                      handleCloseUserMenu();
                    }}
                  >
                    <Typography textAlign="center">{setting.text}</Typography>
                  </MenuItem>
                )
              )}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );

  return (
    <div className={`row ${s.container}`}>
      {/*12 on mobile*/}
      <div className="col-xs-6 col-sm-4">
        <Logo />
      </div>
      <div className="col-xs-0 col-sm-4 col-md-5 col-lg-6">
        <h2 className={`${s.welcome}`}>
          {auth.isLoggedIn && `Welcome ${auth.userName.split(" ")[0]}`}
        </h2>
      </div>
      <div className={`col-xs-6 col-sm-4 col-md-3 col-lg-2`}>
        <h2
          className={`${s.auth}`}
          onClick={auth.isLoggedIn ? auth.logout : openModal}
        >
          {auth.isLoggedIn ? "Log Out" : "Log In"}
        </h2>
      </div>
    </div>
  );
}

export default Header;
