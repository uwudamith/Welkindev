using System;
using System.Configuration;
using System.Threading;
using Microsoft.IdentityModel.Clients.ActiveDirectory;

namespace Welkin.Core.Authentication
{
    public class AzureADAuthenticator : IAuthenticate
    {
        public string GetApplicationAccountToken(string resourceUrl)
        {
            AuthenticationResult result = null;

            var authority = string.Format("https://login.microsoftonline.com/{0}/oauth2/token/",
                ConfigurationManager.AppSettings["TenantId"]);

            var context = new AuthenticationContext(authority);

            var credential = new ClientCredential(ConfigurationManager.AppSettings["ClientId"],
                ConfigurationManager.AppSettings["ClientSecret"]);

            var thread = new Thread(() => { result = context.AcquireToken(resourceUrl, credential); });

            thread.SetApartmentState(ApartmentState.STA);
            thread.Name = "AquireTokenThread";
            thread.Start();
            thread.Join();

            if (result == null)
            {
                throw new InvalidOperationException("Failed to obtain the JWT token");
            }

            var token = result.AccessToken;
            return token;
        }
    }
}