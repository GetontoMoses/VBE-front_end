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

interface GuardianOption {
  id: number;
  full_name: string;
}

export default function EditChildPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [guardians, setGuardians] = useState<GuardianOption[]>([]);
  const [form, setForm] = useState({
    guardian: "",
    first_name: "",
    last_name: "",
    date_of_birth: "",
    gender: "",
    school_name: "",
    allergies: "",
    medical_notes: "",
    special_needs: "",
    is_first_time_attendee: true,
    notes: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [childRes, guardiansRes] = await Promise.all([
          api.get(`/vbs/children/${id}/`),
          api.get("/vbs/guardians/"),
        ]);

        const child = childRes.data;

        setGuardians(Array.isArray(guardiansRes.data) ? guardiansRes.data : []);
        setForm({
          guardian: child.guardian ? String(child.guardian) : "",
          first_name: child.first_name || "",
          last_name: child.last_name || "",
          date_of_birth: child.date_of_birth || "",
          gender: child.gender || "",
          school_name: child.school_name || "",
          allergies: child.allergies || "",
          medical_notes: child.medical_notes || "",
          special_needs: child.special_needs || "",
          is_first_time_attendee: child.is_first_time_attendee ?? true,
          notes: child.notes || "",
        });
      } catch {
        setError("Failed to load child details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) loadData();
  }, [id]);

  const handleChange = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      await api.put(`/vbs/children/${id}/`, {
        ...form,
        guardian: Number(form.guardian),
      });
      setSuccess("Child updated successfully.");
      setTimeout(() => router.push("/children"), 800);
    } catch {
      setError("Failed to update child.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <PageContainer>
        <PageHeader title="Edit Child" subtitle="Update child details." />

        <FormCard title="Child Details">
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
                  select
                  label="Guardian"
                  value={form.guardian}
                  onChange={(e) => handleChange("guardian", e.target.value)}
                  required
                  fullWidth
                >
                  {guardians.map((guardian) => (
                    <MenuItem key={guardian.id} value={guardian.id}>
                      {guardian.full_name}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  label="First Name"
                  value={form.first_name}
                  onChange={(e) => handleChange("first_name", e.target.value)}
                  required
                  fullWidth
                />

                <TextField
                  label="Last Name"
                  value={form.last_name}
                  onChange={(e) => handleChange("last_name", e.target.value)}
                  required
                  fullWidth
                />

                <TextField
                  type="date"
                  label="Date of Birth"
                  value={form.date_of_birth}
                  onChange={(e) =>
                    handleChange("date_of_birth", e.target.value)
                  }
                  required
                  fullWidth
              
                />

                <TextField
                  select
                  label="Gender"
                  value={form.gender}
                  onChange={(e) => handleChange("gender", e.target.value)}
                  required
                  fullWidth
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                </TextField>

                <TextField
                  label="School Name"
                  value={form.school_name}
                  onChange={(e) => handleChange("school_name", e.target.value)}
                  fullWidth
                />

                <TextField
                  label="Allergies"
                  value={form.allergies}
                  onChange={(e) => handleChange("allergies", e.target.value)}
                  multiline
                  minRows={2}
                  fullWidth
                />

                <TextField
                  label="Medical Notes"
                  value={form.medical_notes}
                  onChange={(e) =>
                    handleChange("medical_notes", e.target.value)
                  }
                  multiline
                  minRows={2}
                  fullWidth
                />

                <TextField
                  label="Special Needs"
                  value={form.special_needs}
                  onChange={(e) =>
                    handleChange("special_needs", e.target.value)
                  }
                  multiline
                  minRows={2}
                  fullWidth
                />

                <TextField
                  label="Notes"
                  value={form.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  multiline
                  minRows={3}
                  fullWidth
                  sx={{ gridColumn: { md: "1 / -1" } }}
                />

                <Box sx={{ gridColumn: { md: "1 / -1" }, mt: 1 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={submitting}
                  >
                    {submitting ? "Saving..." : "Update Child"}
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
