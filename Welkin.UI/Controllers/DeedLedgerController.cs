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

        [HttpPost]
        public async Task<ActionResult> SaveDeedLedger(string model)
        {
            var rList = new List<Request>();

            var r = new Request
            {
                Json = model,
                JsCallback = "notify",
                Targert = "SaveDeed",
                UserId = 1,
                Type = Enums.EntityType.Deed
            };
            rList.Add(r);
            await QueueHandler.PushToServiceAsync(rList);
            return View("Index");
        }

        [HttpPost]
        public async Task<ActionResult> UpdateDeedLedger(string model)
        {
            var rList = new List<Request>();

            var r = new Request
            {
                Json = model,
                JsCallback = "notify",
                Targert = "UpdateDeed",
                UserId = 1,
                Type = Enums.EntityType.Deed
            };
            rList.Add(r);
            await QueueHandler.PushToServiceAsync(rList);
            return View("Index");
        }

        [HttpPost]
        public async Task<ActionResult> GetDeeds(string model)
        {
            var rList = new List<Request>();

            var r = new Request
            {
                Json = model,
                JsCallback = "searchDeedResponse",
                Targert = "GetDeeds",
                UserId = 1,
                Type = Enums.EntityType.Deed
            };
            rList.Add(r);
            await QueueHandler.PushToServiceAsync(rList);
            return View("Index");
        }
    }
}