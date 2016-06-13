using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

using Microsoft.AspNet.Identity.Owin;

using Predictor.Web.Models;

namespace Predictor.Web.Controllers
{
    public class HomeController : Controller
    {
        #region properties

        private ApplicationSignInManager SignInManager
        {
            get
            {
                return HttpContext.GetOwinContext().Get<ApplicationSignInManager>();
            }
        }

        #endregion

        public ActionResult Index(string returnUrl) {
            ViewBag.ReturnUrl = returnUrl;
            return View();
        }

        [HttpPost]
        public async Task<bool> Login(LoginViewModel model) {
            // This doesn't count login failures towards account lockout
            // To enable password failures to trigger account lockout, change to shouldLockout: true
            SignInStatus result = await SignInManager.PasswordSignInAsync(model.Email, model.Password, model.RememberMe, shouldLockout: true);

            if (result == SignInStatus.Success)
                return true;
            else
                return false;
        }
    }
}