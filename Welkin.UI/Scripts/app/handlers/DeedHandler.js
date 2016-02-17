window.Welkin.DeedHandler =  (function($scope, $, $m) {

    $m = {
        deedModel : {},
        multipleSearchResult:{},
        masterData:{},
        init: function(options) {
           // alert("DeedHandler");
            this.settings = $scope.$.extend(true, {

            }, options);
            if (this.settings.sAgent) {
                this.settings.sAgent.registerEvents([
                    {
                        name: "PopulateDeedDropdown",
                        fn: this.populateDeedDropdown
                    },
                    {
                        name: "notify",
                        fn: this.notify
                    },
                     {
                        name:"searchDeedResponse",
                        fn:this.searchDeedResponse
                    }                  

                ]);
                this.settings.sAgent.start();
            }
            
             $m.initControlls();
             
                $(".save-deed").click(function () {
                   
                    // Validate Type
                if ($("#ddlType").data("kendoDropDownList").value() == "") {
                    $m.settings.common.showNotification("Deed Type Required", "warning");
                    return;
                } else {
                    $m.deedModel.DeedTypeId = $("#ddlType").data("kendoDropDownList").value();
                }
                
                if ($("#ddlGrantee").data("kendoDropDownList").value() == "") {
                    $m.settings.common.showNotification("Grantee Required", "warning");
                    return;
                } else {
                    $m.deedModel.GranteeId = $("#ddlGrantee").data("kendoDropDownList").value();
                }
                
                 if ($("#ddlGrantor").data("kendoDropDownList").value() == "") {
                    $m.settings.common.showNotification("Grantor Required", "warning");
                    return;
                } else {
                    $m.deedModel.GrantorId = $("#ddlGrantor").data("kendoDropDownList").value();
                }
                
                 if ($("#ddlDistrict").data("kendoDropDownList").value() == "") {
                    $m.settings.common.showNotification("District Required", "warning");
                    return;
                } else {
                    $m.deedModel.DistrictId = $("#ddlDistrict").data("kendoDropDownList").value();
                }
                
                 // Validate DeedNumber
                if ($("#txtDeedNo").val() == "") {
                    $m.settings.common.showNotification("Grantor Required", "warning");
                    return;
                } else {
                    $m.deedModel.DeedNumber = $("#txtDeedNo").val();
                }
                
                 if ($("#txtNameOfLand").val() == "") {
                    $m.settings.common.showNotification("Name of Land Required", "warning");
                    return;
                } else {
                    $m.deedModel.NameOfLand = $("#txtNameOfLand").val();
                }
                
                  if ($("#txtConsideration").val() == "") {
                    $m.settings.common.showNotification("Consideration Required", "warning");
                    return;
                } else {
                    $m.deedModel.Consideration = $("#txtConsideration").val();
                }
                
                 if ($("#txtStampDuty").val() == "") {
                    $m.settings.common.showNotification("Stap Duty Required", "warning");
                    return;
                } else {
                    $m.deedModel.StampDuty = $("#txtStampDuty").val();
                }
                
                 if ($("#txtFee").val() == "") {
                    $m.settings.common.showNotification("Fee Required", "warning");
                    return;
                } else {
                    $m.deedModel.Fee = $("#txtFee").val();
                }
                    if ($("#txtRemarks").val() == "") {
                    $m.settings.common.showNotification("Remarks Required", "warning");
                    return;
                } else {
                    $m.deedModel.Remarks = $("#txtRemarks").val();
                }
                
                 $m.deedModel.Date = $("#date").data("kendoDatePicker").value();
                 $m.deedModel.Availability = $("#chkAvailability").prop('checked');
                 $m.deedModel.RegisterOn = $("#dtRegisterOn").data("kendoDatePicker").value();
                    
                 $m.saveDeedLedger('/DeedLedger/SaveDeedLedger', 'POST', $m.deedModel); 
                });
                
                
            $("#btn-search-deed").click(function () {
                if ($("#txt-search-deed-no").val() == "") {
                    alert("Search field should not be empty");
                } else {
                    var searchQuery = "SELECT * FROM Deed d WHERE CONTAINS(d.DeedNumber,'" + $("#txt-search-deed-no").val() + "')";
                    $m.settings.common.ajaxFunction('/DeedLedger/GetDeeds', 'POST', null, searchQuery,false);
                }
            });
        },
        initControlls:function () {
             /// <summary>
            /// Initialize the controls 
            /// </summary>
            $("#ddlType").kendoDropDownList({
            dataTextField: "Name",
            dataValueField: "ID",
            optionLabel:"Select a Deed Type",
            index: 0
        });

        $("#ddlGrantee").kendoDropDownList({
            dataTextField: "Name",
            dataValueField: "ID",
            optionLabel:"Select a Grantee",
            index: 0
        });

        $("#ddlGrantor").kendoDropDownList({
            dataTextField: "Name",
            dataValueField: "ID",
            optionLabel:"Select a Grantor",
            index: 0
        });

        $("#ddlDistrict").kendoDropDownList({
            dataTextField: "Name",
            dataValueField: "ID",
            optionLabel:"Select a District",
            index: 0
        });

        $("#chkAvailability").checkboxpicker();
        
        $("#grdDeedMultipleResult").kendoGrid({
                // dataSource: {
                //     data: $m.multipleSearchResult,
                //     pageSize: 5
                //  },
                pageable: {
                    input: false,
                    numeric: true
                },
                columns: [
                   { field: "id", hidden: true, },
                   { field: "DeedNumber", title: "Case Number", width: 50 },
                   { field: "DeedTypeName", title: "Type", width: 70 },
                   { field: "GranteeName", title: "Grantee", width: 100 },
                   { field: "GrantorName", title: "Grantor", width: 200 },
                   { field: "DistrictName", title: "District", width: 100 },
                   { field: "NameOfLand", title: "Land Name", width: 100 }
                  ],
                  selectable:"row",
                   change: function (e) {
                    /// <summary>
                    /// Bind Selected data to form
                    /// </summary>
                    /// <param name="e" type="type"></param>
                   var selectedRow = this.select();
                   if(selectedRow)
                   $m.bindDeedData(this.dataItem(selectedRow));
                  $("#displayMultipleDeedSearchResult").modal('toggle');
                }
            });
        
        },
        populateDeedDropdown: function(a) {
             /// <summary>
            /// Callback function for Get Master data
            /// </summary>
             /// <param name="data" type="type">  response Json string</param>
            $m.masterData = JSON.parse(JSON.parse(a).JsonResult)[0];
                            
            var deedTypes = JSON.parse(JSON.parse(a).JsonResult)[0].DeedTypes;
            var grantees = JSON.parse(JSON.parse(a).JsonResult)[0].Grantees;
            var grantors = JSON.parse(JSON.parse(a).JsonResult)[0].Grantors;
            var districts = JSON.parse(JSON.parse(a).JsonResult)[0].Districts;

            var ddl = $("#ddlType").data("kendoDropDownList");
            ddl.setDataSource(deedTypes);
            ddl.refresh();

            var ddlGrantee = $("#ddlGrantee").data("kendoDropDownList");
            ddlGrantee.setDataSource(grantees);
            ddlGrantee.refresh();

            var ddlGrantor = $("#ddlGrantor").data("kendoDropDownList");
            ddlGrantor.setDataSource(grantors);
            ddlGrantor.refresh();

            var ddlDistrict = $("#ddlDistrict").data("kendoDropDownList");
            ddlDistrict.setDataSource(districts);
            ddlDistrict.refresh();
        },
        notify:function(d){
            if(JSON.parse(d).Result){
                $m.settings.common.showNotification("Record Successfully Saved", "success");
            }
            else{
                 $m.settings.common.showNotification("Record Saving Failed", "error");
            }
            $m.clearDeedForm();
        },
          saveDeedLedger: function (url, type, model) {
            /// <summary>
            /// Call ajax function to save deed
            /// </summary>
            /// <param name="url" type="type"> url of the controller action</param>
            /// <param name="type" type="type"> GET/POST</param>
            /// <param name="model" type="type"> deed object</param>
            $m.settings.common.ajaxFunction(url, type,null, model,true);
        },
        searchDeedResponse:function (data) {
             /// <summary>
            /// Callback function for deed search responseS
            /// </summary>
             /// <param name="data" type="type"> search response Json string</param>
            var deeds = JSON.parse(JSON.parse(data).JsonResult);
            var deedsLength = deeds.length;
 
            if(deedsLength > 1){
                $m.setMultipleSearchDataSource(deeds);
            }
            else if(deedsLength > 0){
                $m.bindDeedData(deeds[0]);
            }else{
                $m.settings.common.showNotification("No Results Found", "info");
            }
            
        },
        bindDeedData:function(deedObj){
             /// <summary>
            /// Bind deed data to the form using object
            /// </summary>
            $m.deedModel = deedObj;
            if($("#ddlType").data("kendoDropDownList"))
            $("#ddlType").data("kendoDropDownList").value($m.deedModel.DeedTypeId);
            
            if($("#ddlGrantee").data("kendoDropDownList"))
            $("#ddlGrantee").data("kendoDropDownList").value($m.deedModel.GranteeId);
            
            if($("#ddlGrantor").data("kendoDropDownList"))
            $("#ddlGrantor").data("kendoDropDownList").value($m.deedModel.GrantorId);
            
            if($("#ddlDistrict").data("kendoDropDownList"))
             $("#ddlDistrict").data("kendoDropDownList").value($m.deedModel.DistrictId);
           
            if($("#txtDeedNo"))
            $("#txtDeedNo").val($m.deedModel.DeedNumber);
            
            if($("#txtNameOfLand"))
            $("#txtNameOfLand").val($m.deedModel.NameOfLand);
            
            if($("#txtConsideration"))
            $("#txtConsideration").val($m.deedModel.Consideration);
            
            if($("#txtStampDuty"))
            $("#txtStampDuty").val($m.deedModel.StampDuty);
            
            if($("#txtFee"))
            $("#txtFee").val($m.deedModel.Fee);
            
            if($("#txtRemarks"))
            $("#txtRemarks").val($m.deedModel.Remarks);
            
            if($("#date").data("kendoDatePicker"))
            $("#date").data("kendoDatePicker").value($m.deedModel.Date);
            
            if($("#dtRegisterOn").data("kendoDatePicker"))
            $("#dtRegisterOn").data("kendoDatePicker").value($m.deedModel.RegisterOn);
            
             if($m.deedModel.Availability)
            $("#chkAvailability").prop('checked', true);
           else
            $("#chkAvailability").prop('checked', false);   
              
             $("#txt-search-deed-no").val(""); 
        },
        setMultipleSearchDataSource:function(deedList){
             /// <summary>
            /// Set MultipleSearchResult datasource and refresh the grid
            /// </summary>
           
           for (var i = 0, x = deedList.length; i < x; i++){
              // Refil the deed object using master data
              deedList[i].DeedTypeName =  $.grep($m.masterData.DeedTypes,function (e) {return e.ID === deedList[i].DeedTypeId;})[0].Name;
              deedList[i].GranteeName =  $.grep($m.masterData.Grantees,function (e) {return e.ID === deedList[i].GranteeId;})[0].Name;
              deedList[i].GrantorName =  $.grep($m.masterData.Grantors,function (e) {return e.ID === deedList[i].GrantorId;})[0].Name;
              deedList[i].DistrictName =  $.grep($m.masterData.Districts,function (e) {return e.ID === deedList[i].DistrictId;})[0].Name;
                          
           }
           $m.multipleSearchResult = deedList;
           
           //Set multiple search result grid data source
             var dataSource = new kendo.data.DataSource({
                data: $m.multipleSearchResult,
                pageSize: 10
            });
             $("#grdDeedMultipleResult").data("kendoGrid").dataSource = dataSource;
            dataSource.read();
            $("#grdDeedMultipleResult").data("kendoGrid").refresh();
            //Open Popup
            $("#displayMultipleDeedSearchResult").modal('toggle');
        },
        clearDeedForm:function () {
            
            //Clear Deed Form Data
             if($("#ddlType").data("kendoDropDownList"))
            $("#ddlType").data("kendoDropDownList").select(0);
            
             if($("#ddlGrantee").data("kendoDropDownList"))
            $("#ddlGrantee").data("kendoDropDownList").select(0);
            
            if($("#ddlGrantor").data("kendoDropDownList"))
            $("#ddlGrantor").data("kendoDropDownList").select(0);
            
            if($("#ddlDistrict").data("kendoDropDownList"))
             $("#ddlDistrict").data("kendoDropDownList").select(0);
           
            if($("#txtDeedNo"))
            $("#txtDeedNo").val("");
            
            if($("#txtNameOfLand"))
            $("#txtNameOfLand").val("");
            
            if($("#txtConsideration"))
            $("#txtConsideration").val("");
            
            if($("#txtStampDuty"))
            $("#txtStampDuty").val("");
            
            if($("#txtFee"))
            $("#txtFee").val("");
            
            if($("#txtRemarks"))
            $("#txtRemarks").val("");
            
            if($("#date").data("kendoDatePicker"))
            $("#date").data("kendoDatePicker").value("");
            
            if($("#dtRegisterOn").data("kendoDatePicker"))
            $("#dtRegisterOn").data("kendoDatePicker").value("");
            
            $("#chkAvailability").prop('checked', true);
            
        }
        
    };

    return $m;
}(window.Welkin, window.Welkin.$,window.Welkin.DeedHandler || {}));