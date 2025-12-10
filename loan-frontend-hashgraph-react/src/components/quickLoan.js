import React, { useState } from "react";
import { Box, Button, Divider, Input, Slider, Typography } from "@mui/material";
import { LOAN_TYPE } from "../config";

function QuickLoan({ loanType, nftInfo, onClickOk, onClickCancel }) {
  const [duration, setDuration] = useState(
    loanType === LOAN_TYPE.quickLoan ? nftInfo.maxDuration : nftInfo.duration
  );
  const [billPrice, setBillPrice] = useState(
    loanType === LOAN_TYPE.quickLoan ? nftInfo.maxBillPrice : nftInfo.billPrice
  );

  return (
    <Box
      sx={{
        width: "280px",
        background: "#101820",
        border: "1px solid #a0b0c0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px 16px",
        overflowX: "hidden",
        img: {
          borderRadius: "50%",
          width: "220px",
        },
      }}
    >
      <img alt="" src={nftInfo.imageUrl} />
      <Box
        sx={{
          marginTop: "10px",
          width: "100%",
          ".MuiTypography-root": {
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          },
          ".nft-detail": {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            ".MuiTypography-root": {
              width: "50%",
              fontSize: "16px",
              fontWeight: "500",
              color: "#a0b0c0",
            },
          },
        }}
      >
        <Typography
          sx={{
            textAlign: "center",
            fontSize: "20px",
            fontWeight: "700",
            color: "white",
            marginBottom: "10px",
          }}
        >
          {nftInfo.name}
        </Typography>
        <Box className="nft-detail">
          <Typography>Token ID</Typography>
          <Typography sx={{ direction: "rtl" }}>{nftInfo.tokenId}</Typography>
        </Box>
        <Box className="nft-detail">
          <Typography>Serial Number</Typography>
          <Typography sx={{ direction: "rtl" }}>{nftInfo.serialNum}</Typography>
        </Box>
        <Divider
          sx={{
            borderColor: "#a0b0c0",
            margin: { md: "6px 0", sm: "4px 0", xs: "2px 0" },
          }}
        />
        <Box className="nft-detail">
          <Typography>Duration</Typography>
          <Typography sx={{ textAlign: "end" }}>{duration} days</Typography>
        </Box>
        <Slider
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          min={1}
          max={nftInfo.maxDuration}
          marks
          sx={{
            width: "50%",
            marginLeft: "50%",
            color: "#a0b0c0",
          }}
        />
        <Box className="nft-detail">
          <Typography>Loan Amount (ħ)</Typography>
          <Input
            type="number"
            value={billPrice}
            onChange={(e) =>
              setBillPrice(
                e.target.value < 1
                  ? 1
                  : e.target.value > nftInfo.maxBillPrice
                  ? nftInfo.maxBillPrice
                  : e.target.value
              )
            }
            sx={{
              width: "50%",
              height: "32px",
              padding: "0 10px",
              backgroundColor: "transparent",
              border: "1px solid #a0b0c0",
              borderRadius: "0",
              fontSize: "14px",
              lineHeight: "14px",
              color: "#a0b0c0",
              "&::before": {
                display: "none",
              },
              "&::after": {
                display: "none",
              },
            }}
          />
        </Box>
        <Box className="nft-detail">
          <Typography>Payback Amount</Typography>
          <Typography sx={{ textAlign: "end" }}>
            {parseFloat(
              parseFloat(billPrice) +
                parseFloat((billPrice * nftInfo.fee) / 100)
            ).toFixed(2)}{" "}
            ħ
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          marginTop: "15px",
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          ".MuiButton-root": {
            width: "48%",
            borderRadius: "0",
            background: "#10a070",
            color: "white",
            ":hover": {
              background: "#10a070",
            },
          },
        }}
      >
        <Button
          onClick={() => onClickOk(loanType, nftInfo, duration, billPrice)}
        >
          OK
        </Button>
        <Button onClick={() => onClickCancel()}>CANCEL</Button>
      </Box>
    </Box>
  );
}

export default QuickLoan;
