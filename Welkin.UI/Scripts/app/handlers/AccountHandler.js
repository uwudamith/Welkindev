window.Welkin.AccountHandler = (function($scope, $, $m) {
    
    $m = {
         masterData: {},
         draft:{},
         currentDraftItem:{},
         accountTypeData: [
            { Name: "Law Firm", Id: "1" },
            { Name: "Individual", Id: "2" }
        ],
        userTypeData :[
            { Name: "Lawyer", Id: "1" },
            { Name: "Jr. Lawyer", Id: "2" }
        ],
         userLevelData : [
            { Name: "Admin", Id: "1" },
            { Name: "Co-admin", Id: "2" }
        ],
        init: function(options) {
   
            this.settings = $scope.$.extend(true, {

            }, options);
            if (this.settings.sAgent) {
                //register client methods with signalr agent
                this.settings.sAgent.registerEvents([
                    {
                        name: "masterAccountDataResponse",
                        fn: this.masterAccountDataResponse
                    },
                    {
                        name:"notifyAccount",
                        fn:this.notifyAccount
                    },
                    {
                        name:"draftAccountDataResponse",
                        fn:this.draftAccountDataResponse
                    },
                    {
                        name:"notifyAccountDraft",
                        fn:this.notifyAccountDraft
                    }
                ]);
                this.settings.sAgent.start();
            }
            $('.carousel').carousel({
                interval: false
            })
            $m.initControlls(); 
            
            // Stam Duty Events
              $("#grdStampDuty").on("click", ".btn-edit", function (e) {
                    e.preventDefault();
                    var dataItem = $("#grdStampDuty").data("kendoGrid").dataItem($(e.currentTarget).closest("tr"));
                    $m.openStampDutyPopup(dataItem);
             });     
             
                $("#grdStampDuty").on("click", ".btn-delete", function (e) {
                     e.preventDefault();
                       var yesFunction = function () {
                       var dataItem = $("#grdStampDuty").data("kendoGrid").dataItem($(e.currentTarget).closest("tr"));
                    $m.deleteStampDuty(dataItem);
                    };
            var noFunction = function () { };

            $m.settings.common.showConfirmDialog(yesFunction, noFunction, "Are you sure you want to delete this item?");
          
             }); 
             
              // Add stamp duty
            $("#save-stampDuty").click(function () {
                if($("#hdnStampDutyId").val() == ""){
                    $m.settings.common.createGUID($m.saveStampDuty);
                }
                else
                {
                    $m.saveStampDuty("");
                } 
            });
            $('#chkAny').change(function() {
                 if(this.checked){
                    $('#txtRangeMax').prop('disabled', true);
                    $('#txtRangeMax').val("");
                    
               }else{
                   $('#txtRangeMax').prop('disabled', false);
               }
            });  
            
              $("#addStampDuty").draggable({
                    handle: ".modal-header"
                });
             $('#addStampDuty').on('hidden.bs.modal', function () {
             
                   $m.clearStampDuty();
                
            })
        
         $("#txtRangeMin").keydown(function (e) {
                // Allow: backspace, delete, tab, escape, enter and .
                if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
                    // Allow: Ctrl+A
                    (e.keyCode == 65 && e.ctrlKey === true) ||
                    // Allow: Ctrl+C
                    (e.keyCode == 67 && e.ctrlKey === true) ||
                    // Allow: Ctrl+X
                    (e.keyCode == 88 && e.ctrlKey === true) ||
                    // Allow: home, end, left, right
                    (e.keyCode >= 35 && e.keyCode <= 39)) {
                        // let it happen, don't do anything
                        return;
                }
                // Ensure that it is a number and stop the keypress
                if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                    e.preventDefault();
                }
            });     
             $("#txtRangeMax").keydown(function (e) {
                // Allow: backspace, delete, tab, escape, enter and .
                if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
                    // Allow: Ctrl+A
                    (e.keyCode == 65 && e.ctrlKey === true) ||
                    // Allow: Ctrl+C
                    (e.keyCode == 67 && e.ctrlKey === true) ||
                    // Allow: Ctrl+X
                    (e.keyCode == 88 && e.ctrlKey === true) ||
                    // Allow: home, end, left, right
                    (e.keyCode >= 35 && e.keyCode <= 39)) {
                        // let it happen, don't do anything
                        return;
                }
                // Ensure that it is a number and stop the keypress
                if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                    e.preventDefault();
                }
            });  
             $("#txtPercentage").keydown(function (e) {
                // Allow: backspace, delete, tab, escape, enter and .
                if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
                    // Allow: Ctrl+A
                    (e.keyCode == 65 && e.ctrlKey === true) ||
                    // Allow: Ctrl+C
                    (e.keyCode == 67 && e.ctrlKey === true) ||
                    // Allow: Ctrl+X
                    (e.keyCode == 88 && e.ctrlKey === true) ||
                    // Allow: home, end, left, right
                    (e.keyCode >= 35 && e.keyCode <= 39)) {
                        // let it happen, don't do anything
                        return;
                }
                // Ensure that it is a number and stop the keypress
                if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                    e.preventDefault();
                }
            });  
            // Stamp Duty Events End ---
            
            // Lawyer Fee Events
              $("#grdLawyerFee").on("click", ".btn-edit", function (e) {
                    e.preventDefault();
                    var dataItem = $("#grdLawyerFee").data("kendoGrid").dataItem($(e.currentTarget).closest("tr"));
                    $m.openLawyerFeePopup(dataItem);
             });     
             
                $("#grdLawyerFee").on("click", ".btn-delete", function (e) {
                    e.preventDefault();
                     var yesFunction = function () {
                      var dataItem = $("#grdLawyerFee").data("kendoGrid").dataItem($(e.currentTarget).closest("tr"));
                    $m.deleteLawyerFee(dataItem);
                    };
            var noFunction = function () { };

            $m.settings.common.showConfirmDialog(yesFunction, noFunction, "Are you sure you want to delete this item?");
       
                   
             }); 
             
              // Add LawyerFee
            $("#save-LawyerFee").click(function () {
                if($("#hdnLawyerFeeId").val() == ""){
                    $m.settings.common.createGUID($m.saveLawyerFee);
                }
                else
                {
                    $m.saveLawyerFee("");
                } 
            });
            $('#chkLawyerFeeAny').change(function() {
                 if(this.checked){
                    $('#txtLawyerFeeRangeMax').prop('disabled', true);
                    $('#txtLawyerFeeRangeMax').val("");
                    
               }else{
                   $('#txtLawyerFeeRangeMax').prop('disabled', false);
               }
            });  
            
              $("#addLawyerFee").draggable({
                    handle: ".modal-header"
                });
             $('#addLawyerFee').on('hidden.bs.modal', function () {
             
                   $m.clearLawyerFee();
                
            })
        
         $("#txtLawyerFeeRangeMin").keydown(function (e) {
                // Allow: backspace, delete, tab, escape, enter and .
                if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
                    // Allow: Ctrl+A
                    (e.keyCode == 65 && e.ctrlKey === true) ||
                    // Allow: Ctrl+C
                    (e.keyCode == 67 && e.ctrlKey === true) ||
                    // Allow: Ctrl+X
                    (e.keyCode == 88 && e.ctrlKey === true) ||
                    // Allow: home, end, left, right
                    (e.keyCode >= 35 && e.keyCode <= 39)) {
                        // let it happen, don't do anything
                        return;
                }
                // Ensure that it is a number and stop the keypress
                if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                    e.preventDefault();
                }
            });     
             $("#txtLawyerFeeRangeMax").keydown(function (e) {
                // Allow: backspace, delete, tab, escape, enter and .
                if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
                    // Allow: Ctrl+A
                    (e.keyCode == 65 && e.ctrlKey === true) ||
                    // Allow: Ctrl+C
                    (e.keyCode == 67 && e.ctrlKey === true) ||
                    // Allow: Ctrl+X
                    (e.keyCode == 88 && e.ctrlKey === true) ||
                    // Allow: home, end, left, right
                    (e.keyCode >= 35 && e.keyCode <= 39)) {
                        // let it happen, don't do anything
                        return;
                }
                // Ensure that it is a number and stop the keypress
                if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                    e.preventDefault();
                }
            });  
             $("#txtLawyerFeePercentage").keydown(function (e) {
                // Allow: backspace, delete, tab, escape, enter and .
                if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
                    // Allow: Ctrl+A
                    (e.keyCode == 65 && e.ctrlKey === true) ||
                    // Allow: Ctrl+C
                    (e.keyCode == 67 && e.ctrlKey === true) ||
                    // Allow: Ctrl+X
                    (e.keyCode == 88 && e.ctrlKey === true) ||
                    // Allow: home, end, left, right
                    (e.keyCode >= 35 && e.keyCode <= 39)) {
                        // let it happen, don't do anything
                        return;
                }
                // Ensure that it is a number and stop the keypress
                if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                    e.preventDefault();
                }
            });  
            
            $("#grdLawyerFee .k-grid-header").hide();
            
            // End of Lawyer Fee Section
            
            
            // Deed Type Section 
            
            $("#grdDeedType").on("click", ".btn-edit", function (e) {
                    e.preventDefault();
                    var dataItem = $("#grdDeedType").data("kendoGrid").dataItem($(e.currentTarget).closest("tr"));
                    $m.openDeedTypePopup(dataItem);
             });     
             
                $("#grdDeedType").on("click", ".btn-delete", function (e) {
                    e.preventDefault();
                     var yesFunction = function () {
                      var dataItem = $("#grdDeedType").data("kendoGrid").dataItem($(e.currentTarget).closest("tr"));
                    $m.deleteDeedType(dataItem);
                    };
                      var noFunction = function () { };

            $m.settings.common.showConfirmDialog(yesFunction, noFunction, "Are you sure you want to delete this item?");
       
                   
             }); 
              $("#grdDeedType .k-grid-header").hide();
              
                $("#save-DeedType").click(function () {
                if($("#hdnDeedTypeId").val() == ""){
                    $m.settings.common.createGUID($m.saveDeedType);
                }
                else
                {
                    $m.saveDeedType("");
                } 
            });
            
              $("#addDeedType").draggable({
                    handle: ".modal-header"
                });
             $('#addDeedType').on('hidden.bs.modal', function () {
             
                   $m.clearDeedType();
                
            })
            // End of Deed Type Section
            
            // Case Type Section
            $("#grdCaseType").on("click", ".btn-edit", function (e) {
                    e.preventDefault();
                    var dataItem = $("#grdCaseType").data("kendoGrid").dataItem($(e.currentTarget).closest("tr"));
                    $m.openCaseTypePopup(dataItem);
             });     
             
                $("#grdCaseType").on("click", ".btn-delete", function (e) {
                    e.preventDefault();
                     var yesFunction = function () {
                      var dataItem = $("#grdCaseType").data("kendoGrid").dataItem($(e.currentTarget).closest("tr"));
                    $m.deleteCaseType(dataItem);
                    };
                      var noFunction = function () { };

            $m.settings.common.showConfirmDialog(yesFunction, noFunction, "Are you sure you want to delete this item?");
       
                   
             }); 
              $("#grdCaseType .k-grid-header").hide();
              
                $("#save-CaseType").click(function () {
                if($("#hdnCaseTypeId").val() == ""){
                    $m.settings.common.createGUID($m.saveCaseType);
                }
                else
                {
                    $m.saveCaseType("");
                } 
            });
            
              $("#addCaseType").draggable({
                    handle: ".modal-header"
                });
             $('#addCaseType').on('hidden.bs.modal', function () {
             
                   $m.clearCaseType();
                
            })
            
            // End of Case Type Section
            
             // Court Section
            $("#grdCourt").on("click", ".btn-edit", function (e) {
                    e.preventDefault();
                    var dataItem = $("#grdCourt").data("kendoGrid").dataItem($(e.currentTarget).closest("tr"));
                    $m.openCourtPopup(dataItem);
             });     
             
                $("#grdCourt").on("click", ".btn-delete", function (e) {
                    e.preventDefault();
                     var yesFunction = function () {
                      var dataItem = $("#grdCourt").data("kendoGrid").dataItem($(e.currentTarget).closest("tr"));
                       $m.deleteCourt(dataItem);
                    };
                      var noFunction = function () { };

            $m.settings.common.showConfirmDialog(yesFunction, noFunction, "Are you sure you want to delete this item?");
       
                   
             }); 
              $("#grdCourt .k-grid-header").hide();
              
                $("#save-Court").click(function () {
                if($("#hdnCourtId").val() == ""){
                    $m.settings.common.createGUID($m.saveCourt);
                }
                else
                {
                    $m.saveCourt("");
                } 
            });
            
              $("#addCourt").draggable({
                    handle: ".modal-header"
                });
             $('#addCourt').on('hidden.bs.modal', function () {
             
                   $m.clearCourt();
                
            })
            
            // End of Case Type Section
        },
        initControlls:function () {
            $("#chkAny").checkboxpicker({
               html: true,
                offLabel: '<span>Max</span>',
                onLabel: '<span>Any</span>'
            });
              $("#chkLawyerFeeAny").checkboxpicker({
               html: true,
                offLabel: '<span>Max</span>',
                onLabel: '<span>Any</span>'
            });
            // create DropDownList from input HTML element
        $("#ddlAccountType").kendoDropDownList({
            dataSource: $m.accountTypeData,
            dataTextField: "Name",
            dataValueField: "Id",
            index: 0
        });

        $("#grdUsers").kendoGrid({
            dataSource: {
                data: [],
            },
            columns: [
                { field: "UserId", hidden: true, },
                { field: "Name", title: "Name" },
                { field: "Designation", width: 150, title: "Designation" },
                { field: "Level", title: "Level" },
                { width: 50, title: "Edit" ,template: "<a href='\\#'><span class='glyphicon glyphicon-edit pull-right'></span></a>" }
            ]
        });
        
          $("#ddlDesignation").kendoDropDownList({
            dataSource: $m.userTypeData,
            dataTextField: "Name",
            dataValueField: "Id",
            index: 0
          });
        
           $("#ddlRole").kendoDropDownList({
            dataSource: $m.userLevelData,
            dataTextField: "Name",
            dataValueField: "Id",
            index: 0
            });
            
             $("#grdStampDuty").kendoGrid({
            // dataSource: {
            //     data: [],
            // },
             pageable: {
                    input: false,
                    numeric: true
                },
            columns: [
                { field: "ID", hidden: true, },
                { field: "Range", title: "Range" },
                { field: "Percentage", width: 50, title: "Percentage", template: "<span>#=Percentage#%</span>" },
                { command: { text: "Edit", template: "<button class='btn btn-default btn-edit'> <i class='glyphicon glyphicon-edit'></i></button>" }, title: " ", width: 50},
                { command: { text: "", template: "<button class='btn btn-danger btn-delete'> <i class='glyphicon glyphicon glyphicon-remove-sign'></i></button>" }, title: " ", width: 50 }
                
            ]
         
        });
        
         $("#grdLawyerFee").kendoGrid({
            // dataSource: {
            //     data: [],
            // },
             pageable: {
                    input: false,
                    numeric: true
                },
            columns: [
                { field: "ID", hidden: true, },
                { field: "Range", title: "Range" },
                { field: "Percentage", width: 50, title: "Percentage", template: "<span>#=Percentage#%</span>" },
                { command: { text: "Edit", template: "<button class='btn btn-default btn-edit'> <i class='glyphicon glyphicon-edit'></i></button>" }, title: " ", width: 50},
                { command: { text: "", template: "<button class='btn btn-danger btn-delete'> <i class='glyphicon glyphicon glyphicon-remove-sign'></i></button>" }, title: " ", width: 50 }
                
            ]
         
        });
        
         $("#grdDeedType").kendoGrid({
            // dataSource: {
            //     data: [],
            // },
             pageable: {
                    input: false,
                    numeric: true
                },
            columns: [
                { field: "ID", hidden: true, },
                { field: "Name", title: "Name" },
                { command: { text: "Edit", template: "<button class='btn btn-default btn-edit'> <i class='glyphicon glyphicon-edit'></i></button>" }, title: " ", width: 50},
                { command: { text: "", template: "<button class='btn btn-danger btn-delete'> <i class='glyphicon glyphicon glyphicon-remove-sign'></i></button>" }, title: " ", width: 50 }
                
            ]
         
        });
        
        $("#grdCaseType").kendoGrid({
            // dataSource: {
            //     data: [],
            // },
             pageable: {
                    input: false,
                    numeric: true
                },
            columns: [
                { field: "ID", hidden: true, },
                { field: "Name", title: "Name" },
                { command: { text: "Edit", template: "<button class='btn btn-default btn-edit'> <i class='glyphicon glyphicon-edit'></i></button>" }, title: " ", width: 50},
                { command: { text: "", template: "<button class='btn btn-danger btn-delete'> <i class='glyphicon glyphicon glyphicon-remove-sign'></i></button>" }, title: " ", width: 50 }
                
            ]
         
        });
        
         $("#grdCourt").kendoGrid({
            // dataSource: {
            //     data: [],
            // },
             pageable: {
                    input: false,
                    numeric: true
                },
            columns: [
                { field: "ID", hidden: true, },
                { field: "Name", title: "Name" },
                { command: { text: "Edit", template: "<button class='btn btn-default btn-edit'> <i class='glyphicon glyphicon-edit'></i></button>" }, title: " ", width: 50},
                { command: { text: "", template: "<button class='btn btn-danger btn-delete'> <i class='glyphicon glyphicon glyphicon-remove-sign'></i></button>" }, title: " ", width: 50 }
                
            ]
         
        });
        },
         saveMasterData: function (url, type, model) {
            /// <summary>
            /// Call ajax function to save deed
            /// </summary>
            /// <param name="url" type="type"> url of the controller action</param>
            /// <param name="type" type="type"> GET/POST</param>
            /// <param name="model" type="type"> deed object</param>
            $m.settings.common.ajaxFunction(url, type,null, model,true);
        },
        notifyAccount:function (params) {
           
               if (JSON.parse(params).Result) {
                 $m.settings.common.ajaxFunction('/Account/LoadMasterData', 'POST', null, null,false);
            }
        },
        notifyAccountDraft:function (params) {
             $m.settings.common.ajaxFunction('/Account/LoadDraftData', 'POST', null, null,false);
            
        },
         masterAccountDataResponse:function (data) {
              /// <summary>
            /// Callback function for Get Master data
            /// </summary>
             /// <param name="data" type="type">  response Json string</param>
          $m.masterData = JSON.parse(JSON.parse(data).JsonResult)[0];
          if($m.masterData){
               $m.setStampDutyGridDataSource();
                $m.setLawyerFeeGridDataSource();
                $m.setDeedTypeGridDataSource();
                $m.setCaseTypeGridDataSource();
                $m.setCourtGridDataSource();
          }
          
          
        },
        
        //Stamp Duty Section
        clearStampDuty : function () {
            $("#hdnStampDutyId").val("");
            $("#txtRangeMin").val("");
            $("#txtRangeMax").val("");
            $("#txtPercentage").val("");
             $('#txtRangeMax').prop('disabled', false);
              $("#chkAny").prop('checked', false);  
            //$("#hdnUUID").val("");
        },
         openStampDutyPopup : function (data) {
            var splited = data.Range.split("-");
            $("#hdnStampDutyId").val(data.ID);
            $("#txtRangeMin").val(splited[0]);
            if(splited[1].replace(/ /g,'') === "Any"){
               $('#txtRangeMax').prop('disabled', true);
               $("#chkAny").prop('checked', true); 
            }
            else{
                $("#txtRangeMax").val(splited[1]);
            }
            
            $("#txtPercentage").val(data.Percentage);
            $('#addStampDuty').modal('toggle');
            
        },
       
        saveStampDuty:function (guid) {
            //Save stamp duty data
            
            //Check Min Range Empty
            if ($("#txtRangeMin").val() == "") {
                 $m.settings.common.setValidationMessages("val-messageStampDuty","warning","Min Value Required");
                return;
            }
             //Check Min Range Empty if Any is not checked
            if (!$("#chkAny").prop('checked') && $("#txtRangeMax").val() == "") {
                  $m.settings.common.setValidationMessages("val-messageStampDuty","warning","Max Value Required");
                return;
            }
             if ( $("#txtPercentage").val() == "") {
                  $m.settings.common.setValidationMessages("val-messageStampDuty","warning","Percentage Required");
                return;
            }
            //Check Min Rangeis Zero if current is the first range to enter
          if( !$m.masterData.Stampduty||  $m.masterData.Stampduty.length === 0){     
                if(parseInt($("#txtRangeMin").val()) > 0){
                     $m.settings.common.setValidationMessages("val-messageStampDuty","warning","Should Start with Minimum Value of Zero");
                    return;
                }      
            }
            else
            {
                
                var lastindex = $m.masterData.Stampduty.length - 1;
                 var range = $m.masterData.Stampduty[lastindex].Range;
                var id = $m.masterData.Stampduty[lastindex].ID;
                  var splited = range.split("-");
                var max = splited[1];
                
                //If in Edit mode
                if($("#hdnStampDutyId").val() != "" ){
                    //If editing the first item
                        if($m.masterData.Stampduty.length === 1){
                            if(parseInt($("#txtRangeMin").val()) > 0){
                                    $m.settings.common.setValidationMessages("val-messageStampDuty","warning","Should Start with Minimum Value of Zero");
                                    return;
                            }
                            else if(!$("#chkAny").prop('checked') && parseInt($("#txtRangeMin").val()) >= parseInt($("#txtRangeMax").val())){
                                    $m.settings.common.setValidationMessages("val-messageStampDuty","warning","Max Value must be Greater than Min Value");
                                    return;
                            } 
                        }
                        //If not editing the last item
                        else if (id != $("#hdnStampDutyId").val()){
                            //If the max is Any, not allowed to add Range
                            if( max.replace(/ /g,'') == "Any"){
                                   //If Any checked
                                  if($("#chkAny").prop('checked')){  
                                         $m.settings.common.setValidationMessages("val-messageStampDuty","warning","Invalid Range");
                                        return;
                                  }
                                  // If Any not checked
                                  else{
                                       // have to get index and -1  max val +1 min val
                                       var preMax = "";
                                       var preSplited = [];
                                       var nextMin = "";
                                       var nextSplited = [];
                                      for (var i = 0, x = $m.masterData.Stampduty.length; i < x; i++){
                                          if($m.masterData.Stampduty[i].ID === $("#hdnStampDutyId").val() ){
                                              if(i >0){
                                                    preSplited = $m.masterData.Stampduty[i-1].Range.split("-");
                                              }
                                            
                                              nextSplited = $m.masterData.Stampduty[i+1].Range.split("-");
                                              
                                          }
                                      }
                                      //debugger;
                                      if(preSplited.length > 0){
                                         preMax = preSplited[1];
                                      }
                                      nextMin = nextSplited[0];
                                       if(preMax != "" && parseInt($("#txtRangeMin").val()) != parseInt(preMax) +1){
                                            $m.settings.common.setValidationMessages("val-messageStampDuty","warning","Minimum Value Should be : " + (parseInt(preMax)+1).toString());
                                            return;
                                        }
                                        else if (parseInt($("#txtRangeMax").val()) != parseInt(nextMin) -1){
                                            $m.settings.common.setValidationMessages("val-messageStampDuty","warning","Maximum Value Should be : " + (parseInt(nextMin)-1).toString());
                                            return;
                                        }
                                  }
                                }
                                 // not editing the last item & If the max is not Any
                                else{
                                     //If any not checked
                                    if(!$("#chkAny").prop('checked')){  
                                            var preMax = "";
                                        var preSplited = [];
                                        var nextMin = "";
                                        var nextSplited = [];
                                        //Get Pre Max value & Next Min Value to validate current Min & Max
                                        for (var i = 0, x = $m.masterData.Stampduty.length; i < x; i++){
                                            if($m.masterData.Stampduty[i].ID === $("#hdnStampDutyId").val() ){
                                               if(i >0){
                                                preSplited = $m.masterData.Stampduty[i-1].Range.split("-");
                                                 }
                                                nextSplited = $m.masterData.Stampduty[i+1].Range.split("-");
                                                
                                            }
                                        }
                                 
                                        if(preSplited.length > 0){
                                        preMax = preSplited[1];
                                        }
                                        nextMin = nextSplited[0];
                                        //Validate Min
                                        if(preMax != "" && parseInt($("#txtRangeMin").val()) != parseInt(preMax) +1){
                                                $m.settings.common.setValidationMessages("val-messageStampDuty","warning","Minimum Value Should be : " + (parseInt(preMax)+1).toString());
                                                return;
                                        }
                                        //Validate Max
                                        else if (parseInt($("#txtRangeMax").val()) != parseInt(nextMin) -1){
                                            $m.settings.common.setValidationMessages("val-messageStampDuty","warning","Maximum Value Should be : " + (parseInt(nextMin)-1).toString());
                                            return;
                                        }
                                    }
                                    //If any checked don't allow to add range since Any not allowed in the middle
                                    else{
                                          $m.settings.common.setValidationMessages("val-messageStampDuty","warning","Invalid Range");
                                        return;
                                    }
                                }
                            }
                            //If editing last item
                            else if (id === $("#hdnStampDutyId").val()){
                                //And max is not Any
                                 //if( max.replace(/ /g,'') != "Any"){
                                     //If Any Checked
                                    if(!$("#chkAny").prop('checked')){  
                                           var preMax = "";
                                        var preSplited = [];
                                         var sdl = $m.masterData.Stampduty.length;
                                         if(sdl > 1)
                                            preSplited = $m.masterData.Stampduty[sdl-2].Range.split("-"); 
                                       
                                       
                                        preMax = preSplited[1];
                                      //Validate Min Value
                                        if(parseInt($("#txtRangeMin").val()) != parseInt(preMax) +1){
                                            $m.settings.common.setValidationMessages("val-messageStampDuty","warning","Minimum Value Should be : " + (parseInt(preMax)+1).toString());
                                            return;
                                        }
                                        //Validate Range
                                        if(parseInt($("#txtRangeMin").val()) >= parseInt($("#txtRangeMax").val())){
                                            $m.settings.common.setValidationMessages("val-messageStampDuty","warning","Max Value must be Greater than Min Value");
                                            return;
                                         }
                                    }
   
                            }
                           
                     
                        }
                
                //Adding New Range
                else{
                    //If Current last Range ends with Any do not allow to add new Range
                     if( max.replace(/ /g,'') == "Any"){
                              
                            $m.settings.common.setValidationMessages("val-messageStampDuty","warning","Invalid Range");
                            return;
                     
                     }
                     // If max is not Any
                     else{
                         //Check Any is selected 
                        if(!$("#chkAny").prop('checked')){      
                            //Range Validation 
                            if(parseInt($("#txtRangeMin").val()) >= parseInt($("#txtRangeMax").val())){
                                            $m.settings.common.setValidationMessages("val-messageStampDuty","warning","Max Value must be Greater than Min Value");
                                            return;
                            }
                            //Min value Validation
                            else if(parseInt($("#txtRangeMin").val()) != parseInt(max) +1){
                            $m.settings.common.setValidationMessages("val-messageStampDuty","warning","Minimum Value Should be : " + (parseInt(max)+1).toString());
                            return;
                            }
                        }
                        //Any checked
                        else{
                             if(parseInt($("#txtRangeMin").val()) != parseInt(max) +1){
                            $m.settings.common.setValidationMessages("val-messageStampDuty","warning","Minimum Value Should be : " + parseInt(max)+1);
                            return;
                            }
                        }
                     }
                }
          
            }
           

           
              var max2 = "";
             if($("#chkAny").prop('checked')){
                 max2 = "Any";
             }
             else{
                max2 = $("#txtRangeMax").val()
             }
           
         var stampDuty = { 
                    Range: $("#txtRangeMin").val() +"-"+ max2,
                    Percentage :$("#txtPercentage").val(),
                    UpdatedBy:$scope.Configs.UserId,
                    UpdatedDate:new Date()
             };
           
         
            if(guid != ""){
                 stampDuty.ID = guid;
                  stampDuty.CreatedBy = $scope.Configs.UserId;
                 stampDuty.CreatedDate = new Date();
                 if(!$m.masterData.Stampduty)
                          $m.masterData.Stampduty = [];
                 
                 $m.masterData.Stampduty.push(stampDuty);        
                 
            }
            else
            {
                for (var i = 0, x = $m.masterData.Stampduty.length; i < x; i++){
                    if($m.masterData.Stampduty[i].ID === $("#hdnStampDutyId").val()){
                        $m.masterData.Stampduty[i].Range = stampDuty.Range;
                        $m.masterData.Stampduty[i].Percentage = stampDuty.Percentage;
                        
                    }
                }
            }
            
          $m.setStampDutyGridDataSource();
           $('#addStampDuty').modal('hide');
           $m.clearStampDuty();
           $m.saveMasterData("/Account/SaveAccountMasterData","POST",$m.masterData);
            
        },
        setStampDutyGridDataSource:function () {
            
             var dataSource = new kendo.data.DataSource({
                data: $m.masterData.Stampduty,
                pageSize: 3,
                page:1,
                serverPaging: false
            });
             var stampDutyGrid = $("#grdStampDuty").data("kendoGrid");
           stampDutyGrid.setDataSource(dataSource);
           stampDutyGrid.dataSource.read();
           stampDutyGrid.refresh();
        },
        deleteStampDuty:function (data) {
     
            
             for (var i = 0, x = $m.masterData.Stampduty.length; i < x; i++){
                    if($m.masterData.Stampduty[i].ID === data.ID){
                        if(i +1 === x){
                         $m.masterData.Stampduty.splice(i,1);     
                        $m.setStampDutyGridDataSource(); 
                         $m.saveMasterData("/Account/SaveAccountMasterData","POST",$m.masterData);
                         return;
                        }
                        else{
                             $m.settings.common.showNotification("You Can Only Delete Last Range", "warning");
                        }
                  
                    }
                }
             
        },
       
        // End of Stam Duty Section
        
        //Lawyer Fee  Section
        clearLawyerFee : function () {
            $("#hdnLawyerFeeId").val("");
            $("#txtLawyerFeeRangeMin").val("");
            $("#txtLawyerFeeRangeMax").val("");
            $("#txtLawyerFeePercentage").val("");
             $('#txtLawyerFeeRangeMax').prop('disabled', false);
              $("#chkLawyerFeeAny").prop('checked', false);  
            //$("#hdnUUID").val("");
        },
         openLawyerFeePopup : function (data) {
            var splited = data.Range.split("-");
            $("#hdnLawyerFeeId").val(data.ID);
            $("#txtLawyerFeeRangeMin").val(splited[0]);
            if(splited[1].replace(/ /g,'') === "Any"){
               $('#txtLawyerFeeRangeMax').prop('disabled', true);
               $("#chkLawyerFeeAny").prop('checked', true); 
            }
            else{
                $("#txtLawyerFeeRangeMax").val(splited[1]);
            }
            
            $("#txtLawyerFeePercentage").val(data.Percentage);
            $('#addLawyerFee').modal('toggle');
            
        },
       
        saveLawyerFee:function (guid) {
            //Save stamp duty data
            
            //Check Min Range Empty
            if ($("#txtLawyerFeeRangeMin").val() == "") {
                 $m.settings.common.setValidationMessages("val-messageLawyerFee","warning","Min Value Required");
                return;
            }
             //Check Min Range Empty if Any is not checked
            if (!$("#chkLawyerFeeAny").prop('checked') && $("#txtLawyerFeeRangeMax").val() == "") {
                  $m.settings.common.setValidationMessages("val-messageLawyerFee","warning","Max Value Required");
                return;
            }
             if ( $("#txtLawyerFeePercentage").val() == "") {
                  $m.settings.common.setValidationMessages("val-messageLawyerFee","warning","Percentage Required");
                return;
            }
            //Check Min Rangeis Zero if current is the first range to enter
          if( !$m.masterData.LawyerFee||  $m.masterData.LawyerFee.length === 0){     
                if(parseInt($("#txtLawyerFeeRangeMin").val()) > 0){
                     $m.settings.common.setValidationMessages("val-messageLawyerFee","warning","Should Start with Minimum Value of Zero");
                    return;
                }      
            }
            else
            {
                
                var lastindex = $m.masterData.LawyerFee.length - 1;
                 var range = $m.masterData.LawyerFee[lastindex].Range;
                var id = $m.masterData.LawyerFee[lastindex].ID;
                  var splited = range.split("-");
                var max = splited[1];
                
                //If in Edit mode
                if($("#hdnLawyerFeeId").val() != "" ){
                    //If editing the first item
                        if($m.masterData.LawyerFee.length === 1){
                            if(parseInt($("#txtLawyerFeeRangeMin").val()) > 0){
                                    $m.settings.common.setValidationMessages("val-messageLawyerFee","warning","Should Start with Minimum Value of Zero");
                                    return;
                            }
                            else if(!$("#chkLawyerFeeAny").prop('checked') && parseInt($("#txtLawyerFeeRangeMin").val()) >= parseInt($("#txtLawyerFeeRangeMax").val())){
                                    $m.settings.common.setValidationMessages("val-messageLawyerFee","warning","Max Value must be Greater than Min Value");
                                    return;
                            } 
                        }
                        //If not editing the last item
                        else if (id != $("#hdnLawyerFeeId").val()){
                            //If the max is Any, not allowed to add Range
                            if( max.replace(/ /g,'') == "Any"){
                                   //If Any checked
                                  if($("#chkLawyerFeeAny").prop('checked')){  
                                         $m.settings.common.setValidationMessages("val-messageLawyerFee","warning","Invalid Range");
                                        return;
                                  }
                                  // If Any not checked
                                  else{
                                       // have to get index and -1  max val +1 min val
                                       var preMax = "";
                                       var preSplited = [];
                                       var nextMin = "";
                                       var nextSplited = [];
                                      for (var i = 0, x = $m.masterData.LawyerFee.length; i < x; i++){
                                          if($m.masterData.LawyerFee[i].ID === $("#hdnLawyerFeeId").val() ){
                                              if(i >0){
                                                    preSplited = $m.masterData.LawyerFee[i-1].Range.split("-");
                                              }
                                            
                                              nextSplited = $m.masterData.LawyerFee[i+1].Range.split("-");
                                              
                                          }
                                      }
                                      //debugger;
                                      if(preSplited.length > 0){
                                         preMax = preSplited[1];
                                      }
                                      nextMin = nextSplited[0];
                                       if(preMax != "" && parseInt($("#txtLawyerFeeRangeMin").val()) != parseInt(preMax) +1){
                                            $m.settings.common.setValidationMessages("val-messageLawyerFee","warning","Minimum Value Should be : " + (parseInt(preMax)+1).toString());
                                            return;
                                        }
                                        else if (parseInt($("#txtLawyerFeeRangeMax").val()) != parseInt(nextMin) -1){
                                            $m.settings.common.setValidationMessages("val-messageLawyerFee","warning","Maximum Value Should be : " + (parseInt(nextMin)-1).toString());
                                            return;
                                        }
                                  }
                                }
                                 // not editing the last item & If the max is not Any
                                else{
                                     //If any not checked
                                    if(!$("#chkLawyerFeeAny").prop('checked')){  
                                            var preMax = "";
                                        var preSplited = [];
                                        var nextMin = "";
                                        var nextSplited = [];
                                        //Get Pre Max value & Next Min Value to validate current Min & Max
                                        for (var i = 0, x = $m.masterData.LawyerFee.length; i < x; i++){
                                            if($m.masterData.LawyerFee[i].ID === $("#hdnLawyerFeeId").val() ){
                                               if(i >0){
                                                preSplited = $m.masterData.LawyerFee[i-1].Range.split("-");
                                                 }
                                                nextSplited = $m.masterData.LawyerFee[i+1].Range.split("-");
                                                
                                            }
                                        }
                                 
                                        if(preSplited.length > 0){
                                        preMax = preSplited[1];
                                        }
                                        nextMin = nextSplited[0];
                                        //Validate Min
                                        if(preMax != "" && parseInt($("#txtLawyerFeeRangeMin").val()) != parseInt(preMax) +1){
                                                $m.settings.common.setValidationMessages("val-messageLawyerFee","warning","Minimum Value Should be : " + (parseInt(preMax)+1).toString());
                                                return;
                                        }
                                        //Validate Max
                                        else if (parseInt($("#txtLawyerFeeRangeMax").val()) != parseInt(nextMin) -1){
                                            $m.settings.common.setValidationMessages("val-messageLawyerFee","warning","Maximum Value Should be : " + (parseInt(nextMin)-1).toString());
                                            return;
                                        }
                                    }
                                    //If any checked don't allow to add range since Any not allowed in the middle
                                    else{
                                          $m.settings.common.setValidationMessages("val-messageLawyerFee","warning","Invalid Range");
                                        return;
                                    }
                                }
                            }
                            //If editing last item
                            else if (id === $("#hdnLawyerFeeId").val()){
                                //And max is not Any
                                 //if( max.replace(/ /g,'') != "Any"){
                                     //If Any Checked
                                    if(!$("#chkLawyerFeeAny").prop('checked')){  
                                           var preMax = "";
                                        var preSplited = [];
                                         var sdl = $m.masterData.LawyerFee.length;
                                         if(sdl > 1)
                                            preSplited = $m.masterData.LawyerFee[sdl-2].Range.split("-"); 
                                       
                                       
                                        preMax = preSplited[1];
                                      //Validate Min Value
                                        if(parseInt($("#txtLawyerFeeRangeMin").val()) != parseInt(preMax) +1){
                                            $m.settings.common.setValidationMessages("val-messageLawyerFee","warning","Minimum Value Should be : " + (parseInt(preMax)+1).toString());
                                            return;
                                        }
                                        //Validate Range
                                        if(parseInt($("#txtLawyerFeeRangeMin").val()) >= parseInt($("#txtLawyerFeeRangeMax").val())){
                                            $m.settings.common.setValidationMessages("val-messageLawyerFee","warning","Max Value must be Greater than Min Value");
                                            return;
                                         }
                                    }
   
                            }
                           
                     
                        }
                
                //Adding New Range
                else{
                    //If Current last Range ends with Any do not allow to add new Range
                     if( max.replace(/ /g,'') == "Any"){
                              
                            $m.settings.common.setValidationMessages("val-messageLawyerFee","warning","Invalid Range");
                            return;
                     
                     }
                     // If max is not Any
                     else{
                         //Check Any is selected 
                        if(!$("#chkLawyerFeeAny").prop('checked')){      
                            //Range Validation 
                            if(parseInt($("#txtLawyerFeeRangeMin").val()) >= parseInt($("#txtLawyerFeeRangeMax").val())){
                                            $m.settings.common.setValidationMessages("val-messageLawyerFee","warning","Max Value must be Greater than Min Value");
                                            return;
                            }
                            //Min value Validation
                            else if(parseInt($("#txtLawyerFeeRangeMin").val()) != parseInt(max) +1){
                               // debugger;
                            $m.settings.common.setValidationMessages("val-messageLawyerFee","warning","Minimum Value Should be : " + (parseInt(max)+1).toString());
                            return;
                            }
                        }
                        //Any checked
                        else{
                             if(parseInt($("#txtLawyerFeeRangeMin").val()) != parseInt(max) +1){
                                // debugger;
                            $m.settings.common.setValidationMessages("val-messageLawyerFee","warning","Minimum Value Should be : " + (parseInt(max)+1).toString());
                            return;
                            }
                        }
                     }
                }
          
            }
           

           
              var max2 = "";
             if($("#chkLawyerFeeAny").prop('checked')){
                 max2 = "Any";
             }
             else{
                max2 = $("#txtLawyerFeeRangeMax").val()
             }
           
         var lawyerFee = { 
                    Range: $("#txtLawyerFeeRangeMin").val() +"-"+ max2,
                    Percentage :$("#txtLawyerFeePercentage").val(),
                    UpdatedBy:$scope.Configs.UserId,
                    UpdatedDate:new Date()
                    
             };
           
         
            if(guid != ""){
                 lawyerFee.ID = guid;
                 lawyerFee.CreatedBy = $scope.Configs.UserId;
                 lawyerFee.CreatedDate = new Date();
                 if(!$m.masterData.LawyerFee)
                          $m.masterData.LawyerFee = [];
                 
                 $m.masterData.LawyerFee.push(lawyerFee);        
                 
            }
            else
            {
                for (var i = 0, x = $m.masterData.LawyerFee.length; i < x; i++){
                    if($m.masterData.LawyerFee[i].ID === $("#hdnLawyerFeeId").val()){
                        $m.masterData.LawyerFee[i].Range = lawyerFee.Range;
                        $m.masterData.LawyerFee[i].Percentage = lawyerFee.Percentage;
                        
                    }
                }
            }
            
          $m.setLawyerFeeGridDataSource();
           $('#addLawyerFee').modal('hide');
           $m.clearStampDuty();
           $m.saveMasterData("/Account/SaveAccountMasterData","POST",$m.masterData);
            
        },
        
        setLawyerFeeGridDataSource:function () {
            
             var dataSource = new kendo.data.DataSource({
                data: $m.masterData.LawyerFee,
                pageSize: 3,
                page:1,
                serverPaging: false
            });
             var lawyerFeeGrid = $("#grdLawyerFee").data("kendoGrid");
           lawyerFeeGrid.setDataSource(dataSource);
           lawyerFeeGrid.dataSource.read();
           lawyerFeeGrid.refresh();
        },
        //Only allow to delete the last item
        deleteLawyerFee:function (data) {
     
            
             for (var i = 0, x = $m.masterData.LawyerFee.length; i < x; i++){
                    if($m.masterData.LawyerFee[i].ID === data.ID){
                        if(i +1 === x){
                         $m.masterData.LawyerFee.splice(i,1);     
                        $m.setLawyerFeeGridDataSource(); 
                         $m.saveMasterData("/Account/SaveAccountMasterData","POST",$m.masterData);
                         return;
                        }
                        else{
                             $m.settings.common.showNotification("You Can Only Delete Last Range", "warning");
                        }
                  
                    }
                }
             
        },
       
        // End of Lawyer Fee Section
        
        // Deed Type Section
        
         clearDeedType : function () {
      
            $("#txtDeedType").val("");
             $("#hdnDeedTypeId").val("");
           
            //$("#hdnUUID").val("");
        },
         openDeedTypePopup : function (data) {
            
            $("#hdnDeedTypeId").val(data.ID);
            $("#txtDeedType").val(data.Name);
            $('#addDeedType').modal('toggle');
            
        },
        saveDeedType:function (guid) {
             if ($("#txtDeedType").val() == "") {
                 $m.settings.common.setValidationMessages("val-messageDeedType","warning","Type Required");
                return;
            }
              var deedType = { 
                    Name: $("#txtDeedType").val(),
                    UpdatedBy:$scope.Configs.UserId,
                    UpdatedDate : new Date()
                    
             };
           
         
            if(guid != ""){
                 deedType.ID = guid;
                 deedType.CreatedBy = $scope.Configs.UserId;
                 deedType.CreatedDate = new Date();
                 if(!$m.masterData.DeedTypes)
                          $m.masterData.DeedTypes = [];
                 
                 $m.masterData.DeedTypes.push(deedType);       
                 $m.currentDraftItem = deedType;
                 $m.currentDraftItem.operation = "Add"; 
                 $m.currentDraftItem.operationType = "Deed";             
                 $m.addDraftItem();
                 
                 
            }
            else
            {
                for (var i = 0, x = $m.masterData.DeedTypes.length; i < x; i++){
                    if($m.masterData.DeedTypes[i].ID === $("#hdnDeedTypeId").val()){
                        $m.masterData.DeedTypes[i].Name = deedType.Name;
                         $m.currentDraftItem = $m.masterData.DeedTypes[i];
                        $m.currentDraftItem.operation = "Edit"; 
                        $m.currentDraftItem.operationType = "Deed"; 
                        $m.editDraftItem();
                    }
                }
            }
            
           $m.setDeedTypeGridDataSource();
           $('#addDeedType').modal('hide');
           $m.clearDeedType();
           $m.saveMasterData("/Account/SaveAccountMasterData","POST",$m.masterData);
        },
         setDeedTypeGridDataSource:function () {
            
             var dataSource = new kendo.data.DataSource({
                data: $m.masterData.DeedTypes,
                pageSize: 3,
                page:1,
                serverPaging: false
            });
             var deedTypeGrid = $("#grdDeedType").data("kendoGrid");
           deedTypeGrid.setDataSource(dataSource);
           deedTypeGrid.dataSource.read();
           deedTypeGrid.refresh();
        },
        deleteDeedType:function (data) {
             for (var i = 0, x = $m.masterData.DeedTypes.length; i < x; i++){
                    if($m.masterData.DeedTypes[i].ID === data.ID){
                        $m.currentDraftItem = $m.masterData.DeedTypes[i];
                        $m.currentDraftItem.operation = "Delete"; 
                        $m.currentDraftItem.operationType = "Deed"; 
                        
                         $m.masterData.DeedTypes.splice(i,1);     
                        $m.setDeedTypeGridDataSource(); 
                        $m.deleteDraftItem();
                         $m.saveMasterData("/Account/SaveAccountMasterData","POST",$m.masterData);
                         return;               
                    }
                }         
        },
        // End of Deed Type Section
        
        // Case Type Section
        
         clearCaseType : function () {
      
            $("#txtCaseType").val("");
             $("#hdnCaseTypeId").val("");
           
            //$("#hdnUUID").val("");
        },
        //Open Popup and bind data
         openCaseTypePopup : function (data) {
            
            $("#hdnCaseTypeId").val(data.ID);
            $("#txtCaseType").val(data.Name);
            $('#addCaseType').modal('toggle');
            
        },
        saveCaseType:function (guid) {
              if ($("#txtCaseType").val() == "") {
                 $m.settings.common.setValidationMessages("val-messageCaseType","warning","Type Required");
                return;
            }
              var caseType = { 
                    Name: $("#txtCaseType").val(),
                    UpdatedBy:$scope.Configs.UserId,
                    UpdatedDate : new Date()
                    
             };
           
         // if new create an object & save
            if(guid != ""){
                 caseType.ID = guid;
                 caseType.CreatedBy = $scope.Configs.UserId;
                 caseType.CreatedDate = new Date();
                 if(!$m.masterData.CaseTypes)
                          $m.masterData.CaseTypes = [];
                 
                 $m.masterData.CaseTypes.push(caseType);  
                 
                 $m.currentDraftItem = caseType;
                 $m.currentDraftItem.operation = "Add"; 
                 $m.currentDraftItem.operationType = "Case";             
                 $m.addDraftItem();      
                 
            }
            else
            {
                //Update item
                for (var i = 0, x = $m.masterData.CaseTypes.length; i < x; i++){
                    if($m.masterData.CaseTypes[i].ID === $("#hdnCaseTypeId").val()){
                        $m.masterData.CaseTypes[i].Name = caseType.Name;
                        
                         $m.currentDraftItem = $m.masterData.CaseTypes[i];
                        $m.currentDraftItem.operation = "Edit"; 
                        $m.currentDraftItem.operationType = "Case"; 
                        $m.editDraftItem();
                    }
                }
            }
            
          $m.setCaseTypeGridDataSource();
           $('#addCaseType').modal('hide');
           $m.clearCaseType();
           $m.saveMasterData("/Account/SaveAccountMasterData","POST",$m.masterData);
        },
         setCaseTypeGridDataSource:function () {
            
             var dataSource = new kendo.data.DataSource({
                data: $m.masterData.CaseTypes,
                pageSize: 3,
                page:1,
                serverPaging: false
            });
             var caseTypeGrid = $("#grdCaseType").data("kendoGrid");
           caseTypeGrid.setDataSource(dataSource);
           caseTypeGrid.dataSource.read();
           caseTypeGrid.refresh();
        },
        deleteCaseType:function (data) {
             for (var i = 0, x = $m.masterData.CaseTypes.length; i < x; i++){
                    if($m.masterData.CaseTypes[i].ID === data.ID){
                      $m.currentDraftItem = $m.masterData.CaseTypes[i];
                        $m.currentDraftItem.operation = "Delete"; 
                        $m.currentDraftItem.operationType = "Case"; 
                      
                         $m.masterData.CaseTypes.splice(i,1);     
                        $m.setCaseTypeGridDataSource(); 
                        $m.deleteDraftItem();
                         $m.saveMasterData("/Account/SaveAccountMasterData","POST",$m.masterData);
                         return;               
                    }
                }         
        },
        // End of Case Type Section
        
          // Court Section
        
         clearCourt : function () {
      
            $("#txtCourt").val("");
             $("#hdnCourtId").val("");
           
            //$("#hdnUUID").val("");
        },
         openCourtPopup : function (data) {
            
            $("#hdnCourtId").val(data.ID);
            $("#txtCourt").val(data.Name);
            $('#addCourt').modal('toggle');
            
        },
        saveCourt:function (guid) {
              if ($("#txtCourt").val() == "") {
                 $m.settings.common.setValidationMessages("val-messageCourt","warning","Court Name Required");
                return;
            }
              var court = { 
                    Name: $("#txtCourt").val(),
                    UpdatedBy:$scope.Configs.UserId,
                    UpdatedDate : new Date()
                    
             };
           
         
            if(guid != ""){
                 court.ID = guid;
                 court.CreatedBy = $scope.Configs.UserId;
                 court.CreatedDate = new Date();
                 if(!$m.masterData.Courts)
                          $m.masterData.Courts = [];
                 
                 $m.masterData.Courts.push(court);        
                 
            }
            else
            {
                for (var i = 0, x = $m.masterData.Courts.length; i < x; i++){
                    if($m.masterData.Courts[i].ID === $("#hdnCourtId").val()){
                        $m.masterData.Courts[i].Name = court.Name;
                        
                        
                    }
                }
            }
            
          $m.setCourtGridDataSource();
           $('#addCourt').modal('hide');
           $m.clearCourt();
           $m.saveMasterData("/Account/SaveAccountMasterData","POST",$m.masterData);
        },
         setCourtGridDataSource:function () {
            
             var dataSource = new kendo.data.DataSource({
                data: $m.masterData.Courts,
                pageSize: 3,
                page:1,
                serverPaging: false
            });
             var courtGrid = $("#grdCourt").data("kendoGrid");
           courtGrid.setDataSource(dataSource);
           courtGrid.dataSource.read();
           courtGrid.refresh();
        },
        deleteCourt:function (data) {
             for (var i = 0, x = $m.masterData.Courts.length; i < x; i++){
                    if($m.masterData.Courts[i].ID === data.ID){
                      
                         $m.masterData.Courts.splice(i,1);     
                        $m.setCourtGridDataSource(); 
                         $m.saveMasterData("/Account/SaveAccountMasterData","POST",$m.masterData);
                         return;               
                    }
                }         
        },
        // End of Court Section
        
        //Draft Section to Create the Draft Structure
        
       draftAccountDataResponse: function(a) {
           // debugger;
            $m.draft = JSON.parse(JSON.parse(a).JsonResult)[0];
           
     
        },
        // Add a new draft Item
        addDraftItem:function () {
          
            
            if($m.draft === "undefined" || $m.draft === undefined|| $m.draft === []){
             
             $m.draft = {};
             $m.draft.ClientId = $scope.Configs.ClientId;
             $m.draft.Type = "Draft";
             $m.draft.Structure = [];   
             
             var caseObj = {};
             caseObj.text = "Case";
             caseObj.type = "main";
             caseObj.items = [];
             
              var deedObj = {};
             deedObj.text = "Deed";
             deedObj.type = "main";
             deedObj.items = [];
             
             $m.draft.Structure.push(caseObj);
             $m.draft.Structure.push(deedObj);
             
            }
            
            if($m.draft.Structure && $m.draft.Structure != []){
                
               // Check if adding new Case Type
                if($m.currentDraftItem != {} && $m.currentDraftItem.operationType === "Case"){
                    //Loop through the Draft strucure items
                    for (var i = 0, x = $m.draft.Structure.length; i < x; i++){
                          // Add new draft item to Case
                        if($m.draft.Structure[i].text === "Case")
                        {
                            if(!$m.draft.Structure[i].items)
                                $m.draft.Structure[i].items = [];
                                
                             var draftItem = {};
                             draftItem.text = $m.currentDraftItem.Name;
                             draftItem.type = "sub";
                             draftItem.items = [];
                             draftItem.itemId = $m.currentDraftItem.ID;
                             
                             $m.draft.Structure[i].items.push(draftItem);
                             $m.saveDraft('/Account/SaveDraft', 'POST', $m.draft); 
                             return;
                        }
                    }
                }
                // Check if adding new Deed Type
                else if ($m.currentDraftItem != {} && $m.currentDraftItem.operationType === "Deed"){
                    //Loop through the Draft strucure items
                     for (var i = 0, x = $m.draft.Structure.length; i < x; i++){
                        // Add new draft item to Deed
                        if($m.draft.Structure[i].text === "Deed")
                        {
                            if(!$m.draft.Structure[i].items)
                                $m.draft.Structure[i].items = [];
                                
                             var draftItem = {};
                             draftItem.text = $m.currentDraftItem.Name;
                             draftItem.type = "sub";
                             draftItem.items = [];
                             draftItem.itemId = $m.currentDraftItem.ID;
                             
                             $m.draft.Structure[i].items.push(draftItem);
                              $m.saveDraft('/Account/SaveDraft', 'POST', $m.draft); 
                             return;
                        }
                    }
                }
            }
          //reset current Draft Item  
         $m.currentDraftItem = {};   
        },
        // Edit draft item
        editDraftItem:function () {
             if($m.draft.Structure && $m.draft.Structure != []){
                 // Check if editing a Case type
              if($m.currentDraftItem != {} && $m.currentDraftItem.operationType === "Case"){
                    
                    for (var i = 0, x = $m.draft.Structure.length; i < x; i++){
                        
                        if($m.draft.Structure[i].text === "Case")
                        {
                            if(!$m.draft.Structure[i].items)
                                $m.draft.Structure[i].items = [];
                                
                                for(var j = 0,y= $m.draft.Structure[i].items.length; j < y;j++){
                                    if( $m.draft.Structure[i].items[j].itemId === $m.currentDraftItem.ID){
                                        $m.draft.Structure[i].items[j].text = $m.currentDraftItem.Name;
                                          $m.saveDraft('/Account/SaveDraft', 'POST', $m.draft); 
                                       return;
                                    }
                                }
                           
                        }
                    }
                }
                 // Check if editing a Deed type
                else if($m.currentDraftItem != {} && $m.currentDraftItem.operationType === "Deed"){
                     for (var i = 0, x = $m.draft.Structure.length; i < x; i++){
                        
                        if($m.draft.Structure[i].text === "Deed")
                        {
                            if(!$m.draft.Structure[i].items)
                                $m.draft.Structure[i].items = [];
                                
                                for(var j = 0,y= $m.draft.Structure[i].items.length; j < y;j++){
                                    if( $m.draft.Structure[i].items[j].itemId === $m.currentDraftItem.ID){
                                        $m.draft.Structure[i].items[j].text = $m.currentDraftItem.Name;
                                         $m.saveDraft('/Account/SaveDraft', 'POST', $m.draft); 
                                         return;
                                    }
                                }
                            
                        }
                    }
                }
             }
        },
        deleteDraftItem:function () {
            if($m.draft.Structure && $m.draft.Structure != []){
                 if($m.currentDraftItem != {} && $m.currentDraftItem.operationType === "Case"){
                    
                    for (var i = 0, x = $m.draft.Structure.length; i < x; i++){
                        
                        if($m.draft.Structure[i].text === "Case")
                        {
                            if(!$m.draft.Structure[i].items)
                                $m.draft.Structure[i].items = [];
                                
                                for(var j = 0,y= $m.draft.Structure[i].items.length; j < y;j++){
                                    if( $m.draft.Structure[i].items[j].itemId === $m.currentDraftItem.ID){
                                        $m.draft.Structure[i].items.splice(j,1);
                                         $m.saveDraft('/Account/SaveDraft', 'POST', $m.draft); 
                                    }
                                }
                            
                            
                        }
                    }
                }
                  // Check if editing a Deed type
                else if($m.currentDraftItem != {} && $m.currentDraftItem.operationType === "Deed"){
                     for (var i = 0, x = $m.draft.Structure.length; i < x; i++){
                        
                        if($m.draft.Structure[i].text === "Deed")
                        {
                            if(!$m.draft.Structure[i].items)
                                $m.draft.Structure[i].items = [];
                                
                                for(var j = 0,y= $m.draft.Structure[i].items.length; j < y;j++){
                                    if( $m.draft.Structure[i].items[j].itemId === $m.currentDraftItem.ID){
                                        $m.draft.Structure[i].items.splice(j,1);
                                         $m.saveDraft('/Account/SaveDraft', 'POST', $m.draft); 
                                        
                                    }
                                }
                            
                        }
                    }
                }
            }
        },
         saveDraft: function (url, type, model) {
            /// <summary>
            /// Call ajax function to save deed
            /// </summary>
            /// <param name="url" type="type"> url of the controller action</param>
            /// <param name="type" type="type"> GET/POST</param>
            /// <param name="model" type="type"> deed object</param>
            $m.settings.common.ajaxFunction(url, type,null, model,true);
        },
        
        
    };
    
    return $m;

}(window.Welkin, window.Welkin.$,window.Welkin.AccountHandler || {}));