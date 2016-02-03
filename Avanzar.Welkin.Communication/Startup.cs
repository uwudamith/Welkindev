using Avanzar.Welkin.Communication;
using Microsoft.Owin;
using Microsoft.Owin.Cors;
using Owin;

[assembly: OwinStartup(typeof (Startup))]

namespace Avanzar.Welkin.Communication
{
    public class Startup
    {
        /// <summary>
        /// Configurations the specified application.
        /// </summary>
        /// <param name="app">The application.</param>
        public void Configuration(IAppBuilder app)
        {
            app.UseCors(CorsOptions.AllowAll);
            app.MapSignalR();
        }
    }
}