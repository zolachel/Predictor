using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Net;
using System.Web.Mvc;
using System.Web.Routing;

namespace Predictor.Web.Filters
{
    public class FilterExceptionAttribute : HandleErrorAttribute
    {
        public override void OnException(ExceptionContext filterContext) {
            string errorMessage;

            // Check each type of exception (Business vs non-business)
            if (filterContext.Exception.GetType().ToString().Contains("SevenPeaksSoftware.Azure.NotificationHub.Model.Exceptions")) {
                errorMessage = filterContext.Exception.Message;
            } else {
                errorMessage = filterContext.Exception.Message;
                //errorMessage = "An error occurred while processing your request. Please contract admin.";
            }

            if (filterContext.HttpContext.Request.IsAjaxRequest()) {
                filterContext.HttpContext.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                filterContext.Result = new JsonResult {
                    Data = new { message = errorMessage }
                };
            } else {
                filterContext.Result = new RedirectToRouteResult(new RouteValueDictionary(new {
                    controller = "Home",
                    action = "Error",
                    area = ""
                }));
            }
            filterContext.ExceptionHandled = true;
        }
    }
}