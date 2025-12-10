import { Box, CircularProgress } from "@mui/material";

export default function Loading() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <CircularProgress
        sx={{
          color: "white",
        }}
      />
      <Box
        sx={{
          width: "240px",
          marginTop: "10px",
          "&:after": {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            content: "'Loading'",
            fontSize: "18px",
            fontWeight: "700",
            color: "white",
            animation: "loading-text 3s ease-in-out infinite",
            "@keyframes loading-text": {
              "0%": {
                content: "'Loading'",
              },
              "25%": {
                content: "'Loading.'",
              },
              "50%": {
                content: "'Loading..'",
              },
              "75%": {
                content: "'Loading...'",
              },
            },
          },
        }}
      />
    </Box>
  );
}
