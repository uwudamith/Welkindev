using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Welkin.UI.Controllers
{
    public class BaseController : Controller
    {
        [HttpGet]
        public string createGUID()
        {
            return Guid.NewGuid().ToString();
        }
            
    }
}