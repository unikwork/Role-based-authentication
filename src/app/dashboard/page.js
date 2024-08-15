"use client";
import React, { useState } from "react";
import { useAuth } from "@/context/useAuth";
import withRoleProtection from "@/context/withRoleProtection";
import {
  AppBar as MuiAppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer as MuiDrawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Menu as MenuIcon,
  ChevronRight as ChevronRightIcon,
  ChevronLeft as ChevronLeftIcon,
  Inbox as InboxIcon,
  Mail as MailIcon,
  AccountCircle,
} from "@mui/icons-material";
import { styled, useTheme } from "@mui/material/styles";
import { useRouter } from "next/navigation";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme?.transitions?.create("width", {
    easing: theme?.transitions?.easing?.sharp,
    duration: theme?.transitions?.duration?.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme?.transitions?.create("width", {
    easing: theme?.transitions?.easing?.sharp,
    duration: theme?.transitions?.duration?.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme?.spacing(7)} + 1px)`,
  [theme?.breakpoints.up("sm")]: {
    width: `calc(${theme?.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme?.zIndex?.drawer + 1,
  transition: theme?.transitions?.create(["width", "margin"], {
    easing: theme?.transitions?.easing?.sharp,
    duration: theme?.transitions?.duration?.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme?.transitions?.create(["width", "margin"], {
      easing: theme?.transitions?.easing?.sharp,
      duration: theme?.transitions?.duration?.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const Dashboard = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [page, setPage] = useState("Home");

  const adminPages = ["Admin", "Home", "About", "Services", "Contact"];
  const userPages = ["Home", "About", "Services"];

  const pages = () => {
    if (user?.role === "admin") {
      return adminPages || [];
    }
    if (user?.role === "user") {
      return userPages || [];
    }
  };

  const pageLoad = () => {
    switch (page) {
      case "Admin":
        return <Typography paragraph>Admin page</Typography>;
      case "Home":
        return <Typography paragraph>Home page</Typography>;
      case "About":
        return <Typography paragraph>About page</Typography>;
      case "Services":
        return <Typography paragraph>Services page</Typography>;
      case "Contact":
        return <Typography paragraph>Contact page</Typography>;
      default:
        return <Typography paragraph>Home page</Typography>;
    }
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <div>
        Admin dashboard
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <AppBar position="fixed" open={open}>
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={{
                  marginRight: 5,
                  ...(open && { display: "none" }),
                }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                {user.role === "admin"
                  ? "Admin "
                  : user.role === "user"
                  ? "User "
                  : null}
                Dashboard
              </Typography>
              <div>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  {/* <MenuItem onClick={handleClose}>Profile</MenuItem> */}
                  <MenuItem
                    onClick={() => {
                      handleClose();
                      localStorage.removeItem("token");
                      router.push("/login");
                    }}
                  >
                    Log Out
                  </MenuItem>
                </Menu>
              </div>
            </Toolbar>
          </AppBar>
          <Drawer variant="permanent" open={open}>
            <DrawerHeader>
              <IconButton onClick={handleDrawerClose}>
                {theme.direction === "rtl" ? (
                  <ChevronRightIcon />
                ) : (
                  <ChevronLeftIcon />
                )}
              </IconButton>
            </DrawerHeader>
            <Divider />
            <List>
              {pages()?.map((text, index) => (
                <ListItem
                  key={text}
                  disablePadding
                  sx={{ display: "block" }}
                  selected={page === text}
                  onClick={() => setPage(text)}
                >
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                      }}
                    >
                      {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                    </ListItemIcon>
                    <ListItemText
                      primary={text}
                      sx={{ opacity: open ? 1 : 0 }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Drawer>
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <DrawerHeader />
            {pageLoad()}
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default withRoleProtection(Dashboard, ["admin", "user"]);
