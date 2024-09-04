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
    public class ReservationController : Controller
    {

        DataTable dt = new DataTable();
        DataSet ds = new DataSet();

        DataTable ResultDt = new DataTable();
        Sql_Reservation SR = new Sql_Reservation();
        Sql_Estimate ER = new Sql_Estimate();
        Sql_Estimate SE = new Sql_Estimate();
        

        string strJson = "";
        string strResult = "";

        public class JsonData
        {
            public string vJsonData { get; set; }
        }
        public ActionResult Index()
        {
            ViewBag.MENU_NM = "Reserve";
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
                string QUOT_NO = TempData["QUOT_NO"].ToString();
                if (QUOT_NO != "")
                {
                    ViewBag.QUOT_NO = QUOT_NO;
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
        public string ReservationSearch(JsonData value)
        {
            string DB_con = _DataHelper.ConnectionString;

            strResult = value.vJsonData.ToString();

            DataTable RoomDt = new DataTable();
            DataTable MealDt = new DataTable();
            DataTable SvcDt = new DataTable();
            DataTable ConfDt = new DataTable();
            DataTable QuotMstDt = new DataTable();


            dt = JsonConvert.DeserializeObject<DataTable>(strResult);

            try
            {
                ResultDt = _DataHelper.ExecuteDataTable(SR.ReservationSearch_Query(dt.Rows[0]), CommandType.Text);
                ResultDt.TableName = "ReservationSearch_Show";

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
        public string ReservationSearchDetail(JsonData value)
        {
            string DB_con = _DataHelper.ConnectionString;

            strResult = value.vJsonData.ToString();

            DataTable RoomDt = new DataTable();
            DataTable MealDt = new DataTable();
            DataTable SvcDt = new DataTable();
            DataTable ConfDt = new DataTable();
            DataTable QuotMstDt = new DataTable();


            dt = JsonConvert.DeserializeObject<DataTable>(strResult);

            try
            {

                RoomDt = _DataHelper.ExecuteDataTable(SR.ReserveBottomRoom_Query(dt.Rows[0]), CommandType.Text);
                RoomDt.TableName = "ReserveBottomRoom_Show";

                ds.Tables.Add(RoomDt);

                MealDt = _DataHelper.ExecuteDataTable(SR.ReserveBottomMeal_Query(dt.Rows[0]), CommandType.Text);
                MealDt.TableName = "ReserveBottomMeal_Show";

                ds.Tables.Add(MealDt);

                SvcDt = _DataHelper.ExecuteDataTable(SR.ReserveBottomSvc_Query(dt.Rows[0]), CommandType.Text);
                SvcDt.TableName = "ReserveBottomSvc_Show";

                ds.Tables.Add(SvcDt);

                ConfDt = _DataHelper.ExecuteDataTable(SR.ReserveBottomConf_Query(dt.Rows[0]), CommandType.Text);
                ConfDt.TableName = "ReserveBottomConf_Show";

                ds.Tables.Add(ConfDt);

                QuotMstDt = _DataHelper.ExecuteDataTable(SR.ReserveBottomMst_Query(dt.Rows[0]), CommandType.Text);
                QuotMstDt.TableName = "ReserveBottomMst_Show";

                ds.Tables.Add(QuotMstDt);

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
        /// 지역 값 꺼내기
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        [HttpPost]
        public string ReserveInquirySelect(JsonData value)
        {
            string DB_con = _DataHelper.ConnectionString;

            strResult = value.vJsonData.ToString();

            dt = JsonConvert.DeserializeObject<DataTable>(strResult);

            try
            {
                ResultDt = _DataHelper.ExecuteDataTable(SR.ReserveInquirySelect_Query(dt.Rows[0]), CommandType.Text);
                ResultDt.TableName = "ReserveInquirySelect_Show";


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
        public string ReservCancelAlert(JsonData value)
        {
            string DB_con = _DataHelper.ConnectionString;
            int nResult = 0;
            strResult = value.vJsonData.ToString();

            dt = JsonConvert.DeserializeObject<DataTable>(strResult);

            try
            {
                nResult = _DataHelper.ExecuteNonQuery(SR.ReservCancelAlert_Query(dt.Rows[0]), CommandType.Text);

                if (nResult == 1)
                {
                    strJson = _common.MakeJson("Y", "Success");
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

        public string ReserveDetail(JsonData value)
        {
            string DB_con = _DataHelper.ConnectionString;

            strResult = value.vJsonData.ToString();

            dt = JsonConvert.DeserializeObject<DataTable>(strResult);

            try
            {
                ResultDt = _DataHelper.ExecuteDataTable(SR.ReserveDetailRoom_Query(dt.Rows[0]), CommandType.Text);
                ResultDt.TableName = "ReserveDetailRoom_Show";

                ds.Tables.Add(ResultDt);

                ResultDt = _DataHelper.ExecuteDataTable(SR.ReserveDetailMeal_Query(dt.Rows[0]), CommandType.Text);
                ResultDt.TableName = "ReserveDetailMeal_Show";

                ds.Tables.Add(ResultDt);

                ResultDt = _DataHelper.ExecuteDataTable(SR.ReserveDetailSvc_Query(dt.Rows[0]), CommandType.Text);
                ResultDt.TableName = "ReserveDetailSvc_Show";

                ds.Tables.Add(ResultDt);

                ResultDt = _DataHelper.ExecuteDataTable(SR.ReserveDetailConf_Query(dt.Rows[0]), CommandType.Text);
                ResultDt.TableName = "ReserveDetailConf_Show";

                ds.Tables.Add(ResultDt);

                ResultDt = _DataHelper.ExecuteDataTable(SR.ReserveDetailMst_Query(dt.Rows[0]), CommandType.Text);
                ResultDt.TableName = "ReserveDetailMst_Show";

                ds.Tables.Add(ResultDt);

                //예약 바텀 조회

                ResultDt = _DataHelper.ExecuteDataTable(SR.ReserveBottomRoom_Query(dt.Rows[0]), CommandType.Text);
                ResultDt.TableName = "ReserveBottomRoom_Show";

                ds.Tables.Add(ResultDt);

                ResultDt = _DataHelper.ExecuteDataTable(SR.ReserveBottomMeal_Query(dt.Rows[0]), CommandType.Text);
                ResultDt.TableName = "ReserveBottomMeal_Show";

                ds.Tables.Add(ResultDt);

                ResultDt = _DataHelper.ExecuteDataTable(SR.ReserveBottomSvc_Query(dt.Rows[0]), CommandType.Text);
                ResultDt.TableName = "ReserveBottomSvc_Show";

                ds.Tables.Add(ResultDt);

                ResultDt = _DataHelper.ExecuteDataTable(SR.ReserveBottomConf_Query(dt.Rows[0]), CommandType.Text);
                ResultDt.TableName = "ReserveBottomConf_Show";

                ds.Tables.Add(ResultDt);

                ResultDt = _DataHelper.ExecuteDataTable(SR.ReserveBottomMst_Query(dt.Rows[0]), CommandType.Text);
                ResultDt.TableName = "ReserveBottomMst_Show";

                ds.Tables.Add(ResultDt);

                //상품 디테일 조회
                ResultDt = _DataHelper.ExecuteDataTable(ER.ModifyRoom_Query(dt.Rows[0]), CommandType.Text);
                ResultDt.TableName = "ItemDetailRoom_Show";

                ds.Tables.Add(ResultDt);

                ResultDt = _DataHelper.ExecuteDataTable(ER.ModifyMeal_Query(dt.Rows[0]), CommandType.Text);
                ResultDt.TableName = "ItemDetailMeal_Show";

                ds.Tables.Add(ResultDt);

                ResultDt = _DataHelper.ExecuteDataTable(ER.ModifySvc_Query(dt.Rows[0]), CommandType.Text);
                ResultDt.TableName = "ItemDetailSvc_Show";

                ds.Tables.Add(ResultDt);

                ResultDt = _DataHelper.ExecuteDataTable(ER.ModifyConf_Query(dt.Rows[0]), CommandType.Text);
                ResultDt.TableName = "ItemDetailConf_Show";

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

        [HttpPost]
        public string ReserveInquire(JsonData value)
        {
            string DB_con = _DataHelper.ConnectionString;
            int nResult = 0;
            strResult = value.vJsonData.ToString();


            dt = JsonConvert.DeserializeObject<DataTable>(strResult);

            try
            {
                nResult = _DataHelper.ExecuteNonQuery(SR.ReserveInquire_Query(dt.Rows[0]), CommandType.Text);
                if (nResult > 0)
                {
                    strJson = _common.MakeJson("Y", "값 불러오기 성공");

                }
                else
                {
                    strJson = _common.MakeJson("N", "값 불러오기 실패");
                    return strJson;
                }

                ResultDt = _DataHelper.ExecuteDataTable(SR.ReserveInquireDetail_Query(dt.Rows[0]), CommandType.Text);
                ResultDt.TableName = "ReseveInquireDetail_Show";



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
        public string ResGetCommentInfo(JsonData value)
        {
            string DB_con = _DataHelper.ConnectionString;
            strResult = value.vJsonData.ToString();

            dt = JsonConvert.DeserializeObject<DataTable>(strResult);

            try
            {
                ResultDt = _DataHelper.ExecuteDataTable(SR.ResGetCommentInfo_Query(dt.Rows[0]), CommandType.Text);
                ResultDt.TableName = "ResGetCommentInfo_Show";

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

        public string ModifyReserve(JsonData value)
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
                if (ds.Tables.Count > 0)
                {

                    ResultDt = _DataHelper.ExecuteDataTable(SR.SelectBkgStatus(ds.Tables["MAIN"].Rows[0]), CommandType.Text);
                    if (ResultDt.Rows[0]["BKG_STATUS"].ToString() == "N")
                    {
                        string mngt_no = ds.Tables["MAIN"].Rows[0]["BKG_NO"].ToString();
                        //추석이후에...... COMMING SOON......
                        nResult = _DataHelper.ExecuteNonQuery(SR.UpdateBkgHeader(ds.Tables["MAIN"].Rows[0]), CommandType.Text);
                        nResult = _DataHelper.ExecuteNonQuery(SR.DeleteBkgDetail(ds.Tables["MAIN"].Rows[0]), CommandType.Text);

                        for (int i = 0; Roomdt.Rows.Count > i; i++)
                        {
                            nResult = _DataHelper.ExecuteNonQuery(SR.InsertReserveRoom_Query(Roomdt.Rows[i], mngt_no), CommandType.Text);
                        }

                        for (int i = 0; Semidt.Rows.Count > i; i++)
                        {
                            nResult = _DataHelper.ExecuteNonQuery(SR.InsertReserveSemina_Query(Semidt.Rows[i], mngt_no), CommandType.Text);
                        }

                        for (int i = 0; Fooddt.Rows.Count > i; i++)
                        {
                            nResult = _DataHelper.ExecuteNonQuery(SR.InsertReserveFood_Query(Fooddt.Rows[i], mngt_no), CommandType.Text);
                        }

                        for (int i = 0; Etcdt.Rows.Count > i; i++)
                        {
                            nResult = _DataHelper.ExecuteNonQuery(SR.InsertReserveEtc_Query(Etcdt.Rows[i], mngt_no), CommandType.Text);
                        }



                    }
                    else {
                        nResult = _DataHelper.ExecuteNonQuery(SR.ModifyReserveMst_Query(ds.Tables["MAIN"].Rows[0]), CommandType.Text);
                        string reqno = ds.Tables["MAIN"].Rows[0]["BKG_NO"].ToString();
                        string reqnm = ds.Tables["MAIN"].Rows[0]["BKG_MOD_NO"].ToString();

                        for (int i = 0; Roomdt.Rows.Count > i; i++)
                        {
                            nResult = _DataHelper.ExecuteNonQuery(SR.ModifyReserveRoom_Query(Roomdt.Rows[i], reqno, reqnm), CommandType.Text);
                        }

                        for (int i = 0; Semidt.Rows.Count > i; i++)
                        {
                            nResult = _DataHelper.ExecuteNonQuery(SR.ModifyReserveSemina_Query(Semidt.Rows[i], reqno, reqnm), CommandType.Text);
                        }

                        for (int i = 0; Fooddt.Rows.Count > i; i++)
                        {
                            nResult = _DataHelper.ExecuteNonQuery(SR.ModifyReserveFood_Query(Fooddt.Rows[i], reqno, reqnm), CommandType.Text);
                        }

                        for (int i = 0; Etcdt.Rows.Count > i; i++)
                        {
                            nResult = _DataHelper.ExecuteNonQuery(SR.ModifyReserveEtc_Query(Etcdt.Rows[i], reqno, reqnm), CommandType.Text);
                        }
                    }
                    strJson = _common.MakeJson("Y", "Success");
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

        

    }
}
