import { Paper, Typography, Box } from "@mui/material";

export default function FormCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <Paper sx={{ p: 4, maxWidth: 800 }}>
      <Typography variant="h5" gutterBottom>
        {title}
      </Typography>

      {subtitle && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {subtitle}
        </Typography>
      )}

      <Box>{children}</Box>
    </Paper>
  );
}
