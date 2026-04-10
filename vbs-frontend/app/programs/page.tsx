"use client";

import { useEffect, useState } from "react";
import { Box, Chip, Paper } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/shared/PageHeader";
import LoadingState from "@/components/shared/LoadingState";
import ErrorState from "@/components/shared/ErrorState";
import EmptyState from "@/components/shared/EmptyState";
import api from "@/lib/api";
import { VBSProgram } from "@/types";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 80 },
  { field: "title", headerName: "Title", flex: 1, minWidth: 180 },
  { field: "theme", headerName: "Theme", flex: 1, minWidth: 180 },
  { field: "venue", headerName: "Venue", flex: 1, minWidth: 150 },
  { field: "start_date", headerName: "Start Date", width: 130 },
  { field: "end_date", headerName: "End Date", width: 130 },
  {
    field: "status",
    headerName: "Status",
    width: 140,
    renderCell: (params) => <Chip label={params.value} size="small" />,
  },
];

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<VBSProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await api.get("/vbs/programs/");
        setPrograms(Array.isArray(response.data) ? response.data : []);
      } catch {
        setError("Failed to fetch programs.");
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  return (
    <PageContainer>
      <PageHeader
        title="Programs"
        subtitle="Manage VBS sessions, themes, venues, and dates."
      />

      <Paper sx={{ p: 2 }}>
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} />
        ) : programs.length === 0 ? (
          <EmptyState message="No programs yet. Create a VBS program and it will appear here." />
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
    </PageContainer>
  );
}
