﻿(function (w, $) {

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
                        else 
                         return data;
                    }
                });
            } else {
                $.ajax({
                    url: url,
                    type: type,
                    success: function (data) {
                       
                        if(callBackFunc) callBackFunc(data);
                        else 
                         return data;
                    }
                });
            }
        },
        ajaxFunctionMultiParam:function(url,type,callBackFunc,params){
             if (params) {
                $.ajax({
                    url: url,
                    type: type,
                    data: params,
                    success: function (data) {
                        
                        if(callBackFunc) callBackFunc(data);
                        else 
                         return data;
                    },
                    error:function (data) {
                         if(callBackFunc) callBackFunc(data);
                        else 
                         return data;
                    }
                });
            } else {
                $.ajax({
                    url: url,
                    type: type,
                    success: function (data) {
                       
                        if(callBackFunc) callBackFunc(data);
                        else 
                         return data;
                    }
                });
            }
        },
        ajaxFunctionWithCallBackParam:function(url,type,callBackFunc,params,callBackParams){
             if (params) {
                $.ajax({
                    url: url,
                    type: type,
                    data: params,
                    //async:false,
                    success: function (data) {
                        
                        if(callBackFunc) callBackFunc(data,callBackParams);
                        else 
                         return data;
                    }
                });
            } else {
                $.ajax({
                    url: url,
                    type: type,
                    success: function (data) {
                       
                        if(callBackFunc) callBackFunc(data,callBackParams);
                        else 
                         return data;
                    }
                });
            }
        },
        createGUID: function (callBackFunc) {
            return this.ajaxFunction('/Base/CreateGUID', 'GET', callBackFunc,null,false);
        },
        createGUIDWithParams: function (callBackFunc,callBackParams) {
            return this.ajaxFunctionWithCallBackParam('/Base/CreateGUID', 'GET', callBackFunc,null,callBackParams);
        },
        saveMasterData:function(callBackFunc,model){
            return this.ajaxFunction('/Base/SaveMasterData', 'POST', callBackFunc,model,true);
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

            $("#" + target).append("<div class='alert alert-" + type + " fade in' id='bsAlert'><a class='close' data-dismiss='alert'>×</a>" + message + "</div>");
            setTimeout(function () {
                $(".alert").fadeTo(2000, 0).slideUp(1000, function () {
                    $(this).remove();
                });
            }, 2000);
            

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
        validateEmail:function(value){
             var email = value;
            var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            if (!filter.test(email)) {
            return true;
            }
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
                            setValidationMessages:$scope.setValidationMessages,
                            validateEmail:$scope.validateEmail,
                            ajaxFunctionMultiParam:$scope.ajaxFunctionMultiParam
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
                            showConfirmDialog: $scope.showConfirmDialog,
                            validateEmail:$scope.validateEmail,
                            ajaxFunctionMultiParam:$scope.ajaxFunctionMultiParam,
                            ajaxFunctionWithCallBackParam:$scope.ajaxFunctionWithCallBackParam,
                            createGUIDWithParams:$scope.createGUIDWithParams
                            
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
                        }),
                         common: {
                            ajaxFunction: $scope.ajaxFunction,
                            createGUID:$scope.createGUID,
                            saveMasterData:$scope.saveMasterData,
                            showNotification: $scope.showNotification,
                            setValidationMessages:$scope.setValidationMessages,
                            validateEmail:$scope.validateEmail,
                            ajaxFunctionMultiParam:$scope.ajaxFunctionMultiParam
                        }
                    });
                }
                
                 if ($scope.PageMode.controller === "Scheduler" && $scope.PageMode.action === "Index") {
                    $scope.SchedulerHandler.init({
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
                            setValidationMessages:$scope.setValidationMessages,
                            validateEmail:$scope.validateEmail
                        }
                    });
                }
                
                 if ($scope.PageMode.controller === "Account" && $scope.PageMode.action === "Index") {
                    $scope.AccountHandler.init({
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
                            setValidationMessages:$scope.setValidationMessages,
                            validateEmail:$scope.validateEmail,
                            ajaxFunctionMultiParam:$scope.ajaxFunctionMultiParam,
                             showConfirmDialog: $scope.showConfirmDialog
                        }
                    });
                }

            });
        }
    };
    w.Welkin.init();
}(window, jQuery));
