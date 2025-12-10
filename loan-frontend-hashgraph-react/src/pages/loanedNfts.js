import React, { useEffect } from "react";
import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";

function LoanedNfts({
  accountIds,
  getLoanedNfts,
  loanedNfts,
  getBackNfts,
  addNftToCart,
}) {
  useEffect(() => {
    getLoanedNfts();
  }, [accountIds]);

  const miliSecToStr = (mSec) => {
    const sec = Math.floor(mSec / 1000);
    const min = Math.floor(sec / 60);
    const hur = Math.floor(min / 60);
    const day = Math.floor(hur / 24);

    let elapsedTimeString;

    if (day > 0) {
      elapsedTimeString = `${day} day${day > 1 ? "s" : ""}`;
    } else if (hur > 0) {
      elapsedTimeString = `${hur} hour${hur > 1 ? "s" : ""}`;
    } else if (min > 0) {
      elapsedTimeString = `${min} minute${min > 1 ? "s" : ""}`;
    } else {
      elapsedTimeString = "Timeout";
    }

    return elapsedTimeString;
  };

  return (
    <>
      <Typography
        sx={{
          margin: { md: "12px 0", sm: "8px 0", xs: "6px 0" },
          fontSize: { md: "36px", sm: "32px", xs: "28px" },
          fontWeight: "700",
          color: "#10a070",
        }}
      >
        Loaned NFTs
      </Typography>
      <Grid container spacing={2}>
        {loanedNfts?.length > 0 ? (
          loanedNfts.map((item) => (
            <Grid item md={3} sm={4} xs={6}>
              <Box
                sx={{
                  border: "1px solid #a0b0c0",
                  background: "#203040",
                  img: {
                    width: "100%",
                  },
                }}
              >
                <img alt="" src={item.imageUrl} />
                <Box
                  sx={{
                    ".MuiTypography-root": {
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    },
                    padding: {
                      md: "6px 12px 12px",
                      sm: "2px 6px 6px",
                      xs: "0 4px 4px",
                    },
                    ".nft-detail": {
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      ".MuiTypography-root": {
                        width: "50%",
                        fontSize: { md: "16px", sm: "14px", xs: "12px" },
                        fontWeight: "500",
                        color: "#a0b0c0",
                      },
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: { md: "20px", sm: "18px", xs: "16px" },
                      fontWeight: "700",
                      color: "white",
                      marginBottom: { md: "10px", sm: "8px", xs: "6px" },
                    }}
                  >
                    {item.name}
                  </Typography>
                  <Box className="nft-detail">
                    <Typography>Token ID</Typography>
                    <Typography sx={{ direction: "rtl" }}>
                      {item.tokenId}
                    </Typography>
                  </Box>
                  <Box className="nft-detail">
                    <Typography>Serial Number</Typography>
                    <Typography sx={{ direction: "rtl" }}>
                      {item.serialNum}
                    </Typography>
                  </Box>
                  <Box className="nft-detail">
                    <Typography>Remain Time</Typography>
                    <Typography sx={{ textAlign: "end" }}>
                      {miliSecToStr(item.remainTime)}
                    </Typography>
                  </Box>
                  <Box className="nft-detail">
                    <Typography>Bill Price</Typography>
                    <Typography sx={{ textAlign: "end" }}>
                      {item.billPrice} ħ
                    </Typography>
                  </Box>
                  <Box className="nft-detail">
                    <Typography>Payback Amount</Typography>
                    <Typography sx={{ textAlign: "end" }}>
                      {parseFloat(
                        parseFloat(item.billPrice) +
                          parseFloat((item.billPrice * item.fee) / 100)
                      ).toFixed(2)}{" "}
                      ħ
                    </Typography>
                  </Box>
                  <Divider
                    sx={{
                      borderColor: "#a0b0c0",
                      margin: { md: "6px 0", sm: "4px 0", xs: "2px 0" },
                    }}
                  />
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <IconButton
                      onClick={() => addNftToCart(item)}
                      sx={{
                        width: { md: "36px", sm: "32px", xs: "28px" },
                        padding: "0",
                        aspectRatio: "1",
                        color: "#10a070",
                      }}
                    >
                      <LibraryAddIcon
                        sx={{
                          width: "100%",
                        }}
                      />
                    </IconButton>
                    <Button
                      onClick={() => getBackNfts([item], true)}
                      sx={{
                        background: "#10a070",
                        color: "white",
                        borderRadius: "0",
                        textTransform: "none",
                        fontSize: { md: "14px", sm: "13px", xs: "12px" },
                        ":hover": {
                          background: "#10a070",
                        },
                      }}
                    >
                      Payback
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography
              sx={{
                textAlign: "center",
                lineHeight: "320px",
                color: "#a0b0c0",
              }}
            >
              No NFTs
            </Typography>
          </Grid>
        )}
      </Grid>
    </>
  );
}

export default LoanedNfts;
