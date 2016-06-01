using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(Predictor.Web.Startup))]
namespace Predictor.Web
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
