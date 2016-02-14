window.Welkin.CaseHandler = (function ($scope, $, $m) {
    /// <summary>
    ///     Case ledger handler
    /// </summary>
    /// <param name="$scope">Application Scope </param>
    /// <param name="$">jQuery</param> 
    
   
    $m = {

        // Data source for nextsteps
        nextStepDataSource: [],

        init: function (options) {
            //alert("CaseHandler");
            this.settings = $scope.$.extend(true, {

            }, options);
            if (this.settings.sAgent) {
                this.settings.sAgent.registerEvents([
                    {
                        name: "PopulateCaseDropdown",
                        fn: this.populateCaseDropdown
                    },
                    {
                        name: "notify",
                        fn: this.notify
                    }
                ]);
                this.settings.sAgent.start();
            }

            $(":checkbox").checkboxpicker();

            var masterData = null;

            $("#files").kendoUpload({
                async: {
                    saveUrl: "save",
                    removeUrl: "remove",
                    autoUpload: true
                }
            });

            $("#caseSteps").kendoGrid({
                dataSource: {
                    data: $m.nextStepDataSource,
                    pageSize: 5
                },
                pageable: {
                    input: false,
                    numeric: true
                },
                columns: [
                    { field: "StepId", hidden: true, },
                    { field: "SendNotifications", hidden: true, },
                    { field: "NextStep", title: "Next Step",width:200 },
                    { field: "Fee", title: "Fee",width: 100 },
                    { field: "DueDate", width: 130, title: "Due on", template: "#= kendo.toString(kendo.parseDate(DueDate, 'yyyy-MM-dd'), 'MM/dd/yyyy') #" },
                    { field: "ByWhom", title: "By Whom", template: kendo.template($("#usersTemplate").html()) },
                    { field: "Tasks", width: 50, title: "Task", template: "<a href='\\#'><span class='glyphicon glyphicon-calendar pull-right'></span></a>" },
                    { field: "Status", width: 70, title: "Status", template: kendo.template($("#statusTemplate").html()) },
                    { command: { text: "", template: "<button class='btn btn-primary btn-edit'> <i class='glyphicon glyphicon glyphicon-edit'></i></button>" }, title: " ", width: 50},
                    { command: { text: "", template: "<button class='btn btn-danger btn-delete'> <i class='glyphicon glyphicon glyphicon-remove-sign'></i></button>" }, title: " ", width: 50}
                ]
            });


            var createNextStepData = function (guid) {
                /// <summary>
                /// Create next step data with passing guid
                /// </summary>
                /// <param name="guid" type="type"></param>
                var nextStepModel = {};

                nextStepModel.StepId = guid;
                if ($("#txtNextStep").val() == "") {
                    alert('Please enter step name');
                    return;
                } else {
                    nextStepModel.NextStep = $("#txtNextStep").val();
                }

                nextStepModel.DueDate = $("#dtDueOnDate").data("kendoDatePicker").value();
                nextStepModel.Status = '1';
                nextStepModel.ByWhom = $("#ddlUsers").data("kendoMultiSelect").dataItems();
                nextStepModel.Fee = $("#txtFee").val();
                nextStepModel.SendNotifications = $("#chkNotification").prop('checked');
                if ($m.addToCaseItems(nextStepModel)) {
                    $('#addStepModel').modal('toggle');
                }
            }

            // Save next step click function
            $("#save-step").click(function () {
                $m.settings.common.createGUID(createNextStepData);
            });

            // After step model close function
            $('#addStepModel').on('hidden.bs.modal', function () {
                $m.clearAddStepData();
            })

            // create DropDownList from input HTML element
            $("#ddlType").kendoDropDownList({
                dataTextField: "Name",
                dataValueField: "ID",
                optionLabel: "Select Case Type",
                index: 0
            });

            $("#ddlParty").kendoDropDownList({
                dataTextField: "Name",
                dataValueField: "ID",
                optionLabel: "Select Party",
                index: 0
            });

            $("#ddlCourt").kendoDropDownList({
                dataTextField: "Name",
                dataValueField: "ID",
                optionLabel: "Select Court",
                index: 0
            });

            $("#ddlUsers").kendoMultiSelect({
                dataTextField: "Name",
                dataValueField: "Id",
                index: 0
            });

            // On save-case click function
            $(".save-case").click(function () {

                var caseModel = {};

                // Validate Type
                if ($("#ddlType").data("kendoDropDownList").value() == "") {
                    alert("Please select Type");
                    return;
                } else {
                    caseModel.CaseTypeId = $("#ddlType").data("kendoDropDownList").value();
                }

                // Validate Party
                if ($("#ddlParty").data("kendoDropDownList").value() == "") {
                    alert("Please select Party");
                    return;
                } else {
                    caseModel.PartyId = $("#ddlParty").data("kendoDropDownList").value();
                }

                // Validate CaseNumber
                if ($("#txtCaseNo").val() == "") {
                    alert("Please enter Case Number");
                    return;
                } else {
                    caseModel.CaseNumber = $("#txtCaseNo").val();
                }

                // Validate Court
                if ($("#ddlCourt").data("kendoDropDownList").value() == "") {
                    alert("Please select Court");
                    return;
                } else {
                    caseModel.CourtId = $("#ddlCourt").data("kendoDropDownList").value();
                }

                caseModel.StartDate = $("#dtStartDate").data("kendoDatePicker").value();
                caseModel.Description = $("#txtDescription").val();
                caseModel.SendAutomaticReminders = $("#chkSendReminders").prop('checked');
                caseModel.CaseSteps = $m.getCaseStepsData();

                $m.saveCaseLedger('/CaseLedger/SaveCaseLedger', 'POST', caseModel);
            });

            var clearPartyModel = function () {
                $("#txtUserName").val("");
                $("#txtAddress").val("");
                $("#txtEmail").val("");
                $("#txtContactNumber").val("");
                return true;
            };
            var savePartyData = function (guid) {
                var partyObj = {};
                if ($("#txtUserName").val() == "") {
                    alert("Please enter party name");
                    return;
                } else {
                    partyObj.Id = guid;
                    partyObj.Name = $("#txtUserName").val();
                    partyObj.Address = $("#txtAddress").val();
                    partyObj.Email = $("#txtEmail").val();
                    partyObj.ContactNumber = $("#txtContactNumber").val();
                }
                
                // Push to master data global variable
                var party = $m.masterData.Parties;
                party.push(partyObj);

                // Adding to party data source
                $("#ddlParty").data("kendoDropDownList").dataSource.insert(partyObj);

                // Clear party model data
                if (clearPartyModel()) {
                    $('#addPartyModel').modal('toggle');
                    // Calling the save master data function
                    $m.settings.common.saveMasterData(null, $m.masterData);
                }
            };

            $("#save-party").click(function () {
                $m.settings.common.createGUID(savePartyData);
            });

            $("#btn-search-case").click(function () {
                if ($("#txt-search-case-no").val() == "") {
                    alert("Search field should not be empty");
                } else {
                    var searchQuery = "SELECT * FROM c WHERE CONTAINS(c.CaseNumber,'" + $("#txt-search-case-no").val() + "')";
                    $m.settings.common.ajaxFunction('/CaseLedger/GetCases', 'POST', null, searchQuery,false);
                }
            });
        },
        populateCaseDropdown: function (a) {
            $m.masterData = JSON.parse(JSON.parse(a).JsonResult)[0];

            var caseTypes = JSON.parse(JSON.parse(a).JsonResult)[0].CaseTypes;
            var courts = JSON.parse(JSON.parse(a).JsonResult)[0].Courts;
            var parties = JSON.parse(JSON.parse(a).JsonResult)[0].Parties;

            var statusData = [
                { Name: "Pending", Id: "1" },
                { Name: "Completed", Id: "2" },
            ];

            var usersData = new kendo.data.DataSource({
                data: [
                    { Name: "Damith", Id: "1" },
                    { Name: "Janith", Id: "2" },
                    { Name: "Dimuthu", Id: "3" }
                ]
            });

            var ddl = $("#ddlType").data("kendoDropDownList");
            ddl.setDataSource(caseTypes);
            ddl.refresh();

            var ddlCourt = $("#ddlCourt").data("kendoDropDownList");
            ddlCourt.setDataSource(courts);
            ddlCourt.refresh();

            var ddlParty = $("#ddlParty").data("kendoDropDownList");
            ddlParty.setDataSource(parties);
            ddlParty.refresh();

            //var ddlStatus = $("#ddlStatus").data("kendoDropDownList");
            //ddlStatus.setDataSource(statusData);
            //ddlStatus.refresh();

            var ddlUsers = $("#ddlUsers").data("kendoMultiSelect");
            ddlUsers.setDataSource(usersData);
            ddlUsers.refresh();

        },
        addToCaseItems: function (data) {
            /// <summary>
            /// Add next step data
            /// </summary>
            /// <param name="data" type="type"></param>
            /// <returns type=""></returns>
            $m.nextStepDataSource.push(data);
            $("#caseSteps").data("kendoGrid").dataSource.read();
            $("#caseSteps").data("kendoGrid").refresh();
            return true;
        },
        clearAddStepData: function () {
            //Clear step name textbox
            $("#txtNextStep").val("");
            // Set today date to due date datepicker
            var todayDate = kendo.toString(kendo.parseDate(new Date()), 'MM/dd/yyyy');
            $("#dtDueOnDate").data("kendoDatePicker").value(todayDate);
            // Remove selected indexes from multi select
            $("#ddlUsers").data("kendoMultiSelect").value([]);
            // Set status to pending
            //$("#ddlStatus").data("kendoDropDownList").select(0);
            //Clear fee
            $("#txtFee").val("");
            $("#chkNotification").prop('checked', true);

        },
        saveCaseLedger: function (url, type, model) {
            $m.settings.common.ajaxFunction(url, type,null, model,true);
        },
        getCaseStepsData: function () {
            return $m.nextStepDataSource;
        },
        searchCaseResponse:function(data){
            
        },
        notify: function (d) {
            $m.settings.common.showNotification("Record Successfully Saves","success")
            //var ss = JSON.parse(JSON.parse(d).JsonResult)
           // debugger;
        }
    };

    return $m;

} (window.Welkin, window.Welkin.$, window.Welkin.CaseHandler || {}));