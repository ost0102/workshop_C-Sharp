using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using WORKSHOP.Models.Query;
using WORKSHOP.Models;
using Newtonsoft.Json;


namespace WORKSHOP.Controllers
{
    public class HomeController : Controller
    {
        DataTable dt = new DataTable();
        DataTable ResultDt = new DataTable();

        Sql_Quot SQ = new Sql_Quot();
        Sql_Korea KR = new Sql_Korea();
        Sql_Cust SC = new Sql_Cust();
        Sql_List SL = new Sql_List();
        string strJson = "";
        string strResult = "";

        public class JsonData
        {
            public string vJsonData { get; set; }
        }

        public ActionResult Index()
        {
            ViewBag.Message = "Modify this template to jump-start your ASP.NET MVC application.";

            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your app description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }

        /// <summary>
        /// 로그인함수
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        [HttpPost]
        public string fnLogin(JsonData value)
        {
            string DB_con = _DataHelper.ConnectionString;

            strResult = value.vJsonData.ToString();

            dt = JsonConvert.DeserializeObject<DataTable>(strResult);

            try
            {
               ResultDt = _DataHelper.ExecuteDataTable(SC.GetUserInfo(dt.Rows[0]), CommandType.Text);
               ResultDt.TableName = "Table";

               if (ResultDt.Rows.Count == 0)
               {
                   strJson = _common.MakeJson("N", "로그인 실패", ResultDt);
               }
               else
               {
                   strJson = _common.MakeJson("Y", "로그인 성공", ResultDt);
               }

               return strJson;
            }
            catch (Exception e)
            {
               strJson = _common.MakeJson("E", e.Message);
               return strJson;
            }
        }
        /// <summary>
        /// 로그인 후 데이터 세션 아이디 정보 저장
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult SaveLogin(JsonData value)
        {
            DataSet ds = JsonConvert.DeserializeObject<DataSet>(value.vJsonData);
            DataTable rst = ds.Tables["Result"];
            DataTable dt = ds.Tables["Table"];

            try
            {
                if (rst.Rows[0]["trxCode"].ToString() == "N") return Content("N");

                if (rst.Rows[0]["trxCode"].ToString() == "Y")
                {
                    Session["MNGT_NO"] = dt.Rows[0]["MNGT_NO"].ToString().Trim();
                    Session["EMAIL"] = dt.Rows[0]["EMAIL"].ToString().Trim();
                    Session["GRP_CD"] = dt.Rows[0]["GRP_CD"].ToString().Trim();
                    Session["CUST_NAME"] = dt.Rows[0]["CUST_NAME"].ToString().Trim();
                    Session["TELNO"] = dt.Rows[0]["TELNO"].ToString().Trim();
                    Session["COMPANY"] = dt.Rows[0]["COMPANY"].ToString().Trim();
                    Session["DEPARTURE"] = dt.Rows[0]["DEPARTURE"].ToString().Trim();
                    Session["USER_TYPE"] = dt.Rows[0]["USER_TYPE"].ToString().Trim();
                    Session["APV_YN"] = dt.Rows[0]["APV_YN"].ToString().Trim();

                    return Content("Y");
                }

                return Content("N");
            }
            catch (Exception e)
            {
                return Content(e.Message);
            }
        }
        [HttpPost]
        public ActionResult LogOut()
        {
            Session["EMAIL"] = null;
            Session["GRP_CD"] = null;
            Session["CUST_NAME"] = null;
            Session["TELNO"] = null;
            Session["COMPANY"] = null;
            Session["DEPARTURE"] = null;
            Session["USER_TYPE"] = null;

            return RedirectToAction("Index", "Login");
            //Session.Clear();
            //Session.RemoveAll();
            //Response.Cache.SetExpires(DateTime.UtcNow.AddMinutes(-1));
            //Response.Cache.SetCacheability(HttpCacheability.NoCache);
            //Response.Cache.SetNoStore();

            //return "Y";
        }


