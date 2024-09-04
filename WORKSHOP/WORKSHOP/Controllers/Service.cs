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
    public class ServiceController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.MENU_NM = "Service";
            return View();
        }


        string strJson = "";
        String strResult = "";
        DataTable dt = new DataTable();
        DataTable ResultDt = new DataTable();
        Sql_Service SN = new Sql_Service();
        public class JsonData
        {
            public string vJsonData { get; set; }
        }

        [HttpPost]
        public ActionResult fnSearchNotice(JsonData value)
        {
            try
            {
                strResult = value.vJsonData.ToString();

                dt = JsonConvert.DeserializeObject<DataTable>(strResult);

                ResultDt = _DataHelper.ExecuteDataTable(SN.Search_Notice(dt.Rows[0]), CommandType.Text);
                
                strJson = _common.MakeJson("Y", "SUCCESS", ResultDt);
                return Json(strJson);
            }
            catch (Exception e)
            {
                strJson = _common.MakeJson("E", e.Message);
                return Json(strJson);
            }
        }

        [HttpPost]
        public ActionResult fnCntNotice(JsonData value)
        {
            try
            {
                int nResult = 0;

                strResult = value.vJsonData.ToString();

                dt = JsonConvert.DeserializeObject<DataTable>(strResult);

                nResult = _DataHelper.ExecuteNonQuery(SN.Cnt_Notice(dt.Rows[0]), CommandType.Text);
                ResultDt = _DataHelper.ExecuteDataTable(SN.Search_Notice(dt.Rows[0]), CommandType.Text);
                ResultDt.TableName = "NoticeCnt";

                strJson = _common.MakeJson("Y", "SUCCESS", ResultDt);
                return Json(strJson);
            }
            catch (Exception e)
            {
                strJson = _common.MakeJson("E", e.Message);
                return Json(strJson);
            }
        }

        [HttpPost]
        public ActionResult fnCntReview(JsonData value)
        {
            try
            {
                int nResult = 0;

                strResult = value.vJsonData.ToString();

                dt = JsonConvert.DeserializeObject<DataTable>(strResult);

                nResult = _DataHelper.ExecuteNonQuery(SN.Cnt_Review(dt.Rows[0]), CommandType.Text);
                ResultDt = _DataHelper.ExecuteDataTable(SN.Search_Review(dt.Rows[0]), CommandType.Text);
                ResultDt.TableName = "ReviewCnt";

                strJson = _common.MakeJson("Y", "SUCCESS", ResultDt);
                return Json(strJson);
            }
            catch (Exception e)
            {
                strJson = _common.MakeJson("E", e.Message);
                return Json(strJson);
            }
        }

        [HttpPost]
        public ActionResult fnSearchReview(JsonData value)
        {
            try
            {
                strResult = value.vJsonData.ToString();

                dt = JsonConvert.DeserializeObject<DataTable>(strResult);

                ResultDt = _DataHelper.ExecuteDataTable(SN.Search_Review(dt.Rows[0]), CommandType.Text);

                strJson = _common.MakeJson("Y", "SUCCESS", ResultDt);
                return Json(strJson);
            }
            catch (Exception e)
            {
                strJson = _common.MakeJson("E", e.Message);
                return Json(strJson);
            }
        }
        [HttpPost]
        public ActionResult fnListNotice(JsonData value)
        {
            try
            {
                strResult = value.vJsonData.ToString();

                dt = JsonConvert.DeserializeObject<DataTable>(strResult);

                ResultDt = _DataHelper.ExecuteDataTable(SN.Search_NoticeList(dt.Rows[0]), CommandType.Text);

                strJson = _common.MakeJson("Y", "SUCCESS", ResultDt);

                return Json(strJson);
            }
            catch (Exception e)
            {
                strJson = _common.MakeJson("E", e.Message);
                return Json(strJson);
            }
        }
        [HttpPost]
        public ActionResult fnListReview(JsonData value)
        {
            try
            {
                strResult = value.vJsonData.ToString();

                dt = JsonConvert.DeserializeObject<DataTable>(strResult);

                ResultDt = _DataHelper.ExecuteDataTable(SN.Search_ReviewList(dt.Rows[0]), CommandType.Text);

                strJson = _common.MakeJson("Y", "SUCCESS", ResultDt);
               
                return Json(strJson);
            }
            catch (Exception e)
            {
                strJson = _common.MakeJson("E", e.Message);
                return Json(strJson);
            }
        }
    }
}
