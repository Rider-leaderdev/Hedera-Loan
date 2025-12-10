import React from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import { NFT_INFO, PAGE_INFO } from "../config";

function Home({ resetPage }) {
  return (
    <>
      <Grid container>
        <Grid item sm={6} xs={12}>
          <Box
            sx={{
              position: "relative",
              width: "100%",
              aspectRatio: "1",
              marginTop: { md: "40px", sm: "20px", xs: "10px" },
              img: {
                position: "absolute",
                width: "50%",
                borderRadius: "20%",
                border: "2px solid #a0b0c0",
                ":nth-child(1)": {
                  top: "36%",
                  left: "3%",
                  animation: "moving 8s infinite ease-in-out",
                },
                ":nth-child(2)": {
                  top: "3%",
                  left: "30%",
                  animation: "moving 6s infinite ease-in-out",
                },
                ":nth-child(3)": {
                  bottom: "3%",
                  right: "3%",
                  animation: "moving 7s infinite ease-in-out",
                },
                "@keyframes moving": {
                  "0% , 100%": {
                    transform: "translate(0, 0)",
                  },
                  "20%": {
                    transform: "translate(-2%, -2%)",
                  },
                  "50%": {
                    transform: "translate(-2%, 2%)",
                  },
                  "70%": {
                    transform: "translate(2%, 2%)",
                  },
                },
              },
            }}
          >
            <img alt="" src="./assets/deadpixels.png" />
            <img alt="" src="./assets/hedera-arcade.png" />
            <img alt="" src="./assets/hangry-barboons.png" />
          </Box>
        </Grid>
        <Grid
          item
          sm={6}
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              marginTop: { md: "60px", sm: "40px", xs: "20px" },
              marginLeft: { md: "60px", sm: "30px", xs: "0px" },
              width: "fit-content",
            }}
          >
            <Typography
              sx={{
                width: "fit-content",
                // padding: { md: "8px 24px", sm: "6px 18px", xs: "6px 18px" },
                // borderTopLeftRadius: { md: "70px", xs: "50px" },
                // borderBottomRightRadius: { md: "60px", xs: "40px" },
                fontSize: { md: "64px", sm: "48px", xs: "36px" },
                fontWeight: "700",
                fontStyle: "italic",
                color: "#10a070",
                textShadow: "2px 1px 0px white",
                // background: "white",
              }}
            >
              NEED INSTANT HBARS?
            </Typography>
            {/* <Typography
              sx={{
                width: "fit-content",
                fontSize: { md: "36px", xs: "26px" },
                fontWeight: "400",
                color: "white",
              }}
            >
              AGAINST YOUR NFT’S
            </Typography>
            <Typography
              sx={{
                width: "fit-content",
                fontSize: { md: "60px", xs: "48px" },
                lineHeight: { md: "72px", xs: "56px" },
                fontWeight: "700",
                color: "#10a070",
                textShadow: {
                  sm: "4px 2px 0px white",
                  xs: "3px 2px 0px white",
                },
              }}
            >
              INSTANTLY
            </Typography> */}
            <Typography
              sx={{
                marginTop: "20px",
                width: "fit-content",
                fontSize: { md: "16px", xs: "14px" },
                color: "#a0b0c0",
              }}
            >
              Get instant HBARS against your NFT's at minimum rates.
            </Typography>
            <Box
              sx={{
                marginTop: "30px",
                width: "fit-content",
                ".MuiBox-root": {
                  marginTop: "5px",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  img: {
                    height: "32px",
                    borderRadius: "16px",
                  },
                  ".MuiTypography-root": {
                    fontSize: { md: "16px", xs: "14px" },
                    color: "#a0b0c0",
                    marginLeft: "5px",
                  },
                },
              }}
            >
              {NFT_INFO.length > 0 &&
                NFT_INFO.map((item) => (
                  <Box
                    sx={{
                      marginTop: "10px !important",
                    }}
                  >
                    <img alt="" src={item.logo} />
                    <Typography>Get till </Typography>
                    <Typography
                      sx={{
                        fontWeight: "700",
                        color: "#e08080 !important",
                      }}
                    >
                      {item.maxBillPrice}
                    </Typography>
                    <Typography>Hbars on</Typography>
                    <Typography
                      sx={{
                        fontWeight: "700",
                      }}
                    >
                      {item.name}
                    </Typography>
                  </Box>
                ))}
            </Box>
            <Box
              sx={{
                marginTop: { md: "40px", xs: "20px" },
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <Button
                onClick={() => resetPage(PAGE_INFO.myNfts.id)}
                sx={{
                  padding: { md: "12px 30px", xs: "8px 20px" },
                  background: "#10a070",
                  borderRadius: "0",
                  fontSize: { md: "24px", xs: "18px" },
                  color: "white",
                  ":hover": {
                    background: "#10a070",
                  },
                }}
              >
                Start Loan
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}

export default Home;
