using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Web.Mvc;
using WORKSHOP.Models;
using WORKSHOP.Models.Query;
using Newtonsoft.Json;

namespace WORKSHOP.Controllers.Admin
{
    public class AdFAQController : Controller
    {
        //
        // GET: /AdFAQ/

        public ActionResult Index()
        {
            return View();
        }

        public class JsonData
        {
            public string vJsonData { get; set; }
        }
        string strJson = "";


        [HttpPost]
        public ActionResult fnGetFAQList(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();

                DataTable dt = new DataTable();
                dt = JsonConvert.DeserializeObject<DataTable>(vJsonData);
                dt = Sql_FAQ.SelectFAQList(dt.Rows[0]);
                strJson = _common.MakeJson("Y", "Success", dt);
                return Json(strJson);
            }
            catch (Exception e)
            {
                strJson = e.Message;
                return Json(strJson);
            }
        }
        [HttpPost]
        public ActionResult fnGetFAQDetail(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();

                DataTable dt = new DataTable();
                dt = JsonConvert.DeserializeObject<DataTable>(vJsonData);
                dt = Sql_FAQ.SelectFAQDetail(dt.Rows[0]);
                strJson = _common.MakeJson("Y", "Success", dt);
                return Json(strJson);
            }
            catch (Exception e)
            {
                strJson = e.Message;
                return Json(strJson);
            }
        }

        [HttpPost]
        public ActionResult fnUpdateFAQ(JsonData value)
        {
            bool rtnStatus = false;
            //
            try
            {
                string vJsonData = value.vJsonData.ToString();

                DataTable dt = new DataTable();
                dt = JsonConvert.DeserializeObject<DataTable>(vJsonData);
                rtnStatus = Sql_FAQ.UpdateFAQ(dt.Rows[0]);
                strJson = _common.MakeJson("Y", "Success");
                return Json(strJson);
            }
            catch (Exception e)
            {
                strJson = e.Message;
                return Json(strJson);
            }
        }


        public ActionResult fnGetFAQTalkList(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();

                DataTable dt = new DataTable();
                DataTable rdt = new DataTable();
                DataSet ds = new DataSet();
                dt = JsonConvert.DeserializeObject<DataTable>(vJsonData);

                rdt = Sql_FAQ.SearchFAQDtl_Query(dt.Rows[0]);
                rdt.TableName= "TalkList";

                ds.Tables.Add(rdt);

                rdt = Sql_FAQ.SearchDtlData_Query(dt.Rows[0]);
                rdt.TableName = "DetailData";
                ds.Tables.Add(rdt);


                dt = new DataTable();
                dt.Columns.Add("trxCode");
                dt.Columns.Add("trxMsg");
                DataRow row1 = dt.NewRow();
                row1["trxCode"] = "Y";
                row1["trxMsg"] = "Success";
                dt.Rows.Add(row1);
                dt.TableName = "Result";
                ds.Tables.Add(dt);
                strJson = JsonConvert.SerializeObject(ds);

                //strJson = _common.MakeJson("Y", "Success", dt);
                return Json(strJson);
            }
            catch(Exception e)
            {
                strJson = e.Message;
                return Json(strJson);
            }
        }


        public ActionResult fnUpdateAnswer(JsonData value)
        {
            try
            {
                bool rtnStatus = false;
                string vJsonData = value.vJsonData.ToString();

                DataTable dt = new DataTable();
                dt = JsonConvert.DeserializeObject<DataTable>(vJsonData);

                //rtnStatus = Sql_FAQ.UpdateFAQ(dt.Rows[0]);

                rtnStatus = Sql_FAQ.UpdateAnswer(dt.Rows[0]);

                if (rtnStatus)
                {
                    dt = Sql_FAQ.SearchFAQDtl_Query(dt.Rows[0]);
                    strJson = _common.MakeJson("Y", "Success", dt);
                    
                }
                else
                {
                    strJson = _common.MakeJson("N", "FAIL");
                }
                return Json(strJson);
            }
            catch(Exception e)
            {
                strJson = e.Message;
                return Json(strJson);
            }
        }

    }
}
