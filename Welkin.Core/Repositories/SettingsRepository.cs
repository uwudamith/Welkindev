namespace Welkin.Core.Repositories
{
    internal class SettingsRepository : ISettingsRepository
    {
        public string DocumentDbEndpoint { get; } = ConfigurationProvider.DocumentDbEndpoint;
        public string DocumentDbAuthKey { get; } = ConfigurationProvider.DocumentDbAuthKey;
    }
}