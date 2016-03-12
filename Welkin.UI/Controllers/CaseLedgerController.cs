using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Mvc;
using Avanzar.Welkin.Common;
using System.Configuration;
using Welkin.UI.App_Start;
using Welkin.UI.Models;
using System;

namespace Welkin.UI.Controllers
{
    public class CaseLedgerController : Controller
    {
        // GET: CaseLedger
        public async Task<ActionResult> Index()
        {
            return  await LoadMasterData();
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
            var rList = new List<Request>();

            var r = new Request
            {
                Json = model ,
                JsCallback = "notify",
                Targert = "SaveCase",
                UserId = 1,
                Type = Enums.EntityType.Case
            };
            rList.Add(r);
            await QueueHandler.PushToServiceAsync(rList);
            return View("Index");
        }

        [HttpPost]
        public async Task<ActionResult> UpdateCaseLedger(string model)
        {
            var rList = new List<Request>();

            var r = new Request
            {
                Json = model,
                JsCallback = "notify",
                Targert = "UpdateCase",
                UserId = 1,
                Type = Enums.EntityType.Case
            };
            rList.Add(r);
            await QueueHandler.PushToServiceAsync(rList);
            return View("Index");
        }

        [HttpPost]
        public async Task<ActionResult> GetCases(string model)
        {
            var rList = new List<Request>();

            var r = new Request
            {
                Json = model,
                JsCallback = "searchCaseResponse",
                Targert = "GetCases",
                UserId = 1,
                Type = Enums.EntityType.Case
            };
            rList.Add(r);
            await QueueHandler.PushToServiceAsync(rList);
            return View("Index");
        }


        [HttpPost]
        public async Task<ActionResult> BrowseCases(string model)
        {
            var rList = new List<Request>();

            var r = new Request
            {
                Json = model,
                JsCallback = "browseCaseResponse",
                Targert = "GetCases",
                UserId = 1,
                Type = Enums.EntityType.Case
            };
            rList.Add(r);
            await QueueHandler.PushToServiceAsync(rList);
            return View("Index");
        }

        public ActionResult SaveUploadFiles(IEnumerable<System.Web.HttpPostedFileBase> caseFileUpload, string client, string caseNumber)
        {
            try
            {
                // The Name of the Upload component is "files"
                if (caseFileUpload != null)
                {
                    foreach (var file in caseFileUpload)
                    {
                        FileHandler.UploadFile(file, client, caseNumber);
                    }
                }
                // Return an empty string to signify success
                var blobEndPoint = ConfigurationManager.AppSettings["BlobEndPoint"];
                return Content("");
            }
            catch (Exception e)
            {

                return Content("error");
            }
        }

        [HttpPost]
        public async Task<ActionResult> GetCurrentCaseNumber(string model)
        {
            var rList = new List<Request>();

            var r = new Request
            {
                Json = model,
                JsCallback = "nextCaseNumberReponse",
                Targert = "GetCases",
                UserId = 1,
                Type = Enums.EntityType.Case
            };
            rList.Add(r);
            await QueueHandler.PushToServiceAsync(rList);
            return View("Index");
        }

        public ActionResult DeleteFiles(string client, string files)
        {
            try
            {
                var attachments = Newtonsoft.Json.JsonConvert.DeserializeObject<List<AttachmentModel>>(files);
                foreach (var att in attachments)
                {
                    FileHandler.DeleteFile(client, att.BlobDir, att.Name);
                }

                return Content("success");
            }
            catch (Exception e)
            {

                return Content("error");
            }
        }

        public ActionResult DownloadFiles(string client, string file)
        {
            try
            {
                var attachment = Newtonsoft.Json.JsonConvert.DeserializeObject<AttachmentModel>(file);

                var f = FileHandler.DownloadFile(client, attachment.BlobDir, attachment.Name);


                return Json(f);

            }
            catch (Exception e)
            {

                return Content("error");
            }
        }

        [HttpPost]
        public async Task<ActionResult> DeleteEvent(string model)
        {
            var rList = new List<Request>();
            var list = Newtonsoft.Json.JsonConvert.DeserializeObject<List<string>>(model);
            foreach (var id in list)
            {
                var r = new Request
                {
                    Json = id,
                    JsCallback = "eventNotify",
                    Targert = "DeleteTasks",
                    UserId = 1,
                    Type = Enums.EntityType.Scheduler
                };
                rList.Add(r);
            }
          

           
            await QueueHandler.PushToServiceAsync(rList);
            return View("Index");
        }

        [HttpPost]
        public async Task<ActionResult> SaveEvent(string model)
        {

            var rList = new List<Request>();
          
                var r = new Request
                {
                    Json = model,
                    JsCallback = "eventNotify",
                    Targert = "SaveSchedulerTask",
                    UserId = 1,
                    Type = Enums.EntityType.Scheduler
                };
                rList.Add(r);
            
           
            await QueueHandler.PushToServiceAsync(rList);
            return View("Index");
        }

        [HttpPost]
        public async Task<ActionResult> GetEvents(string model)
        {
            var rList = new List<Request>();

            var r = new Request
            {
                Json = model,
                JsCallback = "getEventsByUserResponse",
                Targert = "GetSchedulerTasks",
                UserId = 1,
                Type = Enums.EntityType.Scheduler
            };
            rList.Add(r);
            await QueueHandler.PushToServiceAsync(rList);
            return View("Index");
        }
    }
}