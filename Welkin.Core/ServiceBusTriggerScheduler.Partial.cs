using Avanzar.Welkin.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Welkin.Core.Entities;

namespace Welkin.Core
{
   public partial class ServiceBusTrigger
    {

        /// <summary>
        /// Saves the scheduler task.
        /// </summary>
        /// <param name="request">The request.</param>
        public async void SaveSchedulerTask(Request request)
        {
            var instance = _entityFactory.CreateEntity<Scheduler>(request.Type.ToString());
            var r = new Response<bool> { Request = request };
            try
            {
                await instance.UpsertDocument(request.Json, request.Type.ToString());
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
        /// Gets the scheduler tasks.
        /// </summary>
        /// <param name="request">The request.</param>
        public async void GetSchedulerTasks(Request request)
        {
            var instance = _entityFactory.CreateEntity<Scheduler>(request.Type.ToString());
            var r = new Response<bool> { Request = request };
            try
            {
                r.JsonResult = Newtonsoft.Json.JsonConvert.SerializeObject(instance.ExecuteQuery("Scheduler", request.Json));
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

        public async void DeleteTasks(Request request)
        {
            var instance = _entityFactory.CreateEntity<Scheduler>(request.Type.ToString());
            var r = new Response<bool> { Request = request };
            try
            {
                await instance.DeleteDocument(request.Json,"Scheduler");
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

    }
}
