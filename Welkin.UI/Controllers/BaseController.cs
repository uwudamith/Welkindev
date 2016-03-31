using Avanzar.Welkin.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Welkin.UI.App_Start;

namespace Welkin.UI.Controllers
{
    public class BaseController : Controller
    {
        public BaseController()
        {
            SessionProvider.ClientId = "client001";
            SessionProvider.UserId = "1";
        }
        [HttpGet]
        [OutputCache(NoStore = true, Duration = 0, VaryByParam = "None")]
        public string CreateGUID()
        {
            return Guid.NewGuid().ToString();
        }

        [HttpPost]
        public async Task<string> SaveMasterData(string model)
        {
            var rList = new List<Request>();

            var r = new Request
            {
                Json = model,
                JsCallback = "notify",
                Targert = "SaveMaster",
                UserId = 1,
                Type = Enums.EntityType.Master
            };
            rList.Add(r);
            await QueueHandler.PushToServiceAsync(rList);
            return null;
        }
            
    }
}