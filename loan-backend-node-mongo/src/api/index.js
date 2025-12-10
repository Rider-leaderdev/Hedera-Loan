const express = require("express");
const router = express.Router();
const loanController = require("./controller");

router.get("/get_loan", loanController.getLoanInfoByAccount);
router.post("/loan", loanController.loanNfts);
router.post("/get_back", loanController.getBackNfts);

module.exports = router;
