using System;
using System.Collections.Generic;
using System.Globalization;
using Newtonsoft.Json;

namespace Avanzar.Welkin.Common
{
    public class Request
    {
        #region Public Properties
        public string Json { get; set; }
        public int UserId { get; set; }
        [JsonIgnore]
        public string Queue { get; set; } = "jobqueue";
        public string Targert { get; set; }
        public Enums.EntityType Type { get; set; }
        [JsonIgnore]
        public string Created => DateTime.UtcNow.ToString(CultureInfo.InvariantCulture);
        public string JsCallback { get; set; }
        [JsonIgnore]
        public object Source { get; set; }
        #endregion

        #region Public Methods

        /// <summary>
        /// Serializes this instance.
        /// </summary>
        /// <returns></returns>
        public string Serialize()
        {
            return JsonConvert.SerializeObject(this);
        }

        /// <summary>
        /// Serializes the list.
        /// </summary>
        /// <param name="requests">The requests.</param>
        /// <returns></returns>
        public static string SerializeList(List<Request> requests)
        {
            return JsonConvert.SerializeObject(requests);
        }

        /// <summary>
        /// Deserializes the specified json.
        /// </summary>
        /// <param name="json">The json.</param>
        /// <returns></returns>
        public static Request Deserialize(string json)
        {
            return JsonConvert.DeserializeObject<Request>(json);
        }

        /// <summary>
        /// Deserializes the list.
        /// </summary>
        /// <param name="json">The json.</param>
        /// <returns></returns>
        public static List<Request> DeserializeList(string json)
        {
            return JsonConvert.DeserializeObject<List<Request>>(json);
        } 
        #endregion
    }
}