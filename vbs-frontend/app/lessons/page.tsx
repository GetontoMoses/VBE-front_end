"use client";

import { useEffect, useState } from "react";
import { Box, Paper, Typography } from "@mui/material";
import PageContainer from "@/components/layout/PageContainer";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import PageHeader from "@/components/shared/PageHeader";
import LoadingState from "@/components/shared/LoadingState";
import ErrorState from "@/components/shared/ErrorState";
import EmptyState from "@/components/shared/EmptyState";
import api from "@/lib/api";

interface Lesson {
  id: number;
  title: string;
  date: string;
  bible_text?: string;
  memory_verse?: string;
  summary?: string;
}

export default function LessonsPage() {
  const [data, setData] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await api.get("/vbs/lessons/");
        setData(Array.isArray(response.data) ? response.data : []);
      } catch {
        setError("Failed to load lessons.");
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, []);

  return (
    <ProtectedRoute>
    <PageContainer>
      <PageHeader
        title="Lessons"
        subtitle="Daily Bible lessons and memory verses for the VBS program."
      />

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} />
      ) : data.length === 0 ? (
        <Paper sx={{ p: 2 }}>
          <EmptyState message="No lessons available. Once lesson content is added, it will be shown here." />
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
          {data.map((lesson) => (
            <Paper
              key={lesson.id}
              sx={{
                p: 3,
                height: "100%",
              }}
            >
              <Typography variant="h6" gutterBottom>
                {lesson.title}
              </Typography>

              <Typography variant="body2" color="text.secondary" gutterBottom>
                {lesson.date}
              </Typography>

              {lesson.bible_text && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2">Bible Text</Typography>
                  <Typography variant="body2">{lesson.bible_text}</Typography>
                </Box>
              )}

              {lesson.memory_verse && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2">Memory Verse</Typography>
                  <Typography variant="body2">{lesson.memory_verse}</Typography>
                </Box>
              )}

              {lesson.summary && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2">Summary</Typography>
                  <Typography variant="body2">{lesson.summary}</Typography>
                </Box>
              )}
            </Paper>
          ))}
        </Box>
      )}
    </PageContainer>
    </ProtectedRoute>
  );
}
