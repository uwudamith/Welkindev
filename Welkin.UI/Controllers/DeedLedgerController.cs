using Avanzar.Welkin.Common;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace Welkin.UI.Controllers
{
    public class DeedLedgerController : Controller
    {
        // GET: DeedLedger
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
                Json = @"__.filter(function(master) { return master; })",
                JsCallback = "PopulateDeedDropdown",
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