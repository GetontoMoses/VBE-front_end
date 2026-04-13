"use client";

import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  MenuItem,
  TextField,
} from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/shared/PageHeader";
import FormCard from "@/components/shared/FormCard";
import api from "@/lib/api";

export default function EditProgramPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [form, setForm] = useState({
    title: "",
    theme: "",
    start_date: "",
    end_date: "",
    venue: "",
    description: "",
    status: "draft",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        const response = await api.get(`/vbs/programs/${id}/`);
        setForm({
          title: response.data.title || "",
          theme: response.data.theme || "",
          start_date: response.data.start_date || "",
          end_date: response.data.end_date || "",
          venue: response.data.venue || "",
          description: response.data.description || "",
          status: response.data.status || "draft",
        });
      } catch {
        setError("Failed to load program.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProgram();
  }, [id]);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      await api.put(`/vbs/programs/${id}/`, form);
      setSuccess("Program updated successfully.");
      setTimeout(() => router.push("/programs"), 800);
    } catch {
      setError("Failed to update program.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <PageContainer>
        <PageHeader title="Edit Program" subtitle="Update program details." />

        <FormCard title="Program Details">
          {loading ? (
            <Box sx={{ py: 4, display: "flex", justifyContent: "center" }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
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
                
                />
                <TextField
                  type="date"
                  label="End Date"
                  value={form.end_date}
                  onChange={(e) => handleChange("end_date", e.target.value)}
                  required
                  fullWidth
              
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
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={submitting}
                  >
                    {submitting ? "Saving..." : "Update Program"}
                  </Button>
                </Box>
              </Box>
            </>
          )}
        </FormCard>
      </PageContainer>
    </ProtectedRoute>
  );
}
