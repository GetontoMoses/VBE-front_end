"use client";

import { useState } from "react";
import { Alert, Box, Button, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/shared/PageHeader";
import FormCard from "@/components/shared/FormCard";
import api from "@/lib/api";
import Link from "next/link";

export default function NewGuardianPage() {
  const router = useRouter();

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
      await api.post("/vbs/guardians/", form);
      setSuccess("Guardian created successfully.");
      setTimeout(() => router.push("/guardians"), 800);
    } catch {
      setError("Failed to create guardian.");
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

        <FormCard title="Guardian Details">
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
              <Button type="submit" variant="contained" disabled={submitting}>
                {submitting ? "Saving..." : "Save Guardian"}
              </Button>
            </Box>
          </Box>
        </FormCard>
      </PageContainer>
    </ProtectedRoute>
  );
}
