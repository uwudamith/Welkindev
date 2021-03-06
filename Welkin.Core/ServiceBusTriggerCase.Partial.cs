﻿using System;
using Avanzar.Welkin.Common;
using Welkin.Core.Entities;

namespace Welkin.Core
{
    public partial class ServiceBusTrigger
    {
        /// <summary>
        /// Saves the case.
        /// </summary>
        /// <param name="request">The request.</param>
        public async void SaveCase(Request request)
        {
            var instance = _entityFactory.CreateEntity<Case>(request.Type.ToString());
            var r = new Response<bool> {Request = request};
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

        /// <summary>
        /// Updates the case.
        /// </summary>
        /// <param name="request">The request.</param>
        public async void UpdateCase(Request request)
        {
            var instance = _entityFactory.CreateEntity<Case>(request.Type.ToString());
            var r = new Response<bool> { Request = request };
            try
            {
                await instance.ReplaceDocument(request.Json, "Data");
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

        public async void GetCases(Request request)
        {
            var instance = _entityFactory.CreateEntity<Case>(request.Type.ToString());
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

    }
}
