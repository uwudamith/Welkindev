(function (w, $) {

    w.Welkin = {
        $: $,
        PageMode: {
            action: "",
            controller: ""
        },
        Configs: {
            hubUrl: ""
        },
        ajaxFunction: function (url, type,callBackFunc, model) {
            if (model) {
                $.ajax({
                    url: url,
                    type: type,
                    data: { 'model': JSON.stringify(model) },
                    success: function (data) {
                        if(callBackFunc) callBackFunc(data);
                    }
                });
            } else {
                $.ajax({
                    url: url,
                    type: type,
                    success: function (data) {
                        if(callBackFunc) callBackFunc(data);
                    }
                });
            }
        },
        createGUID: function (callBackFunc) {
            return this.ajaxFunction('/Base/createGUID', 'GET', callBackFunc);
        },
        saveMasterData:function(callBackFunc,model){
            return this.ajaxFunction('/Base/saveMasterData', 'POST', callBackFunc,model);
        },
        init: function () {

            var $scope = this;
            $(document).ready(function () {


                if ($scope.PageMode.controller === "DeedLedger" && $scope.PageMode.action === "Index") {
                    $scope.DeedHandler.init({
                        sAgent: new $scope.Utils.SignalR({
                            config: {
                                id: "1",
                            },
                            hub: {
                                url: $scope.Configs.hubUrl
                            }
                        })
                    });
                }

                if ($scope.PageMode.controller === "CaseLedger" && $scope.PageMode.action === "Index") {
                    $scope.CaseHandler.init({
                        sAgent: new $scope.Utils.SignalR({
                            config: {
                                id: "1",
                            },
                            hub: {
                                url: $scope.Configs.hubUrl
                            }
                        }),
                        common: {
                            ajaxFunction: $scope.ajaxFunction,
                            createGUID:$scope.createGUID,
                            saveMasterData:$scope.saveMasterData
                        }

                    });
                }

                if ($scope.PageMode.controller === "Draft" && $scope.PageMode.action === "Index") {
                    $scope.DraftHandler.init({
                        sAgent: new $scope.Utils.SignalR({
                            config: {
                                id: "1",
                            },
                            hub: {
                                url: $scope.Configs.hubUrl
                            }
                        })
                    });
                }

            });
        }
    };
    w.Welkin.init();
}(window, jQuery));
