﻿window.Welkin.DraftHandler = (function($scope, $, $m) {
    $m = { 
        init: function(options) {
        //alert("DraftHandler");
            this.settings = $scope.$.extend(true, {

            }, options);
            if (this.settings.sAgent) {
                this.settings.sAgent.registerEvents([
                    {
                        name: "PopulateDraftDropdown",
                        fn: this.populateDraftDropdown
                    }
                ]);
                this.settings.sAgent.start();
            }
        },

        populateDraftDropdown: function(a) {
            var grantees = JSON.parse(JSON.parse(a).JsonResult)[0].Grantees;
            //var ddlGrantee = $("#ddlGrantee").data("kendoDropDownList");
            //ddlGrantee.setDataSource(grantees);
            //ddlGrantee.refresh();
            debugger;
        }
    };
  return $m;
}(window.Welkin, window.Welkin.$,window.Welkin.DraftHandler || {}));



