using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;

using Predictor.Web.Models;

namespace Predictor.Web.Controllers
{
    public class HomeController : BaseController
    {
        #region properties
        private ApplicationUserManager _userManager;

        private ApplicationUserManager UserManager
        {
            get
            {
                if (_userManager == null) {
                    _userManager = HttpContext.GetOwinContext().GetUserManager<ApplicationUserManager>();
                }
                return _userManager;
            }
        }

        private ApplicationSignInManager SignInManager
        {
            get
            {
                return HttpContext.GetOwinContext().Get<ApplicationSignInManager>();
            }
        }

        #endregion

        public ActionResult Index(string returnUrl) {
            if (User.Identity.IsAuthenticated) {
                return RedirectToAction("Predict", "Prediction");
            } else {
                ViewBag.ReturnUrl = returnUrl;
                return View();
            }
        }

        public ActionResult Rules() {
            return View();
        }

        [HttpGet]
        public ActionResult Register() {
            if (User.Identity.IsAuthenticated) {
                return RedirectToAction("Predict", "Prediction");
            } else {
                return View();
            }
        }

        [HttpPost]
        public async Task<bool> Register(RegisterViewModel model, string nickname) {
            ApplicationUser newUser = new ApplicationUser { UserName = model.Email, Email = model.Email, PhoneNumber = nickname };

            IdentityResult result = await UserManager.CreateAsync(newUser, model.Password);

            if (result.Succeeded) {
                await UserManager.AddToRoleAsync(newUser.Id, "Player");
                
                return true;
            } else {
                return false;
            }
        }

        [HttpPost]
        public async Task<bool> Login(LoginViewModel model) {
            // This doesn't count login failures towards account lockout
            // To enable password failures to trigger account lockout, change to shouldLockout: true
            SignInStatus result = await SignInManager.PasswordSignInAsync(model.Email, model.Password, model.RememberMe, shouldLockout: true);

            if (result == SignInStatus.Success) {
                ApplicationUser user = await UserManager.FindByEmailAsync(model.Email);
                if (user.EmailConfirmed)
                    return true;
                else 
                    return false;
            } else
                return false;
        }

        [HttpPost]
        public void Logout() {
            HttpContext.GetOwinContext().Authentication.SignOut(DefaultAuthenticationTypes.ApplicationCookie);
        }

        [HttpGet]
        public ActionResult ForgotPassword() {
            return View();
        }
    }
}