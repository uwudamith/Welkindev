using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Mvc;
using Avanzar.Welkin.Common;
using Welkin.UI.Models;

namespace Welkin.UI.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";


            return View();
        }

        public async Task<ActionResult> CreateJob()
        {
            var rList = new List<Request>();

            var r = new Request
                    {
                        Json =  @"__.filter(function(master) { return master; })",
                        JsCallback = "PopulateDropdown",
                        Targert = "GetData",
                        UserId = 1,
                        Type = Enums.EntityType.Master
                    };
            rList.Add(r);
            //await StorageQueueHandler.PushAsync<string>(r);
            await QueueHandler.PushToServiceAsync(rList);
            return RedirectToAction("Index");
        }

        public async Task<ActionResult> GetData()
        {
            var r = new Request
                    {
                        Json = "{\"CaseId\":1000,\"CaseNumber\":\"CS0001\",\"Description\":\"Case Description\"}",
                        JsCallback = "OnJobCreated",
                        Targert = "GetCases",
                        UserId = 1,
                        Type = Enums.EntityType.Case
                    };
            // await QueueHandler.PushToServiceAsync();
            return null;
        }

        public ActionResult JobStatus(Guid jobId)
        {
            var viewModel = new JobStatusViewModel
                            {
                                JobId = jobId
                            };

            return View(viewModel);
        }
    }
}