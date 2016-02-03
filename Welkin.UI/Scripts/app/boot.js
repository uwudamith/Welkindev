(function(w,$) {

    w.Welkin = {
        $ : $,
        PageMode: {
            action: "",
            controller: ""
        },
        Configs: {
            hubUrl: ""
        },
        init: function() {
            var $scope = this;
            $(document).ready(function() {
                if ($scope.PageMode.controller === "CaseLedger" && $scope.PageMode.action === "Index")
                    $scope.CaseHandler.init({
                        sAgent: new $scope.Utils.SignalR({
                            config: {
                                id: "1",
                            },
                            hub: {
                                url: $scope.Configs.hubUrl
                            }
                        })
                    });
            });
        }
    };
    w.Welkin.init();
}(window,jQuery));
