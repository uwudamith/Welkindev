using System;
using Microsoft.Practices.Unity;

namespace Welkin.Core.Entities
{
    public class EntityFactory : IEntityFactory
    {
        private readonly IUnityContainer _unityContainer;

        public EntityFactory(IUnityContainer unityContainer)
        {
            _unityContainer = unityContainer;
        }

        public T CreateEntity<T>(string type) where T:IEventEntity
        {
            try
            {
                var _eventEntity = (T)_unityContainer.Resolve<IEventEntity>(type);

                return _eventEntity;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        /// Creates the entity.
        /// </summary>
        /// <param name="type">The type.</param>
        /// <returns></returns>

    }
}