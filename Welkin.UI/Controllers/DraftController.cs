using Avanzar.Welkin.Common;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Mvc;
using Welkin.UI.App_Start;

namespace Welkin.UI.Controllers
{
    public class DraftController : BaseController
    {
        // GET: Draft
        public async Task<ActionResult> Index()
        {
          return await LoadMasterData();
        }

        /// <summary>
        /// Loads the master data.
        /// </summary>
        /// <returns></returns>
        public async Task<ActionResult> LoadMasterData()
        {
            var rList = new List<Request>();

            var r = new Request
            {
                Json = @"SELECT * FROM Data d WHERE d.Type ='Master' AND d.ClientId ='" + SessionProvider.ClientId + "'",
                JsCallback = "masterDataResponse",
                Targert = "GetData",
                UserId = 1,
                Type = Enums.EntityType.Master
            };
            rList.Add(r);
            //await StorageQueueHandler.PushAsync<string>(r);
            await QueueHandler.PushToServiceAsync(rList);
            return View("Index");
        }
    }
}