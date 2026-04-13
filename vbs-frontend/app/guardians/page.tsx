"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Box, Button, IconButton, Paper, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/shared/PageHeader";
import LoadingState from "@/components/shared/LoadingState";
import ErrorState from "@/components/shared/ErrorState";
import EmptyState from "@/components/shared/EmptyState";
import DeleteConfirmDialog from "@/components/shared/DeleteConfirmDialog";
import AppSnackbar from "@/components/shared/AppSnackbar";
import api from "@/lib/api";
import { Guardian } from "@/types";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function GuardiansPage() {
  const [guardians, setGuardians] = useState<Guardian[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const fetchGuardians = async () => {
    try {
      const response = await api.get("/vbs/guardians/");
      setGuardians(Array.isArray(response.data) ? response.data : []);
      setError("");
    } catch {
      setError("Failed to fetch guardians.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuardians();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;

    setDeleteLoading(true);
    try {
      await api.delete(`/vbs/guardians/${deleteId}/`);
      setGuardians((prev) => prev.filter((item) => item.id !== deleteId));
      setSnackbar({
        open: true,
        message: "Guardian deleted successfully.",
        severity: "success",
      });
      setDeleteId(null);
    } catch {
      setSnackbar({
        open: true,
        message: "Failed to delete guardian.",
        severity: "error",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const columns = useMemo<GridColDef[]>(
    () => [
      { field: "id", headerName: "ID", width: 80 },
      { field: "full_name", headerName: "Full Name", flex: 1, minWidth: 180 },
      { field: "phone_number", headerName: "Phone", width: 150 },
      { field: "email", headerName: "Email", flex: 1, minWidth: 180 },
      {
        field: "relationship_to_child",
        headerName: "Relationship",
        width: 150,
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
                href={`/guardians/${params.row.id}/edit`}
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
            title="Guardians"
            subtitle="Manage parents and guardians responsible for children."
          />
          <Button component={Link} href="/guardians/new" variant="contained">
            Add Guardian
          </Button>
        </Box>

        <Paper sx={{ p: 2 }}>
          {loading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState message={error} />
          ) : guardians.length === 0 ? (
            <EmptyState
                            message="Guardian records will appear here once added."
            />
          ) : (
            <Box sx={{ width: "100%" }}>
              <DataGrid
                rows={guardians}
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
          title="Delete Guardian"
          message="Are you sure you want to delete this guardian?"
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
