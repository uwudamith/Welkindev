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
        /// Gets the deeds.
        /// </summary>
        /// <param name="request">The request.</param>
        public async void GetDrafts(Request request)
        {
            var instance = _entityFactory.CreateEntity<Draft>(request.Type.ToString());
            var r = new Response<bool> { Request = request };
            try
            {
                r.JsonResult = Newtonsoft.Json.JsonConvert.SerializeObject(instance.ExecuteQuery("Data", request.Json));
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


        public async void SaveDraft(Request request)
        {
            var instance = _entityFactory.CreateEntity<Draft>(request.Type.ToString());
            var r = new Response<bool> { Request = request };
            try
            {
                await instance.UpsertDocument(request.Json, "Data");
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
