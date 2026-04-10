"use client";

import { Box, Button, Paper, Typography } from "@mui/material";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/shared/PageHeader";
import StatsCard from "@/components/shared/StatsCard";

export default function HomePage() {
  return (
    <PageContainer>
      <PageHeader
        title="Dashboard"
        subtitle="Monitor the VBS program, registrations, and attendance."
      />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: 3,
          mb: 4,
        }}
      >
        <StatsCard title="Total Children" value="0" />
        <StatsCard title="Total Guardians" value="0" />
        <StatsCard title="Programs" value="0" />
        <StatsCard title="Attendance Today" value="0" />
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "2fr 1fr",
          },
          gap: 3,
        }}
      >
        <Paper
          sx={{
            p: 4,
            background:
              "linear-gradient(135deg, rgba(46,125,50,0.08), rgba(255,179,0,0.08))",
          }}
        >
          <Typography variant="h5" gutterBottom>
            Welcome to VBS Admin
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Manage guardians, children, programs, registrations, attendance,
            lessons, and activities from one place.
          </Typography>

          <Button variant="contained">Get Started</Button>
        </Paper>

        <Paper sx={{ p: 4 }}>
          <Typography variant="h6" gutterBottom>
            Quick Notes
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Start by creating a program, then add guardians and children.
          </Typography>

          <Typography variant="body2" color="text.secondary">
            After that, register children into the active program and begin
            tracking attendance.
          </Typography>
        </Paper>
      </Box>
    </PageContainer>
  );
}
