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

type Registration = {
  id: number;
  child_name?: string;
};

type Attendance = {
  id: number;
  registration: number;
  child_name?: string;
  date: string;
  status: string;
  check_in_time?: string | null;
  check_out_time?: string | null;
};

export default function AttendancePage() {
  const today = new Date().toISOString().split("T")[0];

  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);

  const [form, setForm] = useState({
    registration: "",
    date: today,
    status: "present",
    check_in_time: "",
    check_out_time: "",
  });

  const [dateFilter, setDateFilter] = useState(today);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [registrationsRes, attendanceRes] = await Promise.all([
        api.get("/vbs/registrations/"),
        api.get("/vbs/attendance/"),
      ]);

      setRegistrations(registrationsRes.data || []);
      setAttendance(attendanceRes.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load attendance data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredAttendance = useMemo(() => {
    return attendance.filter((item) => {
      const matchesDate = dateFilter ? item.date === dateFilter : true;
      const matchesStatus =
        statusFilter === "all" ? true : item.status === statusFilter;
      return matchesDate && matchesStatus;
    });
  }, [attendance, dateFilter, statusFilter]);

  const handleCreate = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await api.post("/api/attendance/", {
        registration: Number(form.registration),
        date: form.date,
        status: form.status,
        check_in_time: form.check_in_time || null,
        check_out_time: form.check_out_time || null,
        marked_by: null,
      });

      setSuccess("Attendance marked successfully.");
      setForm({
        registration: "",
        date: today,
        status: "present",
        check_in_time: "",
        check_out_time: "",
      });
      fetchData();
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data
          ? JSON.stringify(err.response.data)
          : "Failed to mark attendance.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedRoute>
      <PageContainer>
        <PageHeader
          title="Attendance"
          subtitle="Track daily attendance for registered children."
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
              Mark Attendance
            </Typography>

            <Stack spacing={2}>
              <TextField
                select
                label="Registration"
                value={form.registration}
                onChange={(e) =>
                  setForm({ ...form, registration: e.target.value })
                }
                fullWidth
              >
                {registrations.map((reg) => (
                  <MenuItem key={reg.id} value={reg.id}>
                    {reg.child_name || `Registration #${reg.id}`}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                type="date"
                label="Date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
           
                fullWidth
              />

              <TextField
                select
                label="Status"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
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
                onChange={(e) =>
                  setForm({ ...form, check_in_time: e.target.value })
                }
            
                fullWidth
              />

              <TextField
                type="time"
                label="Check Out Time"
                value={form.check_out_time}
                onChange={(e) =>
                  setForm({ ...form, check_out_time: e.target.value })
                }
             
                fullWidth
              />

              <Button
                variant="contained"
                onClick={handleCreate}
                disabled={saving || !form.registration}
              >
                {saving ? "Saving..." : "Save Attendance"}
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
                type="date"
                label="Filter by Date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
          
              />

              <TextField
                select
                label="Filter by Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                sx={{ minWidth: 180 }}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="present">Present</MenuItem>
                <MenuItem value="absent">Absent</MenuItem>
                <MenuItem value="late">Late</MenuItem>
              </TextField>
            </Stack>

            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Child</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Check In</TableCell>
                  <TableCell>Check Out</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAttendance.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.child_name || "-"}</TableCell>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>
                      <Chip
                        label={item.status}
                        size="small"
                        variant="outlined"
                        color={
                          item.status === "present"
                            ? "success"
                            : item.status === "late"
                              ? "warning"
                              : "error"
                        }
                      />
                    </TableCell>
                    <TableCell>{item.check_in_time || "-"}</TableCell>
                    <TableCell>{item.check_out_time || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {!loading && filteredAttendance.length === 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                No attendance records found.
              </Typography>
            )}
          </Paper>
        </Box>
      </PageContainer>
    </ProtectedRoute>
  );
}
