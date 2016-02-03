using System.IO;
using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;

namespace Welkin.Core
{
    public class Trigger
    {
        /// <summary>
        /// Processes the queue message.
        /// </summary>
        /// <param name="source">The source.</param>
        /// <param name="log">The log.</param>
        /// <returns></returns>
        public static async Task ProcessQueueMessage([QueueTrigger("jobqueue")] string source, TextWriter log)
        {
            // await SignalRHandler.SendDataToHub(source);
        }
    }
}