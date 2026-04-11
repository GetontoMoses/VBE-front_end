"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Alert, Box, Button, MenuItem, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/shared/PageHeader";
import FormCard from "@/components/shared/FormCard";
import api from "@/lib/api";

interface ChildOption {
  id: number;
  full_name?: string;
  first_name?: string;
  last_name?: string;
}

interface ProgramOption {
  id: number;
  title: string;
}

interface GroupOption {
  id: number;
  name: string;
}

export default function NewRegistrationPage() {
  const router = useRouter();

  const [children, setChildren] = useState<ChildOption[]>([]);
  const [programs, setPrograms] = useState<ProgramOption[]>([]);
  const [groups, setGroups] = useState<GroupOption[]>([]);

  const [form, setForm] = useState({
    child: "",
    program: "",
    group: "",
    status: "pending",
    pickup_notes: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [childrenRes, programsRes, groupsRes] = await Promise.all([
          api.get("/vbs/children/"),
          api.get("/vbs/programs/"),
          api.get("/vbs/age-groups/"),
        ]);

        setChildren(Array.isArray(childrenRes.data) ? childrenRes.data : []);
        setPrograms(Array.isArray(programsRes.data) ? programsRes.data : []);
        setGroups(Array.isArray(groupsRes.data) ? groupsRes.data : []);
      } catch {
        setError("Failed to load registration options.");
      }
    };

    loadData();
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
      await api.post("/vbs/registrations/", {
        child: Number(form.child),
        program: Number(form.program),
        group: form.group ? Number(form.group) : null,
        status: form.status,
        pickup_notes: form.pickup_notes,
      });

      setSuccess("Registration created successfully.");
      setTimeout(() => router.push("/registrations"), 800);
    } catch {
      setError("Failed to create registration.");
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

        <FormCard title="Registration Details">
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
              label="Child"
              value={form.child}
              onChange={(e) => handleChange("child", e.target.value)}
              required
              fullWidth
            >
              {children.map((child) => (
                <MenuItem key={child.id} value={child.id}>
                  {child.full_name ||
                    `${child.first_name ?? ""} ${child.last_name ?? ""}`.trim()}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Program"
              value={form.program}
              onChange={(e) => handleChange("program", e.target.value)}
              required
              fullWidth
            >
              {programs.map((program) => (
                <MenuItem key={program.id} value={program.id}>
                  {program.title}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Age Group"
              value={form.group}
              onChange={(e) => handleChange("group", e.target.value)}
              fullWidth
            >
              <MenuItem value="">No Group</MenuItem>
              {groups.map((group) => (
                <MenuItem key={group.id} value={group.id}>
                  {group.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Status"
              value={form.status}
              onChange={(e) => handleChange("status", e.target.value)}
              fullWidth
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </TextField>

            <TextField
              label="Pickup Notes"
              value={form.pickup_notes}
              onChange={(e) => handleChange("pickup_notes", e.target.value)}
              multiline
              minRows={4}
              fullWidth
              sx={{ gridColumn: { md: "1 / -1" } }}
            />

            <Box sx={{ gridColumn: { md: "1 / -1" }, mt: 1 }}>
              <Button type="submit" variant="contained" disabled={submitting}>
                {submitting ? "Saving..." : "Save Registration"}
              </Button>
            </Box>
          </Box>
        </FormCard>
      </PageContainer>
    </ProtectedRoute>
  );
}
