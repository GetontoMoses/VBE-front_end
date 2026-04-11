"use client";

import { useEffect, useState } from "react";
import { Alert, Box, Button, MenuItem, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/shared/PageHeader";
import FormCard from "@/components/shared/FormCard";
import api from "@/lib/api";

interface RegistrationOption {
  id: number;
  child_name?: string;
  program_title?: string;
}

export default function NewAttendancePage() {
  const router = useRouter();

  const [registrations, setRegistrations] = useState<RegistrationOption[]>([]);
  const [form, setForm] = useState({
    registration: "",
    date: "",
    status: "present",
    check_in_time: "",
    check_out_time: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadRegistrations = async () => {
      try {
        const response = await api.get("/vbs/registrations/");
        setRegistrations(Array.isArray(response.data) ? response.data : []);
      } catch {
        setError("Failed to load registrations.");
      }
    };

    loadRegistrations();
  }, []);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      await api.post("/vbs/attendance/", {
        registration: Number(form.registration),
        date: form.date,
        status: form.status,
        check_in_time: form.check_in_time || null,
        check_out_time: form.check_out_time || null,
      });

      setSuccess("Attendance recorded successfully.");
      setTimeout(() => router.push("/attendance"), 800);
    } catch {
      setError("Failed to record attendance.");
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

        <FormCard title="Attendance Details">
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
              label="Registration"
              value={form.registration}
              onChange={(e) => handleChange("registration", e.target.value)}
              required
              fullWidth
            >
              {registrations.map((registration) => (
                <MenuItem key={registration.id} value={registration.id}>
                  {registration.child_name} - {registration.program_title}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              type="date"
              label="Date"
              value={form.date}
              onChange={(e) => handleChange("date", e.target.value)}
              required
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
            />

            <TextField
              select
              label="Status"
              value={form.status}
              onChange={(e) => handleChange("status", e.target.value)}
              fullWidth
            >
              <MenuItem value="present">Present</MenuItem>
              <MenuItem value="absent">Absent</MenuItem>
              <MenuItem value="late">Late</MenuItem>
            </TextField>

            <TextField
              type="time"
              label="Check In Time"
              value={form.check_in_time}
              onChange={(e) => handleChange("check_in_time", e.target.value)}
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
            />

            <TextField
              type="time"
              label="Check Out Time"
              value={form.check_out_time}
              onChange={(e) => handleChange("check_out_time", e.target.value)}
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
            />

            <Box sx={{ gridColumn: { md: "1 / -1" }, mt: 1 }}>
              <Button type="submit" variant="contained" disabled={submitting}>
                {submitting ? "Saving..." : "Save Attendance"}
              </Button>
            </Box>
          </Box>
        </FormCard>
      </PageContainer>
    </ProtectedRoute>
  );
}
