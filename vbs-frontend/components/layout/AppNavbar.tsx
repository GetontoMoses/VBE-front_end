"use client";

import { AppBar, Toolbar, Typography, Box, Avatar } from "@mui/material";

export default function AppNavbar() {
  return (
    <AppBar
      position="static"
      color="inherit"
      elevation={0}
      sx={{ borderBottom: "1px solid #e0e0e0" }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Vacation Bible School
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Typography variant="body2">Admin</Typography>
          <Avatar sx={{ width: 32, height: 32 }}>A</Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
