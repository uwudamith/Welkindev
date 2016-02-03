using System;
using Avanzar.Welkin.Common;
using Newtonsoft.Json;
using Welkin.Core.Entities;

namespace Welkin.Core
{
    public class EntityRequestHandler
    {
        /// <summary>
        /// Resolves the entity.
        /// </summary>
        /// <param name="request">The request.</param>
        /// <returns></returns>
        public static Request ResolveEntity(Request request)
        {
            try
            {
                switch (request.Type)
                {
                    case Enums.EntityType.Case:
                        request.Source = JsonConvert.DeserializeObject<Case>(request.Json);
                        break;
                    case Enums.EntityType.Master:
                        request.Source = JsonConvert.DeserializeObject<Master>(request.Json);
                        break;
                }
                return request;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static T Deserialize<T>(string json)
        {
            return JsonConvert.DeserializeObject<T>(json);
        }
    }
}