using System;
using System.Configuration;
using System.Threading.Tasks;
using Avanzar.Welkin.Common;
using Microsoft.AspNet.SignalR.Client;

namespace Welkin.Core
{
 
    public class SignalRHandler
    {
        #region Private Variables

        private static IHubProxy _welkinHubProxy;

        #endregion

        /// <summary>
        /// Initializes this instance.
        /// </summary>
        public static void Initialize()
        {
            try
            {
                var url = ConfigurationManager.AppSettings["SignalrConnectionUrl"] ?? @"http://localhost:64137/";
                var hubConnection = new HubConnection(url);
                hubConnection.Closed += HubConnectionClosed;
                hubConnection.Error += HubConnectionError;
                _welkinHubProxy =
                    hubConnection.CreateHubProxy(ConfigurationManager.AppSettings["SignalrHub"] ?? "communicationHub");

                hubConnection.Start().Wait();
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        /// <summary>
        /// Sends the specified response.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="response">The response.</param>
        /// <returns></returns>
        public static async Task Send<T>(Response<T> response)
        {
           
            await
                _welkinHubProxy.Invoke(response.Destination, response.Serialize(), response.Request.JsCallback, response.Request.UserId);
        }

        /// <summary>
        /// Hubs the connection error.
        /// </summary>
        /// <param name="ex">The ex.</param>
        private static void HubConnectionError(Exception ex)
        {
            //throw ex;
        }

        /// <summary>
        /// Hubs the connection closed.
        /// </summary>
        private static void HubConnectionClosed()
        {
        }
    }
}