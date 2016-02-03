using System;
using System.Collections.Generic;
using System.Linq;
using Avanzar.Welkin.Common;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using Newtonsoft.Json;

namespace Avanzar.Welink.Communication.Hubs
{
    [HubName("communicationHub")]
    public class CommunicationHub : Hub
    {
        #region Private Variables
        private static readonly List<ConnectedUsers> Users = new List<ConnectedUsers>();
        #endregion

        public void Connect(string userId)
        {
            try
            {
                var connectionId = Context.ConnectionId;
                var _userId = Convert.ToInt32(userId);

                var connectedUserList = (from d in Users
                    where d.userId == _userId
                    select d).ToList();
                if (connectedUserList.Count > 0)
                {
                    var conUser = connectedUserList.First();
                    conUser.ConnectionIds.Add(connectionId);
                }
                else
                {
                    var newUser = new ConnectedUsers();
                    newUser.ConnectionIds = new HashSet<string>();
                    newUser.ConnectionIds.Add(connectionId);
                    newUser.userId = _userId;
                    Users.Add(newUser);
                }
            }
            catch (Exception ex)
            {
                // Portal.Infrastructure.Core.Logging.LoggerFactory.Create(Constants.LOGGER_GENERAL).Error(ex);
            }
        }

        public void Push(string request)
        {
            var r = JsonConvert.DeserializeObject<Request<string>>(request);
            IClientProxy proxy = Clients.All;
            proxy.Invoke(r.JsCallback, r);
        }
    }

    public class ConnectedUsers
    {
        public string Name { get; set; }
        public string IP { get; set; }
        public bool NotificationStatus { get; set; }
        public int userId { get; set; }
        public HashSet<string> ConnectionIds { get; set; }
    }
}