"use client";

import { useState } from "react";
import Link from "next/link";
import { Alert, Box, Button, MenuItem, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/shared/PageHeader";
import FormCard from "@/components/shared/FormCard";
import api from "@/lib/api";

export default function NewProgramPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    theme: "",
    start_date: "",
    end_date: "",
    venue: "",
    description: "",
    status: "draft",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      await api.post("/vbs/programs/", form);
      setSuccess("Program created successfully.");
      setTimeout(() => router.push("/programs"), 800);
    } catch {
      setError("Failed to create program.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <PageContainer>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", md: "center" },
            gap: 2,
            mb: 3,
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <PageHeader
            title="Guardians"
            subtitle="Manage parents and guardians responsible for children."
          />
          <Button component={Link} href="/guardians/new" variant="contained">
            Add Guardian
          </Button>
        </Box>

        <FormCard title="Program Details">
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <TextField
              label="Title"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Theme"
              value={form.theme}
              onChange={(e) => handleChange("theme", e.target.value)}
              required
              fullWidth
            />
            <TextField
              type="date"
              label="Start Date"
              value={form.start_date}
              onChange={(e) => handleChange("start_date", e.target.value)}
              required
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              type="date"
              label="End Date"
              value={form.end_date}
              onChange={(e) => handleChange("end_date", e.target.value)}
              required
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              label="Venue"
              value={form.venue}
              onChange={(e) => handleChange("venue", e.target.value)}
              required
              fullWidth
            />
            <TextField
              select
              label="Status"
              value={form.status}
              onChange={(e) => handleChange("status", e.target.value)}
              fullWidth
            >
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="closed">Closed</MenuItem>
            </TextField>
            <TextField
              label="Description"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              multiline
              minRows={4}
              fullWidth
              sx={{ gridColumn: { md: "1 / -1" } }}
            />

            <Box sx={{ gridColumn: { md: "1 / -1" }, mt: 1 }}>
              <Button type="submit" variant="contained" disabled={submitting}>
                {submitting ? "Saving..." : "Save Program"}
              </Button>
            </Box>
          </Box>
        </FormCard>
      </PageContainer>
    </ProtectedRoute>
  );
}
