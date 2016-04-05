using Avanzar.Welkin.Common;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Mvc;
using Welkin.UI.App_Start;
using Welkin.UI.Models;

namespace Welkin.UI.Controllers
{
    public class DraftController : BaseController
    {
        // GET: Draft
        public async Task<ActionResult> Index()
        {
          return await LoadDraftData();
        }

        /// <summary>
        /// Loads the master data.
        /// </summary>
        /// <returns></returns>
        public async Task<ActionResult> LoadDraftData()
        {
            var rList = new List<Request>();

            var r = new Request
            {
                Json = @"SELECT * FROM Data d WHERE d.Type ='Draft' AND d.ClientId ='" + SessionProvider.ClientId + "'",
                JsCallback = "draftDataResponse",
                Targert = "GetDrafts",
                UserId = 1,
                Type = Enums.EntityType.Draft
            };
            rList.Add(r);
            //await StorageQueueHandler.PushAsync<string>(r);
            await QueueHandler.PushToServiceAsync(rList);
            return View("Index");
        }

        public ActionResult SaveUploadFiles(IEnumerable<System.Web.HttpPostedFileBase> draftFileUpload, string client, string folder)
        {
            try
            {
                // The Name of the Upload component is "files"
                if (draftFileUpload != null)
                {
                    foreach (var file in draftFileUpload)
                    {
                        FileHandler.UploadFile(file, client, folder);
                    }
                }
                // Return an empty string to signify success
                
                return Content("");
            }
            catch (Exception e)
            {

                return Content("error");
            }
        }

        [HttpPost]
        public async Task<ActionResult> SaveDraft(string model)
        {
            var rList = new List<Request>();

            var r = new Request
            {
                Json = model,
                JsCallback = "notifyDraft",
                Targert = "SaveDraft",
                UserId = 1,
                Type = Enums.EntityType.Draft
            };
            rList.Add(r);
            await QueueHandler.PushToServiceAsync(rList);
            return View("Index");
        }

        public ActionResult DeleteFiles(string client, string name, string blobdir)
        {
            try
            {
                
                
                    FileHandler.DeleteFile(client, blobdir, name);
               

                return Content("success");
            }
            catch (Exception e)
            {

                return Content("error");
            }
        }

        public ActionResult DownloadFiles(string client, string name, string blobdir)
        {
            try
            {
              

                var f = FileHandler.DownloadFile(client, blobdir, name);


                return Json(f);

            }
            catch (Exception e)
            {

                return Content("error");
            }
        }
    }
}