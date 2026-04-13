"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Box, Button, Chip, IconButton, Paper, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/shared/PageHeader";
import LoadingState from "@/components/shared/LoadingState";
import ErrorState from "@/components/shared/ErrorState";
import EmptyState from "@/components/shared/EmptyState";
import DeleteConfirmDialog from "@/components/shared/DeleteConfirmDialog";
import AppSnackbar from "@/components/shared/AppSnackbar";
import api from "@/lib/api";
import { VBSProgram } from "@/types";

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<VBSProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const fetchPrograms = async () => {
    try {
      const response = await api.get("/vbs/programs/");
      setPrograms(Array.isArray(response.data) ? response.data : []);
      setError("");
    } catch {
      setError("Failed to fetch programs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;

    setDeleteLoading(true);
    try {
      await api.delete(`/vbs/programs/${deleteId}/`);
      setPrograms((prev) => prev.filter((item) => item.id !== deleteId));
      setSnackbar({
        open: true,
        message: "Program deleted successfully.",
        severity: "success",
      });
      setDeleteId(null);
    } catch {
      setSnackbar({
        open: true,
        message: "Failed to delete program.",
        severity: "error",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const columns = useMemo<GridColDef[]>(
    () => [
      { field: "id", headerName: "ID", width: 80 },
      { field: "title", headerName: "Title", flex: 1, minWidth: 180 },
      { field: "theme", headerName: "Theme", flex: 1, minWidth: 160 },
      { field: "venue", headerName: "Venue", flex: 1, minWidth: 150 },
      { field: "start_date", headerName: "Start Date", width: 130 },
      { field: "end_date", headerName: "End Date", width: 130 },
      {
        field: "status",
        headerName: "Status",
        width: 130,
        renderCell: (params) => <Chip label={params.value} size="small" />,
      },
      {
        field: "actions",
        headerName: "Actions",
        width: 130,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Tooltip title="Edit">
              <IconButton
                component={Link}
                href={`/programs/${params.row.id}/edit`}
                size="small"
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete">
              <IconButton
                size="small"
                color="error"
                onClick={() => setDeleteId(params.row.id)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ],
    [],
  );

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
            title="Programs"
            subtitle="Manage VBS sessions, themes, venues, and dates."
          />
          <Button component={Link} href="/programs/new" variant="contained">
            Add Program
          </Button>
        </Box>

        <Paper sx={{ p: 2 }}>
          {loading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState message={error} />
          ) : programs.length === 0 ? (
            <EmptyState

              message="Create a VBS program and it will appear here."
            />
          ) : (
            <Box sx={{ width: "100%" }}>
              <DataGrid
                rows={programs}
                columns={columns}
                autoHeight
                pageSizeOptions={[5, 10, 20]}
                disableRowSelectionOnClick
              />
            </Box>
          )}
        </Paper>

        <DeleteConfirmDialog
          open={deleteId !== null}
          onClose={() => setDeleteId(null)}
          onConfirm={handleDelete}
          loading={deleteLoading}
          title="Delete Program"
          message="Are you sure you want to delete this program?"
        />

        <AppSnackbar
          open={snackbar.open}
          message={snackbar.message}
          severity={snackbar.severity}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        />
      </PageContainer>
    </ProtectedRoute>
  );
}