        /// <summary>
                /// Cnt 값
                /// </summary>
                /// <param name="value"></param>
                /// <returns></returns>
        [HttpPost]
        public string fnCntRegion(JsonData value)
        {
            string DB_con = _DataHelper.ConnectionString;

            strResult = value.vJsonData.ToString();

            dt = JsonConvert.DeserializeObject<DataTable>(strResult);

            try
            {
                ResultDt = _DataHelper.ExecuteDataTable(KR.CntRegion_Query(dt.Rows[0]), CommandType.Text);
                ResultDt.TableName = "Cnt_Table";

                if (ResultDt.Rows.Count == 0)
                {
                    strJson = _common.MakeJson("N", "값 불러오기 실패", ResultDt);
                }
                else
                {
                    strJson = _common.MakeJson("Y", "값 불러오기 성공", ResultDt);
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
        public string fnGetSearchItemCode(JsonData value)
        {
            strResult = value.vJsonData.ToString();

            dt = JsonConvert.DeserializeObject<DataTable>(strResult);

            try
            {
                ResultDt = _DataHelper.ExecuteDataTable(KR.TextClickItemSearch_Query(dt.Rows[0]), CommandType.Text);
                ResultDt.TableName = "TABLE";

                strJson = _common.MakeJson("Y", "값 불러오기 성공", ResultDt);

                return strJson;
            }
            catch (Exception e)
            {
                strJson = _common.MakeJson("E", e.Message);
                return strJson;
            }
        }


        [HttpPost]
        public string fnGetSearchList(JsonData value)
        {
            string DB_con = _DataHelper.ConnectionString;
            strResult = value.vJsonData.ToString();
            DataSet ds = new DataSet();
            dt = JsonConvert.DeserializeObject<DataTable>(strResult);
            try
            {
                ResultDt = _DataHelper.ExecuteDataTable(SL.fnGetList_Query(dt.Rows[0]), CommandType.Text);
                ResultDt.TableName = "TABLE";
                ds.Tables.Add(ResultDt);

                if (dt.Rows[0]["TYPE"].ToString() == "SEARCH")
                {
                    ResultDt = _DataHelper.ExecuteDataTable(SL.fnGetListCount_Query(dt.Rows[0]), CommandType.Text);
                    ResultDt.TableName = "TOTAL";
                    ds.Tables.Add(ResultDt);
                }
                dt = new DataTable();
                dt.Columns.Add("trxCode");
                dt.Columns.Add("trxMsg");
                DataRow row1 = dt.NewRow();
                row1["trxCode"] = "Y";
                row1["trxMsg"] = "Sussess";
                dt.Rows.Add(row1);
                dt.TableName = "Result";
                ds.Tables.Add(dt);

                strJson = JsonConvert.SerializeObject(ds, Formatting.Indented);

                return strJson;
            }
            catch (Exception e)
            {
                strJson = _common.MakeJson("E", e.Message);
                return strJson;
            }
        }



        [HttpPost]
        public string fnGetSearchListCount(JsonData value)
        {
            string DB_con = _DataHelper.ConnectionString;
            strResult = value.vJsonData.ToString();
            dt = JsonConvert.DeserializeObject<DataTable>(strResult);
            try
        {

                ResultDt = _DataHelper.ExecuteDataTable(SL.fnGetListCount_Query(dt.Rows[0]), CommandType.Text);
                ResultDt.TableName = "TOTAL";

                strJson = _common.MakeJson("Y", "값 불러오기 성공", ResultDt);

                return strJson;
            }
            catch (Exception e)
            {
                strJson = _common.MakeJson("E", e.Message);
                return strJson;
            }
        }
        /// <summary>
        /// 지역 값 꺼내기
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        [HttpPost]
        public string fnRegionshow(JsonData value)
        {
            string DB_con = _DataHelper.ConnectionString;

            strResult = value.vJsonData.ToString();

            dt = JsonConvert.DeserializeObject<DataTable>(strResult);

            try
            {
                ResultDt = _DataHelper.ExecuteDataTable(SQ.Regionshow_Query(dt.Rows[0]), CommandType.Text);
                ResultDt.TableName = "Region_Show";

                if (ResultDt.Rows.Count == 0)
                {
                    strJson = _common.MakeJson("N", "값 불러오기 실패", ResultDt);
                }
                else
                {
                    strJson = _common.MakeJson("Y", "값 불러오기 성공", ResultDt);
                }

                return strJson;
            }
            catch (Exception e)
            {
                strJson = _common.MakeJson("E", e.Message);
                return strJson;
            }
        }

        /// <summary>
        /// 간편 견적문의 저장
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        [HttpPost]
        public string fnQuotRequire(JsonData value)
        {
            string DB_con = _DataHelper.ConnectionString;
            int nResult = 0;

            string mngt_no = "REQ" + System.DateTime.Now.ToString("yyyymmDDHHmmssfff");
            strResult = value.vJsonData.ToString();

            // dt = JsonConvert.DeserializeObject<DataTable>(strResult);
            DataSet ds = JsonConvert.DeserializeObject<DataSet>(strResult);
            DataTable Dtldt = ds.Tables["DTL"];
            DataTable Maindt = ds.Tables["MAIN"];
            try
            {

                nResult = _DataHelper.ExecuteNonQuery(SQ.QuotRequire_Query(Maindt.Rows[0], mngt_no), CommandType.Text);
                if (nResult > 0)
                {
                    strJson = _common.MakeJson("Y", "값 불러오기 성공");
                    
                }
                else
                {
                    strJson = _common.MakeJson("N", "값 불러오기 실패");
                    return strJson;
                }

                for (int i = 0; Dtldt.Rows.Count >i; i++)
                {
                    nResult = _DataHelper.ExecuteNonQuery(SQ.AddOptSend_Query(Dtldt.Rows[i], mngt_no), CommandType.Text);
                }

                if (nResult > 0)
                {
                    strJson = _common.MakeJson("Y", mngt_no);
                    return strJson;
                }
                else
                {
                    strJson = _common.MakeJson("N", "값 불러오기 실패");
                    return strJson;
                }

            }
            catch (Exception e)
            {
                strJson = _common.MakeJson("E", e.Message);
                return strJson;
            }
        }


        /// <summary>
        /// 추가옵션 값 꺼내기
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        [HttpPost]
        public string Addoption(JsonData value)
        {
            string DB_con = _DataHelper.ConnectionString;

            strResult = value.vJsonData.ToString();

            dt = JsonConvert.DeserializeObject<DataTable>(strResult);

            try
            {
                ResultDt = _DataHelper.ExecuteDataTable(SQ.Addoption_Query(dt.Rows[0]), CommandType.Text);
                ResultDt.TableName = "Addoption_Show";

                if (ResultDt.Rows.Count == 0)
                {
                    strJson = _common.MakeJson("N", "값 불러오기 실패", ResultDt);
                }
                else
                {
                    strJson = _common.MakeJson("Y", "값 불러오기 성공", ResultDt);
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
        public string fnSchCommentList(JsonData value)
        {
            string DB_con = _DataHelper.ConnectionString;
            strResult = value.vJsonData.ToString();

            dt = JsonConvert.DeserializeObject<DataTable>(strResult);
            try
            {
                ResultDt = _DataHelper.ExecuteDataTable(SL.fnGetComment_Query(dt.Rows[0]), CommandType.Text);
                ResultDt.TableName = "TABLE";

                if (ResultDt.Rows.Count == 0)
                {
                    strJson = _common.MakeJson("N", "값 불러오기 실패", ResultDt);
                }
                else
                {
                    strJson = _common.MakeJson("Y", "값 불러오기 성공", ResultDt);
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
        public string TextClickSearch(JsonData value)
        {
            string DB_con = _DataHelper.ConnectionString;
            strResult = value.vJsonData.ToString();

            dt = JsonConvert.DeserializeObject<DataTable>(strResult);
            try
            {
                ResultDt = _DataHelper.ExecuteDataTable(KR.TextClickSearch_Query(dt.Rows[0]), CommandType.Text);
                //ResultDt = _DataHelper.ExecuteDataTable(KR.TextClickSearch_Query(), CommandType.Text);
                ResultDt.TableName = "TABLE";

                if (ResultDt.Rows.Count == 0)
                {
                    strJson = _common.MakeJson("N", "값 불러오기 실패", ResultDt);
                }
                else
                {
                    strJson = _common.MakeJson("Y", "값 불러오기 성공", ResultDt);
                }

                return strJson;
            }
            catch (Exception e)
            {
                strJson = _common.MakeJson("E", e.Message);
                return strJson;
            }
        }

    }
}
