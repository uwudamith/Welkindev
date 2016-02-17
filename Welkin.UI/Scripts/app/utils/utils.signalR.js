window.Welkin.Utils = window.Welkin.Utils || (function($scope, $, $module) {
    /// <summary>
    ///     Signalr extention
    /// </summary>
    /// <param name="$scope"> Application Scope </param>
    /// <param name="$"> jQuery </param> 

    var $sub = $module.SignalR = $module.SignalR || function (options) {
        this.settings = {
            config: {
                id: "1",
            },
            hub: {
                $conn: $.connection, 
                isActive: false,
                name: "communicationHub",
                url: ""
            },
            callBack: {
                online: null,
                onConnect: function ($hub,o) {
                    $hub.server.connect(o.id);
                },
                onDisconnect: function ($hub, o) {
                    setTimeout(function() { 
                        $hub.server.connect(o.id);
                    }, 2000);
                }
            }
        };

        this.settings = $.extend(true, this.settings, options);
        if (!this.settings.hub.$conn)
            alert("$.connection undefined");
        else {
            this.settings.hub.$conn.hub.url = this.settings.hub.url;
            var $hub = this.getHub();
            if ($hub) {
                $hub.client.online = this.settings.callBack.online;
                $hub.client.offline = this.settings.callBack.offline;
            }
        }
        return this;
    };


    $sub.prototype.getHub = function (hName) {
        /// <summary>
        ///     Get Signalr Hub client
        /// </summary>
        /// <param name="hName"> HUB name </param>
        return (hName) ? this.settings.hub.$conn[hName] : this.settings.hub.$conn[this.settings.hub.name];
    };

    $sub.prototype.registerEvents = function(arrfn, hName) {
        /// <summary>
        ///     Register call back events
        /// </summary>
        /// <param name="arrfn"> array of functions. 
        /// { name:'Name of the invoking function', fn : function}
        ///</param> 
        var $hub = this.getHub(hName);
        if ($hub)
           // debugger;
            for (var i = 0, x = arrfn.length; i < x; i++)
                $hub.client[arrfn[i].name] = arrfn[i].fn;
    };

    $sub.prototype.start = function (hName) {
        /// <summary>
        ///     Start Signalr Hub client
        /// </summary>
        /// <param name="hName"> HUB name </param>
        var $hub = this.getHub(hName), $this = this;
        if ($hub) { 
            this.settings.hub.$conn.hub.start().done(function () {
                $this.settings.hub.isActive = true;
                if ($this.settings.callBack.onConnect && typeof ($this.settings.callBack.onConnect) === "function")
                    $this.settings.callBack.onConnect($hub,$this.settings.config);
            });

            this.settings.hub.$conn.hub.disconnected(function () {
                $this.settings.hub.isActive = false;
                if ($this.settings.callBack.onDisconnect && typeof ($this.settings.callBack.onDisconnect) === "function")
                    $this.settings.callBack.onDisconnect($hub,$this.settings.config);
            });
        }
    };

    return $module;

}(window.Welkin, window.Welkin.$, window.Welkin.Utils || {}));