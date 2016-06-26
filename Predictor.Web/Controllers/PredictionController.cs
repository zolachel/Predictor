using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Predictor.Business;
using Microsoft.AspNet.Identity;
using Predictor.Model;

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

        [HttpPost]
        public JsonResult Predict(PredictionModel model) {
            model.UserId = User.Identity.GetUserId();

            return Json((new PredictionBiz()).AddOrUpdatePrediction(model));
        }
    }
}