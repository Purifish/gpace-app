import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

import s from "./style.module.css";

function Footer() {
  return (
    <div className={`${s.container}`}>
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
            <h1 className={`${s.heading}`}>About Us</h1>
            <p className={`${s.about}`}>
              GPAce aims to assist Computer Science students ace their most
              feared modules. GPAce provides high-quality materials, including
              summary notes and quizzes.
            </p>

            <Box
              sx={{
                mt: 4,
                color: "gray",
              }}
            >
              <FacebookIcon sx={{ mr: 2 }} />
              <TwitterIcon sx={{ mr: 2 }} />
              <InstagramIcon />
            </Box>
            <Box
              sx={{
                mt: 4,
                color: "lightgray",
              }}
            >
              {`Copyright © ${new Date().getFullYear()} All Rights Reserved by GPAce`}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}

export default Footer;
