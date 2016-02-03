using System;

namespace Welkin.Core.Entities
{
    [AttributeUsage(AttributeTargets.Class, AllowMultiple = true)]
    public class EntityType : Attribute
    {
        public EntityType(string[] type)
        {
            ResourceType = type;
        }

        public string[] ResourceType { get; }
    }
}