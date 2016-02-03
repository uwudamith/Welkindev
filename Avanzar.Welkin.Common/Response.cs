using Newtonsoft.Json;

namespace Avanzar.Welkin.Common
{
    public class Response<T>
    {
        #region Public Properties
        public T Result { get; set; }
        public string JsonResult { get; set; }
        public Request Request { get; set; }
        [JsonIgnore]
        public string Destination { get; set; } = "Push";
        public Enums.StatusType StatusType { get; set; }
        public string Message { get; set; }

        #endregion


        #region Public Properties

        /// <summary>
        /// Serializes this instance.
        /// </summary>
        /// <returns></returns>
        public string Serialize()
        {
            return JsonConvert.SerializeObject(this);
        } 
        #endregion
    }
}