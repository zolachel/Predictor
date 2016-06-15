using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Predictor.Business;
using Microsoft.AspNet.Identity;

namespace Predictor.Web.Controllers
{
    [Authorize]
    public class PredictionController : BaseController
    {
        public ActionResult Predict() {
            return View();
        }

        public ActionResult Result() {
            return View();
        }

        public ActionResult Table() {
            return View();
        }

        [HttpPost]
        public JsonResult GetPredictableMatchs() {
            return Json((new PredictionBiz()).GetPredictableMatchs(User.Identity.GetUserId()));
        }
    }
}