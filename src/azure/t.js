const { BlovServiceClient, BlobServiceClient } = require("@azure/storage-blob");

var multipart = require("parse-multipart");
const AZURE_STORAGE_CONNECTION_STRING =
  "DefaultEndpointsProtocol=https;AccountName=csb10032000caf50971;AccountKey=OpTcQ7UbKTeXgrxu6QnwkNCbIPdNLcRi22AOLU51ouyN9uKxMfYXJTBzfRV/Id0e3VloWItkFqyOQpsI6YVP6g==;EndpointSuffix=core.windows.net";

module.exports = async function (context, req) {
  context.log("js");
  var bodyBuffer = Buffer.from(req.body);
  var boundary = multipart.getBoundary(req.headers["content-type"]);
  var parts = multipart.Parse(bodyBuffer, boundary);

  const blobServiceClient = await BlobServiceClient.fromConnectionString(
    AZURE_STORAGE_CONNECTION_STRING
  );

  const container = "guestbookblobcont1003";

  const containerClient = await blobServiceClient.getContainerClient(container);

  const blobName = parts[0].filename;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  const uploadBlobResponse = await blockBlobClient.upload(
    parts[0].data,
    parts[0].data.length
  );
  context.res = {
    body: {
      name: parts[0].filename,
      type: parts[0].type,
      data: parts[0].data.length,
    },
  };
  context.done();
};
