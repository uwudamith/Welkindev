using System.Configuration;

namespace Welkin.Core
{
    public class ConfigurationProvider
    {
        public static string DocumentDbEndpoint => ConfigurationManager.AppSettings["DocumentDBEndpoint"];
        public static string DocumentDbAuthKey => ConfigurationManager.AppSettings["DocumentDBAuthKey"];
    }
}