"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/shared/PageHeader";
import StatsCard from "@/components/shared/StatsCard";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import api from "@/lib/api";

type Child = {
  id: number;
  first_name: string;
  last_name: string;
  full_name?: string;
};

type Guardian = {
  id: number;
  full_name: string;
};

type Program = {
  id: number;
  title: string;
  theme: string;
  status: string;
  start_date: string;
  end_date: string;
};

type Registration = {
  id: number;
  child: number;
  child_name?: string;
  program: number;
  program_title?: string;
  group: number | null;
  group_name?: string;
  status: string;
  pickup_notes?: string;
};

type Attendance = {
  id: number;
  registration: number;
  child_name?: string;
  date: string;
  status: string;
};

type Lesson = {
  id: number;
  title: string;
  date: string;
  bible_text?: string;
};

type Activity = {
  id: number;
  name: string;
  day: string;
  location?: string;
  start_time: string;
  end_time: string;
};

export default function HomePage() {
  const [children, setChildren] = useState<Child[]>([]);
  const [guardians, setGuardians] = useState<Guardian[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  const [selectedProgram, setSelectedProgram] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const fetchDashboardData = async (isRefresh = false) => {
    try {
      setError("");
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const [
        childrenRes,
        guardiansRes,
        programsRes,
        registrationsRes,
        attendanceRes,
        lessonsRes,
        activitiesRes,
      ] = await Promise.all([
        api.get("/vbs/children/"),
        api.get("/vbs/guardians/"),
        api.get("/vbs/programs/"),
        api.get("/vbs/registrations/"),
        api.get("/vbs/attendance/"),
        api.get("/vbs/lessons/"),
        api.get("/vbs/activities/"),
      ]);

      setChildren(childrenRes.data || []);
      setGuardians(guardiansRes.data || []);
      setPrograms(programsRes.data || []);
      setRegistrations(registrationsRes.data || []);
      setAttendance(attendanceRes.data || []);
      setLessons(lessonsRes.data || []);
      setActivities(activitiesRes.data || []);
    } catch (err: any) {
      console.error(err);
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const activePrograms = useMemo(
    () => programs.filter((p) => p.status === "active"),
    [programs],
  );

  const filteredRegistrations = useMemo(() => {
    if (selectedProgram === "all") return registrations;
    return registrations.filter(
      (r) => String(r.program) === String(selectedProgram),
    );
  }, [registrations, selectedProgram]);

  const todayAttendance = useMemo(() => {
    const registrationIds = new Set(filteredRegistrations.map((r) => r.id));
    return attendance.filter(
      (a) => a.date === today && registrationIds.has(a.registration),
    );
  }, [attendance, filteredRegistrations, today]);

  const attendanceSummary = useMemo(() => {
    const present = todayAttendance.filter(
      (a) => a.status === "present",
    ).length;
    const absent = todayAttendance.filter((a) => a.status === "absent").length;
    const late = todayAttendance.filter((a) => a.status === "late").length;
    return { present, absent, late };
  }, [todayAttendance]);

  const todayLessons = useMemo(
    () => lessons.filter((l) => l.date === today),
    [lessons, today],
  );

  const todayActivities = useMemo(
    () => activities.filter((a) => a.day === today),
    [activities, today],
  );

  const recentRegistrations = useMemo(
    () => [...registrations].slice(-5).reverse(),
    [registrations],
  );

  const upcomingActivities = useMemo(() => {
    return [...activities]
      .filter((a) => a.day >= today)
      .sort((a, b) =>
        `${a.day} ${a.start_time}`.localeCompare(`${b.day} ${b.start_time}`),
      )
      .slice(0, 5);
  }, [activities, today]);

  const activeProgramTitle =
    selectedProgram === "all"
      ? "All Programs"
      : programs.find((p) => String(p.id) === selectedProgram)?.title ||
        "Program";

  if (loading) {
    return (
      <ProtectedRoute>
        <PageContainer>
          <Box
            sx={{
              minHeight: "60vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress />
          </Box>
        </PageContainer>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <PageContainer>
        <PageHeader
          title="Dashboard"
          subtitle="Monitor live VBS activity, registrations, attendance, lessons, and upcoming events."
        />

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          sx={{
            justifyContent: "space-between",
            alignItems: { xs: "stretch", md: "center" },
            mb: 3,
          }}
        >
          <TextField
            select
            label="Filter by Program"
            value={selectedProgram}
            onChange={(e) => setSelectedProgram(e.target.value)}
            sx={{ minWidth: { xs: "100%", md: 280 } }}
          >
            <MenuItem value="all">All Programs</MenuItem>
            {programs.map((program) => (
              <MenuItem key={program.id} value={String(program.id)}>
                {program.title}
              </MenuItem>
            ))}
          </TextField>

          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              onClick={() => fetchDashboardData(true)}
              disabled={refreshing}
            >
              {refreshing ? "Refreshing..." : "Refresh Data"}
            </Button>

            <Button component={Link} href="/registrations" variant="contained">
              Manage Registrations
            </Button>
          </Stack>
        </Stack>

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
          <StatsCard title="Total Children" value={String(children.length)} />
          <StatsCard title="Total Guardians" value={String(guardians.length)} />
          <StatsCard title="Programs" value={String(programs.length)} />
          <StatsCard
            title="Attendance Today"
            value={String(todayAttendance.length)}
          />
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <Paper
              sx={{
                p: 4,
                height: "100%",
                background:
                  "linear-gradient(135deg, rgba(46,125,50,0.08), rgba(255,179,0,0.10))",
              }}
            >
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{
                  justifyContent: "space-between",
                  alignItems: { xs: "flex-start", sm: "center" },
                  mb: 2,
                }}
              >
                <Box>
                  <Typography variant="h5" gutterBottom>
                    Welcome to VBS Admin
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    You are viewing: <strong>{activeProgramTitle}</strong>
                  </Typography>
                </Box>

                <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                  <Chip
                    label={`${activePrograms.length} Active Program${
                      activePrograms.length === 1 ? "" : "s"
                    }`}
                    color="success"
                    variant="outlined"
                  />
                  <Chip
                    label={`${todayLessons.length} Lessons Today`}
                    color="primary"
                    variant="outlined"
                  />
                  <Chip
                    label={`${todayActivities.length} Activities Today`}
                    color="warning"
                    variant="outlined"
                  />
                </Stack>
              </Stack>

              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Manage registrations, take attendance, plan lessons, and
                coordinate activities from one place with up-to-date data from
                your backend.
              </Typography>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button component={Link} href="/attendance" variant="contained">
                  Take Attendance
                </Button>
                <Button component={Link} href="/lessons" variant="outlined">
                  View Lessons
                </Button>
                <Button component={Link} href="/activities" variant="outlined">
                  View Activities
                </Button>
              </Stack>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, lg: 4 }}>
            <Paper sx={{ p: 4, height: "100%" }}>
              <Typography variant="h6" gutterBottom>
                Today&apos;s Attendance Summary
              </Typography>

              <Stack spacing={1.5} sx={{ mt: 2 }}>
                <Chip
                  label={`Present: ${attendanceSummary.present}`}
                  color="success"
                  variant="outlined"
                />
                <Chip
                  label={`Absent: ${attendanceSummary.absent}`}
                  color="error"
                  variant="outlined"
                />
                <Chip
                  label={`Late: ${attendanceSummary.late}`}
                  color="warning"
                  variant="outlined"
                />
              </Stack>

              <Divider sx={{ my: 3 }} />

              <Typography variant="body2" color="text.secondary">
                Tip: Start the day by checking active registrations, then mark
                attendance, then review lessons and activities planned for the
                day.
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <Paper sx={{ p: 3, height: "100%" }}>
              <Typography variant="h6" gutterBottom>
                Recent Registrations
              </Typography>

              {recentRegistrations.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No registrations yet.
                </Typography>
              ) : (
                <List dense>
                  {recentRegistrations.map((item) => (
                    <ListItem key={item.id} disableGutters>
                      <ListItemText
                        primary={item.child_name || `Child #${item.child}`}
                        secondary={`${item.program_title || `Program #${item.program}`} • ${item.status}`}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <Paper sx={{ p: 3, height: "100%" }}>
              <Typography variant="h6" gutterBottom>
                Today&apos;s Lessons
              </Typography>

              {todayLessons.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No lessons scheduled for today.
                </Typography>
              ) : (
                <List dense>
                  {todayLessons.map((lesson) => (
                    <ListItem key={lesson.id} disableGutters>
                      <ListItemText
                        primary={lesson.title}
                        secondary={
                          lesson.bible_text || "No Bible text provided"
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 12, lg: 4 }}>
            <Paper sx={{ p: 3, height: "100%" }}>
              <Typography variant="h6" gutterBottom>
                Upcoming Activities
              </Typography>

              {upcomingActivities.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No upcoming activities.
                </Typography>
              ) : (
                <List dense>
                  {upcomingActivities.map((activity) => (
                    <ListItem key={activity.id} disableGutters>
                      <ListItemText
                        primary={activity.name}
                        secondary={`${activity.day} • ${activity.start_time} - ${activity.end_time}${
                          activity.location ? ` • ${activity.location}` : ""
                        }`}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Paper>
          </Grid>
        </Grid>
      </PageContainer>
    </ProtectedRoute>
  );
}
