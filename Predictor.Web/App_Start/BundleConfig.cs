using System.Web;
using System.Web.Optimization;

namespace Predictor.Web
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles) {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            bundles.Add(new ScriptBundle("~/bundles/react").Include(
                        "~/Scripts/react-15.1.0.js",
                        "~/Scripts/react-dom-15.1.0.js"
                        ));

            bundles.Add(new ScriptBundle("~/bundles/plugin").Include(
                        "~/Scripts/jquery.noty.packaged.min.js"
                        ));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/site.css"));
        }
    }
}
