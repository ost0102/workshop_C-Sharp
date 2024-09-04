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
    public class EstimateController : Controller
    {
        DataTable dt = new DataTable();
        DataSet ds = new DataSet();
        
        DataTable ResultDt = new DataTable();

        Sql_Estimate SE = new Sql_Estimate();
        Sql_Quot SQ = new Sql_Quot();

        string strJson = "";
        string strResult = "";

        public class JsonData
        {
            public string vJsonData { get; set; }
        }
        public ActionResult Index()
        {
            ViewBag.MENU_NM = "Estimate";
            if (TempData.ContainsKey("REF1"))
            {
                string MNGT_NO = TempData["REF1"].ToString();
                if (MNGT_NO != "")
                {
                    ViewBag.MNGT_NO = MNGT_NO;
                }
            }
            if (TempData.ContainsKey("QUOT_NO"))
            {
                string MNGT_NO = TempData["QUOT_NO"].ToString();
                if (MNGT_NO != "")
                {
                    ViewBag.MNGT_NO = MNGT_NO;
                }
            }
            if (Session["EMAIL"] == null)
            {

                return RedirectToAction("Index", "Login");
            }
            else
            {
                return View();
            }
        }

        public class RtnFilesInfo
        {
            public string FILE_NAME { get; set; }
            public string FILE_NM { get; set; }
            public string FILE_PATH { get; set; }
            public string REPLACE_FILE_NM { get; set; }
            public string MNGT_NO { get; set; }
            public string INS_USR { get; set; }
            public string SEQ { get; set; }
        }


        /// <summary>
        /// 지역 값 꺼내기
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        [HttpPost]
        public string SimpleMyQuotList(JsonData value)
        {
            string DB_con = _DataHelper.ConnectionString;

            strResult = value.vJsonData.ToString();

            dt = JsonConvert.DeserializeObject<DataTable>(strResult);

            try
            {
                ResultDt = _DataHelper.ExecuteDataTable(SE.SimpleMyQuotList_Query(dt.Rows[0]), CommandType.Text);
                ResultDt.TableName = "SimpleMyQuotList_Show";



                strJson = _common.MakeJson("Y", "SUCCESS", ResultDt);
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
        public string RegionView(JsonData value)
        {
            string DB_con = _DataHelper.ConnectionString;

            strResult = value.vJsonData.ToString();

            dt = JsonConvert.DeserializeObject<DataTable>(strResult);

            try
            {
                ResultDt = _DataHelper.ExecuteDataTable(SE.RegionView_Query(dt.Rows[0]), CommandType.Text);
                ResultDt.TableName = "RegionView_Show";



                strJson = _common.MakeJson("Y", "SUCCESS", ResultDt);
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
        public string EstimateSearch(JsonData value)
        {
            string DB_con = _DataHelper.ConnectionString;

            strResult = value.vJsonData.ToString();

            dt = JsonConvert.DeserializeObject<DataTable>(strResult);

            try
            {
                ResultDt = _DataHelper.ExecuteDataTable(SE.EstimateSearch_Query(dt.Rows[0]), CommandType.Text);
                ResultDt.TableName = "EstimateSearch_Show";


                if (ResultDt.Rows.Count == 0)
                {
                    strJson = _common.MakeJson("N", "", ResultDt);
                }
                else
                {
                    strJson = _common.MakeJson("Y", "SUCCESS", ResultDt);
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
        /// 지역 값 꺼내기
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        [HttpPost]
        public string QuotComplete(JsonData value)
        {
            string DB_con = _DataHelper.ConnectionString;

            strResult = value.vJsonData.ToString();

            dt = JsonConvert.DeserializeObject<DataTable>(strResult);

            try
            {
                ResultDt = _DataHelper.ExecuteDataTable(SE.QuotComplete_Query(dt.Rows[0]), CommandType.Text);
                ResultDt.TableName = "QuotComplete_Show";


                if (ResultDt.Rows.Count == 0)
                {
                    strJson = _common.MakeJson("N", "", ResultDt);
                }
                else
                {
                    strJson = _common.MakeJson("Y", "SUCCESS", ResultDt);
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
        public string SimpleComPareQuotList(JsonData value)
        {
            string DB_con = _DataHelper.ConnectionString;

            strResult = value.vJsonData.ToString();

            dt = JsonConvert.DeserializeObject<DataTable>(strResult);

            try
            {
                ResultDt = _DataHelper.ExecuteDataTable(SE.SimpleComPareQuotList_Query(dt.Rows[0]), CommandType.Text);
                ResultDt.TableName = "SimpleComPareQuotList_Show";



                if (ResultDt.Rows.Count == 0)
                {
                    strJson = _common.MakeJson("N", "", ResultDt);
                }
                else
                {
                    strJson = _common.MakeJson("Y", "SUCCESS", ResultDt);
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
        public string TalkDataSearch(JsonData value)
        {
            string DB_con = _DataHelper.ConnectionString;

            strResult = value.vJsonData.ToString();

            dt = JsonConvert.DeserializeObject<DataTable>(strResult);

            try
            {
                ResultDt = _DataHelper.ExecuteDataTable(SE.QuotInquireDetail_Query(dt.Rows[0]), CommandType.Text);
                ResultDt.TableName = "TalkDataSearch_Show";



                if (ResultDt.Rows.Count == 0)
                {
                    strJson = _common.MakeJson("N", "", ResultDt);
                }
                else
                {
                    strJson = _common.MakeJson("Y", "SUCCESS", ResultDt);
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
        public string QuotReserve(JsonData value)
        {
            string DB_con = _DataHelper.ConnectionString;
            int nResult = 0;
            DataTable RoomtDt = new DataTable();
            DataTable MealDt = new DataTable();
            DataTable SvcDt = new DataTable();
            DataTable ConfDt = new DataTable();



            strResult = value.vJsonData.ToString();

            dt = JsonConvert.DeserializeObject<DataTable>(strResult);

            try
            {


                ResultDt = _DataHelper.ExecuteDataTable(SE.QuotReserveSearch_Query(dt.Rows[0]), CommandType.Text);
                if (ResultDt.Rows.Count > 0)
                {
                    strJson = _common.MakeJson("N", "값 불러오기 실패", ResultDt);
                    return strJson;
                }

                nResult = _DataHelper.ExecuteNonQuery(SE.QuotReserve_Query(dt.Rows[0]), CommandType.Text);


                if (nResult > 0)
                {
                    RoomtDt = _DataHelper.ExecuteDataTable(SE.QuotReserveRoomSearch_Query(dt.Rows[0]), CommandType.Text);

                    for(int i =0; RoomtDt.Rows.Count > i; i++)
                    {
                        nResult = _DataHelper.ExecuteNonQuery(SE.QuotReserveRoom_Query(RoomtDt.Rows[i],dt.Rows[0]), CommandType.Text);
                    }

                    MealDt = _DataHelper.ExecuteDataTable(SE.QuotReserveMealSearch_Query(dt.Rows[0]), CommandType.Text);

                    for (int i = 0; MealDt.Rows.Count > i; i++)
                    {
                        nResult = _DataHelper.ExecuteNonQuery(SE.QuotReserveMeal_Query(MealDt.Rows[i], dt.Rows[0]), CommandType.Text);
                    }

                    SvcDt = _DataHelper.ExecuteDataTable(SE.QuotReserveSvcSearch_Query(dt.Rows[0]), CommandType.Text);

                    for (int i = 0; SvcDt.Rows.Count > i; i++)
                    {
                        nResult = _DataHelper.ExecuteNonQuery(SE.QuotReserveSvc_Query(SvcDt.Rows[i], dt.Rows[0]), CommandType.Text);
                    }

                    ConfDt = _DataHelper.ExecuteDataTable(SE.QuotReserveConfSearch_Query(dt.Rows[0]), CommandType.Text);

                    for (int i = 0; ConfDt.Rows.Count > i; i++)
                    {
                        nResult = _DataHelper.ExecuteNonQuery(SE.QuotReserveConf_Query(ConfDt.Rows[i], dt.Rows[0]), CommandType.Text);
                    }


                    nResult = _DataHelper.ExecuteNonQuery(SE.QuotReserveComUpadate_Query(dt.Rows[0]), CommandType.Text);
                    nResult = _DataHelper.ExecuteNonQuery(SE.QuotReserveHeadUpdate_Query(dt.Rows[0]), CommandType.Text);
                    strJson = _common.MakeJson("Y", "값 불러오기 성공", ResultDt);

                }
                else
                {
                    strJson = _common.MakeJson("N", "값 불러오기 실패", ResultDt);
                    return strJson;
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
        public string QuotInquire(JsonData value)
        {
            string DB_con = _DataHelper.ConnectionString;
            int nResult = 0;
            strResult = value.vJsonData.ToString();


            dt = JsonConvert.DeserializeObject<DataTable>(strResult);

            try
            {
                nResult = _DataHelper.ExecuteNonQuery(SE.QuotInquire_Query(dt.Rows[0]), CommandType.Text);
                if (nResult > 0)
                {
                    strJson = _common.MakeJson("Y", "값 불러오기 성공");

                }
                else
                {
                    strJson = _common.MakeJson("N", "값 불러오기 실패");
                    return strJson;
                }

                ResultDt = _DataHelper.ExecuteDataTable(SE.QuotInquireDetail_Query(dt.Rows[0]), CommandType.Text);
                ResultDt.TableName = "QuotInquireDetail_Show";



                if (ResultDt.Rows.Count == 0)
                {
                    strJson = _common.MakeJson("N", "", ResultDt);
                }
                else
                {
                    strJson = _common.MakeJson("Y", "SUCCESS", ResultDt);
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
        public string SearchQuotInquire(JsonData value)
        {

            strResult = value.vJsonData.ToString();


            dt = JsonConvert.DeserializeObject<DataTable>(strResult);

            try
            {
                ResultDt = _DataHelper.ExecuteDataTable(SE.QuotInquireDetail_Query(dt.Rows[0]), CommandType.Text);

                strJson = _common.MakeJson("Y", "SUCCESS", ResultDt);
                return strJson;
            }
            catch (Exception e)
            {
                strJson = _common.MakeJson("E", e.Message);
                return strJson;
            }
        }

        [HttpPost]
        public string ComPareQuotDetail(JsonData value)
        {
            string DB_con = _DataHelper.ConnectionString;

            strResult = value.vJsonData.ToString();

            dt = JsonConvert.DeserializeObject<DataTable>(strResult);

            try
            {
                ResultDt = _DataHelper.ExecuteDataTable(SE.ComPareQuotRoom_Query(dt.Rows[0]), CommandType.Text);
                ResultDt.TableName = "ComPareQuotRoom_Show";


                    ds.Tables.Add(ResultDt);

                ResultDt = _DataHelper.ExecuteDataTable(SE.ComPareQuotMeal_Query(dt.Rows[0]), CommandType.Text);
                ResultDt.TableName = "ComPareQuotMeal_Show";

                
                    ds.Tables.Add(ResultDt);
                

                ResultDt = _DataHelper.ExecuteDataTable(SE.ComPareQuotSvc_Query(dt.Rows[0]), CommandType.Text);
                ResultDt.TableName = "ComPareQuotSvc_Show";

                
                    ds.Tables.Add(ResultDt);
                

                ResultDt = _DataHelper.ExecuteDataTable(SE.ComPareQuotConf_Query(dt.Rows[0]), CommandType.Text);
                ResultDt.TableName = "ComPareQuotConf_Show";

                
                    ds.Tables.Add(ResultDt);
                
                ResultDt = _DataHelper.ExecuteDataTable(SE.ComPareQuotMst_Query(dt.Rows[0]), CommandType.Text);
                ResultDt.TableName = "ComPareQuotMst_Show";
                

                    ds.Tables.Add(ResultDt);

                ResultDt = _DataHelper.ExecuteDataTable(SE.ComPareQuotInq_Query(dt.Rows[0]), CommandType.Text);
                ResultDt.TableName = "ComPareQuotInq_Show";

                    ds.Tables.Add(ResultDt);

                ResultDt = _DataHelper.ExecuteDataTable(SE.ComPareQuotImg_Query(dt.Rows[0]), CommandType.Text);
                ResultDt.TableName = "ComPareQuotImg_Show";

                ds.Tables.Add(ResultDt);

                dt = new DataTable();
                dt.Columns.Add("trxCode");
                dt.Columns.Add("trxMsg");
                DataRow row1 = dt.NewRow();
                row1["trxCode"] = "Y";
                row1["trxMsg"] = "Success";
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


        /// <summary>
        /// 파일 다운로드 로직
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        [HttpGet]
        public ActionResult DownloadFile(RtnFilesInfo value)
        {
            string strFILE_NM = value.FILE_NM;
            string strFILE_PATH = value.FILE_PATH;
            string strREPLACE_FILE_NM = value.REPLACE_FILE_NM;

            try
            {
                System.IO.FileInfo fi = new System.IO.FileInfo(Server.MapPath(strFILE_PATH + "/"+ strFILE_NM));

                if (fi.Exists)
                {
                    //return File(fi.FullName, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", strREPLACE_FILE_NM);
                    return File(fi.FullName, "application/octet-stream", strFILE_NM);
                }
                else
                {
                    return Content("<script>alert('파일이 존재하지 않습니다.'); window.history.back();</script>");
                }
            }
            catch (Exception ex)
            {
                return Content("<script>alert('" + ex.Message + "')</script>");
            }
        }

        [HttpPost]
        public string HomeEstimate(JsonData value)
        {
            string DB_con = _DataHelper.ConnectionString;
            strResult = value.vJsonData.ToString();

            dt = JsonConvert.DeserializeObject<DataTable>(strResult);

            try
            {
                ResultDt = _DataHelper.ExecuteDataTable(SQ.Addoption_Query(dt.Rows[0]), CommandType.Text);
                ResultDt.TableName = "Addoption_Show";
                ds.Tables.Add(ResultDt);

                //메인아이템정보
                ResultDt = _DataHelper.ExecuteDataTable(SE.HomeEstimateIteminfo_Query(dt.Rows[0]), CommandType.Text);
                ResultDt.TableName = "Itemtable_show";
                ds.Tables.Add(ResultDt);

                //세미나실
                ResultDt = _DataHelper.ExecuteDataTable(SE.HomeEstimateconfinfo_Query(dt.Rows[0]), CommandType.Text);
                ResultDt.TableName = "Itemtableconf_show";
                ds.Tables.Add(ResultDt);

                //부가서비스
                ResultDt = _DataHelper.ExecuteDataTable(SE.HomeEstimateetcinfo_Query(dt.Rows[0]), CommandType.Text);
                ResultDt.TableName = "Itemtableetc_show";
                ds.Tables.Add(ResultDt);

                //숙박정보
                ResultDt = _DataHelper.ExecuteDataTable(SE.HomeEstimateroominfo_Query(dt.Rows[0]), CommandType.Text);
                ResultDt.TableName = "Itemtableroom_show";
                ds.Tables.Add(ResultDt);

                //식사
                ResultDt = _DataHelper.ExecuteDataTable(SE.HomeEstimatemealinfo_Query(dt.Rows[0]), CommandType.Text);
                ResultDt.TableName = "Itemtablemeal_show";
                ds.Tables.Add(ResultDt);

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
        public string HomeEstimateCompare(JsonData value)
        {
            int nResult = 0;
            string DB_con = _DataHelper.ConnectionString;

            strResult = value.vJsonData.ToString();

            DataSet ds = new DataSet();
            DataTable Roomdt = new DataTable();
            DataTable Semidt = new DataTable();
            DataTable Fooddt = new DataTable();
            DataTable Etcdt = new DataTable();
 
            ds = JsonConvert.DeserializeObject<DataSet>(strResult);

            Roomdt = ds.Tables["ROOM"];
            Semidt = ds.Tables["SEMINA"];
            Fooddt = ds.Tables["FOOD"];
            Etcdt = ds.Tables["ETC"];

            try
            {
                if (ds.Tables.Count > 0) {
                    
                    nResult = _DataHelper.ExecuteNonQuery(SE.HomeEstimateMain_Query(ds.Tables["MAIN"].Rows[0]), CommandType.Text);
                    string reqno = ds.Tables["MAIN"].Rows[0]["REQ_NO"].ToString();
                    string reqnm = ds.Tables["MAIN"].Rows[0]["REQ_NM"].ToString();

                    for (int i = 0; Roomdt.Rows.Count > i; i++)
                    {
                        nResult = _DataHelper.ExecuteNonQuery(SE.HomeEstimateRoom_Query(Roomdt.Rows[i], reqno, reqnm), CommandType.Text);
                    }

                    for (int i = 0; Semidt.Rows.Count > i; i++)
                    {
                        nResult = _DataHelper.ExecuteNonQuery(SE.HomeEstimateSemina_Query(Semidt.Rows[i], reqno, reqnm), CommandType.Text);
                    }

                    for (int i = 0; Fooddt.Rows.Count > i; i++)
                    {
                        nResult = _DataHelper.ExecuteNonQuery(SE.HomeEstimateFood_Query(Fooddt.Rows[i], reqno, reqnm), CommandType.Text);
                    }

                    for (int i = 0; Etcdt.Rows.Count > i; i++)
                    {
                        nResult = _DataHelper.ExecuteNonQuery(SE.HomeEstimateEtc_Query(Etcdt.Rows[i], reqno, reqnm), CommandType.Text);
                    }

                    strJson = _common.MakeJson("Y", reqno);
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
        public string HomeEstimateImgClick(JsonData value)
        {
            string DB_con = _DataHelper.ConnectionString;

            strResult = value.vJsonData.ToString();

            dt = JsonConvert.DeserializeObject<DataTable>(strResult);

            try
            {
                ResultDt = _DataHelper.ExecuteDataTable(SE.HomeEstimateIteminfo_Query(dt.Rows[0]), CommandType.Text);
                ResultDt.TableName = "TABLE";

                if (ResultDt.Rows.Count == 0)
                {
                    strJson = _common.MakeJson("N", "", ResultDt);
                }
                else
                {
                    strJson = _common.MakeJson("Y", "SUCCESS", ResultDt);
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
