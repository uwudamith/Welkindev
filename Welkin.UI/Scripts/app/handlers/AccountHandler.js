window.Welkin.AccountHandler = (function($scope, $, $m) {
    
    $m = {
         masterData: {},
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
                        name: "masterDataResponse",
                        fn: this.masterDataResponse
                    },
                    {
                        name:"notifyAccount",
                        fn:this.notifyAccount
                    }
                ]);
                this.settings.sAgent.start();
            }
            $m.initControlls(); 
            
              $("#grdStampDuty").on("click", ".btn-edit", function (e) {
                    e.preventDefault();
                    var dataItem = $("#grdStampDuty").data("kendoGrid").dataItem($(e.currentTarget).closest("tr"));
                    $m.openStampDutyPopup(dataItem);
             });     
             
                $("#grdStampDuty").on("click", ".btn-delete", function (e) {
                    e.preventDefault();
                    var dataItem = $("#grdStampDuty").data("kendoGrid").dataItem($(e.currentTarget).closest("tr"));
                    $m.deleteStampDuty(dataItem);
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
        },
        initControlls:function () {
            
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
            dataSource: {
                data: [],
            },
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
           var res = JSON.parse(params).Result;
           if(res=== true)
            $m.settings.common.ajaxFunction('/Account/LoadMasterData', 'POST', null, null,false);
        },
         masterDataResponse:function (data) {
              /// <summary>
            /// Callback function for Get Master data
            /// </summary>
             /// <param name="data" type="type">  response Json string</param>
          $m.masterData = JSON.parse(JSON.parse(data).JsonResult)[0];
          if($m.masterData){
               $m.setStampDutyGridDataSource();
          }
          
          
        },
        //Stamp Duty Section
        clearStampDuty : function () {
            $("#hdnStampDutyId").val("");
            $("#txtRangeMin").val("");
            $("#txtRangeMax").val("");
            $("#txtPercentage").val("");
            //$("#hdnUUID").val("");
        },
         openStampDutyPopup : function (data) {
            var splited = data.Range.split("-");
            $("#hdnStampDutyId").val(data.ID);
            $("#txtRangeMin").val(splited[0]);
            $("#txtRangeMax").val(splited[1]);
            $("#txtPercentage").val(data.Percentage);
            $('#addStampDuty').modal('toggle');
        },
       
        saveStampDuty:function (guid) {
            //Save stamp duty data
            if ($("#txtRangeMin").val() == "") {
                 $m.settings.common.setValidationMessages("val-messageStampDuty","warning","Min Value Required");
                return;
            }

            if ($("#txtRangeMax").val() == "") {
                  $m.settings.common.setValidationMessages("val-messageStampDuty","warning","Max Value Required");
                return;
            }
         
             if(parseInt($("#txtRangeMin").val()) >= parseInt($("#txtRangeMax").val())){
                    $m.settings.common.setValidationMessages("val-messageStampDuty","warning","Max Value must be Greater than Min Value");
                return;
            }

            if ($("#txtPercentage").val() == "") {
                  $m.settings.common.setValidationMessages("val-messageStampDuty","warning","Percentage Required");
                return;
            }
         var stampDuty = { 
                    Range: $("#txtRangeMin").val() +"-"+ $("#txtRangeMax").val(),
                    Percentage :$("#txtPercentage").val()
             };
         
            if(guid != ""){
                 stampDuty.ID = guid;
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
                        $m.masterData.Stampduty.splice(i,1);     
                        $m.setStampDutyGridDataSource(); 
                         $m.saveMasterData("/Account/SaveAccountMasterData","POST",$m.masterData);
                         return;
                    }
                }
             
        }
        // End of Stam Duty Section
        
        
    };
    
    return $m;

}(window.Welkin, window.Welkin.$,window.Welkin.AccountHandler || {}));