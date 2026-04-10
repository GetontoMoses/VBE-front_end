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
import { Child } from "@/types";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 80 },
  { field: "full_name", headerName: "Full Name", flex: 1, minWidth: 180 },
  { field: "gender", headerName: "Gender", width: 120 },
  { field: "date_of_birth", headerName: "Date of Birth", width: 150 },
  { field: "school_name", headerName: "School", flex: 1, minWidth: 150 },
];

export default function ChildrenPage() {
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const response = await api.get("/vbs/children/");
        setChildren(Array.isArray(response.data) ? response.data : []);
      } catch {
        setError("Failed to fetch children.");
      } finally {
        setLoading(false);
      }
    };

    fetchChildren();
  }, []);

  const rows = children.map((child) => ({
    ...child,
    full_name:
      child.full_name ||
      `${child.first_name ?? ""} ${child.last_name ?? ""}`.trim(),
  }));

  return (
    <PageContainer>
      <PageHeader
        title="Children"
        subtitle="View and manage registered VBS children."
      />

      <Paper sx={{ p: 2 }}>
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} />
        ) : rows.length === 0 ? (
          <EmptyState
            message="No children yet. Registered children will appear here once added."
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
    </PageContainer>
  );
}
