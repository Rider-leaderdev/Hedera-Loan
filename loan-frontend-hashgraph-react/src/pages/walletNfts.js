import React, { useEffect } from "react";
import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";

function WalletNfts({
  accountIds,
  getOwnedNfts,
  ownedNfts,
  setQuickLoan,
  addNftToCart,
}) {
  useEffect(() => {
    getOwnedNfts();
  }, [accountIds]);

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
        Wallet NFTs
      </Typography>
      <Grid container spacing={2}>
        {ownedNfts?.length > 0 ? (
          ownedNfts.map((item) => (
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
                    <Typography>Duration</Typography>
                    <Typography sx={{ textAlign: "end" }}>
                      {item.maxDuration} days
                    </Typography>
                  </Box>
                  <Box className="nft-detail">
                    <Typography>Loan Amount</Typography>
                    <Typography sx={{ textAlign: "end" }}>
                      {item.maxBillPrice} ħ
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
                      <AddShoppingCartIcon
                        sx={{
                          width: "100%",
                        }}
                      />
                    </IconButton>
                    <Button
                      onClick={() => setQuickLoan(item)}
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
                      Quick Loan
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

export default WalletNfts;
