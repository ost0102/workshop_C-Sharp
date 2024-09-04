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
    public class CommunityRegistController : Controller
    {
        DataTable dt = new DataTable();
        DataSet ds = new DataSet();

        DataTable ResultDt = new DataTable();
        Sql_Reservation SR = new Sql_Reservation();

        string strJson = "";
        string strResult = "";

        public class JsonData
        {
            public string vJsonData { get; set; }
        }

        public ActionResult index()
        {
            ViewBag.MENU_NM = "Community";
            return View();            
        }

    }
}
