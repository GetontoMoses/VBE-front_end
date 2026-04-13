"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Box, Button, IconButton, Paper, Tooltip } from "@mui/material";
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
import { Child } from "@/types";

export default function ChildrenPage() {
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const fetchChildren = async () => {
    try {
      const response = await api.get("/vbs/children/");
      setChildren(Array.isArray(response.data) ? response.data : []);
      setError("");
    } catch {
      setError("Failed to fetch children.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChildren();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;

    setDeleteLoading(true);
    try {
      await api.delete(`/vbs/children/${deleteId}/`);
      setChildren((prev) => prev.filter((item) => item.id !== deleteId));
      setSnackbar({
        open: true,
        message: "Child deleted successfully.",
        severity: "success",
      });
      setDeleteId(null);
    } catch {
      setSnackbar({
        open: true,
        message: "Failed to delete child.",
        severity: "error",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const rows = children.map((child) => ({
    ...child,
    full_name:
      child.full_name ||
      `${child.first_name ?? ""} ${child.last_name ?? ""}`.trim(),
  }));

  const columns = useMemo<GridColDef[]>(
    () => [
      { field: "id", headerName: "ID", width: 80 },
      { field: "full_name", headerName: "Full Name", flex: 1, minWidth: 180 },
      { field: "gender", headerName: "Gender", width: 120 },
      { field: "date_of_birth", headerName: "Date of Birth", width: 150 },
      { field: "school_name", headerName: "School", flex: 1, minWidth: 150 },
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
                href={`/children/${params.row.id}/edit`}
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
            title="Children"
            subtitle="View and manage registered VBS children."
          />
          <Button component={Link} href="/children/new" variant="contained">
            Add Child
          </Button>
        </Box>

        <Paper sx={{ p: 2 }}>
          {loading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState message={error} />
          ) : rows.length === 0 ? (
            <EmptyState
              message="Registered children will appear here once added."
            />
          ) : (
            <Box sx={{ width: "100%" }}>
              <DataGrid
                rows={rows}
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
          title="Delete Child"
          message="Are you sure you want to delete this child?"
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
