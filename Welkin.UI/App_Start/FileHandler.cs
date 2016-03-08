using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace Welkin.UI.App_Start
{
    public class FileHandler
    {
        public static string UploadFile(System.Web.HttpPostedFileBase file, string client, string uniqueId)
        {
            try
            {
                var storageAccount =
                    CloudStorageAccount.Parse(
                        ConfigurationManager.ConnectionStrings["QueueStorageConnectionString"].ConnectionString);

                // Create the blob client.
                CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

                // Retrieve a reference to a container.
                CloudBlobContainer container = blobClient.GetContainerReference(client);

                // Create the container if it doesn't already exist.
                container.CreateIfNotExists();

                CloudBlockBlob blockBlob = container.GetBlockBlobReference(uniqueId + "\\" + file.FileName);

                // Create or overwrite the "myblob" blob with contents from a local file.
                using (var fileStream = file.InputStream)
                {
                    blockBlob.UploadFromStream(fileStream);
                }
                return blockBlob.Uri.ToString();
            }
            catch (Exception e)
            {

                throw;
            }
        }

        public static bool DeleteFile(string client, string folder, string file)
        {
            try
            {
                var storageAccount =
                    CloudStorageAccount.Parse(
                        ConfigurationManager.ConnectionStrings["QueueStorageConnectionString"].ConnectionString);

                // Create the blob client.
                CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

                // Retrieve a reference to a container.
                CloudBlobContainer container = blobClient.GetContainerReference(client);
                var fileref = folder + "/" + file;
                CloudBlockBlob blockBlob = container.GetBlockBlobReference(fileref);

                // Delete the blob.
                blockBlob.Delete();

                return true;
            }
            catch (Exception e)
            {

                throw;
            }
        }

        public static string DownloadFile(string client, string folder, string file)
        {
            try
            {
                var storageAccount =
                    CloudStorageAccount.Parse(
                        ConfigurationManager.ConnectionStrings["QueueStorageConnectionString"].ConnectionString);

                // Create the blob client.
                CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

                // Retrieve a reference to a container.
                CloudBlobContainer container = blobClient.GetContainerReference(client);
                var fileref = folder + "/" + file;
                CloudBlockBlob blockBlob = container.GetBlockBlobReference(fileref);
                
                // Save blob contents to a file.
                //using (var fileStream = System.IO.File.OpenWrite(@"path\myfile"))
                //{
                //    blockBlob.DownloadToStream(fileStream);
                //}
                var sasConstraints = new SharedAccessBlobPolicy();
                sasConstraints.SharedAccessStartTime = DateTime.UtcNow.AddMinutes(-5);
                sasConstraints.SharedAccessExpiryTime = DateTime.UtcNow.AddMinutes(10);
                sasConstraints.Permissions = SharedAccessBlobPermissions.Read;

                var sasBlobToken = blockBlob.GetSharedAccessSignature(sasConstraints);
                var url = blockBlob.Uri + sasBlobToken;


                return url;
            }
            catch (Exception e)
            {

                throw e;
            }
        }
    }
}