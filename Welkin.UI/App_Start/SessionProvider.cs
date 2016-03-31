using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Welkin.UI.App_Start
{
    public class SessionProvider
    {
        public static string ClientId
        {
            get { return HttpContext.Current.Session["ClientId"] as string; }
            set { HttpContext.Current.Session["ClientId"] = value; }
        }

        public static string UserId
        {
            get { return HttpContext.Current.Session["UserId"] as string; }
            set { HttpContext.Current.Session["UserId"] = value; }
        }
    }
}