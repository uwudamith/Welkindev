using System.Configuration;
using Microsoft.Azure.WebJobs;
using Microsoft.Practices.Unity;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Auth;
using Microsoft.WindowsAzure.Storage.Queue;
using Welkin.Core.DI;
using Welkin.Core.Entities;
using Welkin.Core.Repositories;
using System.Reflection;

namespace Welkin.Core
{
    // To learn more about Microsoft Azure WebJobs SDK, please see http://go.microsoft.com/fwlink/?LinkID=320976
    public class Program
    {
        public static IUnityContainer Container { get; private set; }

        /// <summary>
        /// Defines the entry point of the application.
        /// </summary>
        private static void Main()
        {
            Register();
            SignalRHandler.Initialize();
            // JobHostConfiguration config = new JobHostConfiguration();
            var config = new JobHostConfiguration
                         {
                             JobActivator = new Activator(Container)
                         };
            config.UseServiceBus();
            var host = new JobHost(config);
            host.RunAndBlock();
        }

        /// <summary>
        /// Registers this instance.
        /// </summary>
        public static void Register()
        {
            using (Container = new UnityContainer())
            {
                Container.RegisterType(typeof(IDataRepository), typeof(DataRepository));
                Container.RegisterType(typeof(ISettingsRepository), typeof(SettingsRepository));
                Container.RegisterType(typeof(IEntityFactory), typeof(EntityFactory));


                foreach (System.Type cType in Assembly.GetExecutingAssembly().GetTypes())
                {
                    var attribs = cType.GetCustomAttributes(typeof (EntityType), true);
                    var iface = cType.GetInterface("IEventEntity");

                    if (attribs?.Length > 0 && iface != null)
                    {
                        var consumer = (EntityType) attribs[0];
                        foreach (var _resourceType in consumer.ResourceType)
                        {
                            Container.RegisterType(typeof (IEventEntity), System.Type.GetType(cType.FullName),
                                _resourceType, new TransientLifetimeManager());
                        }

                    }
                }
            }
        }

     

        //For Testing
        /// <summary>
        /// Sends the message.
        /// </summary>
        /// <param name="msg">The MSG.</param>
        public static void SendMessage(string msg)
        {
            var credentials = new StorageCredentials("welkinstoragedev",
                "Zk4FUJTCdm2ViP8xplmG/Zm1Vzop9g6u+1Ey86hl2wG5C5ZuIjZX1Eta1gjLscJDjRqglToXzHL+pWnzgxpCRg==");
            var storageAccount =
                CloudStorageAccount.Parse(ConfigurationManager.ConnectionStrings["AzureWebJobsStorage"].ConnectionString);

            // Create the queue client
            var queueClient = storageAccount.CreateCloudQueueClient();
            var queue = queueClient.GetQueueReference("queue");
            //queue.DeleteIfExists();
            queue.Clear();

            var message = new CloudQueueMessage(msg);
            queue.AddMessage(message);
        }
    }
}