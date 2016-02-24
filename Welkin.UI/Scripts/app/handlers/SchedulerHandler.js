window.Welkin.SchedulerHandler = (function ($scope, $, $m) {
    /// <summary>
    ///     scheduler handler
    /// </summary>
    /// <param name="$scope">Application Scope </param>
    /// <param name="$">jQuery</param> 
    
        $m = {
            schedulerData : [],
            masterData:{},
            init: function(options) {
             
                    this.settings = $scope.$.extend(true, {
                    }, options);
                    if (this.settings.sAgent) {
                        this.settings.sAgent.registerEvents([
                            {
                                name: "masterDataResponse",
                                fn: this.masterDataResponse
                            }
                        ]);
                        this.settings.sAgent.start();
                    }
                     $m.initControlls();
                    
                    $("#people :checkbox").change(function(e) {
                        var checked = $.map($("#people :checked"), function(checkbox) {
                            return parseInt($(checkbox).val());
                        });
                        var scheduler = $("#scheduler").data("kendoScheduler");
                        scheduler.dataSource.filter({
                            operator: function(task) {
                              
                                return $.inArray(task.ownerId, checked) >= 0;
                            }
                        });
                    });
                },
                 initControlls: function () {
                     
                    

                 },
                 masterDataResponse:function(data){
                    $m.masterData = JSON.parse(JSON.parse(data).JsonResult)[0];
                    
    
                    var sData = [];
                    
                    var d1 = {};
                    d1.id = "03528fc0-fb8e-20f8-02ef-eeeda83d8cba";
                    d1.start =new Date("2016/2/24 11:00 AM");
                    d1.end = new Date("2016/2/24 1:00 PM");
                    d1.title = "Meeting 1"
                    d1.attendees = "03528fc0-fb8e-20f8-02ef-eeeda83d8cba"
                    
                     var d2 = {};
                    d2.id = "b1408d1c-e9d5-aa60-62ac-3a625f5a9465";
                    d2.start =new Date("2016/2/24 11:00 AM");
                    d2.end = new Date("2016/2/24 1:00 PM");
                    d2.title = "Meeting 2"
                    d2.attendees = "b1408d1c-e9d5-aa60-62ac-3a625f5a9465"
                    
                    sData.push(d1);
                    sData.push(d2);
                    $m.populateScedulerData(sData);
                 },
                 
                 populateScedulerData:function(sdata){
          
                     var users = $m.masterData.Users;
                     var resourcesData = [];
                     var resources = {};
                     var resourceList = [];           
                   
                    for (var i = 0, x = users.length; i < x; i++){
                      var data = {};
                      data.text = users[i].FirstName +" " + users[i].LastName;
                      data.value = users[i].id;
                      data.color = $m.makeRandomColor.toString();
                      resourcesData.push(data);
                      
                    }
                    
                    resources.field = "attendees";
                    resources.title ="Attendees";
                    resources.dataSource = resourcesData;
                    resourceList.push(resources);
                    $m.createScheduler(resourceList,sdata);

                 },
                  save:function(e){            
                    debugger;
                    var task = {};
                    
                    task.taskId = "";
                    task.title = e.event.title;
                    task.atendees = e.event.atendees;
                    task.start = e.event.start;
                    task.end = e.event.end;
                    $m.schedulerData.push(task);
                    
                    var dataSource = new kendo.data.SchedulerDataSource({
                                data: $m.schedulerData
                            });
                            
                        var scheduler = $("#scheduler").data("kendoScheduler");
                        scheduler.setDataSource(dataSource);

                  },
                  createScheduler:function(resources,datasource){
                      
                      debugger;
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
                        resources:  resources
                        });
                  }, makeRandomColor:function(){
                        var c = '';
                        while (c.length < 7) {
                            c += (Math.random()).toString(16).substr(-6).substr(-1)
                        }
                        return '#'+c;
                    }

        };

return $m;


    } (window.Welkin, window.Welkin.$, window.Welkin.SchedulerHandler || {}));