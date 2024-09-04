using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using WORKSHOP.Models;
using Newtonsoft.Json;
using WORKSHOP.Models.Query;

namespace WORKSHOP.Controllers
{
    public class InquiryDetailController : Controller
    {
        public ActionResult index()
        {
            ViewBag.MENU_NM = "Inquiry";
            return View();            
        }

    }
}
