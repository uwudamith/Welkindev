using Avanzar.Welkin.Common;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace Welkin.UI.Controllers
{
    public class SchedulerController : Controller
    {
        // GET: Scheduler
        public async Task<ActionResult>  Index()
        {
            await LoadData();
            return View();


        }

        private static async Task LoadData()
        {
            var rList = new List<Request>();

            var r = new Request
                    {
                        Json = @"__.filter(function(master) { return master; })",
                        JsCallback = "masterDataResponse",
                        Targert = "GetData",
                        UserId = 1,
                        Type = Enums.EntityType.Master
                    };
            rList.Add(r);
            //await StorageQueueHandler.PushAsync<string>(r);
            await QueueHandler.PushToServiceAsync(rList);
        }
    }
}