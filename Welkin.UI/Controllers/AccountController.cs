using Avanzar.Welkin.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Welkin.UI.App_Start;

namespace Welkin.UI.Controllers
{
    public class AccountController : BaseController
    {
        // GET: Account
        public async Task<ActionResult> Index()
        {
            return await LoadMasterData();
        }

        public async Task<ActionResult> LoadMasterData()
        {
            var rList = new List<Request>();

            var r = new Request
            {
                Json = @"SELECT * FROM Data d WHERE d.Type ='Master' AND d.ClientId ='" + SessionProvider.ClientId + "'",
                JsCallback = "masterDataResponse",
                Targert = "GetMaster",
                UserId = 1,
                Type = Enums.EntityType.Master
            };
            rList.Add(r);
            //await StorageQueueHandler.PushAsync<string>(r);
            await QueueHandler.PushToServiceAsync(rList);
            return View("Index");
        }

        [HttpPost]
        public async Task<string> SaveAccountMasterData(string model)
        {
            var rList = new List<Request>();

            var r = new Request
            {
                Json = model,
                JsCallback = "notifyAccount",
                Targert = "SaveMaster",
                UserId = 1,
                Type = Enums.EntityType.Master
            };
            rList.Add(r);
            await QueueHandler.PushToServiceAsync(rList);
            return null;
        }

    }
}