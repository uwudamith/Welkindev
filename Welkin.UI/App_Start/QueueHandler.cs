using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Threading.Tasks;
using Avanzar.Welkin.Common;
using Microsoft.ServiceBus.Messaging;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Queue;
using Newtonsoft.Json;

namespace Welkin.UI
{
    public class QueueHandler
    {
        /// <summary>
        /// Pushes to service asynchronous.
        /// </summary>
        /// <param name="requests">The requests.</param>
        /// <returns></returns>
        public static async Task PushToServiceAsync(List<Request> requests)
        {
            var client =
                QueueClient.CreateFromConnectionString(
                    ConfigurationManager.ConnectionStrings["AzureWebJobsServiceBus"].ConnectionString, "inputqueue");
            var req = Request.SerializeList(requests);
            using (Stream stream = new MemoryStream())
            using (TextWriter writer = new StreamWriter(stream))
            {
                writer.Write(req);
                writer.Flush();
                stream.Position = 0;

                await client.SendAsync(new BrokeredMessage(stream) {ContentType = "text/plain"});
            }
        }

        /// <summary>
        /// Pushes to storage asynchronous.
        /// </summary>
        /// <param name="request">The request.</param>
        /// <returns></returns>
        public static async Task PushToStorageAsync(Request request)
        {
            var storageAccount =
                CloudStorageAccount.Parse(
                    ConfigurationManager.ConnectionStrings["QueueStorageConnectionString"].ConnectionString);
            var cloudQueueClient = storageAccount.CreateCloudQueueClient();

            var queue = cloudQueueClient.GetQueueReference(request.Queue);
            queue.CreateIfNotExists();

            var r = JsonConvert.SerializeObject(request);
            var message = new CloudQueueMessage(r);
            await queue.AddMessageAsync(message);
        }
    }
}