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
        [HttpPost]
        public async Task<ActionResult> GetSchedulerData(string model)
        {
            var rList = new List<Request>();

            var r = new Request
            {
                Json = model,
                JsCallback = "getSchedulerDataResponse",
                Targert = "GetSchedulerTasks",
                UserId = 1,
                Type = Enums.EntityType.Scheduler
            };
            rList.Add(r);
            await QueueHandler.PushToServiceAsync(rList);
            return View("Index");
        }

        [HttpPost]
        public async Task<ActionResult> Save(string model)
        {
            var rList = new List<Request>();

            var r = new Request
            {
                Json = model,
                JsCallback = "notify",
                Targert = "SaveSchedulerTask",
                UserId = 1,
                Type = Enums.EntityType.Scheduler
            };
            rList.Add(r);
            await QueueHandler.PushToServiceAsync(rList);
            return View("Index");
        }

        [HttpPost]
        public async Task<ActionResult> DeleteTask(string model)
        {
            var rList = new List<Request>();

            var r = new Request
            {
                Json = model,
                JsCallback = "notify",
                Targert = "DeleteTasks",
                UserId = 1,
                Type = Enums.EntityType.Scheduler
            };
            rList.Add(r);
            await QueueHandler.PushToServiceAsync(rList);
            return View("Index");
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