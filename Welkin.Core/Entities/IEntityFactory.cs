namespace Welkin.Core.Entities
{
    public interface IEntityFactory
    {
        T CreateEntity<T>(string type) where T:IEventEntity;
    }
}