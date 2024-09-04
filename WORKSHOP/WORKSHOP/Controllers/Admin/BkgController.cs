using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WORKSHOP.Models;
using WORKSHOP.Models.Query;
using Newtonsoft.Json;
using System.Data;
using System.Net;
using System.Net.Mail;
using System.IO;

namespace WORKSHOP.Controllers.Admin
{
    public class BkgController : Controller
    {
        string strJson = "";
        DataSet ds = new DataSet();
        bool rtnStatus = false;
        //
        // GET: /Quotation/

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult bkgList()
        {
            return View();
        }
        public ActionResult bkgCustomer()
        {
            return View();
        }

        public ActionResult bkgMgt()
        {
            return View();
        }

        public ActionResult bkgRegist()
        {
            return View();
        }
        public class JsonData
        {
            public string vJsonData { get; set; }
        }


        #region 조회 화면 

        /// <summary>
        /// 리스트 조회
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult fnGetListData(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();
                DataTable dt = new DataTable();


                dt = JsonConvert.DeserializeObject<DataTable>(vJsonData);
                dt = Sql_Booking.GetBkgList_Query(dt.Rows[0]);


                strJson = _common.MakeJson("Y", "Success", dt);

                return Json(strJson);
            }
            catch (Exception e)
            {
                strJson = e.Message;
                return Json(strJson);
            }
        }


