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

interface Attendance {
  id: number;
  child_name?: string;
  date: string;
  status: string;
  check_in_time?: string | null;
  check_out_time?: string | null;
}

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 80 },
  { field: "child_name", headerName: "Child", flex: 1, minWidth: 180 },
  { field: "date", headerName: "Date", width: 150 },
  {
    field: "status",
    headerName: "Status",
    width: 140,
    renderCell: (params) => <Chip label={params.value} size="small" />,
  },
  { field: "check_in_time", headerName: "Check In", width: 130 },
  { field: "check_out_time", headerName: "Check Out", width: 130 },
];

export default function AttendancePage() {
  const [data, setData] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/vbs/attendance/");
        setData(Array.isArray(response.data) ? response.data : []);
      } catch {
        setError("Failed to load attendance records.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <PageContainer>
      <PageHeader
        title="Attendance"
        subtitle="Track daily attendance and check-in times."
      />

      <Paper sx={{ p: 2 }}>
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} />
        ) : data.length === 0 ? (
          <EmptyState
            message="No attendance records yet. Attendance marked during program days will appear here."
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
  );
}
