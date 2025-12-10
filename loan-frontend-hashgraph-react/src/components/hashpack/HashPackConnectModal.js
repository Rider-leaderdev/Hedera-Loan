import React from "react";
import { Button, Input } from "@mui/material";
import QRCode from "react-qr-code";

const MINI_TITLE_STYLE = {
  color: "lightcyan",
  fontSize: "16px",
  marginTop: "10px",
  marginBottom: "10px",
  fontWeight: "500",
};

const HashPackConnectModal = ({
  pairingString,
  connectedAccount,
  onClickConnectHashPack,
  onClickCopyPairingStr,
  onClickDisconnectHashPack,
}) => {
  return (
    <div
      style={{
        backgroundColor: "#1f1d2b",
        width: "fit-content",
        height: "fit-content",
        border: "3px solid white",
        padding: "20px 17px",
        position: "absolute",
        right: "20px",
        top: "20px",
        left: "auto",
      }}
    >
      {!connectedAccount && (
        <div>
          <p
            style={{
              color: "white",
              fontSize: "24px",
              margin: "0",
              fontWeight: "700",
            }}
          >
            Pair Wallet
          </p>
          <p style={MINI_TITLE_STYLE}>PAIR WITH WALLET</p>
          <Button
            onClick={() => onClickConnectHashPack()}
            variant="contained"
            sx={{
              backgroundColor: "#4a417f",
              width: 200,
              height: 42,
              color: "white",
              borderRadius: 0,
              textTransform: "none",
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "#4a417f",
                boxShadow: "none",
              },
              "&:focus": {
                outline: "none",
              },
            }}
          >
            <img
              alt="..."
              src="https://wallet.hashpack.app/assets/favicon/favicon.ico"
              style={{
                width: 24,
                height: 24,
                marginRight: "5px",
              }}
            />
            <p
              style={{
                margin: 0,
              }}
            >
              HashPack
            </p>
          </Button>
          <p style={MINI_TITLE_STYLE}>PAIR WITH CODE</p>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Input
              value={pairingString}
              readOnly={true}
              sx={{
                width: 185,
                height: 42,
                border: "3px solid",
                borderColor: "#4a417f",
                color: "gray",
                padding: "0 5px",
                "&::before": {
                  display: "none",
                },
                "&::after": {
                  display: "none",
                },
              }}
            />
            <Button
              onClick={() => onClickCopyPairingStr()}
              variant="contained"
              sx={{
                backgroundColor: "#4a417f",
                width: 65,
                height: 42,
                color: "white",
                borderRadius: 0,
                textTransform: "none",
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: "#4a417f",
                  boxShadow: "none",
                },
                "&:focus": {
                  outline: "none",
                },
              }}
            >
              Copy
            </Button>
          </div>
          <p style={MINI_TITLE_STYLE}>PAIR WITH QR CODE</p>
          <QRCode
            value={pairingString}
            style={{
              width: 250,
              height: 250,
            }}
          />
        </div>
      )}
      {connectedAccount && (
        <div>
          <p
            style={{
              color: "white",
              fontSize: "24px",
              margin: "0 0 20px",
              fontWeight: "700",
            }}
          >
            Disconnect Wallet
          </p>
          <Button
            onClick={() => onClickDisconnectHashPack()}
            sx={{
              backgroundColor: "#4a417f",
              width: 200,
              height: 42,
              color: "white",
              borderRadius: 0,
              textTransform: "none",
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "#4a417f",
                boxShadow: "none",
              },
              "&:focus": {
                outline: "none",
              },
            }}
          >
            Disconnect
          </Button>
        </div>
      )}
    </div>
  );
};

export default HashPackConnectModal;
