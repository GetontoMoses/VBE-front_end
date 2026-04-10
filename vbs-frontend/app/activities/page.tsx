"use client";

import { useEffect, useState } from "react";
import { Box, Paper, Typography } from "@mui/material";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/shared/PageHeader";
import LoadingState from "@/components/shared/LoadingState";
import ErrorState from "@/components/shared/ErrorState";
import EmptyState from "@/components/shared/EmptyState";
import api from "@/lib/api";

interface Activity {
  id: number;
  name: string;
  description?: string;
  location?: string;
  day: string;
  start_time: string;
  end_time: string;
}

export default function ActivitiesPage() {
  const [data, setData] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await api.get("/vbs/activities/");
        setData(Array.isArray(response.data) ? response.data : []);
      } catch {
        setError("Failed to load activities.");
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  return (
    <PageContainer>
      <PageHeader
        title="Activities"
        subtitle="Games, crafts, songs, and other scheduled activities."
      />

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} />
      ) : data.length === 0 ? (
        <Paper sx={{ p: 2 }}>
          <EmptyState message="No activities created. Scheduled activities will show here once added." />
        </Paper>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            },
            gap: 3,
          }}
        >
          {data.map((activity) => (
            <Paper
              key={activity.id}
              sx={{
                p: 3,
                height: "100%",
              }}
            >
              <Typography variant="h6" gutterBottom>
                {activity.name}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {activity.day}
              </Typography>

              <Box sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>Time:</strong> {activity.start_time} -{" "}
                  {activity.end_time}
                </Typography>

                {activity.location && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <strong>Location:</strong> {activity.location}
                  </Typography>
                )}
              </Box>

              {activity.description && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    {activity.description}
                  </Typography>
                </Box>
              )}
            </Paper>
          ))}
        </Box>
      )}
    </PageContainer>
  );
}
