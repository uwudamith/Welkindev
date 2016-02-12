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
        /// Saves the deed.
        /// </summary>
        /// <param name="request">The request.</param>
        public async void SaveDeed(Request request)
        {
            var instance = _entityFactory.CreateEntity<Deed>(request.Type.ToString());
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
        /// Gets the deeds.
        /// </summary>
        /// <param name="request">The request.</param>
        public async void GetDeeds(Request request)
        {
            var instance = _entityFactory.CreateEntity<Deed>(request.Type.ToString());
            var r = new Response<bool> { Request = request };
            try
            {
                r.JsonResult = Newtonsoft.Json.JsonConvert.SerializeObject(instance.ExecuteQuery("Deed", request.Json));
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
