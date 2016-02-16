window.Welkin.DeedHandler =  (function($scope, $, $m) {

    $m = {
        deedModel : {},
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
                    $m.deedModel.CaseTypeId = $("#ddlType").data("kendoDropDownList").value();
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
        },
        populateDeedDropdown: function(a) {

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
            $m.settings.common.showNotification("Record Successfully Saved", "success");
        },
          saveDeedLedger: function (url, type, model) {
            $m.settings.common.ajaxFunction(url, type,null, model,true);
        },
        searchDeedResponse:function (data) {
            debugger;
        }
        
    };

    return $m;
}(window.Welkin, window.Welkin.$,window.Welkin.DeedHandler || {}));