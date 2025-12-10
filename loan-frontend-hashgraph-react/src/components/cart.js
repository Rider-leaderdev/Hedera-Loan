import React, { useState, useEffect } from "react";
import { Box, Button, Divider, IconButton, Typography } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import ClearIcon from "@mui/icons-material/Clear";
import { PAGE_INFO } from "../config";

function Cart({
  currentPage,
  cartNfts,
  loanCartNfts,
  resetNftLoanInfo,
  removeNftFromCart,
}) {
  const [totalBillPrice, setTotalBillPrice] = useState(0);

  useEffect(() => {
    console.log(cartNfts);
    const totalPrice = cartNfts.reduce(
      (sum, item) =>
        parseFloat(sum) +
        parseFloat(
          currentPage === PAGE_INFO.myNfts.id
            ? item.billPrice
            : currentPage === PAGE_INFO.loanedNfts.id
            ? parseFloat(
                parseFloat(item.billPrice) +
                  parseFloat((item.billPrice * item.fee) / 100)
              )
            : 0
        ),
      0
    );
    setTotalBillPrice(parseFloat(totalPrice).toFixed(2));
  }, [cartNfts]);
  return (
    <Box
      sx={{
        height: "280px",
        background: "#203040",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          width: "fit-content",
          margin: "10px auto",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            fontSize: "16px",
            color: "white",
            fontWeight: "700",
            marginRight: "20px",
          }}
        >
          Total{" "}
          {currentPage === PAGE_INFO.myNfts.id
            ? "Bill"
            : currentPage === PAGE_INFO.loanedNfts.id
            ? "Payback"
            : ""}{" "}
          Price {totalBillPrice} ħ
        </Typography>
        <Button
          onClick={() => loanCartNfts()}
          sx={{
            width: "80px",
            margin: "0 5px",
            background: "#10a070",
            color: "white",
            borderRadius: "0",
            ":hover": {
              background: "#10a070",
            },
          }}
        >
          Apply
        </Button>
      </Box>
      <Divider
        sx={{
          borderColor: "#a0b0c0",
          margin: "10px",
        }}
      />
      <Box
        sx={{
          width: "100vw",
          paddingBottom: "10px",
          overflowX: "scroll",
        }}
      >
        <Box
          sx={{
            width: "fit-content",
            margin: "auto",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {cartNfts.length > 0 &&
            cartNfts.map((item) => (
              <Box
                sx={{
                  width: "130px",
                  minWidth: "130px",
                  height: "100%",
                  margin: "0 10px",
                  padding: "10px",
                  border: "1px solid #a0b0c0",
                  borderRadius: "10px",
                  background: "#101820",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  img: {
                    width: "64%",
                    borderRadius: "50%",
                  },
                  ".MuiTypography-root": {
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  },
                  ".MuiBox-root": {
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    ".MuiTypography-root": {
                      color: "#a0b0c0",
                      fontSize: "12px",
                    },
                  },
                }}
              >
                <img alt="" src={item.imageUrl} />
                <Typography
                  sx={{
                    width: "100%",
                    textAlign: "center",
                    direction: "rtl",
                    color: "white",
                    fontSize: "14px",
                    margin: "5px 0px",
                  }}
                >
                  {item.name}
                </Typography>
                <Box>
                  <Typography>Duration</Typography>
                  <Typography>{item.duration} days</Typography>
                </Box>
                <Box>
                  <Typography>Bill Price</Typography>
                  <Typography>{item.billPrice} ħ</Typography>
                </Box>
                <Box
                  sx={{
                    padding: "5px 0px 0px",
                    ".MuiIconButton-root": {
                      width: "32px",
                      aspectRatio: "1",
                      padding: "0",
                      color: "white",
                      margin: "auto",
                    },
                  }}
                >
                  {currentPage === PAGE_INFO.myNfts.id && (
                    <IconButton
                      onClick={() => resetNftLoanInfo(item)}
                      sx={{
                        background: "#10a010",
                        ":hover": {
                          background: "#10a010",
                        },
                      }}
                    >
                      <SettingsIcon />
                    </IconButton>
                  )}
                  <IconButton
                    onClick={() => removeNftFromCart(item)}
                    sx={{
                      background: "#a01010",
                      ":hover": {
                        background: "#a01010",
                      },
                    }}
                  >
                    <ClearIcon />
                  </IconButton>
                </Box>
              </Box>
            ))}
        </Box>
      </Box>
    </Box>
  );
}

export default Cart;
