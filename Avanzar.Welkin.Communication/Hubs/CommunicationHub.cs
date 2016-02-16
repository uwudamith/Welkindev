using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Avanzar.Welkin.Common;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;

namespace Avanzar.Welkin.Communication.Hubs
{
    [HubName("communicationHub")]
    public class CommunicationHub : Hub
    {
        #region Private Variables

        private static readonly List<ConnectedUsers> Users = new List<ConnectedUsers>();
        private static Dictionary<string, string> _queue = new Dictionary<string, string>();
        private bool _isClientConnected = false;

        #endregion

        /// <summary>
        /// Connects the specified user identifier.
        /// </summary>
        /// <param name="userId">The user identifier.</param>
        public void Connect(string userId)
        {
            try
            {
                var connectionId = Context.ConnectionId;
                var _userId = Convert.ToInt32(userId);

                var connectedUserList = (from d in Users
                    where d.UserId == _userId
                    select d).ToList();
                if (connectedUserList.Count > 0)
                {
                    var conUser = connectedUserList.First();
                    conUser.ConnectionIds.Add(connectionId);
                }
                else
                {
                    var newUser = new ConnectedUsers
                                  {
                                      ConnectionIds = new HashSet<string> {connectionId},
                                      UserId = _userId
                                  };
                    Users.Add(newUser);
                }
            }
            catch (Exception ex)
            {
                // Portal.Infrastructure.Core.Logging.LoggerFactory.Create(Constants.LOGGER_GENERAL).Error(ex);
            }
        }

        /// <summary>
        /// Pushes the specified response.
        /// </summary>
        /// <param name="response">The response.</param>
        /// <param name="callback">The callback.</param>
        public void Push(string response, string callback,int userId)
        {
            if (!_isClientConnected && !_queue.ContainsKey(callback))
                _queue.Add(callback, response);
            //select user by user Id and push messages to connections
            ConnectedUsers user = (from d in Users
                                   where d.UserId == userId
                                   select d).Single();

            IClientProxy proxy = Clients.Clients(user.ConnectionIds.ToArray());
            proxy.Invoke(callback, response);
        }

        public Dictionary<string, string> Queue
        {
            get { return _queue; }
            set { _queue = value; }
        }

        public bool IsClientConnected
        {
            get { return _isClientConnected; }
            set { _isClientConnected = value; }
        }

        public override Task OnConnected()
        {
            _isClientConnected = true;
            if (_queue.Count > 0)
            { 
                IClientProxy proxy = Clients.All;
                foreach (var pair in _queue)
                    proxy.Invoke(pair.Key, pair.Value);

                _queue = new Dictionary<string, string>();
            }
            return base.OnConnected();
        }

        public override Task OnDisconnected(bool stopCalled)
        {
            _isClientConnected = stopCalled;
            _queue = new Dictionary<string, string>();
            return base.OnDisconnected(stopCalled);
        }
    }

    public class ConnectedUsers
    {
        public string Name { get; set; }
        public string Ip { get; set; }
        public bool NotificationStatus { get; set; }
        public int UserId { get; set; }
        public HashSet<string> ConnectionIds { get; set; }
    }
}