import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

function Footer() {
  return (
    <Box
      sx={{
        background: "#0C356A",
        color: "white",
        p: { xs: 4, md: 10 },
        pt: 12,
        pb: 12,
        fontSize: { xs: "12px", md: "14px" },
      }}
    >
      <Grid container spacing={2} justifyContent="center">
        <Grid item md={6} lg={4}>
          <h5>About Us</h5>
          <Typography variant="caption2">
            GPAce aims to assist Computer Science students ace their most feared
            modules. GPAce provides high-quality materials, including summary
            notes and quizzes.
          </Typography>

          <Box
            sx={{
              mt: 4,
              color: "gray",
            }}
          >
            <FacebookIcon sx={{ mr: 1 }} />
            <TwitterIcon sx={{ mr: 1 }} />
            <InstagramIcon />
          </Box>
          <Box
            sx={{
              mt: 4,
              color: "lightgray",
            }}
          >
            Copyright © 2023 All Rights Reserved by GPAce
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Footer;
