using System.Configuration;

namespace Welkin.UI.Helpers
{
    public class ConfigurationProvider
    {
        public static string SignalrServerUrl => ConfigurationManager.AppSettings["SignalrServerUrl"];
        public static string SignalrHubUrl => ConfigurationManager.AppSettings["SignalrHubUrl"];

        public static string DefaultThemeForKendo
            => ConfigurationManager.AppSettings["DefaultThemeForKendo"] ?? "Default";
    }
}