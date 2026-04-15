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

type Lesson = {
  id: number;
  program: number;
  title: string;
  date: string;
  bible_text?: string;
  memory_verse?: string;
  summary?: string;
};

export default function LessonsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);

  const [form, setForm] = useState({
    program: "",
    title: "",
    date: "",
    bible_text: "",
    memory_verse: "",
    summary: "",
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

      const [programsRes, lessonsRes] = await Promise.all([
        api.get("/vbs/programs/"),
        api.get("/vbs/lessons/"),
      ]);

      setPrograms(programsRes.data || []);
      setLessons(lessonsRes.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load lessons data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredLessons = useMemo(() => {
    if (selectedProgram === "all") return lessons;
    return lessons.filter(
      (lesson) => String(lesson.program) === selectedProgram,
    );
  }, [lessons, selectedProgram]);

  const handleCreate = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await api.post("/vbs/lessons/", {
        program: Number(form.program),
        title: form.title,
        date: form.date,
        bible_text: form.bible_text,
        memory_verse: form.memory_verse,
        summary: form.summary,
      });

      setSuccess("Lesson created successfully.");
      setForm({
        program: "",
        title: "",
        date: "",
        bible_text: "",
        memory_verse: "",
        summary: "",
      });
      fetchData();
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data
          ? JSON.stringify(err.response.data)
          : "Failed to create lesson.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedRoute>
      <PageContainer>
        <PageHeader
          title="Lessons"
          subtitle="Plan and review Bible lessons for the VBS program."
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
              New Lesson
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
                label="Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                fullWidth
              />

              <TextField
                type="date"
                label="Date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                fullWidth
              />

              <TextField
                label="Bible Text"
                value={form.bible_text}
                onChange={(e) =>
                  setForm({ ...form, bible_text: e.target.value })
                }
                fullWidth
              />

              <TextField
                label="Memory Verse"
                value={form.memory_verse}
                onChange={(e) =>
                  setForm({ ...form, memory_verse: e.target.value })
                }
                multiline
                minRows={2}
                fullWidth
              />

              <TextField
                label="Summary"
                value={form.summary}
                onChange={(e) => setForm({ ...form, summary: e.target.value })}
                multiline
                minRows={4}
                fullWidth
              />

              <Button
                variant="contained"
                onClick={handleCreate}
                disabled={saving || !form.program || !form.title || !form.date}
              >
                {saving ? "Saving..." : "Create Lesson"}
              </Button>
            </Stack>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              sx={{ mb: 3, justifyContent: "space-between" }}
            >
              <Typography variant="h6">Lesson Library</Typography>

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
              {filteredLessons.map((lesson) => (
                <Paper
                  key={lesson.id}
                  variant="outlined"
                  sx={{ p: 2, borderRadius: 2 }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {lesson.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    {lesson.date} • Program #{lesson.program}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Bible Text:</strong> {lesson.bible_text || "-"}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Memory Verse:</strong> {lesson.memory_verse || "-"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {lesson.summary || "No summary available."}
                  </Typography>
                </Paper>
              ))}

              {!loading && filteredLessons.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  No lessons found.
                </Typography>
              )}
            </Stack>
          </Paper>
        </Box>
      </PageContainer>
    </ProtectedRoute>
  );
}
