using System;
using Avanzar.Welkin.Common;
using System.Collections.Generic;
using System.Configuration;
using System.Threading.Tasks;

using System.Web.Mvc;
using Welkin.UI.App_Start;
using Welkin.UI.Models;

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

        [HttpPost]
        public async Task<ActionResult> BrowseDeeds(string model)
        {
            var rList = new List<Request>();

            var r = new Request
            {
                Json = model,
                JsCallback = "browseDeedResponse",
                Targert = "GetDeeds",
                UserId = 1,
                Type = Enums.EntityType.Deed
            };
            rList.Add(r);
            await QueueHandler.PushToServiceAsync(rList);
            return View("Index");
        }

        public  ActionResult SaveUploadFiles(IEnumerable<System.Web.HttpPostedFileBase> deedFileUpload, string client,string deedNumber)
        {
            try
            {
                // The Name of the Upload component is "files"
                if (deedFileUpload != null)
                {
                    foreach (var file in deedFileUpload)
                    {
                         FileHandler.UploadFile(file, client,deedNumber);
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
        public async Task<ActionResult> GetCurrentDeedNumber(string model)
        {
            var rList = new List<Request>();

            var r = new Request
            {
                Json = model,
                JsCallback = "nextDeedNumberReponse",
                Targert = "GetDeeds",
                UserId = 1,
                Type = Enums.EntityType.Deed
            };
            rList.Add(r);
            await QueueHandler.PushToServiceAsync(rList);
            return View("Index");
        }

        public ActionResult DeleteFiles( string client,string files)
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

    }
}