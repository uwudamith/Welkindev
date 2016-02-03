namespace Welkin.UI.Helpers
{
    public class SignalrHelper
    {
        /// <summary>
        /// Gets the signalr server URL.
        /// </summary>
        /// <returns></returns>
        public static string GetSignalrServerUrl()
        {
            return ConfigurationProvider.SignalrServerUrl;
        }

        /// <summary>
        /// Gets the signalr hub URL.
        /// </summary>
        /// <returns></returns>
        public static string GetSignalrHubUrl()
        {
            return ConfigurationProvider.SignalrHubUrl;
        }
    }
}