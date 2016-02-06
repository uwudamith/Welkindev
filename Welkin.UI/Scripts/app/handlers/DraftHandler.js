window.Welkin.DraftHandler = window.Welkin.DraftHandler || (function($scope, $) {

$this = this;
    initDraft = function(options) {
       $this.settings = $scope.$.extend(true, {
           
        }, options);
        if ($this.settings.sAgent) {
            $this.settings.sAgent.registerEvents([
                {
                    name: "PopulateDraftDropdown",
                    fn: $this.PopulateDraftDropdown
                }
            ]);
            $this.settings.sAgent.start();
        }
    };

     PopulateDraftDropdown = function (a) {
        var grantees = JSON.parse(JSON.parse(a).JsonResult)[0].Grantees;  
        var ddlGrantee = $("#ddlGrantee").data("kendoDropDownList");
        ddlGrantee.setDataSource(grantees);
        ddlGrantee.refresh();

    };
  return this;
}(window.Welkin, window.Welkin.$));