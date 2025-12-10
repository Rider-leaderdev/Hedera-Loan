module.exports = (mongoose) => {
  const dbModel = mongoose.model(
    "loanInfo",
    mongoose.Schema(
      {
        accountId: { type: String, default: "" },
        name: { type: String, default: "" },
        tokenId: { type: String, default: "" },
        serialNum: { type: Number, default: 0 },
        imageUrl: { type: String, default: "" },
        duration: { type: Number, default: 0 },
        billPrice: { type: Number, default: 0 },
        fee: { type: Number, default: 0 },
      },
      { timestamps: true }
    )
  );
  return dbModel;
};
