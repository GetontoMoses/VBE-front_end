"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/shared/PageHeader";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import api from "@/lib/api";

type Program = {
  id: number;
  title: string;
};

type Activity = {
  id: number;
  program: number;
  name: string;
  description?: string;
  location?: string;
  day: string;
  start_time: string;
  end_time: string;
};

export default function ActivitiesPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  const [form, setForm] = useState({
    program: "",
    name: "",
    description: "",
    location: "",
    day: "",
    start_time: "",
    end_time: "",
  });

  const [selectedProgram, setSelectedProgram] = useState("all");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [programsRes, activitiesRes] = await Promise.all([
        api.get("/vbs/programs/"),
        api.get("/vbs/activities/"),
      ]);

      setPrograms(programsRes.data || []);
      setActivities(activitiesRes.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load activities data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredActivities = useMemo(() => {
    if (selectedProgram === "all") return activities;
    return activities.filter(
      (activity) => String(activity.program) === selectedProgram,
    );
  }, [activities, selectedProgram]);

  const handleCreate = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await api.post("/vbs/activities/", {
        program: Number(form.program),
        name: form.name,
        description: form.description,
        leader: null,
        location: form.location,
        day: form.day,
        start_time: form.start_time,
        end_time: form.end_time,
      });

      setSuccess("Activity created successfully.");
      setForm({
        program: "",
        name: "",
        description: "",
        location: "",
        day: "",
        start_time: "",
        end_time: "",
      });
      fetchData();
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data
          ? JSON.stringify(err.response.data)
          : "Failed to create activity.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedRoute>
      <PageContainer>
        <PageHeader
          title="Activities"
          subtitle="Coordinate games, worship sessions, quizzes, and other VBS events."
        />

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "360px 1fr" },
            gap: 3,
          }}
        >
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              New Activity
            </Typography>

            <Stack spacing={2}>
              <TextField
                select
                label="Program"
                value={form.program}
                onChange={(e) => setForm({ ...form, program: e.target.value })}
                fullWidth
              >
                {programs.map((program) => (
                  <MenuItem key={program.id} value={program.id}>
                    {program.title}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Activity Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                fullWidth
              />

              <TextField
                label="Description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                multiline
                minRows={3}
                fullWidth
              />

              <TextField
                label="Location"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                fullWidth
              />

              <TextField
                type="date"
                label="Day"
                value={form.day}
                onChange={(e) => setForm({ ...form, day: e.target.value })}
        
                fullWidth
              />

              <TextField
                type="time"
                label="Start Time"
                value={form.start_time}
                onChange={(e) =>
                  setForm({ ...form, start_time: e.target.value })
                }

                fullWidth
              />

              <TextField
                type="time"
                label="End Time"
                value={form.end_time}
                onChange={(e) => setForm({ ...form, end_time: e.target.value })}

                fullWidth
              />

              <Button
                variant="contained"
                onClick={handleCreate}
                disabled={
                  saving ||
                  !form.program ||
                  !form.name ||
                  !form.day ||
                  !form.start_time ||
                  !form.end_time
                }
              >
                {saving ? "Saving..." : "Create Activity"}
              </Button>
            </Stack>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              sx={{ mb: 3, justifyContent: "space-between" }}
            >
              <Typography variant="h6">Scheduled Activities</Typography>

              <TextField
                select
                label="Filter by Program"
                value={selectedProgram}
                onChange={(e) => setSelectedProgram(e.target.value)}
                sx={{ minWidth: 220 }}
              >
                <MenuItem value="all">All Programs</MenuItem>
                {programs.map((program) => (
                  <MenuItem key={program.id} value={String(program.id)}>
                    {program.title}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>

            <Stack spacing={2}>
              {filteredActivities.map((activity) => (
                <Paper
                  key={activity.id}
                  variant="outlined"
                  sx={{ p: 2, borderRadius: 2 }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {activity.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    {activity.day} • {activity.start_time} - {activity.end_time}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Location:</strong> {activity.location || "-"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {activity.description || "No description provided."}
                  </Typography>
                </Paper>
              ))}

              {!loading && filteredActivities.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  No activities found.
                </Typography>
              )}
            </Stack>
          </Paper>
        </Box>
      </PageContainer>
    </ProtectedRoute>
  );
}
