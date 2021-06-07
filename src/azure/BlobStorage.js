import { BlobServiceClient } from "@azure/storage-blob";

// THIS IS SAMPLE CODE ONLY - DON'T STORE TOKEN IN PRODUCTION CODE
const containerName = `guestbookblobcont1003`;

const sasToken =
  "sp=racwdl&st=2021-06-07T17:52:30Z&se=2021-06-08T01:52:30Z&sv=2020-02-10&sr=c&sig=HLnPy2AS6sfqJfI8%%2F%%2FUzSUIESbNUhSI2s9CqyxLa8j0%%3D";
const storageAccountName = "csb10032000caf50971";

// </snippet_package>

// <snippet_isStorageConfigured>
// Feature flag - disable storage feature to app if not configured
export const isStorageConfigured = () => {
  return !storageAccountName || !sasToken ? false : true;
};
// </snippet_isStorageConfigured>

// <snippet_getBlobsInContainer>
// return list of blobs in container to display
const getBlobsInContainer = async (containerClient) => {
  const returnedBlobUrls = [];

  // get list of blobs in container
  // eslint-disable-next-line
  for await (const blob of containerClient.listBlobsFlat()) {
    // if image is public, just construct URL
    returnedBlobUrls.push(
      `https://${storageAccountName}.blob.core.windows.net/${containerName}/${blob.name}`
    );
  }

  return returnedBlobUrls;
};
// </snippet_getBlobsInContainer>

// <snippet_createBlobInContainer>
const createBlobInContainer = async (containerClient, file) => {
  // create blobClient for container
  const blobClient = containerClient.getBlockBlobClient(file.name);
  // set mimetype as determined from browser with file upload control
  // const metadata = {};
  //metadata["x-ms-blob-type"] = "BlockBlob";
  const options = {
    blobHTTPHeaders: { blobContentType: "BlockBlob" },
  };
  blobClient.DefaultRequestHeaders.Add("x-ms-blob-type", "BlockBlob");

  // upload file
  await blobClient.uploadBrowserData(file, options);
};
// </snippet_createBlobInContainer>

// <snippet_uploadFileToBlob>
const uploadFileToBlob = async (file) => {
  if (!file) return [];

  // get BlobService = notice `?` is pulled out of sasToken - if created in Azure portal
  const blobService = new BlobServiceClient(
    `https://${storageAccountName}.blob.core.windows.net/?${sasToken}`
  );

  // get Container - full public read access
  const containerClient = blobService.getContainerClient(containerName);
  await containerClient.createIfNotExists({
    access: "container",
  });

  // upload file
  await createBlobInContainer(containerClient, file);

  // get list of blobs in container
  return getBlobsInContainer(containerClient);
};
// </snippet_uploadFileToBlob>

export default uploadFileToBlob;
