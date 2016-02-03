namespace Welkin.Core.Repositories
{
    public interface ISettingsRepository
    {
        string DocumentDbEndpoint { get; }
        string DocumentDbAuthKey { get; }
    }
}