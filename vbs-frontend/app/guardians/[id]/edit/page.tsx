"use client";

import { useEffect, useState } from "react";
import { Alert, Box, Button, CircularProgress, TextField } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/shared/PageHeader";
import FormCard from "@/components/shared/FormCard";
import api from "@/lib/api";

export default function EditGuardianPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [form, setForm] = useState({
    full_name: "",
    phone_number: "",
    email: "",
    relationship_to_child: "",
    address: "",
    home_church: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchGuardian = async () => {
      try {
        const response = await api.get(`/vbs/guardians/${id}/`);
        setForm({
          full_name: response.data.full_name || "",
          phone_number: response.data.phone_number || "",
          email: response.data.email || "",
          relationship_to_child: response.data.relationship_to_child || "",
          address: response.data.address || "",
          home_church: response.data.home_church || "",
          emergency_contact_name: response.data.emergency_contact_name || "",
          emergency_contact_phone: response.data.emergency_contact_phone || "",
        });
      } catch {
        setError("Failed to load guardian.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchGuardian();
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
      await api.put(`/vbs/guardians/${id}/`, form);
      setSuccess("Guardian updated successfully.");
      setTimeout(() => router.push("/guardians"), 800);
    } catch {
      setError("Failed to update guardian.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <PageContainer>
        <PageHeader title="Edit Guardian" subtitle="Update guardian details." />

        <FormCard title="Guardian Details">
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
                  label="Full Name"
                  value={form.full_name}
                  onChange={(e) => handleChange("full_name", e.target.value)}
                  required
                  fullWidth
                />
                <TextField
                  label="Phone Number"
                  value={form.phone_number}
                  onChange={(e) => handleChange("phone_number", e.target.value)}
                  required
                  fullWidth
                />
                <TextField
                  label="Email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Relationship to Child"
                  value={form.relationship_to_child}
                  onChange={(e) =>
                    handleChange("relationship_to_child", e.target.value)
                  }
                  fullWidth
                />
                <TextField
                  label="Home Church"
                  value={form.home_church}
                  onChange={(e) => handleChange("home_church", e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Emergency Contact Name"
                  value={form.emergency_contact_name}
                  onChange={(e) =>
                    handleChange("emergency_contact_name", e.target.value)
                  }
                  fullWidth
                />
                <TextField
                  label="Emergency Contact Phone"
                  value={form.emergency_contact_phone}
                  onChange={(e) =>
                    handleChange("emergency_contact_phone", e.target.value)
                  }
                  fullWidth
                />
                <TextField
                  label="Address"
                  value={form.address}
                  onChange={(e) => handleChange("address", e.target.value)}
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
                    {submitting ? "Saving..." : "Update Guardian"}
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
