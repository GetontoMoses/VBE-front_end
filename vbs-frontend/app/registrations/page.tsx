"use client";

import { useEffect, useState } from "react";
import { Box, Paper } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import PageContainer from "@/components/layout/PageContainer";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import PageHeader from "@/components/shared/PageHeader";
import LoadingState from "@/components/shared/LoadingState";
import ErrorState from "@/components/shared/ErrorState";
import EmptyState from "@/components/shared/EmptyState";
import api from "@/lib/api";

interface Registration {
  id: number;
  child_name?: string;
  program_title?: string;
  group_name?: string;
  status: string;
  registration_date: string;
}

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 80 },
  { field: "child_name", headerName: "Child", flex: 1, minWidth: 180 },
  { field: "program_title", headerName: "Program", flex: 1, minWidth: 180 },
  { field: "group_name", headerName: "Group", flex: 1, minWidth: 140 },
  { field: "status", headerName: "Status", width: 130 },
  { field: "registration_date", headerName: "Date", width: 180 },
];

export default function RegistrationsPage() {
  const [data, setData] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/vbs/registrations/");
        setData(Array.isArray(response.data) ? response.data : []);
      } catch {
        setError("Failed to load registrations.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <ProtectedRoute>
    <PageContainer>
      <PageHeader
        title="Registrations"
        subtitle="Manage children enrolled into VBS programs."
      />

      <Paper sx={{ p: 2 }}>
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} />
        ) : data.length === 0 ? (
          <EmptyState
            message="No registrations yet. Once children are enrolled into programs, they will appear here."
          />
        ) : (
          <Box sx={{ width: "100%" }}>
            <DataGrid
              rows={data}
              columns={columns}
              autoHeight
              pageSizeOptions={[5, 10, 20]}
              disableRowSelectionOnClick
            />
          </Box>
        )}
      </Paper>
    </PageContainer>
    </ProtectedRoute>
  );
}
