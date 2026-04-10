"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import EventIcon from "@mui/icons-material/Event";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import CelebrationIcon from "@mui/icons-material/Celebration";

const drawerWidth = 240;

const menuItems = [
  { text: "Dashboard", href: "/", icon: <DashboardIcon /> },
  { text: "Guardians", href: "/guardians", icon: <FamilyRestroomIcon /> },
  { text: "Children", href: "/children", icon: <ChildCareIcon /> },
  { text: "Programs", href: "/programs", icon: <EventIcon /> },
  {
    text: "Registrations",
    href: "/registrations",
    icon: <AppRegistrationIcon />,
  },
  { text: "Attendance", href: "/attendance", icon: <HowToRegIcon /> },
  { text: "Lessons", href: "/lessons", icon: <MenuBookIcon /> },
  { text: "Activities", href: "/activities", icon: <CelebrationIcon /> },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          borderRight: "1px solid #e5e7eb",
        },
      }}
    >
      <Toolbar>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            VBS Admin
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Management System
          </Typography>
        </Box>
      </Toolbar>

      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            component={Link}
            href={item.href}
            selected={pathname === item.href}
            sx={{
              mx: 1,
              my: 0.5,
              borderRadius: 2,
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
}
