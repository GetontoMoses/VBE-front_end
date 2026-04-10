"use client";

import { useEffect, useState } from "react";
import { Box, Paper } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/shared/PageHeader";
import LoadingState from "@/components/shared/LoadingState";
import ErrorState from "@/components/shared/ErrorState";
import EmptyState from "@/components/shared/EmptyState";
import api from "@/lib/api";
import { Guardian } from "@/types";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 80 },
  { field: "full_name", headerName: "Full Name", flex: 1, minWidth: 180 },
  { field: "phone_number", headerName: "Phone", width: 150 },
  { field: "email", headerName: "Email", flex: 1, minWidth: 180 },
  { field: "relationship_to_child", headerName: "Relationship", width: 150 },
];

export default function GuardiansPage() {
  const [guardians, setGuardians] = useState<Guardian[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGuardians = async () => {
      try {
        const response = await api.get("/vbs/guardians/");
        setGuardians(Array.isArray(response.data) ? response.data : []);
      } catch {
        setError("Failed to fetch guardians.");
      } finally {
        setLoading(false);
      }
    };

    fetchGuardians();
  }, []);

  return (
    <PageContainer>
      <PageHeader
        title="Guardians"
        subtitle="Manage parents and guardians responsible for children."
      />

      <Paper sx={{ p: 2 }}>
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} />
        ) : guardians.length === 0 ? (
          <EmptyState message="No guardians yet. Guardian records will appear here once added." />
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
    </PageContainer>
  );
}
