using System.Web.Optimization;

namespace Avanzar.Welink.Communication
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            BundleConfig.RegisterBundles(BundleTable.Bundles);
        }
    }
}