        public ActionResult fnUpdateBkg(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();
                DataTable dt = new DataTable();
                DataTable rdt = new DataTable();

                dt = JsonConvert.DeserializeObject<DataTable>(vJsonData);

                rtnStatus = Sql_Booking.UpdateBkgFlag(dt.Rows[0]);

                if(dt.Rows[0]["STATUS"].ToString() == "F")
                {
                    rdt = Sql_Booking.SearchBkgItem(dt.Rows[0]);

                    rtnStatus = Sql_Booking.UpdateItemCnt(rdt.Rows[0]);
                }

                dt = Sql_Booking.GetBkgList_Query(dt.Rows[0]);

                strJson = _common.MakeJson("Y", "Success", dt);


                return Json(strJson);

            }
            catch(Exception e)
            {
                strJson = e.Message;
                return Json(strJson);
            }
        }

        public ActionResult fnGetBkgAllDetail(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();
                DataTable dt = new DataTable();
                dt = JsonConvert.DeserializeObject<DataTable>(vJsonData);

                dt = Sql_Booking.SelectBkgAllDetail(dt.Rows[0]);


                strJson = _common.MakeJson("Y", "Success", dt);
                return Json(strJson);
            }
            catch(Exception e)
            {
                strJson = e.Message;
                return Json(strJson);
            }
        }


        public ActionResult fnUpdateDetailPrc(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();
                DataTable dt = new DataTable();
                ds = JsonConvert.DeserializeObject<DataSet>(vJsonData);
                //dt = JsonConvert.DeserializeObject<DataTable>(vJsonData);
                dt = ds.Tables["MAIN"];
                int tot_amt = 0;

                for (int i = 0; i < dt.Rows.Count; i++)
                {

                   rtnStatus = Sql_Booking.UpdateBkgDtl_Query(dt.Rows[i]);


                    tot_amt += Convert.ToInt32(dt.Rows[i]["PRC"]);
                }

                rtnStatus = Sql_Booking.UpdateTotalPrc(dt.Rows[0], tot_amt);

                dt = Sql_Booking.SelectBkgAllDetail(dt.Rows[0]);


                strJson = _common.MakeJson("Y", "Success", dt);
                return Json(strJson);

            }
            catch (Exception e) {
                strJson = e.Message;
                return Json(strJson);
            }
        }

        #endregion



        #region 관리 화면

        /// <summary>
        /// 전체 조회
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public ActionResult fnGetBkgManageDetail(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();
                DataSet ds = new DataSet();
                DataTable dt = new DataTable();
                DataTable paramDt = new DataTable();

                paramDt = JsonConvert.DeserializeObject<DataTable>(vJsonData);

                dt = Sql_Booking.fnSearchBkg_Query(paramDt.Rows[0]);
                dt.TableName = "MAIN";
                ds.Tables.Add(dt);


                dt = Sql_Booking.fnSearchBkgConf_Query(paramDt.Rows[0]);
                dt.TableName = "CONF";
                ds.Tables.Add(dt);


                dt = Sql_Booking.fnSearchBkgRoom_Query(paramDt.Rows[0]);
                dt.TableName = "ROOM";
                ds.Tables.Add(dt);


                dt = Sql_Booking.fnSearchBkgMeal_Query(paramDt.Rows[0]);
                dt.TableName = "MEAL";
                ds.Tables.Add(dt);


                dt = Sql_Booking.fnSearchBkgSvc_Query(paramDt.Rows[0]);
                dt.TableName = "SVC";
                ds.Tables.Add(dt);


                #region 결과 테이블
                dt = new DataTable();
                dt.Columns.Add("trxCode");
                dt.Columns.Add("trxMsg");
                DataRow row1 = dt.NewRow();

                row1["trxCode"] = "Y";
                row1["trxMsg"] = "Success";
                dt.Rows.Add(row1);
                dt.TableName = "Result";
                ds.Tables.Add(dt);

                #endregion

                strJson = JsonConvert.SerializeObject(ds);

                return Json(strJson);
            }
            catch(Exception e)
            {
                strJson = e.Message;
                return Json(strJson);
            }
        }

        #region 디테일 업데이트

        public ActionResult fnUpdateBkgConf(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();
                DataTable dt = new DataTable();
                dt = JsonConvert.DeserializeObject<DataTable>(vJsonData);
                for(int i = 0; i < dt.Rows.Count; i++)
                {
                    if(dt.Rows[i]["INSFLAG"].ToString() == "I")
                    {
                        rtnStatus = Sql_Booking.fnInsertBkgConf_Query(dt.Rows[i]);
                    }

                    else if (dt.Rows[i]["INSFLAG"].ToString() == "U")
                    {
                        rtnStatus = Sql_Booking.fnUpdateBkgConf_Query(dt.Rows[i]);
                    }

                    else if (dt.Rows[i]["INSFLAG"].ToString() == "D")
                    {
                        rtnStatus = Sql_Booking.fnDeleteBkgConf_Query(dt.Rows[i]);
                    }

                    if (!rtnStatus) break;
                }

                dt = Sql_Booking.fnSearchBkgConf_Query(dt.Rows[0]);
                strJson = _common.MakeJson("Y", "Success", dt);

                return Json(strJson);
            }
            catch(Exception e)
            {
                strJson = e.Message;
                return Json(strJson);
            }
        }

        public ActionResult fnUpdateBkgRoom(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();
                DataTable dt = new DataTable();
                dt = JsonConvert.DeserializeObject<DataTable>(vJsonData);
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    if (dt.Rows[i]["INSFLAG"].ToString() == "I")
                    {
                        rtnStatus = Sql_Booking.fnInsertBkgRoom_Query(dt.Rows[i]);
                    }

                    else if (dt.Rows[i]["INSFLAG"].ToString() == "U")
                    {
                        rtnStatus = Sql_Booking.fnUpdateBkgRoom_Query(dt.Rows[i]);
                    }

                    else if (dt.Rows[i]["INSFLAG"].ToString() == "D")
                    {
                        rtnStatus = Sql_Booking.fnDeleteBkgRoom_Query(dt.Rows[i]);
                    }

                    if (!rtnStatus) break;
                }

                dt = Sql_Booking.fnSearchBkgRoom_Query(dt.Rows[0]);
                strJson = _common.MakeJson("Y", "Success", dt);

                return Json(strJson);
            }
            catch (Exception e)
            {
                strJson = e.Message;
                return Json(strJson);
            }
        }


        public ActionResult fnUpdateBkgMeal(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();
                DataTable dt = new DataTable();
                dt = JsonConvert.DeserializeObject<DataTable>(vJsonData);
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    if (dt.Rows[i]["INSFLAG"].ToString() == "I")
                    {
                        rtnStatus = Sql_Booking.fnInsertBkgMeal_Query(dt.Rows[i]);
                    }

                    else if (dt.Rows[i]["INSFLAG"].ToString() == "U")
                    {
                        rtnStatus = Sql_Booking.fnUpdateBkgMeal_Query(dt.Rows[i]);
                    }

                    else if (dt.Rows[i]["INSFLAG"].ToString() == "D")
                    {
                        rtnStatus = Sql_Booking.fnDeleteBkgMeal_Query(dt.Rows[i]);
                    }

                    if (!rtnStatus) break;
                }

                dt = Sql_Booking.fnSearchBkgMeal_Query(dt.Rows[0]);
                strJson = _common.MakeJson("Y", "Success", dt);

                return Json(strJson);
            }
            catch (Exception e)
            {
                strJson = e.Message;
                return Json(strJson);
            }
        }


        public ActionResult fnUpdateBkgSvc(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();
                DataTable dt = new DataTable();
                dt = JsonConvert.DeserializeObject<DataTable>(vJsonData);
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    if (dt.Rows[i]["INSFLAG"].ToString() == "I")
                    {
                        rtnStatus = Sql_Booking.fnInsertBkgSvc_Query(dt.Rows[i]);
                    }

                    else if (dt.Rows[i]["INSFLAG"].ToString() == "U")
                    {
                        rtnStatus = Sql_Booking.fnUpdateBkgSvc_Query(dt.Rows[i]);
                    }

                    else if (dt.Rows[i]["INSFLAG"].ToString() == "D")
                    {
                        rtnStatus = Sql_Booking.fnDeleteBkgSvc_Query(dt.Rows[i]);
                    }

                    if (!rtnStatus) break;
                }

                dt = Sql_Booking.fnSearchBkgSvc_Query(dt.Rows[0]);
                strJson = _common.MakeJson("Y", "Success", dt);

                return Json(strJson);
            }
            catch (Exception e)
            {
                strJson = e.Message;
                return Json(strJson);
            }
        }

        #endregion

        /// <summary>
        /// 상품 변경시 헤더 업데이트 , 디테일 삭제
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
       public ActionResult fnChangeItem(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();
                DataTable dt = new DataTable();

                dt = JsonConvert.DeserializeObject<DataTable>(vJsonData);
                
                if(dt.Rows[0]["INSFLAG"].ToString() == "U")
                {
                    rtnStatus = Sql_Booking.UpDateHd_Query(dt.Rows[0]);

                    #region 디테일 정보 삭제
                    rtnStatus = Sql_Booking.fnAllDeleteBkgConf_Query(dt.Rows[0]);

                    rtnStatus = Sql_Booking.fnAllDeleteBkgRoom_Query(dt.Rows[0]);

                    rtnStatus = Sql_Booking.fnAllDeleteBkgMeal_Query(dt.Rows[0]);

                    rtnStatus = Sql_Booking.fnAllDeleteBkgSvc_Query(dt.Rows[0]);
                    #endregion

                }


                strJson = _common.MakeJson("Y", "Success");
                return Json(strJson);

            }
            catch(Exception e)
            {
                strJson = e.Message;
                return Json(strJson);
            }
        }


        public ActionResult fnUpdateBkgfile(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();
                DataTable dt = new DataTable();

                dt = JsonConvert.DeserializeObject<DataTable>(vJsonData);

                if(dt.Rows[0]["INSfLAG"].ToString() == "U")
                {
                    rtnStatus = Sql_Booking.UpdateFilePath(dt.Rows[0]);
                }


                strJson = _common.MakeJson("Y", "Success");
                return Json(strJson);
            }
            catch(Exception e)
            {
                strJson = e.Message;
                return Json(strJson);
            }
        }


        public ActionResult fnSaveBkgList(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();
                DataTable dt = new DataTable();

                dt = JsonConvert.DeserializeObject<DataTable>(vJsonData);

                if (dt.Rows[0]["INSfLAG"].ToString() == "U")
                {
                    rtnStatus = Sql_Booking.UpdateBkgList(dt.Rows[0]);
                }


                dt = Sql_Booking.fnSearchBkg_Query(dt.Rows[0]);

                strJson = _common.MakeJson("Y", "Success", dt);

                return Json(strJson);
            }
            catch(Exception e)
            {
                strJson = e.Message;
                return Json(strJson);
            }
        }



        public ActionResult fnFlagUpDateBkg(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();
                DataTable dt = new DataTable();
                DataTable rdt = new DataTable();


                dt = JsonConvert.DeserializeObject<DataTable>(vJsonData);

                rtnStatus = Sql_Booking.UpdateBkgFlag(dt.Rows[0]);


                //최종 확정일때 건수 증가
                if(dt.Rows[0]["STATUS"].ToString() == "F")
                {
                    rdt = Sql_Booking.SearchBkgItem(dt.Rows[0]);

                    rtnStatus = Sql_Booking.UpdateItemCnt(rdt.Rows[0]);

                }


                dt = Sql_Booking.fnSearchBkg_Query(dt.Rows[0]);

                strJson = _common.MakeJson("Y", "Success", dt);


                return Json(strJson);

            }
            catch (Exception e)
            {
                strJson = e.Message;
                return Json(strJson);
            }
        }

        #endregion



        #region 수정 요청 관리
        public ActionResult fnOrdModSearch(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();
                DataTable dt = new DataTable();
                DataSet ds = new DataSet();
                DataTable rdt = new DataTable();

                dt = JsonConvert.DeserializeObject<DataTable>(vJsonData);


                #region 원본 예약 정보

                rdt = Sql_Booking.fnSearchBkg_Query(dt.Rows[0]);
                rdt.TableName = "ORG_MAIN";
                ds.Tables.Add(rdt);


                rdt = Sql_Booking.fnSearchBkgConf_Query(dt.Rows[0]);
                rdt.TableName = "ORG_CONF";
                ds.Tables.Add(rdt);

                rdt = Sql_Booking.fnSearchBkgRoom_Query(dt.Rows[0]);
                rdt.TableName = "ORG_ROOM";
                ds.Tables.Add(rdt);

                rdt = Sql_Booking.fnSearchBkgMeal_Query(dt.Rows[0]);
                rdt.TableName = "ORG_MEAL";
                ds.Tables.Add(rdt);

                rdt = Sql_Booking.fnSearchBkgSvc_Query(dt.Rows[0]);
                rdt.TableName = "ORG_SVC";
                ds.Tables.Add(rdt);
                #endregion


                #region 수정요청 정보
                rdt = Sql_Booking.SelectBkgModHd_Query(dt.Rows[0]);
                rdt.TableName = "MOD_HD";
                ds.Tables.Add(rdt);

                rdt = Sql_Booking.SelectBkgModConf_Query(dt.Rows[0]);
                rdt.TableName = "MOD_CONF";
                ds.Tables.Add(rdt);

                rdt = Sql_Booking.SelectBkgModMeal_Query(dt.Rows[0]);
                rdt.TableName = "MOD_MEAL";
                ds.Tables.Add(rdt);

                rdt = Sql_Booking.SelectBkgModRoom_Query(dt.Rows[0]);
                rdt.TableName = "MOD_ROOM";
                ds.Tables.Add(rdt);

                rdt = Sql_Booking.SelectBkgModSvc_Query(dt.Rows[0]);
                rdt.TableName = "MOD_SVC";
                ds.Tables.Add(rdt);

                #endregion



                #region 결과 테이블
                dt = new DataTable();
                dt.Columns.Add("trxCode");
                dt.Columns.Add("trxMsg");
                DataRow row1 = dt.NewRow();

                row1["trxCode"] = "Y";
                row1["trxMsg"] = "Success";
                dt.Rows.Add(row1);
                dt.TableName = "Result";
                ds.Tables.Add(dt);

                #endregion

                strJson = JsonConvert.SerializeObject(ds);

                return Json(strJson);
            }
            catch(Exception e)
            {
                strJson = e.Message;
                return Json(strJson);
            }
        }


        public ActionResult UpDateMOD_FLAG(JsonData value)
        {
            try
            {

                string vJsonData = value.vJsonData.ToString();
                DataTable dt = new DataTable();
                DataTable rdt = new DataTable();
                
                dt = JsonConvert.DeserializeObject<DataTable>(vJsonData);
                rtnStatus = Sql_Booking.UpdateModFlag(dt.Rows[0]);


                #region 수정 플래그 Y 일때
                if (dt.Rows[0]["BKG_MOD_FLAG"].ToString() == "Y") 
                {
                    rtnStatus = Sql_Booking.UpdateBKGheadFlag(dt.Rows[0]);
                }

                #endregion


                strJson = _common.MakeJson("Y", "Success", dt);
                return Json(strJson);
            }
            catch(Exception e)
            {
                strJson = e.Message;
                return Json(strJson);
            }
        }



        public ActionResult UpdateHeader(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();
                DataTable dt = new DataTable();
                DataTable rdt = new DataTable();
                dt = JsonConvert.DeserializeObject<DataTable>(vJsonData);
                rtnStatus = Sql_Booking.fnUpdateHd_Query(dt.Rows[0]);


                //재조회
                rdt = Sql_Booking.fnSearchBkg_Query(dt.Rows[0]);
                rdt.TableName = "ORG_MAIN";
                

                strJson = _common.MakeJson("Y", "Success", rdt);
                return Json(strJson);
            }
            catch(Exception e)
            {
                strJson = e.Message;
                return Json(strJson);
            }
        }

        #endregion



        #region 수정 요청 리스트
        /// <summary>
        /// 리스트 조회
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult fnGetModList(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();
                DataTable dt = new DataTable();


                dt = JsonConvert.DeserializeObject<DataTable>(vJsonData);
                dt = Sql_Booking.SelectModList_Query(dt.Rows[0]);


                strJson = _common.MakeJson("Y", "Success", dt);

                return Json(strJson);
            }
            catch (Exception e)
            {
                strJson = e.Message;
                return Json(strJson);
            }
        }

        #endregion

    }
}
