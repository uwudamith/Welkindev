using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Mvc;
using Avanzar.Welkin.Common;

namespace Welkin.UI.Controllers
{
    public class CaseLedgerController : Controller
    {
        // GET: CaseLedger
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
                        JsCallback = "PopulateCaseDropdown",
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
        public async Task<ActionResult> SaveCaseLedger(string model)
        {
            return View("Index");
        }
    }
}