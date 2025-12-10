import React, { useState } from "react";
import {
  Box,
  Container,
  Drawer,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import StorageIcon from "@mui/icons-material/Storage";
import HashPackConnectButton from "../components/hashpack/hashpackConnectButton";
import { PAGE_INFO } from "../config";

function Navbar({ currentPage, resetPage }) {
  const [menuView, setMenuView] = useState(false);

  return (
    <Box
      sx={{
        position: "fixed",
        width: "100vw",
        height: "72px",
        background: "#203040",
        zIndex: "10",
      }}
    >
      <Container
        sx={{
          height: "100%",
          paddingTop: "10px",
          paddingBottom: "10px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            height: "100%",
            img: {
              height: "100%",
            },
          }}
        >
          <Typography
            sx={{
              display: { md: "flex", xs: "none" },
              color: "white",
              fontSize: "24px",
              fontWeight: "700",
              marginRight: "10px",
            }}
          >
            H Arcade
          </Typography>
          <img alt="" src="./logo192.png" />
          <Link
            href="https://twitter.com/hedera300"
            target="_blank"
            sx={{
              display: { sm: "flex", xs: "none" },
              alignItems: "center",
              img: {
                marginLeft: "20px",
                width: "32px",
                height: "32px",
              },
            }}
          >
            <img alt="" src="./twitter.svg" />
          </Link>
          <Link
            href="https://discord.gg/Rb6kTcHsew"
            target="_blank"
            sx={{
              display: { sm: "flex", xs: "none" },
              alignItems: "center",
              img: {
                marginLeft: "10px",
                width: "42px",
                height: "42px",
              },
            }}
          >
            <img alt="" src="./discord.svg" />
          </Link>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: { sm: "flex", xs: "none" },
              flexDirection: "row",
              alignItems: "center",
              marginRight: "20px",
              ".MuiLink-root": {
                marginRight: "16px",
                cursor: "pointer",
              },
            }}
          >
            <Link
              onClick={() => {
                resetPage(PAGE_INFO.home.id);
              }}
              underline="none"
              sx={{
                color: currentPage === PAGE_INFO.home.id ? "#10a070" : "white",
                fontWeight: currentPage === PAGE_INFO.home.id ? "700" : "500",
              }}
            >
              {PAGE_INFO.home.text}
            </Link>
            <Link
              onClick={() => {
                resetPage(PAGE_INFO.myNfts.id);
              }}
              underline="none"
              sx={{
                color:
                  currentPage === PAGE_INFO.myNfts.id ? "#10a070" : "white",
                fontWeight: currentPage === PAGE_INFO.myNfts.id ? "700" : "500",
              }}
            >
              {PAGE_INFO.myNfts.text}
            </Link>
            <Link
              onClick={() => {
                resetPage(PAGE_INFO.loanedNfts.id);
              }}
              underline="none"
              sx={{
                color:
                  currentPage === PAGE_INFO.loanedNfts.id ? "#10a070" : "white",
                fontWeight:
                  currentPage === PAGE_INFO.loanedNfts.id ? "700" : "500",
              }}
            >
              {PAGE_INFO.loanedNfts.text}
            </Link>
          </Box>
          <Box
            sx={{
              ".MuiButton-root": {
                width: "120px",
                height: "36px",
                background: "transparent",
                border: "1px solid #10a070",
                borderRadius: "0",
                textTransform: "none",
                color: "#10a070",
                fontSize: "14px",
                lineHeight: "14px",
              },
            }}
          >
            <HashPackConnectButton />
          </Box>
          <IconButton
            sx={{
              display: { sm: "none", xs: "flex" },
              marginLeft: "10px",
            }}
            onClick={() => setMenuView(true)}
          >
            <MenuIcon
              sx={{
                color: "#18aa6d",
              }}
            />
          </IconButton>
        </Box>
      </Container>
      <Drawer
        anchor="right"
        open={menuView}
        onClose={() => {
          setMenuView(false);
        }}
        sx={{
          display: {
            sm: "none",
            xs: "flex",
          },
        }}
      >
        <Box
          sx={{
            background: "#203040",
            height: "100vh",
            ".MuiListItemText-root": {
              marginLeft: "10px",
            },
          }}
        >
          <List>
            <ListItemButton
              onClick={() => {
                setMenuView(false);
                resetPage(PAGE_INFO.home.id);
              }}
            >
              <HomeIcon
                sx={{
                  color:
                    currentPage === PAGE_INFO.home.id ? "#10a070" : "#a0b0c0",
                }}
              />
              <ListItemText
                primary={PAGE_INFO.home.text}
                sx={{
                  color:
                    currentPage === PAGE_INFO.home.id ? "#10a070" : "#a0b0c0",
                }}
              />
            </ListItemButton>
            <ListItemButton
              onClick={() => {
                setMenuView(false);
                resetPage(PAGE_INFO.myNfts.id);
              }}
            >
              <AccountBalanceWalletIcon
                sx={{
                  color:
                    currentPage === PAGE_INFO.myNfts.id ? "#10a070" : "#a0b0c0",
                }}
              />
              <ListItemText
                primary={PAGE_INFO.myNfts.text}
                sx={{
                  color:
                    currentPage === PAGE_INFO.myNfts.id ? "#10a070" : "#a0b0c0",
                }}
              />
            </ListItemButton>
            <ListItemButton
              onClick={() => {
                setMenuView(false);
                resetPage(PAGE_INFO.loanedNfts.id);
              }}
            >
              <StorageIcon
                sx={{
                  color:
                    currentPage === PAGE_INFO.loanedNfts.id
                      ? "#10a070"
                      : "#a0b0c0",
                }}
              />
              <ListItemText
                primary={PAGE_INFO.loanedNfts.text}
                sx={{
                  color:
                    currentPage === PAGE_INFO.loanedNfts.id
                      ? "#10a070"
                      : "#a0b0c0",
                }}
              />
            </ListItemButton>
            <ListItem>
              <Link
                href="https://twitter.com/hedera300"
                target="_blank"
                sx={{
                  img: {
                    marginLeft: "20px",
                    width: "32px",
                    height: "32px",
                  },
                }}
              >
                <img alt="" src="./twitter.svg" />
              </Link>
              <Link
                href="https://discord.gg/Rb6kTcHsew"
                target="_blank"
                sx={{
                  img: {
                    marginLeft: "20px",
                    width: "42px",
                    height: "42px",
                  },
                }}
              >
                <img alt="" src="./discord.svg" />
              </Link>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}

export default Navbar;
