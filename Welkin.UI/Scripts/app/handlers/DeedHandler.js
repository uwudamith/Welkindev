window.Welkin.DeedHandler = window.Welkin.DeedHandler || (function($scope, $) {

$this = this;
    initialize = function(options) {
        
       $this.settings = $scope.$.extend(true, {
           
        }, options);
        if ($this.settings.sAgent) {
            $this.settings.sAgent.registerEvents([
                {
                    name: "PopulateDeedDropdown",
                    fn: $this.PopulateDeedDropdown
                }
            ]);
            $this.settings.sAgent.start();
        }
    };

    
     PopulateDeedDropdown = function (a) {
       
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
    };

    return this;
}(window.Welkin, window.Welkin.$));