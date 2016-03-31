using Avanzar.Welkin.Common;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Mvc;
using Welkin.UI.App_Start;

namespace Welkin.UI.Controllers
{
    public class SchedulerController : BaseController
    {
        // GET: Scheduler
        public async Task<ActionResult>  Index()
        {
           return await LoadData();
            //return View();


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
                JsCallback = "notifyScheduler",
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
                JsCallback = "notifyScheduler",
                Targert = "DeleteTasks",
                UserId = 1,
                Type = Enums.EntityType.Scheduler
            };
            rList.Add(r);
            await QueueHandler.PushToServiceAsync(rList);
            return View("Index");
        }

        public async Task<ActionResult> LoadData()
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
    }
}