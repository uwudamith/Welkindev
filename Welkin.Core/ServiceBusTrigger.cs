using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Avanzar.Welkin.Common;
using Microsoft.Azure.WebJobs;
using Microsoft.Practices.Unity;
using Welkin.Core.Entities;

namespace Welkin.Core
{
    public class ServiceBusTrigger
    {
        /// <summary>
        ///     Processes the bus queue message.
        /// </summary>
        /// <param name="message">The message.</param>
        /// <param name="logger">The logger.</param>
        public static void ProcessBusQueueMessage([ServiceBusTrigger("inputqueue")] string message,
            TextWriter logger)
        {
            var requestList = Request.DeserializeList(message);
            foreach (var req in requestList)
            {
                var instance = new ServiceBusTrigger();

                if (req.Targert != null)
                    instance.GetType().GetMethod(req.Targert).Invoke(instance, new object[] {req});
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
        ///     Gets the cases.
        /// </summary>
        /// <param name="request">The request.</param>
        public async void GetCases(Request request)
        {
            if (!(request.Source is Case)) return;

            var ca = request.Source as Case;
            var r = new Response<List<Case>> {Request = request};
            try
            {
                
            }
            catch (Exception e)
            {
                r.Result = new List<Case>();
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
            var instance =   Program.Container.Resolve<IEntityFactory>().CreateEntity<Master>(request.Type.ToString());
            if (!(request.Source is Master)) return;
            var r = new Response<Master> {Request = request};
            try
            {
                var data = await instance.GetAll(request.Source as Master);
                r.Result = data.ToList().FirstOrDefault();
            }
            catch (Exception e)
            {
                r.Result = Program.Container.Resolve<IEntityFactory>().CreateEntity<Master>("Master");
                r.StatusType = Enums.StatusType.Error;
                r.Message = e.Message;
            }
           await SignalRHandler.Send(r);
        }

        public async void GetData(Request request)
        {
           // request.Source = EntityRequestHandler.Deserialize<Master>(request.Json);
            var instance = Program.Container.Resolve<IEntityFactory>().CreateEntity<Master>(request.Type.ToString());
            //if (!(request.Source is Master)) return;
            var r = new Response<Master> { Request = request };
            try
            {
                var data = await instance.GetData("Master", request.Json);
                r.JsonResult = data.ToString();
            }
            catch (Exception e)
            {
                r.Result = Program.Container.Resolve<IEntityFactory>().CreateEntity<Master>("Master");
                r.StatusType = Enums.StatusType.Error;
                r.Message = e.Message;
            }
            await SignalRHandler.Send(r);
        }
    }
}