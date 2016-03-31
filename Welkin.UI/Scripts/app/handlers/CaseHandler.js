window.Welkin.CaseHandler = (function ($scope, $, $m) {
    /// <summary>
    ///     Case ledger handler
    /// </summary>
    /// <param name="$scope">Application Scope </param>
    /// <param name="$">jQuery</param> 


    $m = {

        // Data source for nextsteps
        nextStepDataSource: [],
        stepTaskItems: [],
        caseModel: {},
        masterData: {},
        multipleSearchResult: {},
        uploadedFiles: [],
        attachmentsToDelete: [],
        blobEndPoint: {},
        // eventsToSave:[],
        eventsToDelete: [],


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
                    },
                    {
                        name: "searchCaseResponse",
                        fn: this.searchCaseResponse
                    },
                    {
                        name: "browseCaseResponse",
                        fn: this.browseCaseResponse
                    },
                        {
                            name: "nextCaseNumberReponse",
                            fn: this.nextCaseNumberReponse
                        },
                    {
                        name: "eventNotify",
                        fn: this.eventNotify
                    },
                    {
                        name: "getEventsByUserResponse",
                        fn: this.getEventsByUserResponse
                    }
                ]);
                this.settings.sAgent.start();
            }
            $m.blobEndPoint = $scope.Configs.blobEndPoint;
            // Initialize controlls
            $m.initControlls();

            $('.chkStatus').change(function (e) {

            });

            $("#caseSteps").on("click", ".btn-task", function (e) {
                e.preventDefault();
                var dataItem = $("#caseSteps").data("kendoGrid").dataItem($(e.currentTarget).closest("tr"));
                $m.setStepTaskModelData(dataItem);
            });



            // Save next step click function
            $("#save-step").click(function () {
                if ($("#hdnStepId").val() == "") {
                    $m.settings.common.createGUID($m.createNextStepData);
                } else {
                    $m.createNextStepData();
                }

            });

            // After step model close function
            $('#addStepModel').on('hidden.bs.modal', function () {
                $m.clearAddStepData();
            })

            // After step model close function
            $('#addStepTasks').on('hidden.bs.modal', function () {
                $m.clearStepsTaskModel();
                $m.addTasksToNextItemGrid($("#hdnNextItemId").val(), $m.stepTaskItems);
                $m.stepTaskItems = [];
                $m.setstepTaskDataSource();
                $m.refreshNextStepGrid();
            })

            // On save-case click function
            $(".save-case").click(function () {
                $m.prepareCaseModel();
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
                    $m.settings.common.setValidationMessages("val-message-add-party", "warning", "Please enter party name");
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
                    $m.settings.common.showNotification("Search field should not be empty", "success");
                } else {
                    var searchQuery = "SELECT * FROM Data d WHERE CONTAINS(LOWER(d.CaseNumber),LOWER('" + $("#txt-search-case-no").val() + "')) AND d.Type='Case' AND d.ClientId = '"+$scope.Configs.ClientId+"'";
                    $m.settings.common.ajaxFunction('/CaseLedger/GetCases', 'POST', null, searchQuery, false);
                }
            });

            $("#add-step-items").click(function () {
                if ($("#hdnTaskId").val() == "") {
                    $m.settings.common.createGUID($m.createStepTaskObj);
                } else {
                    $m.createStepTaskObj();
                }
            });

            // Delete next step items
            $("#caseSteps").on("click", ".btn-delete", function (e) {
                e.preventDefault();
                var dataItem = $("#caseSteps").data("kendoGrid").dataItem($(e.currentTarget).closest("tr"));
                $m.deleteNextStepItem(dataItem);
            });

            // Delete next step items
            $("#caseSteps").on("click", ".btn-edit", function (e) {
                e.preventDefault();
                var dataItem = $("#caseSteps").data("kendoGrid").dataItem($(e.currentTarget).closest("tr"));
                $m.setNextStepData(dataItem);
            });

            // Edit step task items
            $("#grdStepsTasks").on("click", ".btn-edit", function (e) {
                e.preventDefault();
                var dataItem = $("#grdStepsTasks").data("kendoGrid").dataItem($(e.currentTarget).closest("tr"));
                $m.setStepTaskSelectedData(dataItem);
            });

            // Add/Edit Event
            $("#caseSteps").on("click", ".btn-event", function (e) {
                e.preventDefault();
                var dataItem = $("#caseSteps").data("kendoGrid").dataItem($(e.currentTarget).closest("tr"));
                $m.setEventModelControls(dataItem);
            });

            // Delete step task items
            $("#grdStepsTasks").on("click", ".btn-delete", function (e) {
                e.preventDefault();
                var dataItem = $("#grdStepsTasks").data("kendoGrid").dataItem($(e.currentTarget).closest("tr"));
                $m.deleteStepTaskItem(dataItem);
            });

            $("#btnCaseBrowse").click(function () {
                var searchQuery = "SELECT * FROM Data d WHERE d.Type='Case' AND d.ClientId = '"+$scope.Configs.ClientId+"'";
                $m.settings.common.ajaxFunction('/CaseLedger/BrowseCases', 'POST', null, searchQuery, false);
                $('#browseModal').modal('toggle');

            });
            $("#btnBrowseSearch").click(function () {
                var searchQuery = "SELECT * FROM Data d";
                var whereClause = $m.buildBrowseQuery();
                if (whereClause != "")
                    searchQuery = searchQuery + " " + whereClause;
                $m.settings.common.ajaxFunction('/CaseLedger/BrowseCases', 'POST', null, searchQuery, false);


            });

            $("#btnUploadPopup").click(function () {
                $('#uploadModel').modal('toggle');
                return false;
            });

            $("#liPhotos").click(function () {
                var length = $m.setAttachmentDataSource("photos");
                if (length > 0)
                    $('#viewAttachmentModel').modal('toggle');
                else
                    $m.settings.common.showNotification("No Attachments to Show", "info");

                return false;
            });

            $("#liDocuments").click(function () {
                var length = $m.setAttachmentDataSource("documents");
                if (length > 0)
                    $('#viewAttachmentModel').modal('toggle');
                else
                    $m.settings.common.showNotification("No Attachments to Show", "info");

                return false;
            });

            $("#grdViewAttachments").on("click", ".btn-delete", function (e) {
                e.preventDefault();
                var dataItem = $("#grdViewAttachments").data("kendoGrid").dataItem($(e.currentTarget).closest("tr"));
                if (dataItem) {
                    var data = $.grep($m.attachmentsToDelete, function (d) { return d.Name === dataItem.Name; });
                    if (data.length < 1) {
                        if ($m.caseModel.id)
                            $m.attachmentsToDelete.push(dataItem);

                    
                    }
                    $m.uploadedFiles = $.grep($m.uploadedFiles, function (e) {
                        return e.Name != dataItem.Name;
                    });
                    $m.showUploadedFiles();
                    if (dataItem.Type.toLowerCase().indexOf("image") < 0)
                        $m.setAttachmentDataSource("documents");
                    else
                        $m.setAttachmentDataSource("photos");

                }
            });

            $("#grdViewAttachments").on("click", ".btn-download", function (e) {
                e.preventDefault();
                var dataItem = $("#grdViewAttachments").data("kendoGrid").dataItem($(e.currentTarget).closest("tr"));

                var params = {};
                params.client = "client1";
                params.file = JSON.stringify(dataItem);
                $m.settings.common.ajaxFunctionMultiParam('/CaseLedger/DownloadFiles', 'POST', $m.downloadFile, params);

            });

            $('#uploadModel').on('hidden.bs.modal', function () {
                $(".k-upload-files.k-reset").find("li").remove();
            });

            $("#txtFee").keydown(function (e) {
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
            $("#save-event").click(function () {
                $m.saveEvent();
                return false;
            });

            $('#addEventModel').on('hidden.bs.modal', function () {
                $("#txtEventTitle").val("");
                $("#dtStartDateTime").data("kendoDateTimePicker").value("");
                $("#dtEndDateTime").data("kendoDateTimePicker").value("");
                $("#txtEventDescription").val("");
                $("#ddlEventAttendees").data("kendoMultiSelect").value([]);
            })
            $(".modal").draggable({ handle: ".modal-header" });

        },
        // Initilize controlls
        initControlls: function () {

            $("#caseFileUpload").kendoUpload({
                async: {
                    saveUrl: "/CaseLedger/SaveUploadFiles",
                    //removeUrl: "remove",
                    autoUpload: true
                },
                upload: $m.onFileUpload,
                success: $m.onUploadSuccess
            });
            $("#chkNotification").checkboxpicker();
            $("#chkSendReminders").checkboxpicker();

            $('#chkStatus').checkboxpicker({
                html: true,
                offLabel: '<span>Pending</span>',
                onLabel: '<span>Completed</span>'
            });

            $('.chkTaskStatus').checkboxpicker({
                html: true,
                offLabel: '<span>Pending</span>',
                onLabel: '<span>Completed</span>'
            });

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
                    { field: "NextStep", title: "Next Step", width: 200 },
                    { field: "Fee", title: "Fee", width: 100 },
                    { field: "DueDate", width: 130, title: "Due on", template: "#= kendo.toString(kendo.parseDate(DueDate, 'yyyy-MM-dd'), 'MM/dd/yyyy') #" },
                    { field: "ByWhom", title: "By Whom", template: kendo.template($("#usersTemplate").html()) },
                    { command: { text: "", template: "<button class='btn btn-primary btn-event'> <i class='glyphicon glyphicon glyphicon-calendar'></i></button>" }, width: 70 },
                    { command: { text: "", template: "<button class='btn btn-primary btn-task'> <i class='glyphicon glyphicon glyphicon-edit'></i></button>" }, title: "Task(s)", width: 70 },
                    { command: { text: "", template: "<button class='btn btn-primary btn-edit'> <i class='glyphicon glyphicon glyphicon-edit'></i></button>" }, title: " ", width: 50 },
                    { command: { text: "", template: "<button class='btn btn-danger btn-delete'> <i class='glyphicon glyphicon glyphicon-remove-sign'></i></button>" }, title: " ", width: 50 }
                ],
                dataBinding: function (e) {
                    /// <summary>
                    /// Set total fee value in textbox
                    /// </summary>
                    /// <param name="e" type="type"></param>
                    var data = this.dataSource.data();
                    var total = 0;
                    $(data).each(function (index, item) {

                        if (item.Fee != "")
                            total = total + parseInt(item.Fee);
                    });

                    $("#txtTotalFee").val(total);
                }
            });

            $("#grdStepsTasks").kendoGrid({
                dataSource: {
                    data: $m.stepTaskItems,
                    pageSize: 5
                },
                pageable: {
                    input: false,
                    numeric: true
                },
                columns: [
                   { field: "TaskId", hidden: true, },
                   { field: "Status", hidden: true, },
                   { field: "Description", title: "Description", width: 200 },
                   { field: "DueDate", width: 130, title: "Due on", template: "#= kendo.toString(kendo.parseDate(DueDate, 'yyyy-MM-dd'), 'MM/dd/yyyy') #" },
                   { field: "ByWhom", title: "By Whom", template: kendo.template($("#taskUsersTemplate").html()) },
                   { command: { text: "", template: "<button class='btn btn-primary btn-edit'> <i class='glyphicon glyphicon glyphicon-edit'></i></button>" }, title: " ", width: 50 },
                   { command: { text: "", template: "<button class='btn btn-danger btn-delete'> <i class='glyphicon glyphicon glyphicon-remove-sign'></i></button>" }, title: " ", width: 50 }
                ],
                dataBinding: function (e) {

                }
            });

            // create DropDownList from input HTML element
            $("#ddlType").kendoComboBox({
                dataTextField: "Name",
                dataValueField: "ID",
                placeholder: "Select Case Type",
                filter: "startswith",
                index: 0
            });

            $("#ddlParty").kendoComboBox({
                dataTextField: "Name",
                dataValueField: "ID",
                placeholder: "Select Party",
                filter: "startswith",
                index: 0
            });

            $("#ddlCourt").kendoComboBox({
                dataTextField: "Name",
                dataValueField: "ID",
                placeholder: "Select Court",
                filter: "startswith",
                index: 0
            });

            $("#ddlBrowseType").kendoComboBox({
                dataTextField: "Name",
                dataValueField: "ID",
                placeholder: "Select Case Type",
                filter: "startswith",
                index: 0
            });

            $("#ddlBrowseParty").kendoComboBox({
                dataTextField: "Name",
                dataValueField: "ID",
                placeholder: "Select Party",
                filter: "startswith",
                index: 0
            });

            $("#ddlBrowseCourt").kendoComboBox({
                dataTextField: "Name",
                dataValueField: "ID",
                placeholder: "Select Court",
                filter: "startswith",
                index: 0
            });

            $("#ddlUsers").kendoMultiSelect({
                dataTextField: "Name",
                dataValueField: "ID",
                index: 0
            });

            // create DropDownList from input HTML element
            $("#ddlTaskUsers").kendoMultiSelect({
                dataTextField: "Name",
                dataValueField: "ID",
                index: 0
            });

            $("#ddlEventAttendees").kendoMultiSelect({
                dataTextField: "Name",
                dataValueField: "ID",
                index: 0
            });


            $("#grdCaseMultipleResult").kendoGrid({
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
                   { field: "CaseNumber", title: "Case Number", width: 100 },
                   { field: "CaseTypeName", title: "Type", width: 100 },
                   { field: "CourtName", title: "Court", width: 100 },
                   { field: "PartyName", title: "Party", width: 200 },
                   { field: "StartDate", width: 130, title: "Start Date", template: "#= kendo.toString(kendo.parseDate(StartDate, 'yyyy-MM-dd'), 'MM/dd/yyyy') #" }
                ],
                selectable: "row",
                change: function (e) {
                    /// <summary>
                    /// Bind Selected data to form
                    /// </summary>
                    /// <param name="e" type="type"></param>
                    var selectedRow = this.select();
                    if (selectedRow)
                        $m.bindCaseData(this.dataItem(selectedRow));
                    $("#displayMultipleCaseSearchResult").modal('toggle');
                }
            });

            $("#grdBrowseMultipleResult").kendoGrid({

                pageable: true,
                columns: [
                   { field: "id", hidden: true, },
                   { field: "CaseNumber", title: "Case Number", width: 100 },
                   { field: "CaseTypeName", title: "Type", width: 100 },
                   { field: "CourtName", title: "Court", width: 100 },
                   { field: "PartyName", title: "Party", width: 200 },
                   { field: "StartDate", width: 130, title: "Start Date", template: "#= kendo.toString(kendo.parseDate(StartDate, 'yyyy-MM-dd'), 'MM/dd/yyyy') #" }
                ],
                selectable: "row",
                change: function (e) {
                    /// <summary>
                    /// Bind Selected data to form
                    /// </summary>
                    /// <param name="e" type="type"></param>
                    var selectedRow = this.select();
                    if (selectedRow)
                        $m.bindCaseData(this.dataItem(selectedRow));
                    $("#browseModal").modal('toggle');
                }

            });

            $("#grdViewAttachments").kendoGrid({
                pageable: {
                    input: false,
                    numeric: true
                },
                columns: [
                   { field: "Name", title: "Name", width: 100 },
                    { command: { text: "", template: "<button class='btn btn-primary btn-download'> <i class='glyphicon glyphicon glyphicon-download-alt'></i></button>" }, title: " ", width: 13 },
                   { command: { text: "", template: "<button class='btn btn-danger btn-delete'> <i class='glyphicon glyphicon glyphicon-remove-sign'></i></button>" }, title: " ", width: 13 }


                ],
                selectable: "row",

            });

            $("#dtStartDateTime").kendoDateTimePicker({
                // value:new Date()
            });

            $("#dtEndDateTime").kendoDateTimePicker({
                // value:new Date()
            });

        },
        populateCaseDropdown: function (a) {

            $m.masterData = JSON.parse(JSON.parse(a).JsonResult)[0];

            var caseTypes = JSON.parse(JSON.parse(a).JsonResult)[0].CaseTypes;
            var courts = JSON.parse(JSON.parse(a).JsonResult)[0].Courts;
            var parties = JSON.parse(JSON.parse(a).JsonResult)[0].Parties;

            var usersData = $m.masterData.Users;
            for (var i = 0, length = usersData.length; i < length; i++) {
                usersData[i].Name = usersData[i].FirstName + " " + usersData[i].LastName;
            }

            // new kendo.data.DataSource({
            //     data: [
            //         { Name: "Damith", Id: "1" },
            //         { Name: "Janith", Id: "2" },
            //         { Name: "Dimuthu", Id: "3" }
            //     ]
            // });

            var ddl = $("#ddlType").data("kendoComboBox");
            ddl.setDataSource(caseTypes);
            ddl.refresh();

            var ddlCourt = $("#ddlCourt").data("kendoComboBox");
            ddlCourt.setDataSource(courts);
            ddlCourt.refresh();

            var ddlParty = $("#ddlParty").data("kendoComboBox");
            ddlParty.setDataSource(parties);
            ddlParty.refresh();

            var ddlBrowseType = $("#ddlBrowseType").data("kendoComboBox");
            ddlBrowseType.setDataSource(caseTypes);
            ddlBrowseType.refresh();

            var ddlBrowseCourt = $("#ddlBrowseCourt").data("kendoComboBox");
            ddlBrowseCourt.setDataSource(courts);
            ddlBrowseCourt.refresh();

            var ddlBrowseParty = $("#ddlBrowseParty").data("kendoComboBox");
            ddlBrowseParty.setDataSource(parties);
            ddlBrowseParty.refresh();

            var ddlUsers = $("#ddlUsers").data("kendoMultiSelect");
            ddlUsers.setDataSource(usersData);
            ddlUsers.refresh();
            $m.getCurrentCaseNo();
        },
        getCurrentCaseNo: function () {
            var query = "SELECT TOP 1 d.CaseNumber FROM Data d  WHERE  d.Type='Case' AND d.ClientId = '"+$scope.Configs.ClientId+"' ORDER BY d.CreatedDate DESC";
           // debugger;
            $m.settings.common.ajaxFunction('/CaseLedger/GetCurrentCaseNumber', 'POST', null, query, false);
        },
        // Add next case next step item
        addToCaseItems: function (data) {
            /// <summary>
            /// Add next step data
            /// </summary>
            /// <param name="data" type="type"></param>
            /// <returns type=""></returns>

            // Check if record available
            if ($m.isStepAvaiable(data) == false) {
                $m.nextStepDataSource.push(data);
            }
            $m.refreshNextStepGrid();
            return true;
        },
        isStepAvaiable: function (data) {
            /// <summary>
            /// Check Step data and update
            /// </summary>
            /// <param name="data" type="type"></param>
            /// <returns type=""></returns>
            var isAvailable = false;
            for (var i = 0, length = $m.nextStepDataSource.length; i < length; i++) {
                if ($m.nextStepDataSource[i].StepId == data.StepId) {
                    $m.nextStepDataSource[i].NextStep = data.NextStep;
                    $m.nextStepDataSource[i].DueDate = data.DueDate;
                    $m.nextStepDataSource[i].ByWhom = data.ByWhom;
                    $m.nextStepDataSource[i].Fee = data.Fee;
                    $m.nextStepDataSource[i].SendNotifications = data.SendNotifications;
                    $m.nextStepDataSource[i].UpdatedDate = data.UpdatedDate;
                    isAvailable = true;
                    break;
                }
            }
            return isAvailable;
        },
        // Clear add step modal variables
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
        // save case ledger
        saveCaseLedger: function (url, type, model) {
            $m.settings.common.ajaxFunction(url, type, null, model, true);
        },
        // Rerieve case step data from data source
        getCaseStepsData: function () {
            return $m.nextStepDataSource;
        },
        searchCaseResponse: function (data) {

            var cases = JSON.parse(JSON.parse(data).JsonResult);
            var casesLength = cases.length;
            if (casesLength > 1) {
                $m.setMultipleSearchDataSource(cases);
            }
            else if (casesLength > 0) {
                $m.bindCaseData(cases[0]);
            } else {
                $m.settings.common.showNotification("No Results Found", "info");
            }

        },
        notify: function (d) {

            if (JSON.parse(d).Result) {

                $m.settings.common.showNotification("Successfully Saved", "success");

                if (JSON.parse(d).Request.Targert === "SaveCase")
                    $m.clearCaseForm();
            }
            else {
                $m.settings.common.showNotification("Record Saving Failed", "error");
            }
            // $m.settings.common.showNotification("Record Successfully Saved", "success");
            //  $m.clearCaseForm();  
        },
        setStepTaskModelData: function (data) {
            // Set task users from step items
            var ddlTaskUsers = $("#ddlTaskUsers").data("kendoMultiSelect");
            ddlTaskUsers.setDataSource(data.ByWhom);
            ddlTaskUsers.refresh();

            // Set max date from step item
            var datepicker = $("#dtTaskDueOnDate").data("kendoDatePicker");
            datepicker.setOptions({
                max: new Date(data.DueDate)
            });

            $("#hdnNextItemId").val(data.StepId);
            $m.stepTaskItems = data.Tasks;
            $m.setstepTaskDataSource();
            $("#addStepTasks").modal('toggle');
        },
        createStepTaskObj: function (guid) {
            var task = {};
            if (guid) {
                task.TaskId = guid;
            } else {
                task.TaskId = $("#hdnTaskId").val();
            }
            task.StepId = $("#hdnNextItemId").val();

            if ($("#txtTaskDescription").val() == "") {
                $m.settings.common.setValidationMessages("val-message", "warning", "Please enter description");
                return;
            } else {
                task.Description = $("#txtTaskDescription").val();
            }
            if (kendo.parseDate($("#dtTaskDueOnDate").data("kendoDatePicker").value()) == null) {
                $m.settings.common.setValidationMessages("val-message", "warning", "Please enter valid date");
                return;
            } else {
                task.DueDate = $("#dtTaskDueOnDate").data("kendoDatePicker").value();
            }

            task.Status = $(".chkTaskStatus").prop('checked');
            if ($("#ddlTaskUsers").data("kendoMultiSelect").dataItems().length < 1) {
                $m.settings.common.setValidationMessages("val-message", "warning", "Please select Owners");
                return;
            } else {
                task.ByWhom = $("#ddlTaskUsers").data("kendoMultiSelect").dataItems();
            }


            if (!task.CreatedDate)
                task.CreatedDate = new Date();

            task.UpdatedDate = new Date();

            $m.addToStepTasks(task);
        },
        addToStepTasks: function (data) {
            /// <summary>
            /// Add step task data
            /// </summary>
            /// <param name="data" type="type"></param>
            /// <returns type=""></returns>
            if ($m.isTaskAvaiable(data) == false) {
                $m.stepTaskItems.push(data);
            }
            $m.setstepTaskDataSource();
            $m.clearStepsTaskModel();
        },
        isTaskAvaiable: function (data) {
            var isAvailable = false;
            for (var i = 0, length = $m.stepTaskItems.length; i < length; i++) {
                if ($m.stepTaskItems[i].TaskId == data.TaskId) {

                    $m.stepTaskItems[i].ByWhom = data.ByWhom;
                    $m.stepTaskItems[i].Description = data.Description;
                    $m.stepTaskItems[i].DueDate = data.DueDate;
                    $m.stepTaskItems[i].Status = data.Status;
                    $m.stepTaskItems[i].StepId = data.StepId;
                    $m.stepTaskItems[i].TaskId = data.TaskId;
                    $m.stepTaskItems[i].UpdatedDate = data.UpdatedDate;
                    isAvailable = true;
                    break;
                }
            }
            return isAvailable;
        },
        clearStepsTaskModel: function () {
            /// <summary>
            /// If reset value is true. Consider as close modal popup. 
            /// Then Clear grid as multi select boxes
            /// </summary>
            /// <param name="reset" type="type"></param>
            $("#txtTaskDescription").val("");
            $("#dtTaskDueOnDate").data("kendoDatePicker").value("");
            $("#chkStatus").prop('checked', false);
            $("#ddlTaskUsers").data("kendoMultiSelect").value([]);

        },
        addTasksToNextItemGrid: function (id, tasks) {
            /// <summary>
            /// Adding final tasks into respective item
            /// </summary>
            /// <param name="id" type="type"></param>
            var data = $m.nextStepDataSource;
            for (var i = 0, len = data.length; i < len; i++) {
                if (id == data[i].StepId) {
                    data[i].Tasks = tasks;
                    break;
                }
            }
        },
        setstepTaskDataSource: function () {
            var dataSource = new kendo.data.DataSource({
                data: $m.stepTaskItems,
                pageSize: 5
            });

            $("#grdStepsTasks").data("kendoGrid").setDataSource(dataSource);
            dataSource.read();
            $("#grdStepsTasks").data("kendoGrid").refresh();
        },
        bindCaseData: function (caseObj) {
            /// <summary>
            /// Bind case data to the form
            /// </summary>
            /// <param name="caseObj" type="CaseList"></param>
            $m.caseModel = {};
            $m.caseModel = caseObj;
            $m.nextStepDataSource = $m.caseModel.CaseSteps;
            $m.attachmentsToDelete = [];
            // $m.eventsToSave = [];
            $m.eventsToDelete = [];
            if ($("#ddlType").data("kendoComboBox"))
                $("#ddlType").data("kendoComboBox").value($m.caseModel.CaseTypeId);

            if ($("#ddlParty").data("kendoComboBox"))
                $("#ddlParty").data("kendoComboBox").value($m.caseModel.PartyId);

            if ($("#txtCaseNo"))
                $("#txtCaseNo").val($m.caseModel.CaseNumber);

            if ($("#ddlCourt").data("kendoComboBox"))
                $("#ddlCourt").data("kendoComboBox").value($m.caseModel.CourtId);

            if ($("#dtStartDate").data("kendoDatePicker"))
                $("#dtStartDate").data("kendoDatePicker").value($m.caseModel.StartDate);

            if ($("#txtDescription"))
                $("#txtDescription").val($m.caseModel.Description);

            if ($m.caseModel.SendAutomaticReminders)
                $("#chkSendReminders").prop('checked', true);
            else
                $("#chkSendReminders").prop('checked', false);
            //$m.setStepDataSource();
            $m.refreshNextStepGrid();
            $("#txt-search-case-no").val("");

            $m.uploadedFiles = $m.caseModel.Attachments;
            $m.showUploadedFiles();
        },
        // setStepDataSource:function () {
        //     /// <summary>
        //     /// Set NextStep datasource and refresh the grid
        //     /// </summary>
        //      var dataSource = new kendo.data.DataSource({
        //         data: $m.nextStepDataSource,
        //         pageSize: 10
        //     });
        //     
        //     
        //     $("#caseSteps").data("kendoGrid").setDataSource(dataSource);
        //     dataSource.read();
        //     $("#caseSteps").data("kendoGrid").refresh();
        //     
        // },
        setMultipleSearchDataSource: function (caseList) {
            /// <summary>
            /// Set MultipleSearchResult datasource and refresh the grid
            /// </summary>

            for (var i = 0, x = caseList.length; i < x; i++) {
                caseList[i].CaseTypeName = $.grep($m.masterData.CaseTypes, function (e) { return e.ID === caseList[i].CaseTypeId; })[0].Name;
                caseList[i].CourtName = $.grep($m.masterData.Courts, function (e) { return e.ID === caseList[i].CourtId; })[0].Name;
                caseList[i].PartyName = $.grep($m.masterData.Parties, function (e) { return e.ID === caseList[i].PartyId; })[0].Name;

            }
            $m.multipleSearchResult = caseList;

            var dataSource = new kendo.data.DataSource({
                data: $m.multipleSearchResult,
                pageSize: 10
            });
            $("#grdCaseMultipleResult").data("kendoGrid").setDataSource(dataSource);
            dataSource.read();
            $("#grdCaseMultipleResult").data("kendoGrid").refresh();
            $("#displayMultipleCaseSearchResult").modal('toggle');
        },
        clearCaseForm: function () {
            if ($("#ddlType").data("kendoComboBox"))
                $("#ddlType").data("kendoComboBox").text('');

            if ($("#ddlParty").data("kendoComboBox"))
                $("#ddlParty").data("kendoComboBox").text('');

            if ($("#txtCaseNo"))
                $("#txtCaseNo").val("");

            if ($("#ddlCourt").data("kendoComboBox"))
                $("#ddlCourt").data("kendoComboBox").text('');

            if ($("#dtStartDate").data("kendoDatePicker"))
                $("#dtStartDate").data("kendoDatePicker").value("");

            if ($("#txtDescription"))
                $("#txtDescription").val("");

            $("#chkSendReminders").prop('checked', true);

            var newStepDataSource = new kendo.data.DataSource({
                data: []
            });
            $("#caseSteps").data("kendoGrid").setDataSource(newStepDataSource);
            newStepDataSource.read();
            $("#caseSteps").data("kendoGrid").refresh();

            $m.getCurrentCaseNo();

            // $m.saveEvents();
            $m.showUploadedFiles();
            $m.deleteAttachments();
            $m.nextStepDataSource = [];
            $("#collapse1").collapse('hide');

        },
        deleteNextStepItem: function (dataItem) {
            // Delete from array and refresk kendo grid
            var yesFunction = function () {
                $m.removeFromNextStepDataSource(dataItem);
            };
            var noFunction = function () { };

            $m.settings.common.showConfirmDialog(yesFunction, noFunction, "Are you sure you want to delete this step ?");
        },
        removeFromNextStepDataSource: function (dataItem) {
            /// <summary>
            /// Remove nextstep from array
            /// </summary>
            /// <param name="dataItem" type="type"></param>
            // debugger;
            if (dataItem.events && dataItem.events.length > 0) {
                for (var i = 0, x = dataItem.events.length; i < x; i++) {
                    $m.eventsToDelete.push(dataItem.events[i].eventId);
                }
                $m.deleteEvents();
            }

            $m.nextStepDataSource = $.grep($m.nextStepDataSource, function (value) {
                return value.StepId != dataItem.StepId;
            });

            $m.refreshNextStepGrid();

        },
        refreshNextStepGrid: function () {
            /// <summary>
            /// Refresh kendo grid data source
            /// </summary>
            var dataSource = new kendo.data.DataSource({
                data: $m.nextStepDataSource,
                pageSize: 5
            });
            if ($m.nextStepDataSource.length < 1)
                $("#collapse1").collapse('hide');

            dataSource.sort({ field: "CreatedDate", dir: "desc" });
            $("#caseSteps").data("kendoGrid").setDataSource(dataSource);
            dataSource.read();
            $("#caseSteps").data("kendoGrid").refresh();

        },
        setNextStepData: function (dataItem) {

            $("#hdnStepId").val(dataItem.StepId);
            $("#txtNextStep").val(dataItem.NextStep);
            $("#dtDueOnDate").data("kendoDatePicker").value(dataItem.DueDate);
            var values = [];
            if (dataItem.ByWhom.length > 0) {
                for (var i = 0; i < dataItem.ByWhom.length; i++) {
                    values.push(dataItem.ByWhom[i].ID);
                }
            }
            $("#ddlUsers").data("kendoMultiSelect").value(values);
            $("#txtFee").val(dataItem.Fee);
            $("#chkNotification").prop('checked', dataItem.SendNotifications);
            $('#addStepModel').modal('toggle');

        },
        setStepTaskSelectedData: function (dataItem) {
            /// <summary>
            /// Set controls data when click on step task edit button
            /// on the grid
            /// </summary>
            /// <param name="dataItem" type="type"></param>
            $("#hdnTaskId").val(dataItem.TaskId);
            $("#txtTaskDescription").val(dataItem.Description);
            $("#dtTaskDueOnDate").data("kendoDatePicker").value(dataItem.DueDate);
            $(".chkTaskStatus").prop('checked', dataItem.Status);
            var values = [];
            if (dataItem.ByWhom.length > 0) {
                for (var i = 0; i < dataItem.ByWhom.length; i++) {
                    values.push(dataItem.ByWhom[i].Id);
                }
            }
            $("#ddlTaskUsers").data("kendoMultiSelect").value(values);
        },
        deleteStepTaskItem: function (dataItem) {
            // Delete from array and refresk kendo grid
            var yesFunction = function () {
                $m.removeFromStepTaskDataSource(dataItem);
            };
            var noFunction = function () { };

            $m.settings.common.showConfirmDialog(yesFunction, noFunction, "Are you sure you want to delete this task ?");
        },
        removeFromStepTaskDataSource: function (dataItem) {
            /// <summary>
            /// Remove nextstep from array
            /// </summary>
            /// <param name="dataItem" type="type"></param>
            $m.stepTaskItems = $.grep($m.stepTaskItems, function (value) {
                return value.TaskId != dataItem.TaskId;
            });


            $m.setstepTaskDataSource();
        },
        browseCaseResponse: function (data) {
            /// <summary>
            /// Callback function for deed search responseS
            /// </summary>
            /// <param name="data" type="type"> search response Json string</param>

            var cases = JSON.parse(JSON.parse(data).JsonResult);
            var casesLength = 0;
            if (cases)
                casesLength = cases.length;

            if (casesLength > 1) {
                $m.setMultipleBrowseDataSource(cases);
            }
            else if (casesLength > 0) {
                $m.bindCaseData(cases[0]);
                $("#browseModal").modal('toggle');
            } else {
                $m.setMultipleBrowseDataSource(cases);
                $m.settings.common.setValidationMessages("val-messageBrowse", "info", "No Results Found");
            }


        },
        setMultipleBrowseDataSource: function (caseList) {
            /// <summary>
            /// Set MultipleSearchResult datasource and refresh the grid
            /// </summary>

            for (var i = 0, x = caseList.length; i < x; i++) {
               
                caseList[i].CaseTypeName = $.grep($m.masterData.CaseTypes, function (e) { return e.ID === caseList[i].CaseTypeId; })[0].Name;
                caseList[i].CourtName = $.grep($m.masterData.Courts, function (e) { return e.ID === caseList[i].CourtId; })[0].Name;
                caseList[i].PartyName = $.grep($m.masterData.Parties, function (e) { return e.ID === caseList[i].PartyId; })[0].Name;
            }
            $m.multipleSearchResult = caseList;

            //Set multiple search result grid data source
            var dataSource = new kendo.data.DataSource({

                data: $m.multipleSearchResult,
                pageSize: 10,
                page: 1,
                serverPaging: false
            });

            $("#grdBrowseMultipleResult").data("kendoGrid").setDataSource(dataSource);
            dataSource.read();
            $("#grdBrowseMultipleResult").data("kendoGrid").refresh();

        },
        buildBrowseQuery: function () {

            var whereClause = "";
            if ($("#ddlBrowseType").val() != "") {
                whereClause = "WHERE d.CaseTypeId = '" + $("#ddlBrowseType").val() + "'";
            }
            if ($("#ddlBrowseParty").val() != "") {
                if (whereClause === "")
                    whereClause = "WHERE d.PartyId = '" + $("#ddlBrowseParty").val() + "'";
                else
                    whereClause = whereClause + " OR d.PartyId = '" + $("#ddlBrowseParty").val() + "'";
            }
            if ($("#ddlBrowseCourt").val() != "") {
                if (whereClause === "")
                    whereClause = "WHERE d.CourtId = '" + $("#ddlBrowseCourt").val() + "'";
                else
                    whereClause = whereClause + " OR d.CourtId = '" + $("#ddlBrowseCourt").val() + "'";
            }

            if ($("#txtBrowseCaseNo").val() != "") {
                if (whereClause === "")
                    whereClause = "WHERE LOWER(d.CaseNumber) = LOWER('" + $("#txtBrowseCaseNo").val() + "')";
                else
                    whereClause = whereClause + " OR LOWER(d.CaseNumber) = LOWER('" + $("#txtBrowseCaseNo").val() + "')";
            }
            if(whereClause === "")
                    whereClause = "WHERE d.Type='Case' AND d.ClientId = '"+$scope.Configs.ClientId+"'";
            else
                   whereClause = whereClause + " AND d.Type='Case' AND d.ClientId = '"+$scope.Configs.ClientId+"'"; 
            
            return whereClause;
        },
        onFileUpload: function (e) {

            if ($("#txtCaseNo").val() != "") {
                e.data = {
                    client: "client1",
                    caseNumber: "Case/" + $("#txtCaseNo").val()
                };
            } else {
                $m.settings.common.showNotification("Case Number Required", "warning");
                return false;
            }
        },
        onUploadSuccess: function (e) {

            if (e.files) {
                for (var i = 0, x = e.files.length; i < x; i++) {
                    var data = $.grep($m.uploadedFiles, function (d) { return d.Name === e.files[i].name; });
                    if (data.length < 1) {
                        var url = $m.blobEndPoint + "client1" + "/" + $("#txtCaseNo").val() + "/" + e.files[i].name;
                        var file = {};
                        file.Name = e.files[i].name;
                        file.Extension = e.files[i].extension;
                        file.Type = e.files[i].rawFile.type;
                        file.Url = url;
                        file.BlobDir = "Case/" + $("#txtCaseNo").val();
                        $m.uploadedFiles.push(file);
                    }

                }
            }
            $m.showUploadedFiles();
        },

        nextCaseNumberReponse: function (data) {

            if (data) {
                var newCaseNumber = 1;
                if (JSON.parse(JSON.parse(data).JsonResult).length > 0) {
                    var currentCaseNumber = JSON.parse(JSON.parse(data).JsonResult)[0].CaseNumber;
                    var numberPattern = /\d+/g;
                    var num = currentCaseNumber.match(numberPattern)[0];
                    newCaseNumber = parseInt(num) + 1;
                }
                var num2 = $m.paddingNumber(newCaseNumber);
                var formattedNum = $m.masterData.CaseNumberPrefix + num2;

                if ($("#txtCaseNo").val() === "")
                    $("#txtCaseNo").val(formattedNum);
            }
        },
        paddingNumber: function (n) {
            if (n < 10) {
                return ("000" + n);
            }
            else if (n < 100) {
                return ("00" + n);
            }
            else if (n < 1000) {
                return ("000" + n);
            }
            else {
                return n;
            }

        },
        showUploadedFiles: function () {

            var imageCnt = 0;
            var docCnt = 0;
            if ($m.uploadedFiles.length > 0) {
                for (var i = 0, x = $m.uploadedFiles.length; i < x; i++) {
                    if ($m.uploadedFiles[i].Type.indexOf("image") > -1) {
                        imageCnt++
                    }
                    else {
                        docCnt++;
                    }
                    $("#spnPhotos").text(imageCnt.toString());
                    $("#spnDocuments").text(docCnt.toString());

                    //  debugger;
                }
            }
            else {
                $("#spnPhotos").text(0);
                $("#spnDocuments").text(0);
            }


        },
        setAttachmentDataSource: function (type) {
            var data = [];
            if (type === "photos") {
                data = $.grep($m.uploadedFiles, function (e) { return (e.Type.toLowerCase().indexOf("image") >= 0) });
            }
            else {
                data = $.grep($m.uploadedFiles, function (e) { return (e.Type.toLowerCase().indexOf("image") < 0) });
            }

            var dataLength = data.length;

            var dataSource = new kendo.data.DataSource({
                data: data,
                pageSize: 3,
                page: 1,
                serverPaging: false
            });
            $("#grdViewAttachments").data("kendoGrid").setDataSource(dataSource);
            dataSource.read();
            $("#grdViewAttachments").data("kendoGrid").refresh();

            // $('#viewAttachmentModel').modal('toggle');   
            return dataLength;

        },
        deleteAttachments: function () {

            if ($m.attachmentsToDelete.length > 0) {
                var params = {};
                params.client = "client1";
                params.files = JSON.stringify($m.attachmentsToDelete);
                $m.settings.common.ajaxFunctionMultiParam('/CaseLedger/DeleteFiles', 'POST', null, params);
            }
            $m.attachmentsToDelete = [];
        },
        downloadFile: function (file) {
            // window.location = file;
            window.open(
            file,
            '_blank' // <- This is what makes it open in a new window.
            );
        },
        prepareCaseModel: function () {
            // Validate Type
            if ($("#ddlType").data("kendoComboBox").value() == "") {
                $m.settings.common.showNotification("Please select Type", "warning");
                return;
            } else {
                $m.caseModel.CaseTypeId = $("#ddlType").data("kendoComboBox").value();
            }

            // Validate Party
            if ($("#ddlParty").data("kendoComboBox").value() == "") {
                $m.settings.common.showNotification("Please select Party", "warning");
                return;
            } else {
                $m.caseModel.PartyId = $("#ddlParty").data("kendoComboBox").value();
            }

            // Validate CaseNumber
            if ($("#txtCaseNo").val() == "") {
                $m.settings.common.showNotification("Please enter Case Number", "warning");
                return;
            } else {
                $m.caseModel.CaseNumber = $("#txtCaseNo").val();
            }

            // Validate Court
            if ($("#ddlCourt").data("kendoComboBox").value() == "") {
                $m.settings.common.showNotification("Please select Court", "warning");
                return;
            } else {
                $m.caseModel.CourtId = $("#ddlCourt").data("kendoComboBox").value();
            }

            $m.caseModel.StartDate = $("#dtStartDate").data("kendoDatePicker").value();
            $m.caseModel.Description = $("#txtDescription").val();
            $m.caseModel.SendAutomaticReminders = $("#chkSendReminders").prop('checked');
            $m.caseModel.CaseSteps = $m.getCaseStepsData();
            if (!$m.caseModel.CreatedDate)
                $m.caseModel.CreatedDate = new Date();
                
            if(!$m.caseModel.CreatedBy)  
                  $m.caseModel.CreatedBy = $scope.Configs.UserId

            $m.caseModel.UpdatedDate = new Date();
            $m.caseModel.UpdatedBy = $scope.Configs.UserId
            $m.caseModel.Attachments = $m.uploadedFiles;
            $m.caseModel.Type = "Case";
            $m.caseModel.ClientId = $scope.Configs.ClientId;
            $m.saveCaseLedger('/CaseLedger/SaveCaseLedger', 'POST', $m.caseModel);
            $m.caseModel = {};
            $m.uploadedFiles = [];

        },
        createNextStepData: function (guid) {
            /// <summary>
            /// Create next step data with passing guid
            /// </summary>
            /// <param name="guid" type="type"></param>
            var nextStepModel = {};
            if (guid) {
                nextStepModel.StepId = guid;
                nextStepModel.Tasks = [];
            } else {
                nextStepModel.StepId = $("#hdnStepId").val();
            }

            if ($("#txtNextStep").val() == "") {
                $m.settings.common.setValidationMessages("val-message-sep-model", "warning", "Please enter step name");
                return;
            } else {
                nextStepModel.NextStep = $("#txtNextStep").val();
            }

            nextStepModel.DueDate = $("#dtDueOnDate").data("kendoDatePicker").value();
            // nextStepModel.Status = '1';

            if ($("#ddlUsers").data("kendoMultiSelect").dataItems().length < 1) {
                $m.settings.common.setValidationMessages("val-message-sep-model", "warning", "Please select a owner");
                return;
            }
            else {
                nextStepModel.ByWhom = $("#ddlUsers").data("kendoMultiSelect").dataItems();

            }
            var stepData = $.grep($m.nextStepDataSource, function (e) { return e.StepId === $("#hdnStepId").val(); });
            //debugger;
            if (stepData && stepData.length > 0) {
                var events = stepData[0].events;
                if (events && events.length > 0) {
                    for (var i = 0, x = nextStepModel.ByWhom.length; i < x; i++) {
                        //debugger;
                        events = $.grep(events, function (e) { return e.attendee != nextStepModel.ByWhom[i].ID; });

                    }
                    for (var j = 0, x = events.length; j < x; j++) {
                        //add old event id to delete list 
                        $m.eventsToDelete.push(events[j].eventId);
                    }
                    $m.deleteEvents();
                }

            }




            nextStepModel.Fee = $("#txtFee").val();
            nextStepModel.SendNotifications = $("#chkNotification").prop('checked');

            if (!nextStepModel.CreatedDate)
                nextStepModel.CreatedDate = new Date();

            nextStepModel.UpdatedDate = new Date();

            if ($m.addToCaseItems(nextStepModel)) {
                $("#hdnStepId").val("");
                $('#addStepModel').modal('toggle');
            }

            $("#collapse1").collapse('show');

        },
        setEventModelControls: function (data) {
            //debugger;
            // Set task users from step items
            var ddlEventAttendees = $("#ddlEventAttendees").data("kendoMultiSelect");
            ddlEventAttendees.setDataSource(data.ByWhom);
            ddlEventAttendees.refresh();

            // Set max date from step item
            var dtStartDateTime = $("#dtStartDateTime").data("kendoDateTimePicker");
            dtStartDateTime.setOptions({
                max: new Date(data.DueDate)
            });

            var dtEndDateTime = $("#dtEndDateTime").data("kendoDateTimePicker");
            dtEndDateTime.setOptions({
                max: new Date(data.DueDate)
            });
            $("#hdnNextItemId").val(data.StepId);

            var stepData = $.grep($m.nextStepDataSource, function (e) { return e.StepId === data.StepId });

            if (stepData[0].events && stepData[0].events.length > 0)
                $m.getEventsByUser(stepData[0]);
            else
                $("#addEventModel").modal('toggle');

        },
        getEventsByUser: function (data) {
          
            var query = "SELECT  * FROM Data d "
            var whereClause = "";
            for (var i = 0, x = data.events.length; i < x; i++) {
                if (i === 0)
                    whereClause = "WHERE d.id ='" + data.events[i].eventId + "'";
                else
                    whereClause = whereClause + " OR d.id ='" + data.events[i].eventId + "'";
            }
           if(whereClause === "")
                    whereClause = "WHERE d.Type='Scheduler' AND d.ClientId = '"+$scope.Configs.ClientId+"'";
            else
                   whereClause = whereClause + " AND d.Type='Scheduler' AND d.ClientId = '"+$scope.Configs.ClientId+"'"; 
            
            query = query + whereClause;
            $m.settings.common.ajaxFunction('/CaseLedger/GetEvents', 'POST', null, query, false);

        },
        getEventsByUserResponse: function (data) {

            var events = JSON.parse(JSON.parse(data).JsonResult);
            if (events.length > 0) {
                 debugger;
                $("#txtEventTitle").val(events[0].title);
                $("#dtStartDateTime").data("kendoDateTimePicker").value(events[0].start);
                $("#dtEndDateTime").data("kendoDateTimePicker").value(events[0].end);
                $("#txtEventDescription").val(events[0].description);


                var values = [];
                //debugger;
                for (var i = 0, x = events.length; i < x; i++) {
                    values.push(events[i].attendees);
                }
                $("#ddlEventAttendees").data("kendoMultiSelect").value(values);

                $("#addEventModel").modal('show');
            }
            else {
                $("#txtEventTitle").val("");
                $("#dtStartDateTime").data("kendoDateTimePicker").value("");
                $("#dtEndDateTime").data("kendoDateTimePicker").value("");
                $("#txtEventDescription").val("");
                $("#ddlEventAttendees").data("kendoMultiSelect").value([]);
                $("#addEventModel").modal('show');
            }
        },
        saveEvent: function () {
            var startdt = $("#dtStartDateTime").data("kendoDateTimePicker").value();
            var enddt = $("#dtEndDateTime").data("kendoDateTimePicker").value();

            if ($("#txtEventTitle").val() == "") {
                $m.settings.common.setValidationMessages("val-messageEvent", "warning", "Title Required");
                return;
            }
            else if (kendo.parseDate($("#dtStartDateTime").data("kendoDateTimePicker").value()) == null) {
                $m.settings.common.setValidationMessages("val-messageEvent", "warning", "Valid Start Date Required");
                return;
            }
            else if (kendo.parseDate($("#dtEndDateTime").data("kendoDateTimePicker").value()) == null) {
                $m.settings.common.setValidationMessages("val-messageEvent", "warning", "Valid End Date Required");
                return;
            }
            else if (startdt >= enddt) {
                $m.settings.common.setValidationMessages("val-messageEvent", "warning", "End Date and Time Must be Greater than Start Date and Time");
                return;
            }
            else if ($("#ddlEventAttendees").data("kendoMultiSelect").dataItems().length < 1) {
                $m.settings.common.setValidationMessages("val-messageEvent", "warning", "Attendees Required");
                return;
            }
            else {
                //Loop through nextStepDataSource
                for (var i = 0, x = $m.nextStepDataSource.length; i < x; i++) {
                    // find the current step 
                    if ($m.nextStepDataSource[i].StepId === $("#hdnNextItemId").val()) {
                        // if step has events 
                        if ($m.nextStepDataSource[i].events && $m.nextStepDataSource[i].events.length > 0) {
                            //add events to delete list
                            for (var j = 0, x = $m.nextStepDataSource[i].events.length; j < x; j++) {
                                //add old event id to delete list 
                                $m.eventsToDelete.push($m.nextStepDataSource[i].events[j].eventId);

                            }
                        }
                        $m.nextStepDataSource[i].events = [];
                    }
                }
                var attendees = $("#ddlEventAttendees").data("kendoMultiSelect").dataItems();
                for (var i = 0, x = attendees.length; i < x; i++) {

                    $m.settings.common.createGUIDWithParams($m.saveEventCallBack, attendees[i]);
                }


            }
        },
        saveEventCallBack: function (guid, attendee) {
            var event = {};
            event.id = guid;
            event.title = $("#txtEventTitle").val();
           
            event.start = $("#dtStartDateTime").data("kendoDateTimePicker").value().toString();
            // var s = $("#dtStartDateTime").data("kendoDateTimePicker").value(); 
            // s.setHours(s.getHours() - s.getTimezoneOffset() / 60);
            // 
            // event.start = s; 
            event.end = $("#dtEndDateTime").data("kendoDateTimePicker").value().toString();
            event.description = $("#txtEventDescription").val();
            event.attendees = attendee.ID;
            event.CreatedBy = $scope.Configs.UserId;
            event.CreatedDate = new Date();
            event.Type = "Scheduler";
            event.ClientId = $scope.Configs.ClientId;
            $m.deleteEvents();


            for (var i = 0, x = $m.nextStepDataSource.length; i < x; i++) {
                if ($m.nextStepDataSource[i].StepId === $("#hdnNextItemId").val()) {
                    var eve = {};
                    eve.eventId = guid;
                    eve.attendee = attendee.ID;
                    if (!$m.nextStepDataSource[i].events) {
                        $m.nextStepDataSource[i].events = [];
                        $m.nextStepDataSource[i].events.push(eve);
                    }
                    else {
                        $m.nextStepDataSource[i].events.push(eve);
                    }
                }
            }
           
            $m.saveEvents(event);
            $("#addEventModel").modal('hide');
            // $.grep($m.masterData.CaseTypes,function (e) {return e.ID === caseList[i].CaseTypeId;})[0].Name;

        },
      
        deleteEvents: function () {

            var sQuery = $m.eventsToDelete;   //"SELECT  * FROM Scheduler s WHERE s.id = '"+ e.event.id +"'";
            $m.settings.common.ajaxFunction('/CaseLedger/DeleteEvent', 'POST', null, sQuery, true);
        },
        saveEvents: function (event) {
            $m.settings.common.ajaxFunction('/CaseLedger/SaveEvent', 'POST', null, event, true);

        },
        eventNotify: function (d) {
            if (JSON.parse(d).Result) {

                // if(JSON.parse(d).Request.Targert === "SaveSchedulerTask")
                //     $m.eventsToSave = [];
                if (JSON.parse(d).Request.Targert === "DeleteTasks")
                    $m.eventsToDelete = [];
            }
        }






    };

    return $m;

}(window.Welkin, window.Welkin.$, window.Welkin.CaseHandler || {}));