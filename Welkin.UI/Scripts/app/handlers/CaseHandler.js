window.Welkin.CaseHandler = (function ($scope, $, $m) {
    /// <summary>
    ///     Case ledger handler
    /// </summary>
    /// <param name="$scope">Application Scope </param>
    /// <param name="$">jQuery</param> 
    
   
    $m = {

        // Data source for nextsteps
        nextStepDataSource: [],
        stepTaskItems:[],
        caseModel : {},
        masterData : {},
        multipleSearchResult:{},
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
                        name:"searchCaseResponse",
                        fn:this.searchCaseResponse
                    }
                ]);
                this.settings.sAgent.start();
            }

            // Initialize controlls
            $m.initControlls();

            $('.chkStatus').change(function (e) {

            });

            $("#caseSteps").on("click", ".btn-task", function (e) {
                e.preventDefault();
                var dataItem = $("#caseSteps").data("kendoGrid").dataItem($(e.currentTarget).closest("tr"));
                $m.setStepTaskModelData(dataItem);
            });
          
            var createNextStepData = function (guid) {
                /// <summary>
                /// Create next step data with passing guid
                /// </summary>
                /// <param name="guid" type="type"></param>
                var nextStepModel = {};
                if (guid) {
                    nextStepModel.StepId = guid;
                    nextStepModel.Tasks = [];
                }else{
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
                nextStepModel.ByWhom = $("#ddlUsers").data("kendoMultiSelect").dataItems();
                nextStepModel.Fee = $("#txtFee").val();
                nextStepModel.SendNotifications = $("#chkNotification").prop('checked');
                if ($m.addToCaseItems(nextStepModel)) {
                    $("#hdnStepId").val("");
                    $('#addStepModel').modal('toggle');
                }
            };

            // Save next step click function
            $("#save-step").click(function () {
                if ($("#hdnStepId").val() == "") {
                    $m.settings.common.createGUID(createNextStepData);
                } else {
                    createNextStepData();
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
               // Validate Type
                if ($("#ddlType").data("kendoDropDownList").value() == "") {
                    $m.settings.common.showNotification("Please select Type", "warning");
                    return;
                } else {
                    $m.caseModel.CaseTypeId = $("#ddlType").data("kendoDropDownList").value();
                }

                // Validate Party
                if ($("#ddlParty").data("kendoDropDownList").value() == "") {
                    $m.settings.common.showNotification("Please select Party", "warning");
                    return;
                } else {
                    $m.caseModel.PartyId = $("#ddlParty").data("kendoDropDownList").value();
                }

                // Validate CaseNumber
                if ($("#txtCaseNo").val() == "") {
                    $m.settings.common.showNotification("Please enter Case Number", "warning");
                    return;
                } else {
                    $m.caseModel.CaseNumber = $("#txtCaseNo").val();
                }

                // Validate Court
                if ($("#ddlCourt").data("kendoDropDownList").value() == "") {
                    $m.settings.common.showNotification("Please select Court", "warning");
                    return;
                } else {
                    $m.caseModel.CourtId = $("#ddlCourt").data("kendoDropDownList").value();
                }

                $m.caseModel.StartDate = $("#dtStartDate").data("kendoDatePicker").value();
                $m.caseModel.Description = $("#txtDescription").val();
                $m.caseModel.SendAutomaticReminders = $("#chkSendReminders").prop('checked');
                $m.caseModel.CaseSteps = $m.getCaseStepsData();

                $m.saveCaseLedger('/CaseLedger/SaveCaseLedger', 'POST', $m.caseModel); 
                                         
                        
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
                    var searchQuery = "SELECT * FROM c WHERE CONTAINS(c.CaseNumber,'" + $("#txt-search-case-no").val() + "')";
                    $m.settings.common.ajaxFunction('/CaseLedger/GetCases', 'POST', null, searchQuery,false);
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

            // Delete step task items
            $("#grdStepsTasks").on("click", ".btn-delete", function (e) {
                e.preventDefault();
                var dataItem = $("#grdStepsTasks").data("kendoGrid").dataItem($(e.currentTarget).closest("tr"));
                $m.deleteStepTaskItem(dataItem);
            });
        },
        // Initilize controlls
        initControlls: function () {
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

            // create DropDownList from input HTML element
            $("#ddlTaskUsers").kendoMultiSelect({
                dataTextField: "Name",
                dataValueField: "Id",
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
                  selectable:"row",
                   change: function (e) {
                    /// <summary>
                    /// Bind Selected data to form
                    /// </summary>
                    /// <param name="e" type="type"></param>
                   var selectedRow = this.select();
                   if(selectedRow)
                   $m.bindCaseData(this.dataItem(selectedRow));
                  $("#displayMultipleCaseSearchResult").modal('toggle');
                }
              });

        },
        populateCaseDropdown: function (a) {
           
            $m.masterData = JSON.parse(JSON.parse(a).JsonResult)[0];

            var caseTypes = JSON.parse(JSON.parse(a).JsonResult)[0].CaseTypes;
            var courts = JSON.parse(JSON.parse(a).JsonResult)[0].Courts;
            var parties = JSON.parse(JSON.parse(a).JsonResult)[0].Parties;

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

            var ddlUsers = $("#ddlUsers").data("kendoMultiSelect");
            ddlUsers.setDataSource(usersData);
            ddlUsers.refresh();

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
            var isAvailable = false;
            for(var i =0,length = $m.nextStepDataSource.length;i<length;i++){
                if ($m.nextStepDataSource[i].StepId == data.StepId) {
                    $m.nextStepDataSource[i].NextStep = data.NextStep;
                    $m.nextStepDataSource[i].DueDate = data.DueDate;
                    $m.nextStepDataSource[i].ByWhom = data.ByWhom;
                    $m.nextStepDataSource[i].Fee = data.Fee;
                    $m.nextStepDataSource[i].SendNotifications = data.SendNotifications;

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
            $m.settings.common.ajaxFunction(url, type,null, model,true);
        },
        // Rerieve case step data from data source
        getCaseStepsData: function () {
            return $m.nextStepDataSource;
        },
        searchCaseResponse: function (data) {
            
            var cases = JSON.parse(JSON.parse(data).JsonResult);
            var casesLength = cases.length;
            if(casesLength > 1){
                $m.setMultipleSearchDataSource(cases);
            }
            else if(casesLength > 0){
                $m.bindCaseData(cases[0]);
            }else{
                $m.settings.common.showNotification("No Results Found", "info");
            }
            
        },
        notify: function (d) {
            $m.settings.common.showNotification("Record Successfully Saved", "success");
             $m.clearCaseForm();  
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
            if (kendo.parseDate($("#dtTaskDueOnDate").data("kendoDatePicker").value())==null){
                $m.settings.common.setValidationMessages("val-message", "warning", "Please enter valid date");
                return;
            }else{
                task.DueDate = $("#dtTaskDueOnDate").data("kendoDatePicker").value();
            }

            task.Status = $(".chkTaskStatus").prop('checked');
            task.ByWhom = $("#ddlTaskUsers").data("kendoMultiSelect").dataItems();

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
        addTasksToNextItemGrid: function (id,tasks) {
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

            $("#grdStepsTasks").data("kendoGrid").dataSource = dataSource;
            dataSource.read();
            $("#grdStepsTasks").data("kendoGrid").refresh();
        },
        bindCaseData:function(caseObj) {
             /// <summary>
            /// Bind case data to the form
            /// </summary>
            /// <param name="caseObj" type="CaseList"></param>
             $m.caseModel = caseObj;
             $m.nextStepDataSource = $m.caseModel.CaseSteps
             if($("#ddlType").data("kendoDropDownList"))
            $("#ddlType").data("kendoDropDownList").value($m.caseModel.CaseTypeId);
            
            if($("#ddlParty").data("kendoDropDownList"))
            $("#ddlParty").data("kendoDropDownList").value($m.caseModel.PartyId);
            
            if($("#txtCaseNo"))
            $("#txtCaseNo").val($m.caseModel.CaseNumber);
            
            if($("#ddlCourt").data("kendoDropDownList"))
            $("#ddlCourt").data("kendoDropDownList").value($m.caseModel.CourtId);
            
            if($("#dtStartDate").data("kendoDatePicker"))
            $("#dtStartDate").data("kendoDatePicker").value($m.caseModel.StartDate);
            
            if($("#txtDescription"))
            $("#txtDescription").val($m.caseModel.Description);
            
           if($m.caseModel.SendAutomaticReminders)
            $("#chkSendReminders").prop('checked', true);
           else
            $("#chkSendReminders").prop('checked', false);  
            $m.setStepDataSource();
            
            $("#txt-search-case-no").val("");
        },
        setStepDataSource:function () {
            /// <summary>
            /// Set NextStep datasource and refresh the grid
            /// </summary>
             var dataSource = new kendo.data.DataSource({
                data: $m.nextStepDataSource,
                pageSize: 10
            });
            $("#caseSteps").data("kendoGrid").dataSource = dataSource;
            dataSource.read();
            $("#caseSteps").data("kendoGrid").refresh();
        },
        setMultipleSearchDataSource:function(caseList){
             /// <summary>
            /// Set MultipleSearchResult datasource and refresh the grid
            /// </summary>
            
           for (var i = 0, x = caseList.length; i < x; i++){
              caseList[i].CaseTypeName =  $.grep($m.masterData.CaseTypes,function (e) {return e.ID === caseList[i].CaseTypeId;})[0].Name;
              caseList[i].CourtName =  $.grep($m.masterData.Courts,function (e) {return e.ID === caseList[i].CourtId;})[0].Name;
              caseList[i].PartyName =  $.grep($m.masterData.Parties,function (e) {return e.ID === caseList[i].PartyId;})[0].Name;
                          
           }
           $m.multipleSearchResult = caseList;
           
             var dataSource = new kendo.data.DataSource({
                data: $m.multipleSearchResult,
                pageSize: 10
            });
             $("#grdCaseMultipleResult").data("kendoGrid").dataSource = dataSource;
            dataSource.read();
            $("#grdCaseMultipleResult").data("kendoGrid").refresh();
            $("#displayMultipleCaseSearchResult").modal('toggle');
        },
        clearCaseForm:function () {
            if($("#ddlType").data("kendoDropDownList"))
            $("#ddlType").data("kendoDropDownList").select(0);
            
            if($("#ddlParty").data("kendoDropDownList"))
            $("#ddlParty").data("kendoDropDownList").select(0);
            
             if($("#txtCaseNo"))
            $("#txtCaseNo").val("");
            
            if($("#ddlCourt").data("kendoDropDownList"))
            $("#ddlCourt").data("kendoDropDownList").select(0);
            
            if($("#dtStartDate").data("kendoDatePicker"))
            $("#dtStartDate").data("kendoDatePicker").value("");
            
            if($("#txtDescription"))
            $("#txtDescription").val("");
                    
            $("#chkSendReminders").prop('checked', true);

            var newStepDataSource = new kendo.data.DataSource({
                data: []
                }); 
            $("#caseSteps").data("kendoGrid").dataSource = newStepDataSource;
            newStepDataSource.read();
            $("#caseSteps").data("kendoGrid").refresh();
            
            
        },
        deleteNextStepItem: function (dataItem) {
            // Delete from array and refresk kendo grid
            var yesFunction = function () {
                $m.removeFromNextStepDataSource(dataItem);
            };
            var noFunction = function () {};

            $m.settings.common.showConfirmDialog(yesFunction, noFunction, "Are you sure you want to delete this step ?");
        },
        removeFromNextStepDataSource: function (dataItem) {
            /// <summary>
            /// Remove nextstep from array
            /// </summary>
            /// <param name="dataItem" type="type"></param>
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

            $("#caseSteps").data("kendoGrid").dataSource = dataSource;
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
                    values.push(dataItem.ByWhom[i].Id);
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
    };

    return $m;

} (window.Welkin, window.Welkin.$, window.Welkin.CaseHandler || {}));