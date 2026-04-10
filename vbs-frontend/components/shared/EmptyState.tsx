import { Box, Typography } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutlineOutlined";

export default function ErrorState({ message }: { message: string }) {
  return (
    <Box
      sx={{
        py: 6,
        textAlign: "center",
      }}
    >
      <ErrorOutlineIcon sx={{ fontSize: 50, color: "error.main", mb: 2 }} />
      <Typography variant="h6" gutterBottom>
        Something went wrong
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
}
