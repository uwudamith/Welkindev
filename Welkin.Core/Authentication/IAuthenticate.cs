namespace Welkin.Core.Authentication
{
    public interface IAuthenticate
    {
        string GetApplicationAccountToken(string resourceUrl);
    }
}