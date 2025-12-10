const app = require("./app");
const https = require("https");
const fs = require("fs");

// var server = require('http').createServer(app);
// const port = process.env.PORT || 8080;
// server.listen(port, () => console.log(`Listening on port ${port}..`));

const httpsPort = 5432;
const privateKey = fs.readFileSync(
  "/etc/letsencrypt/live/william520server.com/privkey.pem"
);
const certificate = fs.readFileSync(
  "/etc/letsencrypt/live/william520server.com/fullchain.pem"
);

const credentials = {
  key: privateKey,
  cert: certificate,
};

https.createServer(credentials, app).listen(httpsPort, () => {
  console.log(`Server is running at port ${httpsPort} as https.`);
});
