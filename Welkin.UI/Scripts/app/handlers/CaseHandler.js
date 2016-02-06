window.Welkin.CaseHandler = window.Welkin.CaseHandler || (function($scope, $) {
    /// <summary>
    ///     Case ledger handler
    /// </summary>
    /// <param name="$scope">Application Scope </param>
    /// <param name="$">jQuery</param> 
    $this = this;

    init = function(options) {
        $this.settings = $scope.$.extend(true, {
           
        }, options);
        if ($this.settings.sAgent) {
            $this.settings.sAgent.registerEvents([
                {
                    name: "PopulateDropdown",
                    fn: $this.populateDropdown
                }
            ]);
            $this.settings.sAgent.start();
        }
        
    };

    populateDropdown = function (a) {

        var caseTypes = JSON.parse(JSON.parse(a).JsonResult)[0].CaseTypes;
        var courts = JSON.parse(JSON.parse(a).JsonResult)[0].Courts;
         var parties = JSON.parse(JSON.parse(a).JsonResult)[0].Parties;

        var ddl = $("#ddlType").data("kendoDropDownList");
        ddl.setDataSource(caseTypes);
        ddl.refresh();

        var ddlCourt = $("#ddlCourt").data("kendoDropDownList");
        ddlCourt.setDataSource(courts);
        ddlCourt.refresh();

         var ddlParty = $("#ddlParty").data("kendoDropDownList");
        ddlParty.setDataSource(parties);
        ddlParty.refresh();
    };


    return this;

}(window.Welkin, window.Welkin.$));