using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WORKSHOP.Models;
using WORKSHOP.Models.Query;

namespace WORKSHOP.Controllers
{
    public class MyboardController : Controller
    {
        DataSet ds = new DataSet();
        DataTable dt = new DataTable();
        DataTable Resultdt = new DataTable();

        Sql_Cust SC = new Sql_Cust();

        string strJson = "";
        string strResult = "";
        public ActionResult Index()
        {
            ViewBag.MENU_NM = "Myboard";

            return View();
        }
        public class JsonData
        {
            public string vJsonData { get; set; }
        }
        
        [HttpPost]
        public string fnAddcomment(JsonData value)
        {
            int nResult = 0;
            string DB_con = _DataHelper.ConnectionString;
            
            strResult = value.vJsonData.ToString();


            dt = JsonConvert.DeserializeObject<DataTable>(strResult);

            try
            {
                nResult = _DataHelper.ExecuteNonQuery(SC.fnInsertcomment_Query(dt.Rows[0]), CommandType.Text);

                nResult = _DataHelper.ExecuteNonQuery(SC.fnInsertmilage_Query(dt.Rows[0]), CommandType.Text);
                if (nResult == 1)
                {
                    strJson = _common.MakeJson("Y", "Sucess");
                }
                else
                {
                    strJson = _common.MakeJson("N", "Fail");
                }
                return strJson;
            }
            catch (Exception e) 
            {
                strJson = _common.MakeJson("E", e.Message);
                return strJson;
            }
        }

        [HttpPost]
        public string GetCommentInfo(JsonData value)
        {
            string DB_con = _DataHelper.ConnectionString;
            strResult = value.vJsonData.ToString();

            dt = JsonConvert.DeserializeObject<DataTable>(strResult);

            try
            {
                Resultdt = _DataHelper.ExecuteDataTable(SC.GetCommentInfo_Query(dt.Rows[0]), CommandType.Text);
                Resultdt.TableName = "TABLE";

                if (Resultdt.Rows.Count == 0)
                {
                    strJson = _common.MakeJson("N", "값 불러오기 실패", Resultdt);
                }
                else
                {
                    strJson = _common.MakeJson("Y", "값 불러오기 성공", Resultdt);
                }

                return strJson;
            }
            catch (Exception e)
            {
                strJson = _common.MakeJson("E", e.Message);
                return strJson;
            }
        }

        [HttpPost]
        public string GetCommenttopList(JsonData value)
        {
            string DB_con = _DataHelper.ConnectionString;
            strResult = value.vJsonData.ToString();

            dt = JsonConvert.DeserializeObject<DataTable>(strResult);

            try
            {
                Resultdt = _DataHelper.ExecuteDataTable(SC.GetCommenttopList_Query(dt.Rows[0]), CommandType.Text);
                Resultdt.TableName = "TABLE";

                strJson = _common.MakeJson("Y", "값 불러오기 성공", Resultdt);

                return strJson;
            }
            catch (Exception e)
            {
                strJson = _common.MakeJson("E", e.Message);
                return strJson;
            }
        }

        [HttpPost]
        public string GetCommentList(JsonData value)
        {
            string DB_con = _DataHelper.ConnectionString;
            strResult = value.vJsonData.ToString();

            dt = JsonConvert.DeserializeObject<DataTable>(strResult);

            try
            {
                Resultdt = _DataHelper.ExecuteDataTable(SC.GetCommentList_Query(dt.Rows[0]), CommandType.Text);
                Resultdt.TableName = "TABLE";

                strJson = _common.MakeJson("Y", "값 불러오기 성공", Resultdt);
  

                return strJson;
            }
            catch (Exception e)
            {
                strJson = _common.MakeJson("E", e.Message);
                return strJson;
            }
        }

        [HttpPost]
        public string GetQuotationList(JsonData value)
        {
            string DB_con = _DataHelper.ConnectionString;
            strResult = value.vJsonData.ToString();

            dt = JsonConvert.DeserializeObject<DataTable>(strResult);

            try
            {
                Resultdt = _DataHelper.ExecuteDataTable(SC.GetQuoation_Query(dt.Rows[0]), CommandType.Text);
                Resultdt.TableName = "TABLE";

                strJson = _common.MakeJson("Y", "값 불러오기 성공", Resultdt);
                return strJson;
            }
            catch (Exception e)
            {
                strJson = _common.MakeJson("E", e.Message);
                return strJson;
            }
        }

        [HttpPost]
        public string MyGetUserMileage(JsonData value)
        {
            string DB_con = _DataHelper.ConnectionString;
            strResult = value.vJsonData.ToString();

            dt = JsonConvert.DeserializeObject<DataTable>(strResult);

            try
            {
                Resultdt = _DataHelper.ExecuteDataTable(SC.GetUserMileage_Query(dt.Rows[0]), CommandType.Text);
                Resultdt.TableName = "MILEAGE";

                strJson = _common.MakeJson("Y", "값 불러오기 성공", Resultdt);
                return strJson;
            }
            catch (Exception e)
            {
                strJson = _common.MakeJson("E", e.Message);
                return strJson;
            }
        }
        //[HttpPost]
        //public string GetUserMileagePopup(JsonData value)
        //{
        //    string DB_con = _DataHelper.ConnectionString;
        //    strResult = value.vJsonData.ToString();

        //    dt = JsonConvert.DeserializeObject<DataTable>(strResult);

        //    try
        //    {
        //        Resultdt = _DataHelper.ExecuteDataTable(SC.GetUserMileagePopup_Query(dt.Rows[0]), CommandType.Text);
        //        Resultdt.TableName = "MILEAGEPOP";

        //        strJson = _common.MakeJson("Y", "값 불러오기 성공", Resultdt);
        //        return strJson;
        //    }
        //    catch (Exception e)
        //    {
        //        strJson = _common.MakeJson("E", e.Message);
        //        return strJson;
        //    }
        //}

        //[HttpPost]
        //public string SearchMileage(JsonData value)
        //{
        //    string DB_con = _DataHelper.ConnectionString;
        //    strResult = value.vJsonData.ToString();

        //    dt = JsonConvert.DeserializeObject<DataTable>(strResult);

        //    try
        //    {
        //        Resultdt = _DataHelper.ExecuteDataTable(SC.SearchMileage_Query(dt.Rows[0]), CommandType.Text);
        //        Resultdt.TableName = "TABLE";

        //        strJson = _common.MakeJson("Y", "값 불러오기 성공", Resultdt);
        //        return strJson;
        //    }
        //    catch (Exception e)
        //    {
        //        strJson = _common.MakeJson("E", e.Message);
        //        return strJson;
        //    }
        //}

        [HttpPost]
        public ActionResult fnSearchMg(JsonData value)
        {
            try
            {
                strResult = value.vJsonData.ToString();

                dt = JsonConvert.DeserializeObject<DataTable>(strResult);

                Resultdt = _DataHelper.ExecuteDataTable(SC.fnSearchMg(dt.Rows[0]), CommandType.Text);

                strJson = _common.MakeJson("Y", "SUCCESS", Resultdt);
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
