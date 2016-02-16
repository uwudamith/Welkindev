using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.CompilerServices;
using Avanzar.Welkin.Common;
using Microsoft.Azure.WebJobs;
using Microsoft.Practices.Unity;
using Welkin.Core.Entities;

namespace Welkin.Core
{
    public partial class ServiceBusTrigger
    {
        private IEntityFactory _entityFactory;
        public ServiceBusTrigger(IEntityFactory entityFactory)
        {
            _entityFactory = entityFactory;
        }
        /// <summary>
        ///     Processes the bus queue message.
        /// </summary>
        /// <param name="message">The message.</param>
        /// <param name="logger">The logger.</param>
        public  void ProcessBusQueueMessage([ServiceBusTrigger("inputqueue")] string message,
            TextWriter logger)
        {
            var requestList = Request.DeserializeList(message);
            foreach (var req in requestList)
            {
                var instance = this;//new ServiceBusTrigger();

                if (req.Targert != null)
                    instance.GetType().GetMethod(req.Targert).Invoke(instance, new object[] {req});
                  Console.WriteLine(string.Format("Target Method: {0}",req.Targert));
            }

           
        }

        /// <summary>
        ///     Creates the job.
        /// </summary>
        /// <param name="request">The request.</param>
        public async void CreateJob(Request request)
        {
            if (!(request.Source is Case)) return;

            var ca = request.Source as Case;
            var r = new Response<bool> {Request = request};
            try
            {
                await ca.UpsertDocument(request.Json, request.Type.ToString());
                r.Result = true;
            }
            catch (Exception e)
            {
                r.Result = false;
                r.StatusType = Enums.StatusType.Error;
                r.Message = e.Message;
            }
            await SignalRHandler.Send(r);
        }

      
        /// <summary>
        ///     Gets the master data.
        /// </summary>
        /// <param name="request">The request.</param>
        public async void GetMasterData(Request request)
        {
            
            request.Source = EntityRequestHandler.Deserialize<Master>(request.Json);
            var instance =   _entityFactory.CreateEntity<Master>(request.Type.ToString());
            if (!(request.Source is Master)) return;
            var r = new Response<Master> {Request = request};
            try
            {
                var data = await instance.GetAll(request.Source as Master);
                r.Result = data.ToList().FirstOrDefault();
            }
            catch (Exception e)
            {
                r.Result = _entityFactory.CreateEntity<Master>("Master");
                r.StatusType = Enums.StatusType.Error;
                r.Message = e.Message;
            }
           await SignalRHandler.Send(r);
        }



      

      
    }
}