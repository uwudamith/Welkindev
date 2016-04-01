using System.Web.Optimization;
using Welkin.UI.Helpers;

namespace Welkin.UI
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
           // bundles.Clear();
            ScriptBundle(bundles);

            ThemeBundle(bundles);

            //bundles.IgnoreList.Clear();
        }

        private static void ScriptBundle(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                "~/Scripts/jquery.validate*"));

            //bundles.Add(new ScriptBundle("~/bundles/bootstrapval").Include(
            //    "~/Scripts/validator.js"));
            bundles.Add(new ScriptBundle("~/bundles/jqueryui").Include(
                "~/Scripts/jquery-ui-1.11.4.js"));

            bundles.Add(new ScriptBundle("~/bundles/signalr").Include(
                "~/Scripts/jquery.signalR-2.2.0.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/app").Include(
                 "~/Scripts/app/boot.js",
                "~/Scripts/app/utils/utils.signalR.js",
                "~/Scripts/app/handlers/CaseHandler.js",
                "~/Scripts/app/handlers/DeedHandler.js",
               "~/Scripts/app/handlers/DraftHandler.js",
               "~/Scripts/app/handlers/SchedulerHandler.js"

                ));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                "~/Scripts/bootstrap.js",
                "~/Scripts/bootstrap-checkbox.js",
                "~/Scripts/bootstrap-checkbox.min.js",
                "~/Scripts/bootstrap-treeview.js",
                "~/Scripts/respond.js"));

            bundles.Add(new ScriptBundle("~/bundles/kendo-jquery").Include(
                "~/Scripts/kendo/jquery.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/kendo-web").Include(
                "~/Scripts/kendo/kendo.web.min.js",
                "~/Scripts/kendo/kendo.all.min.js",
                "~/Scripts/kendo/kendo.aspnetmvc.min.js"
                //"~/Scripts/kendo/kendo.timezones.min.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/notify").Include(
               "~/Scripts/bootstrap-notify.min.js"
              ));
        }

        private static void ThemeBundle(BundleCollection bundles)
        {
            KendoTheme(bundles);

            //bundles.Add(new StyleBundle("~/Content/dataviz/css").Include(
            //    "~/Content/dataviz/kendo.dataviz.min.css",
            //    "~/Content/dataviz/kendo.dataviz.default.min.css"));

            //bundles.Add(new StyleBundle("~/Content/kendo/mobile/css").Include(
            //    "~/Content/kendo/mobile/kendo.mobile.all.min.css"));


            bundles.Add(new StyleBundle("~/Content/css").Include(
                "~/Content/bootstrap.min.css",
                "~/Content/bootstrap-theme.min.css",
                "~/Content/site.css"));
        }

        private static void KendoTheme(BundleCollection bundles)
        {
            bundles.Add(new StyleBundle("~/Content/kendo/web/css").Include(
                "~/Content/kendo/web/kendo.common.min.css",
                "~/Content/kendo/web/kendo.rtl.min.css",
                string.Format("~/Content/kendo/web/kendo.{0}.min.css",
                    ConfigurationProvider.DefaultThemeForKendo.ToLower())
                ));
        }
    }
}