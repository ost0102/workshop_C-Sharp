using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WORKSHOP.Controllers
{
    public class LanguageController : Controller
    {
        //
        // GET: /Language/

        public ActionResult SetLang(string strLang)
        {
            if (string.IsNullOrEmpty(strLang)) strLang = "EN";
            HttpContext.Session["Language"] = strLang;
            return RedirectToAction("Index", "Home");
        }

    }
}
