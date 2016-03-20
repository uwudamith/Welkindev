window.Welkin.DraftHandler = (function($scope, $, $m) {
    $m = { 
        init: function(options) {
        //alert("DraftHandler");
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
        },
        initControlls:function () {
            
              var inlineDefault = new kendo.data.HierarchicalDataSource({
            data: [
                {
                    text: "Case", items: [
                      {
                          text: "Land", items: [
                              {
                                  text:"Mortgage.docx"
                              }
                          ]
                      },
                      { text: "Partition" }
                    ]
                },
                {
                    text: "Deed"
                },
                {
                    text: "General"
                },
                {
                    text: "Misc", items: [
                        {
                            text: "Pedigree Diagram V1"
                        },
                        {
                            text: "Pedigree Diagram V2"
                        }
                    ]
                }
            ]
        });

        $("#treeview-left").kendoTreeView({
            dataSource: inlineDefault
        });
        },
        masterDataResponse: function(a) {
            var grantees = JSON.parse(JSON.parse(a).JsonResult)[0].Grantees;
            //var ddlGrantee = $("#ddlGrantee").data("kendoDropDownList");
            //ddlGrantee.setDataSource(grantees);
            //ddlGrantee.refresh();
           // debugger;
        }
        
    };
  return $m;
}(window.Welkin, window.Welkin.$,window.Welkin.DraftHandler || {}));



