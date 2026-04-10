import { Box } from "@mui/material";
import Sidebar from "@/components/layout/Sidebar";
import AppNavbar from "@/components/layout/AppNavbar";

export default function PageContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "background.default",
      }}
    >
      <Sidebar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
        }}
      >
        <AppNavbar />
        <Box
          sx={{
            p: { xs: 2, md: 4 },
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
