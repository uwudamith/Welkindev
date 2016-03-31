window.Welkin.SchedulerHandler = (function ($scope, $, $m) {
    /// <summary>
    ///     scheduler handler
    /// </summary>
    /// <param name="$scope">Application Scope </param>
    /// <param name="$">jQuery</param> 
    
        $m = {
            schedulerData : [],
            masterData:{},
            currentTask:{},
            init: function(options) {
             
                    this.settings = $scope.$.extend(true, {
                    }, options);
                    if (this.settings.sAgent) {
                        this.settings.sAgent.registerEvents([
                            {
                                name: "masterDataResponse",
                                fn: this.masterDataResponse
                            },
                            {
                                name:"getSchedulerDataResponse",
                                fn:this.getSchedulerDataResponse
                            },
                            {
                                name:"notifyScheduler",
                                fn:this.notifyScheduler
                            }
                        ]);
                        this.settings.sAgent.start();
                    }
                     $m.initControlls();
                     
                    
                    $('#people').on("click", 'input[type="checkbox"]', function (e) {
                   
                   
                   var checked = [];
                     var checkboxes =   $('#people input[type="checkbox"]');
                     if(checkboxes){
                          for (var i = 0, x = checkboxes.length; i < x; i++){
                             if(checkboxes[i].checked)
                             checked.push(checkboxes[i].value);                     
                           }
                            var scheduler = $("#scheduler").data("kendoScheduler");
                        scheduler.dataSource.filter({
                            operator: function(task) {
                              
                                return $.inArray(task.attendees, checked) >= 0;
                            }
                        });
                     }
                    
                    });
                },
                 initControlls: function () {
                    
                     
                    

                 },
                 masterDataResponse:function(data){
                  
                    $m.masterData = JSON.parse(JSON.parse(data).JsonResult)[0];
                    
                    var searchQuery = "SELECT * FROM Data d WHERE d.Type ='Scheduler' AND d.ClientId = '"+ $scope.Configs.ClientId+ "'";
                    $m.settings.common.ajaxFunction('/Scheduler/GetSchedulerData', 'POST', null, searchQuery,false);
                    
 
                 },
                 getSchedulerDataResponse:function (data) {
             
                    var sDatasrc = {};
                  
                    var model = {};
                         model = '{"id":"id","fields":{ "id":{ "type":"string"},"title":{"defaultValue":"No title","validation":{"required":"true"}},"start":{"type":"date"},"end":{"type":"date"},"description":{"type":"string"},"attendees":{ "defaultValue":1}}}';
                        
                    
                    $m.schedulerData = JSON.parse(JSON.parse(data).JsonResult);
                    sDatasrc.data = JSON.parse(JSON.parse(data).JsonResult);
                    var schema = {};
                    schema.model = JSON.parse(model);
                    var dataSource = new kendo.data.SchedulerDataSource({
                                data: $m.schedulerData,
                                schema:schema
                            });
                    
                    $m.populateScedulerData(dataSource);
                 },
                 
                 populateScedulerData:function(sdata){
                     //debugger;
                     var users = $m.masterData.Users;
                     var resourcesData = [];
                     var resources = {};
                     var resourceList = [];           
                     $('#people').empty();
                    for (var i = 0, x = users.length; i < x; i++){
                      var data = {};
                      data.text = users[i].FirstName +" " + users[i].LastName;
                      data.value = users[i].ID;
                      data.color =  users[i].DefaultColor;//$m.makeRandomColor.toString();
                      resourcesData.push(data);
                    
                    var chk = $('<input checked type="checkbox" id="chk' + users[i].FirstName+ users[i].LastName + '"  value="' + users[i].ID + '" > </input>');
                    var label = $('<label for="chk' + users[i].FirstName+ users[i].LastName + '" class="css-label">' + users[i].FirstName +' '+ users[i].LastName + '</label>');
                    $('#people').append(chk);
                    $('#people').append(label);
                    
                    }
                    
                    resources.field = "attendees";
                    resources.title ="Attendees";
                    resources.dataSource = resourcesData;
                    resourceList.push(resources);
                    $m.createScheduler(resourceList,sdata);

                 },
                  save:function(e){            
               
                   if(e.event.id != ""){
                       
                        for (var i = 0, x = $m.schedulerData.length; i < x; i++){
                        
                                    if($m.schedulerData[i].id && $m.schedulerData[i].id === e.event.id){
                                       
                                                $m.schedulerData[i].title = e.event.title;
                                                $m.schedulerData[i].start = e.event.start;
                                                $m.schedulerData[i].end = e.event.end;
                                                $m.schedulerData[i].description = e.event.description;
                                                $m.schedulerData[i].attendees = e.event.attendees;
                                                $m.schedulerData[i].CreatedBy = $scope.Configs.UserId;
                                                $m.schedulerData[i].CreatedDate = new Date();
                                                $m.schedulerData[i].Type = "Scheduler"; 
                                                $m.schedulerData[i].ClientId = $scope.Configs.ClientId; 
                                                $m.settings.common.ajaxFunction('/Scheduler/Save', 'POST', null, $m.schedulerData[i],true);
                                     }
                                 
                                    
                            }
                        }
                        else
                        {
                            $m.currentTask.title = e.event.title;
                            $m.currentTask.start = e.event.start;
                            $m.currentTask.end = e.event.end;
                            $m.currentTask.description = e.event.description;
                            $m.currentTask.attendees = e.event.attendees;
                            $m.currentTask.id = e.event.uid;
                            $m.currentTask.Type = "Scheduler";
                            $m.currentTask.ClientId = $scope.Configs.ClientId;
                            $m.currentTask.UpdatedBy = $scope.Configs.UserId;
                            $m.currentTask.UpdatedDate = new Date();
                         
                            $m.schedulerData.push($m.currentTask);
                            $m.settings.common.ajaxFunction('/Scheduler/Save', 'POST', null,$m.currentTask,true);
                     
                            $m.currentTask = {};
                            //$m.settings.common.createGUID($m.saveNewSchedulerTask);
                        }
                   
                  },
//                   saveNewSchedulerTask:function(guid){
//                   
//                     
//                     
//                     $m.schedulerData.push($m.currentTask);
//    
//                     
//                   },
                  setSchedulerDatasource:function () {
                      var dataSource = new kendo.data.SchedulerDataSource({
                                data: $m.schedulerData
                            });
                             $m.populateScedulerData(dataSource);
                        // var scheduler = $("#scheduler").data("kendoScheduler");
                        // scheduler.setDataSource(dataSource);
                        // dataSource.read();
                        // scheduler.refresh();
                  },
                  createScheduler:function(resources,datasource){
                      
                       if (!resources) {
                            resources = [];
                        }
                        
                        if (!datasource) {
                            datasource = [];
                        }
                        var ele = $("#scheduler");
                        var scheduler = ele.data("kendoScheduler");
                        if (scheduler) {
                            scheduler.destroy();
                            ele.html("");
                        }
                       $("#scheduler").kendoScheduler({
                        views: [
                            { type: "day" },
                            { type: "week" },
                            { type: "workWeek", selected: true },
                            { type: "month" },
                            {type:"agenda"},
                            { type: "timeline", eventHeight: 50}
                        ],
                        date:  kendo.toString(kendo.parseDate(new Date()), 'MM/dd/yyyy'),
                        edit: function(e) {
                            e.container.find("[name=isAllDay]").parent().prev().remove().end().remove();
                            e.container.find("[name=recurrenceRule]").parent().prev().remove().end().remove();
                        },
                        height:600,
                        dataSource: datasource,
                        save:$m.save,
                        remove:$m.delete,
                        resources:  resources
                        });
                  }, 
                  makeRandomColor:function(){
                        var c = '';
                        while (c.length < 7) {
                            c += (Math.random()).toString(16).substr(-6).substr(-1)
                        }
                        return '#'+c;
                    },
                   notifyScheduler:function(d){
          
                        if(JSON.parse(d).Result){
                            
                            
                            if(JSON.parse(d).Request.Targert === "DeleteTasks"){
                             
                              for (var i = 0, x = $m.schedulerData.length; i < x; i++){
                                    if($m.schedulerData[i].id === $m.currentTask.id){
                                                  $m.schedulerData.splice(i,1);      
                                      }
                                 }
                                 $m.settings.common.showNotification("Successfully Deleted", "success");  
                                 $m.currentTask = {};  
                                 var searchQuery = "SELECT * FROM Data d WHERE d.Type ='Scheduler' AND d.ClientId = '"+ $scope.Configs.ClientId+ "'";
                               $m.settings.common.ajaxFunction('/Scheduler/GetSchedulerData', 'POST', null, searchQuery,false);
                           
                                //   $m.setSchedulerDatasource();
                            }
                            else{
                                $m.settings.common.showNotification("Successfully Saved", "success"); 
                               var searchQuery = "SELECT * FROM Data d WHERE d.Type ='Scheduler' AND d.ClientId = '"+ $scope.Configs.ClientId+ "'";
                               $m.settings.common.ajaxFunction('/Scheduler/GetSchedulerData', 'POST', null, searchQuery,false);
                            
                            // $m.setSchedulerDatasource();
                            }
                            
                        }
                        else{
                            $m.settings.common.showNotification("Record Saving Failed", "error");
                        }
                   },
                   delete:function (e) {
                       //debugger;   
                           $m.currentTask.id = e.event.id;
                            var sQuery =  e.event.id;   //"SELECT  * FROM Scheduler s WHERE s.id = '"+ e.event.id +"'";
                            $m.settings.common.ajaxFunction('/Scheduler/DeleteTask', 'POST', null,sQuery,false);
                            
                   }

        };

return $m;


    } (window.Welkin, window.Welkin.$, window.Welkin.SchedulerHandler || {}));