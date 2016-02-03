using Microsoft.Owin;
using Owin;
using Welkin.UI;

[assembly: OwinStartup(typeof (Startup))]

namespace Welkin.UI
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            // For more information on how to configure your application, visit http://go.microsoft.com/fwlink/?LinkID=316888
        }
    }
}