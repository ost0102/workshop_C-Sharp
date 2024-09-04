using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WORKSHOP.Controllers
{
    public class LoginController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.MENU_NM = "Login";
            return View();
        }
    }
}
