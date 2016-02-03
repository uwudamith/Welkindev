using Microsoft.Azure.WebJobs.Host;
using Microsoft.Practices.Unity;

namespace Welkin.Core.DI
{
    public class Activator : IJobActivator
    {
        #region Private Properties
        private readonly IUnityContainer _container;
        #endregion

        #region Public Methods
        public Activator(IUnityContainer container)
        {
            _container = container;
        }

        /// <summary>
        /// Creates a new instance of a job type.
        /// </summary>
        /// <typeparam name="T">The job type.</typeparam>
        /// <returns>
        /// A new instance of the job type.
        /// </returns>
        public T CreateInstance<T>()
        {
            return _container.Resolve<T>();
        } 
        #endregion
    }
}