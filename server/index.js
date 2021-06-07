import appInsights from "applicationinsights";
import express from "express";
import bodyParser from "body-parser";
import mustacheExpress from "mustache-express";
import expressValidator from "express-validator";
import { default as mongodb } from "mongodb";
let MongoClient = mongodb.MongoClient;
import cors from "cors";
import path from "path";

const url =
  "mongodb://guestbookgcc1003-mongod:F9xPnSFqBccmDZv9ZPVImV3RGGLrJseKWC9i1Y8WghIvNswchBQGXu01nJmiL6eG2nSTkiofitI3fwaDsnRN8g%3D%3D@guestbookgcc1003-mongod.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=@guestbookgcc1003-mongod@";

appInsights
  .setup("c5dec33a-a94d-4c29-9cad-cadcb7e46d9e")
  .setInternalLogging(true, true)
  .setUseDiskRetryCaching(false)
  .setSendLiveMetrics(true)
  .start();
// const Signature = require('./models/signature.js')
var app = express();
const DB_NAME = "guestbookgcc1003-mongod";
const COLLECTION_NAME = "guestbook";
let collection = null;
var dbo = null;

//=========================//

//====Blob storage===//

// const containerName1 = "questbookcontainer-1003";
// const inMemoryStorage = multer.memoryStorage();
// const uploadStrategy = multer({ storage: inMemoryStorage }).single("image");

// const containerName2 = "questbookcontainerimages-1003";
// const ONE_MEGABYTE = 1024 * 1024;
// const uploadOptions = { bufferSize: 4 * ONE_MEGABYTE, maxBuffers: 20 };
// const AZURE_STORAGE_ACCOUNT_ACCESS_KEY =
//   "afA/BBt1Yw1JegUqvLIOfNVocvDo9ZRLBekGBfcl+JaIYLwPp4KbpDT1lLBT8XURwQrUu8JmEKCPQQzXjr6H0w==";
// const AZURE_STORAGE_ACCOUNT_NAME = "guestbookblob1003";
// const sharedKeyCredential = new StorageSharedKeyCredential(
//   AZURE_STORAGE_ACCOUNT_NAME,
//   AZURE_STORAGE_ACCOUNT_ACCESS_KEY
// );
// const pipeline = newPipeline(sharedKeyCredential);

// const blobServiceClient = new BlobServiceClient(
//   `https://${AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
//   pipeline
// );
//====SET APP ENGINE===//
if (process.env.NODE_ENV !== "production") {
  // dotenv.config();
}
app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", "./views");
app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(expressValidator());
const __dirname = path.resolve(path.dirname(""));
app.use(express.static(path.join(__dirname, "client/build")));

//====mongodb PROMISE===//

MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log("Unable to connect to the mongoDB server. Error:", err);
  } else {
    dbo = db.db(DB_NAME);
    collection = db.db(DB_NAME).collection(COLLECTION_NAME);
    console.log("Connection established to", url);
  }
});

//====GET ALL SIGNATURES===//
app.get("/api/reviews", cors(), function (req, res) {
  dbo
    .collection(COLLECTION_NAME)
    .find({})
    .toArray((err, result) => {
      if (err) throw err;
      res.json(result);
    });
});

//====POST NEW SIGNATURE===//
app.post("/api/review", cors(), function (req, res) {
  const entry = {
    email: req.body.email,
    guestSignature: req.body.guestSignature,
    message: req.body.message,
    team: req.body.team,
  };

  collection.insertOne(entry, (err, result) => {
    if (err) throw err;
    console.log("Inserted 1 entry", entry);
    res.json(entry);
  });
});

//====SERVE STATIC REACT===//
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});
//==========================//

//====APP LISTEN ON ENVIRONMENT PORT===//
app.listen(process.env.PORT || 3001);
//==========================//

// setInterval(() => appInsights.defaultClient.trackEvent({name: "my event", properties: {foo: 'event'}}), 100);
// setInterval(() => appInsights.defaultClient.trackTrace({message: "my event", properties: {foo: 'message'}}), 60000);
setInterval(
  () =>
    appInsights.defaultClient.trackException({
      exception: new Error("my custom error2"),
      measurements: { meas1: 123.456 },
    }),
  60000
);

//====Blob storage api===//

// const getBlobName = (originalName) => {
//   // Use a random number to generate a unique file name,
//   // removing "0." from the start of the string.
//   const identifier = Math.random().toString().replace(/0\./, "");
//   return `${identifier}-${originalName}`;
// };

// app.get("/api/get-image", async (req, res, next) => {
//   let viewData;

//   try {
//     const containerClient =
//       blobServiceClient.getContainerClient(containerName1);
//     const listBlobsResponse = await containerClient.listBlobFlatSegment();

//     for await (const blob of listBlobsResponse.segment.blobItems) {
//       console.log(`Blob: ${blob.name}`);
//     }

//     viewData = {
//       title: "Home",
//       viewName: "index",
//       accountName: AZURE_STORAGE_ACCOUNT_NAME,
//       containerName: containerName1,
//     };

//     if (listBlobsResponse.segment.blobItems.length) {
//       viewData.thumbnails = listBlobsResponse.segment.blobItems;
//     }
//   } catch (err) {
//     viewData = {
//       title: "Error",
//       viewName: "error",
//       message: "There was an error contacting the blob storage container.",
//       error: err,
//     };
//     res.status(500);
//   } finally {
//     res.render(viewData.viewName, viewData);
//   }
// });

// app.post("/api/upload", uploadStrategy, async (req, res) => {
//   const blobName = getBlobName(req.file.originalname);
//   const stream = getStream(req.file.buffer);
//   const containerClient = blobServiceClient.getContainerClient(containerName2);
//   const blockBlobClient = containerClient.getBlockBlobClient(blobName);

//   try {
//     await blockBlobClient.uploadStream(
//       stream,
//       uploadOptions.bufferSize,
//       uploadOptions.maxBuffers,
//       { blobHTTPHeaders: { blobContentType: "image/jpeg" } }
//     );
//     res.render("success", { message: "File uploaded to Azure Blob storage." });
//   } catch (err) {
//     res.render("error", { message: err.message });
//   }
// });

//====EXPORT APP===//
export default app;
