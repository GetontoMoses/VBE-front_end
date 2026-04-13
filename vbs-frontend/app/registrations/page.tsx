"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/shared/PageHeader";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import api from "@/lib/api";

type Child = {
  id: number;
  full_name?: string;
  first_name: string;
  last_name: string;
};

type Program = {
  id: number;
  title: string;
};

type AgeGroup = {
  id: number;
  name: string;
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

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [groups, setGroups] = useState<AgeGroup[]>([]);

  const [form, setForm] = useState({
    child: "",
    program: "",
    group: "",
    status: "pending",
    pickup_notes: "",
  });

  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [registrationsRes, childrenRes, programsRes, groupsRes] =
        await Promise.all([
          api.get("/vbs/registrations/"),
          api.get("/vbs/children/"),
          api.get("/vbs/programs/"),
          api.get("/vbs/age-groups/"),
        ]);

      setRegistrations(registrationsRes.data || []);
      setChildren(childrenRes.data || []);
      setPrograms(programsRes.data || []);
      setGroups(groupsRes.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load registrations data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredRegistrations = useMemo(() => {
    return registrations.filter((item) => {
      const matchesStatus =
        statusFilter === "all" ? true : item.status === statusFilter;

      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        (item.child_name || "").toLowerCase().includes(q) ||
        (item.program_title || "").toLowerCase().includes(q) ||
        (item.group_name || "").toLowerCase().includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [registrations, statusFilter, search]);

  const handleCreate = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await api.post("/vbs/registrations/", {
        child: Number(form.child),
        program: Number(form.program),
        group: form.group ? Number(form.group) : null,
        status: form.status,
        pickup_notes: form.pickup_notes,
      });

      setSuccess("Registration created successfully.");
      setForm({
        child: "",
        program: "",
        group: "",
        status: "pending",
        pickup_notes: "",
      });
      fetchData();
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data
          ? JSON.stringify(err.response.data)
          : "Failed to create registration.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedRoute>
      <PageContainer>
        <PageHeader
          title="Registrations"
          subtitle="Register children into VBS programs and groups."
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
              New Registration
            </Typography>

            <Stack spacing={2}>
              <TextField
                select
                label="Child"
                value={form.child}
                onChange={(e) => setForm({ ...form, child: e.target.value })}
                fullWidth
              >
                {children.map((child) => (
                  <MenuItem key={child.id} value={child.id}>
                    {child.full_name ||
                      `${child.first_name} ${child.last_name}`}
                  </MenuItem>
                ))}
              </TextField>

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
                select
                label="Age Group"
                value={form.group}
                onChange={(e) => setForm({ ...form, group: e.target.value })}
                fullWidth
              >
                <MenuItem value="">None</MenuItem>
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
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                fullWidth
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </TextField>

              <TextField
                label="Pickup Notes"
                value={form.pickup_notes}
                onChange={(e) =>
                  setForm({ ...form, pickup_notes: e.target.value })
                }
                fullWidth
                multiline
                minRows={3}
              />

              <Button
                variant="contained"
                onClick={handleCreate}
                disabled={saving || !form.child || !form.program}
              >
                {saving ? "Saving..." : "Create Registration"}
              </Button>
            </Stack>
          </Paper>

          <Paper sx={{ p: 3, overflowX: "auto" }}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              sx={{ mb: 3, justifyContent: "space-between" }}
            >
              <TextField
                label="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ minWidth: 240 }}
              />

              <TextField
                select
                label="Filter by status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                sx={{ minWidth: 180 }}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </TextField>
            </Stack>

            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Child</TableCell>
                  <TableCell>Program</TableCell>
                  <TableCell>Group</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Pickup Notes</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRegistrations.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.child_name || item.child}</TableCell>
                    <TableCell>
                      {item.program_title || `Program #${item.program}`}
                    </TableCell>
                    <TableCell>{item.group_name || "-"}</TableCell>
                    <TableCell>
                      <Chip
                        label={item.status}
                        color={
                          item.status === "approved"
                            ? "success"
                            : item.status === "pending"
                              ? "warning"
                              : "error"
                        }
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{item.pickup_notes || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {!loading && filteredRegistrations.length === 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                No registrations found.
              </Typography>
            )}
          </Paper>
        </Box>
      </PageContainer>
    </ProtectedRoute>
  );
}
