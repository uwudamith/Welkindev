using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Avanzar.Welkin.Common;
using Welkin.Core.Entities;

namespace Welkin.Core
{
   public partial class ServiceBusTrigger
    {
        /// <summary>
        /// Gets the data.
        /// </summary>
        /// <param name="request">The request.</param>
        public async void GetData(Request request)
        {
            // request.Source = EntityRequestHandler.Deserialize<Master>(request.Json);
            var instance = _entityFactory.CreateEntity<Master>(request.Type.ToString());
            //if (!(request.Source is Master)) return;
            var r = new Response<Master> { Request = request };
            try
            {
                var data = await instance.GetData("Master", request.Json,"query");
                r.JsonResult = data.ToString();
            }
            catch (Exception e)
            {
                r.Result = _entityFactory.CreateEntity<Master>("Master");
                r.StatusType = Enums.StatusType.Error;
                r.Message = e.Message;
            }
            await SignalRHandler.Send(r);
        }

        public async void SaveMaster(Request request)
        {
            var instance = _entityFactory.CreateEntity<Master>(request.Type.ToString());
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
        /// Updates the master.
        /// </summary>
        /// <param name="request">The request.</param>
        public async void UpdateMaster(Request request)
        {
            var instance = _entityFactory.CreateEntity<Master>(request.Type.ToString());
            var r = new Response<bool> { Request = request };
            try
            {
                await instance.ReplaceDocument(request.Json, request.Type.ToString());
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
