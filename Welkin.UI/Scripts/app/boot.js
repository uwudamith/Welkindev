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
        ajaxFunction: function (url, type,callBackFunc, model,isStringfy) {
            if (model) {
                $.ajax({
                    url: url,
                    type: type,
                    data: { 'model': isStringfy==true?JSON.stringify(model):model },
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
            return this.ajaxFunction('/Base/createGUID', 'GET', callBackFunc,null,false);
        },
        saveMasterData:function(callBackFunc,model){
            return this.ajaxFunction('/Base/saveMasterData', 'POST', callBackFunc,model,true);
        },
        showNotification:function(message,nType){
            $.notify({
                // options
                message: message
            }, {
                    // settings
                    type: nType
                });
            
        },
        setValidationMessages:function(target,type,message){
            /// <summary>
            /// This function used to generate dynamic alert boxes for validations
            /// </summary>
            /// <param name="target" type="type">Where to place the alertbox</param>
            /// <param name="type" type="type">Possible types are success,info,warning,danger</param>
            /// <param name="message" type="type">Message should display</param>

            $("#" + target).empty();
            $("#" + target).append("<div class='alert alert-" + type + "'><a class='close' data-dismiss='alert'>×</a>" + message + "</div>");
        },
        showConfirmDialog: function (yesFucn, noFunc, message) {
            /// <summary>
            /// yesFucn and noFunc must be functions
            /// </summary>
            /// <param name="yesFucn" type="type">Function which should call when click Yes</param>
            /// <param name="noFunc" type="type">Function which should call when click No</param>
            /// <param name="message" type="type">Message to display</param>
            // Set option not close when click out side of the popup
            $('#confirmDialog').modal({ backdrop: 'static', keyboard: false });
            // Append message into body
            $("#confirmDialog").find("div#confirmationMessage").html(message);
            // Bind no functions
            $("#confirmDialog").find("button#no").off('click').on('click',function () {
                $('#confirmDialog').modal('hide');
                noFunc();
            });
            // Bind yes functions
            $("#confirmDialog").find("button#yes").off('click').on('click',function () {
                $('#confirmDialog').modal('hide');
                yesFucn();
            });
            
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
                        }),
                        common: {
                            ajaxFunction: $scope.ajaxFunction,
                            createGUID:$scope.createGUID,
                            saveMasterData:$scope.saveMasterData,
                            showNotification: $scope.showNotification,
                            setValidationMessages:$scope.setValidationMessages
                        }
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
                            saveMasterData:$scope.saveMasterData,
                            showNotification: $scope.showNotification,
                            setValidationMessages: $scope.setValidationMessages,
                            showConfirmDialog: $scope.showConfirmDialog
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
