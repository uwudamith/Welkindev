window.Welkin.DeedHandler =  (function($scope, $, $m) {

    $m = {
        deedModel : {},
        uploadedFiles:[],
        attachmentsToDelete:[],
        multipleSearchResult:{},
        masterData:{},
        blobEndPoint:{},
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
                    },
                    {
                        name:"browseDeedResponse",
                        fn:this.browseDeedResponse
                    },
                       {
                        name:"nextDeedNumberReponse",
                        fn:this.nextDeedNumberReponse
                    }               

                ]);
                this.settings.sAgent.start();
            }
            $m.blobEndPoint = $scope.Configs.blobEndPoint;
             $m.initControlls();
             
                $(".save-deed").click(function () {
                   
                    $m.prepareDeedModel();
              
                });
                
                
            $("#btn-search-deed").click(function () {
                if ($("#txt-search-deed-no").val() == "") {
                    alert("Search field should not be empty");
                } else {
                    var searchQuery = "SELECT * FROM Deed d WHERE CONTAINS(LOWER(d.DeedNumber),LOWER('" + $("#txt-search-deed-no").val() + "'))";
                    $m.settings.common.ajaxFunction('/DeedLedger/GetDeeds', 'POST', null, searchQuery,false);
                }
            });
            
             $("#save-grantee").click(function () {
              
                if ($("#txtGranteeUserName").val() === "") {
                   // Validate Grantee Data & invoke save method
                   $m.settings.common.setValidationMessages("val-messageGrantee","warning","Name Required");
                    return;
                } 
                else if($m.settings.common.validateEmail($("#txtGranteeEmail").val())){
                    $m.settings.common.setValidationMessages("val-messageGrantee","warning","Invalid Email Address");
                    return;
                }
                else if($("#txtGranteeContactNo").val()=== ""){
                    $m.settings.common.setValidationMessages("val-messageGrantee","warning","Contact No Required");
                    return;
                }
                else if($("#txtGranteeNIC").val()=== ""){
                    $m.settings.common.setValidationMessages("val-messageGrantee","warning","NIC Required");
                    return;
                }
                else {
                $m.settings.common.createGUID($m.saveGranteeData);
                }
            });
            
             $("#save-grantor").click(function () {
                 // Validate Grantor Data & invoke save method
                 if ($("#txtGrantorUserName").val() == "") {
                   // $m.settings.common.showNotification("Name Required", "warning");
                   $m.settings.common.setValidationMessages("val-messageGrantor","warning","Name Required");
                    return;
                } 
                else if($m.settings.common.validateEmail($("#txtGrantorEmail").val())){
                    $m.settings.common.setValidationMessages("val-messageGrantor","warning","Invalid Email Address");
                    return;
                }
                else if($("#txtGrantorContactNo").val()=== ""){
                    $m.settings.common.setValidationMessages("val-messageGrantor","warning","Contact No Required");
                    return;
                }
                else if($("#txtGrantorNIC").val()=== ""){
                    $m.settings.common.setValidationMessages("val-messageGrantor","warning","NIC Required");
                    return;
                }
                else {
                $m.settings.common.createGUID($m.saveGrantorData);
                }
            });
            
            $('#addGranteeModel').on('hidden.bs.modal', function () {
                $m.clearGranteeModel();
                 $('#btnGranteePopup').prop('disabled', true);
          
                
            })
             $('#addGrantorModel').on('hidden.bs.modal', function () {
                $m.clearGrantorModel();
                $('#btnGrantorPopup').prop('disabled', true);  
            })
            
            $("#btnDeedBrowse").click(function(){
                 var searchQuery = "SELECT * FROM Deed";
                    $m.settings.common.ajaxFunction('/DeedLedger/BrowseDeeds', 'POST', null, searchQuery,false);
                $('#browseModal').modal('toggle');   
           
            });
            
             $("#btnBrowseSearch").click(function(){
                 var searchQuery = "SELECT * FROM Deed d";
               var whereClause =  $m.buildBrowseQuery();
                if(whereClause != "")
                   searchQuery = searchQuery +" " + whereClause;
                  $m.settings.common.ajaxFunction('/DeedLedger/BrowseDeeds', 'POST', null, searchQuery,false);
                   
           
            });
            
             $("#btnBorrow").click(function(){
                 
                $('#borrowModel').modal('toggle');   
           
            });
            
           $('#chkAvailability').change(function() {
            
               if(this.checked){
                    $('#btnBorrow').prop('disabled', false);
               }else{
                   $('#btnBorrow').prop('disabled', true);
               }
            });
            
            $("#save-borrow").click(function(){
                 
                if ($("#txtBorrowUserName").val() == "") {
                   $m.settings.common.setValidationMessages("val-messageBorrow","warning","Name Required");
                    return;
                } 
                else if($("#txtBorrowNIC").val() == ""){
                    $m.settings.common.setValidationMessages("val-messageBorrow","warning","NIC Required");
                    return;
                }
                else{
                    $('#borrowModel').modal('toggle');   
                } 
           
            });
            
             $("#btnUploadPopup").click(function(){   
                $('#uploadModel').modal('toggle');   
                return false;
            });
            
             $("#liPhotos").click(function(){   
                var length =  $m.setAttachmentDataSource("photos");
                 if(length > 0)
                    $('#viewAttachmentModel').modal('toggle'); 
                 else
                    $m.settings.common.showNotification("No Attachments to Show", "info");
            
                  
                return false;
            });
            
              $("#liDocuments").click(function(){ 
                var length = $m.setAttachmentDataSource("documents");  
                if(length > 0)
                     $('#viewAttachmentModel').modal('toggle');   
               else
                    $m.settings.common.showNotification("No Attachments to Show", "info");
                
                return false;
            });
            
             $("#grdViewAttachments").on("click", ".btn-delete", function (e) {
                e.preventDefault();       
                var dataItem = $("#grdViewAttachments").data("kendoGrid").dataItem($(e.currentTarget).closest("tr"));
                if(dataItem){
                     var data = $.grep($m.attachmentsToDelete,function (d) {return d.Name === dataItem.Name;});
                     if(data.length < 1)
                     {
                          if($m.deedModel.id)
                          $m.attachmentsToDelete.push(dataItem);
                          
                          debugger;
                     }
                     $m.uploadedFiles = $.grep($m.uploadedFiles, function(e){ 
                        return e.Name != dataItem.Name; 
                    });
                    $m.showUploadedFiles();              
                    if(dataItem.Type.toLowerCase().indexOf("image") < 0)
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
                $m.settings.common.ajaxFunctionMultiParam('/DeedLedger/DownloadFiles', 'POST', $m.downloadFile, params);   
                
            });
            
             $('#uploadModel').on('hidden.bs.modal', function () {
                $(".k-upload-files.k-reset").find("li").remove();
            })
            
             $("#txtStampDuty").keydown(function (e) {
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
            
        },
        initControlls:function () {
            
         $("#deedFileUpload").kendoUpload({
                        async: {
                           saveUrl: "/DeedLedger/SaveUploadFiles",
                            //removeUrl: "remove",
                            autoUpload: true
                        },
                        upload: $m.onFileUpload,
                        success: $m.onUploadSuccess
                    });
            
           
        $("#ddlType").kendoComboBox({
            dataTextField: "Name",
            dataValueField: "ID",
            placeholder:"Select a Deed Type",
            filter:"startswith",
            index: 0
            });

        $("#ddlGrantee").kendoComboBox({
            dataTextField: "Name",
            dataValueField: "ID",
            placeholder:"Select a Grantee",
            filter:"startswith",
            index: 0,
            filtering:$m.onGranteeFiltering
        });
       

        $("#ddlGrantor").kendoComboBox({
            dataTextField: "Name",
            dataValueField: "ID",
            placeholder:"Select a Grantor",
            filter:"startswith",
            index: 0,
            filtering:$m.onGrantorFiltering
        });

        $("#ddlDistrict").kendoComboBox({
            dataTextField: "Name",
            dataValueField: "ID",
            placeholder:"Select a District",
            filter:"startswith",
            index: 0
        });
        
        
         $("#ddlBrowseType").kendoComboBox({
            dataTextField: "Name",
            dataValueField: "ID",
            placeholder:"Select a Deed Type",
            filter:"startswith",
            index: 0
        });

        $("#ddlBrowseGrantee").kendoComboBox({
            dataTextField: "Name",
            dataValueField: "ID",
            placeholder:"Select a Grantee",
            filter:"startswith",
            index: 0
        });

        $("#ddlBrowseGrantor").kendoComboBox({
            dataTextField: "Name",
            dataValueField: "ID",
            placeholder:"Select a Grantor",
            filter:"startswith",
            index: 0
        });
        
         $("#ddlBrowseDistrict").kendoComboBox({
            dataTextField: "Name",
            dataValueField: "ID",
            placeholder:"Select a District",
            filter:"startswith",
            index: 0
        });

        $("#chkAvailability").checkboxpicker();
        $('#chkAvailability').prop('checked', false);
        
        
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
                   { field: "DeedNumber", title: "Deed Number", width: 80 },
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
            
            
            
             $("#grdBrowseMultipleResult").kendoGrid({
                // dataSource: {
                //     data: [],
                //     pageSize: 1
                //  },
                // pageable: {
                // input: false,
                // numeric: true,
                // refresh: true,
                // pageSizes: true,
                // previousNext: true
                //  },
                pageable:true,
                columns: [
                   { field: "id", hidden: true, },
                   { field: "DeedNumber", title: "Deed Number", width: 80 },
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
                  selectable:"row",
                  
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
         
            var ddlBrowseDistrict = $("#ddlBrowseDistrict").data("kendoComboBox");
            ddlBrowseDistrict.setDataSource(districts);
            ddlBrowseDistrict.dataSource.sort({ field: "Name", dir: "asc" });
            ddlBrowseDistrict.refresh();
            
            var ddl = $("#ddlType").data("kendoComboBox");
            ddl.setDataSource(deedTypes);
            ddl.dataSource.sort({ field: "Name", dir: "asc" });
            ddl.refresh();

            var ddlGrantee = $("#ddlGrantee").data("kendoComboBox");
            ddlGrantee.setDataSource(grantees);
            ddlGrantee.dataSource.sort({ field: "Name", dir: "asc" });
            ddlGrantee.refresh();
           

            var ddlGrantor = $("#ddlGrantor").data("kendoComboBox");
            ddlGrantor.setDataSource(grantors);
            ddlGrantor.dataSource.sort({ field: "Name", dir: "asc" });
            ddlGrantor.refresh();

            var ddlDistrict = $("#ddlDistrict").data("kendoComboBox");
            ddlDistrict.setDataSource(districts);
            ddlDistrict.dataSource.sort({ field: "Name", dir: "asc" });
            ddlDistrict.refresh();
            
            
            var ddlType = $("#ddlBrowseType").data("kendoComboBox");
            ddlType.setDataSource(deedTypes);
            ddlType.dataSource.sort({ field: "Name", dir: "asc" });
            ddlType.refresh();

            var ddlBrowseGrantee = $("#ddlBrowseGrantee").data("kendoComboBox");
            ddlBrowseGrantee.setDataSource(grantees);
            ddlBrowseGrantee.dataSource.sort({ field: "Name", dir: "asc" });
            ddlBrowseGrantee.refresh();

            var ddlBrowseGrantor = $("#ddlBrowseGrantor").data("kendoComboBox");
            ddlBrowseGrantor.setDataSource(grantors);
            ddlBrowseGrantor.dataSource.sort({ field: "Name", dir: "asc" });
            ddlBrowseGrantor.refresh();
            
          $m.getCurrentDeedNo();
        },
        getCurrentDeedNo:function () {
            var query ='SELECT TOP 1 d.DeedNumber FROM Deed d ORDER BY d.CreatedDate DESC';
           $m.settings.common.ajaxFunction('/DeedLedger/GetCurrentDeedNumber', 'POST', null, query,false);
        },
        notify:function(d){
          
            if(JSON.parse(d).Result){
                
                $m.settings.common.showNotification("Successfully Saved", "success");
                
                if(JSON.parse(d).Request.Targert === "SaveDeed")
                   $m.clearDeedForm();
            }
            else{
                 $m.settings.common.showNotification("Record Saving Failed", "error");
            }
            
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
            $m.deedModel = {};
            $m.attachmentsToDelete = [];
            $m.deedModel = deedObj;
         
            if($("#ddlType").data("kendoComboBox"))
            $("#ddlType").data("kendoComboBox").value($m.deedModel.DeedTypeId);
            
            if($("#ddlGrantee").data("kendoComboBox"))
            $("#ddlGrantee").data("kendoComboBox").value($m.deedModel.GranteeId);
            
            if($("#ddlGrantor").data("kendoComboBox"))
            $("#ddlGrantor").data("kendoComboBox").value($m.deedModel.GrantorId);
            
            if($("#ddlDistrict").data("kendoComboBox"))
             $("#ddlDistrict").data("kendoComboBox").value($m.deedModel.DistrictId);
           
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
            
             if($m.deedModel.Availability){
                  $("#chkAvailability").prop('checked', true);
                   $('#btnBorrow').prop('disabled', false);
             }
             else{
                 $("#chkAvailability").prop('checked', false);   
                  $('#btnBorrow').prop('disabled', true);
             }
             $("#txt-search-deed-no").val(""); 
                 
             $("#txtBorrowNIC").val($m.deedModel.BorrowerNIC);
             $("#txtBorrowPIN").val($m.deedModel.BorrowerPIN);
             $("#txtBorrowUserName").val($m.deedModel.BorrowerName);
             
              $m.uploadedFiles = $m.deedModel.Attachments;
              $m.showUploadedFiles();
                  
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
                pageSize: 10,
                page:1,
                serverPaging: false
            });
             $("#grdDeedMultipleResult").data("kendoGrid").setDataSource(dataSource);
            dataSource.read();
            $("#grdDeedMultipleResult").data("kendoGrid").refresh();
            //Open Popup
            $("#displayMultipleDeedSearchResult").modal('toggle');
        },
        clearDeedForm:function () {
            
            //Clear Deed Form Data
             if($("#ddlType").data("kendoComboBox"))
            $("#ddlType").data("kendoComboBox").text('');
            
             if($("#ddlGrantee").data("kendoComboBox"))
            $("#ddlGrantee").data("kendoComboBox").text('');
            
            if($("#ddlGrantor").data("kendoComboBox"))
            $("#ddlGrantor").data("kendoComboBox").text('');
            
            if($("#ddlDistrict").data("kendoComboBox"))
             $("#ddlDistrict").data("kendoComboBox").text('');
           
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
            var todayDate = kendo.toString(kendo.parseDate(new Date()), 'MM/dd/yyyy');
            if($("#date").data("kendoDatePicker"))
            $("#date").data("kendoDatePicker").value(todayDate);
            
            if($("#dtRegisterOn").data("kendoDatePicker"))
            $("#dtRegisterOn").data("kendoDatePicker").value(todayDate);
            
            $("#chkAvailability").prop('checked', false);
          
            $('#btnGranteePopup').prop('disabled', true);
            $('#btnGrantorPopup').prop('disabled', true);  
          
            $("#txtBorrowNIC").val("");
            $("#txtBorrowPIN").val("");
            $("#txtBorrowUserName").val("");
            $('#btnBorrow').prop('disabled', true);
                 
            $m.getCurrentDeedNo();  
            $m.showUploadedFiles(); 
            $m.deleteAttachments();
           
        },
        
          saveGranteeData :function (guid) {
                var granteeObj = {};
                    granteeObj.ID = guid;
                    granteeObj.Name = $("#txtGranteeUserName").val();
                    granteeObj.Address = $("#txtGranteeAddress").val();
                    granteeObj.Email = $("#txtGranteeEmail").val();
                    granteeObj.ContactNumber = $("#txtGranteeContactNo").val();
                    granteeObj.NIC = $("#txtGranteeNIC").val();
                    
                // Push to master data global variable
                if($m.masterData && $m.masterData.Grantees)
                 $m.masterData.Grantees.push(granteeObj);

                // Adding to grantee data source
                $("#ddlGrantee").data("kendoComboBox").dataSource.insert(granteeObj);
                 
                $("#ddlGrantee").data("kendoComboBox").value(granteeObj.ID);
                // Calling the save master data function  
                $m.settings.common.saveMasterData(null, $m.masterData);
                // Clear grantee model data
          
                $('#addGranteeModel').modal('toggle');        
               
        },
        saveGrantorData :function (guid) {
                var grantorObj = {};
                    grantorObj.ID = guid;
                    grantorObj.Name = $("#txtGrantorUserName").val();
                    grantorObj.Address = $("#txtGrantorAddress").val();
                    grantorObj.Email = $("#txtGrantorEmail").val();
                    grantorObj.ContactNumber = $("#txtGrantorContactNo").val();
                    grantorObj.NIC = $("#txtGrantorNIC").val();
                
                
                // Push to master data global variable
                if($m.masterData && $m.masterData.Grantors)
                 $m.masterData.Grantors.push(grantorObj);

                // Adding to grantor data source
                $("#ddlGrantor").data("kendoComboBox").dataSource.insert(grantorObj);
                $("#ddlGrantor").data("kendoComboBox").value(grantorObj.ID);

                // Calling the save master data function  
                //uncomment this later
                $m.settings.common.saveMasterData(null, $m.masterData);
                // Clear grantor model data
                $('#addGrantorModel').modal('toggle');   
               
               
        },
        clearGranteeModel:function(){
            $("#txtGranteeUserName").val("");
            $("#txtGranteeAddress").val("");
            $("#txtGranteeEmail").val("");
            $("#txtGranteeContactNo").val("");
            $("#txtGranteeNIC").val("");
            $('#bsAlert').alert("close");
        },
        clearGrantorModel:function(){
            $("#txtGrantorUserName").val("");
            $("#txtGrantorAddress").val("");
            $("#txtGrantorEmail").val("");
            $("#txtGrantorContactNo").val("");
            $("#txtGrantorNIC").val("");  
            $('#bsAlert').alert("close");     
        },
        prepareDeedModel:function () {
              if ($("#ddlType").data("kendoComboBox").value() == "") {
                    $m.settings.common.showNotification("Deed Type Required", "warning");
                    return;
                } else {
                    $m.deedModel.DeedTypeId = $("#ddlType").data("kendoComboBox").value();
                }
                
                if ($("#ddlGrantee").data("kendoComboBox").value() == "") {
                    $m.settings.common.showNotification("Grantee Required", "warning");
                    return;
                } else {
                    $m.deedModel.GranteeId = $("#ddlGrantee").data("kendoComboBox").value();
                }
                
                 if ($("#ddlGrantor").data("kendoComboBox").value() == "") {
                    $m.settings.common.showNotification("Grantor Required", "warning");
                    return;
                } else {
                    $m.deedModel.GrantorId = $("#ddlGrantor").data("kendoComboBox").value();
                }
                
                 if ($("#ddlDistrict").data("kendoComboBox").value() == "") {
                    $m.settings.common.showNotification("District Required", "warning");
                    return;
                } else {
                    $m.deedModel.DistrictId = $("#ddlDistrict").data("kendoComboBox").value();
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
                
                
                 $m.deedModel.Consideration = $("#txtConsideration").val();
                
                
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
                  
                  $m.deedModel.Remarks = $("#txtRemarks").val();
                
                
                  $m.deedModel.Date = $("#date").data("kendoDatePicker").value();
                  $m.deedModel.Availability = $("#chkAvailability").prop('checked');
                  $m.deedModel.RegisterOn = $("#dtRegisterOn").data("kendoDatePicker").value();
                  $m.deedModel.BorrowerName = $("#txtBorrowUserName").val();
                  $m.deedModel.BorrowerNIC = $("#txtBorrowNIC").val();
                  $m.deedModel.BorrowerPIN = $("#txtBorrowPIN").val();
          
                  if(!$m.deedModel.CreatedDate)
                    $m.deedModel.CreatedDate = new Date();
                 
                  $m.deedModel.UpdatedDate = new Date();
                   $m.deedModel.Attachments = $m.uploadedFiles;
                  
                  $m.saveDeedLedger('/DeedLedger/SaveDeedLedger', 'POST', $m.deedModel); 
                  $m.deedModel = {};
                  $m.uploadedFiles = [];  
                  
                 
        },
       browseDeedResponse:function (data) {
            /// <summary>
            /// Callback function for deed search responseS
            /// </summary>
             /// <param name="data" type="type"> search response Json string</param>
          
            var deeds = JSON.parse(JSON.parse(data).JsonResult);
            var deedsLength = 0;
               if(deeds)
               deedsLength = deeds.length;
        
                if(deedsLength > 1){
                    $m.setMultipleBrowseDataSource(deeds);
                }
                else if(deedsLength > 0){
                    $m.bindDeedData(deeds[0]);
                    $("#browseModal").modal('toggle');
                }else{
                     $m.setMultipleBrowseDataSource(deeds);
                     $m.settings.common.setValidationMessages("val-messageBrowse","info","No Results Found");
                }
                
            
       },
       setMultipleBrowseDataSource:function (deedList) {
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
                pageSize: 10,
                page:1,
                serverPaging: false
            });
             $("#grdBrowseMultipleResult").data("kendoGrid").setDataSource(dataSource);
            dataSource.read();
            $("#grdBrowseMultipleResult").data("kendoGrid").refresh();
            
       },
       buildBrowseQuery:function(){
           
          var whereClause = "";
           if($("#ddlBrowseType").val() !=""){
                 whereClause = "WHERE d.DeedTypeId = '"+$("#ddlBrowseType").val() +"'";
             }
             if($("#ddlBrowseGrantee").val() !=""){
                 if(whereClause === "")
                   whereClause = "WHERE d.GranteeId = '"+$("#ddlBrowseGrantee").val() +"'";
                 else
                   whereClause = whereClause + " OR d.GranteeId = '"+$("#ddlBrowseGrantee").val() +"'";
             }
             if($("#ddlBrowseGrantor").val() !=""){
                 if(whereClause === "")
                   whereClause = "WHERE d.GrantorId = '"+$("#ddlBrowseGrantor").val() +"'";
                 else
                   whereClause = whereClause + " OR d.GrantorId = '"+$("#ddlBrowseGrantor").val() +"'";
             }
             if($("#ddlBrowseDistrict").val() !=""){
                 if(whereClause === "")
                   whereClause = "WHERE d.DistrictId = '"+$("#ddlBrowseDistrict").val() +"'";
                 else
                   whereClause = whereClause + " OR d.DistrictId = '"+$("#ddlBrowseDistrict").val() +"'";
             }
              if($("#txtBrowseDeedNo").val() !=""){
                 if(whereClause === "")
                   whereClause = "WHERE LOWER(d.DeedNumber) = LOWER('"+$("#txtBrowseDeedNo").val() +"')";
                 else
                   whereClause = whereClause + " OR LOWER(d.DeedNumber) = LOWER('"+$("#txtBrowseDeedNo").val() +"')";
             }
              if($("#txtBrowseNameOfLand").val() !=""){
                 if(whereClause === "")
                   whereClause = "WHERE LOWER(d.NameOfLand) = LOWER('"+$("#txtBrowseNameOfLand").val() +"')";
                 else
                   whereClause = whereClause + " OR LOWER(d.NameOfLand) = LOWER('"+$("#txtBrowseNameOfLand").val() +"')";
             }
             return whereClause;
       },
       onGranteeFiltering:function (data) {
           //debugger;
         var  dts = $.grep($m.masterData.Grantees,function (e) {return (e.Name.toLowerCase().indexOf(data.filter.value.toLowerCase()) >= 0)|| (e.NIC.toLowerCase().indexOf(data.filter.value.toLowerCase()) >=0) || (e.ContactNumber.toLowerCase().indexOf(data.filter.value.toLowerCase()) >=0) });
           
            var ddlGrantee = $("#ddlGrantee").data("kendoComboBox");
            ddlGrantee.setDataSource(dts);
            ddlGrantee.dataSource.sort({ field: "Name", dir: "asc" });
            ddlGrantee.refresh();
            
           
            if(dts.length >0)
            $('#btnGranteePopup').prop('disabled', true);
            else
             $('#btnGranteePopup').prop('disabled', false);
       },
       onGrantorFiltering:function (data) {
           //debugger;
         var  dts = $.grep($m.masterData.Grantors,function (e) {return (e.Name.toLowerCase().indexOf(data.filter.value.toLowerCase()) >= 0)|| (e.NIC.toLowerCase().indexOf(data.filter.value.toLowerCase()) >=0) || (e.ContactNumber.toLowerCase().indexOf(data.filter.value.toLowerCase()) >=0) });
      
            var ddlGrantor = $("#ddlGrantor").data("kendoComboBox");
            ddlGrantor.setDataSource(dts);
            ddlGrantor.dataSource.sort({ field: "Name", dir: "asc" });
            ddlGrantor.refresh();
            
             if(dts.length >0)
            $('#btnGrantorPopup').prop('disabled', true);
            else
             $('#btnGrantorPopup').prop('disabled', false);
       },
        onFileUpload:function(e) {
            
            if($("#txtDeedNo").val() !=""){
                e.data = { 
            client : "client1" , 
            deedNumber:"Deed/"+$("#txtDeedNo").val()
            };  
            }else{
                $m.settings.common.showNotification("Deed Number Required", "warning");
                return false;
            }   
       },
       onUploadSuccess:function (e) {
           
           if(e.files){
                for (var i = 0, x = e.files.length; i < x; i++){
                   var data = $.grep($m.uploadedFiles,function (d) {return d.Name === e.files[i].name;});
                 if(data.length <1){
                       var url = $m.blobEndPoint+"client1"+"/"+$("#txtDeedNo").val()+"/"+e.files[i].name;
                    var file = {};
                    file.Name = e.files[i].name;
                    file.Extension = e.files[i].extension;
                    file.Type = e.files[i].rawFile.type;
                    file.Url = url;
                    file.BlobDir = "Deed/"+$("#txtDeedNo").val();
                    $m.uploadedFiles.push(file);
                   }
                    
                }
               
           }
               $m.showUploadedFiles(); 
               
                   
       },
    
       nextDeedNumberReponse:function (data) {
        
           if(data){
               var newDeedNumber = 1;
               if(JSON.parse(JSON.parse(data).JsonResult).length >0 ){
                 var currentDeedNumber = JSON.parse(JSON.parse(data).JsonResult)[0].DeedNumber;
                  var numberPattern = /\d+/g;
                   var num = currentDeedNumber.match( numberPattern)[0];
                   var newDeedNumber = parseInt(num) + 1;
               }
               var num2 = $m.paddingNumber(newDeedNumber);
                var formattedNum = $m.masterData.DeedNumberPrefix + num2;
                $("#txtDeedNo").val(formattedNum);  
           }
       },
        paddingNumber:function(n) {
            if(n<10){
                return ("000"+n);
            }
            else if(n<100){
                return ("00"+n);
            }
            else if(n<1000){
                return ("000"+n);
            }
            else{
                return n;
            }
            
        },
        showUploadedFiles:function () {
          
          var imageCnt = 0;
          var docCnt = 0;
          if($m.uploadedFiles.length > 0){
             for (var i = 0, x = $m.uploadedFiles.length; i < x; i++){
                if($m.uploadedFiles[i].Type.indexOf("image") > -1){
                    imageCnt++
                }
                else{
                    docCnt++;
                }
                $("#spnPhotos").text(imageCnt.toString());
                $("#spnDocuments").text(docCnt.toString());
                
              //  debugger;
            }  
          }
          else{
               $("#spnPhotos").text(0);
                $("#spnDocuments").text(0);
          }
           
            
        },
        setAttachmentDataSource:function (type) {
            var data = [];
            if(type ==="photos"){
                data = $.grep($m.uploadedFiles,function (e) {return (e.Type.toLowerCase().indexOf("image") >= 0)});
            }
            else{
                data = $.grep($m.uploadedFiles,function (e) {return (e.Type.toLowerCase().indexOf("image") < 0)});
            }
           
            var dataLength = data.length;
            
                 var dataSource = new kendo.data.DataSource({  
                data: data,
                pageSize: 3,
                page:1,
                serverPaging: false
            });
             $("#grdViewAttachments").data("kendoGrid").setDataSource(dataSource);
            dataSource.read();
            $("#grdViewAttachments").data("kendoGrid").refresh();
            
           // $('#viewAttachmentModel').modal('toggle');   
            return dataLength;
               
        },
        deleteAttachments:function(){
            
            if($m.attachmentsToDelete.length >0){
                var params = {};
                params.client = "client1";
                params.files = JSON.stringify($m.attachmentsToDelete);
                $m.settings.common.ajaxFunctionMultiParam('/DeedLedger/DeleteFiles', 'POST', null, params);     
            }
           $m.attachmentsToDelete = [];
        },
        downloadFile:function (file) {
           // window.location = file;
            window.open(
  file,
  '_blank' // <- This is what makes it open in a new window.
);
        }
    };

    return $m;
}(window.Welkin, window.Welkin.$,window.Welkin.DeedHandler || {}));