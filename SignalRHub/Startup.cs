


using Microsoft.Owin;
using Microsoft.Owin.Cors;
using Owin;
//
//[//assembly: OwinStartup(typeof(Avanzar.Welink.Communication.Startup))]
namespace Avanzar.Welink.Communication
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.UseCors(CorsOptions.AllowAll);
            app.MapSignalR();
        }
    }
}
