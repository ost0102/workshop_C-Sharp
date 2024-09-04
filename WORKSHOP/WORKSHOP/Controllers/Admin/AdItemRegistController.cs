using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Web.Mvc;
using WORKSHOP.Models;
using WORKSHOP.Models.Query;
using Newtonsoft.Json;
using System.IO;


namespace WORKSHOP.Controllers.Admin
{
    public class AdItemRegistController : Controller
    {
        bool rtnStatus = false;
        //
        // GET: /business/       


        public ActionResult ItemRegist()
        {
            return View();
        }

        public class JsonData
        {
            public string vJsonData { get; set; }
        }
        string strJson = "";

        [HttpPost]
        public string UploadHandler()
        {
            try
            {
                HttpFileCollectionBase files = Request.Files;
                if (files[0].FileName != "")
                {
                    string savePath = "/Files/Admin";
                    string folder1 = DateTime.Now.ToString("yyyyMMdd");
                    string path = Server.MapPath(savePath) + "\\" + folder1;
                    string zipPath = path;

                    //현재 날짜 파일 생성
                    DirectoryInfo di = new DirectoryInfo(path); //폴더 관련 객체
                    if (di.Exists != true)
                    {
                        di.Create();
                    }

                    // 파일 넣을 경로 생성
                    string strDateTimeDi = DateTime.Now.ToString("yyyyMMddHHmmssFFF");
                    di.Refresh();

                    path += "/" + strDateTimeDi;

                    di = new DirectoryInfo(path);
                    if (di.Exists != true)
                    {
                        di.Create();
                    }
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


                    savePath += "/" + folder1 + "/" + strDateTimeDi;

                    System.IO.FileInfo fi;
                    string strDateTime = ""; //년월일시분초밀리초 시간은 계속 변해서 변수 사용.

                    for (int i = 0; i < files.Count; i++)
                    {
                        try
                        {
                            HttpPostedFileBase file = files[i];
                            strDateTime = DateTime.Now.ToString("yyyyMMddHHmmssFFF") + "." + file.FileName.Substring(file.FileName.LastIndexOf(".") + 1, file.FileName.Length - (file.FileName.LastIndexOf(".") + 1));

                            fi = new System.IO.FileInfo(path + "/" + strDateTime);

                            //파일 이름이 벌써 있는 경우 채번을 다시 시도. (무한루프)
                            while (true)
                            {
                                if (fi.Exists)
                                {
                                    strDateTime = DateTime.Now.ToString("yyyyMMddHHmmssFFF") + "." + file.FileName.Substring(file.FileName.LastIndexOf(".") + 1, file.FileName.Length - (file.FileName.LastIndexOf(".") + 1)); //파일이 있을 경우 다시 채번.
                                    fi = new System.IO.FileInfo(path + "/" + strDateTime);
                                }
                                else
                                {
                                    break;
                                }
                            }

                            if (fi.Exists != true)
                            {
                                //파일만 저장
                                file.SaveAs(path + "/" + file.FileName);
                            }

                            strJson = _common.MakeJson("Y", savePath);
                        }
                        catch (Exception ex)
                        {

                            strJson = _common.MakeJson("E", ex.Message);
                            return strJson;
                            //return Json(strJson);
                        }
                    }
                    /////////////////////////////
                    ///
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
        public ActionResult fnSaveExcel(JsonData value)
        {
            try
            {
                var errorMsg = "";
                string vJsonData = value.vJsonData.ToString();
                DataTable dt = new DataTable();
                dt = JsonConvert.DeserializeObject<DataTable>(vJsonData);
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    if (dt.Rows[i][0].ToString() != "지역")
                    {
                 
                        string mngt_no = "ITEM" + DateTime.Now.ToString("yyyyMMddHHmmss");
                        rtnStatus = Sql_AdminItem.insertItemExcel(dt.Rows[i], mngt_no);
                        if (!rtnStatus) break;
                      
                    }
                }


                strJson = _common.MakeJson("Y", errorMsg, dt);
                return Json(strJson);
            }
            catch (Exception e)
            {
                strJson = e.Message;
                return Json(strJson);
            }
        }




        #region 상품등록 Controller

        [HttpPost]
        public ActionResult fnGetItemInfo(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();

                DataTable dt = new DataTable();
                dt = JsonConvert.DeserializeObject<DataTable>(vJsonData);
                dt = Sql_AdminItem.SelectItemInfo(dt.Rows[0]);
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
        public ActionResult fnSaveItemMST(JsonData value)
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
                        rtnStatus = Sql_AdminItem.InsertItemMST(dt.Rows[i]);
                    }
                    else if (dt.Rows[i]["INSFLAG"].ToString() == "U")
                    {
                        rtnStatus = Sql_AdminItem.UpdateItemMST(dt.Rows[i]);
                    }
                    else if(dt.Rows[i]["INSFLAG"].ToString() == "D")
                    {
                        rtnStatus = Sql_AdminItem.DeleteItemMST(dt.Rows[i]);

                        rtnStatus = Sql_AdminItem.DeleteConfDtl(dt.Rows[i]);
                        rtnStatus = Sql_AdminItem.DeleteMealDtl(dt.Rows[i]);
                        rtnStatus = Sql_AdminItem.DeleteRoomDtl(dt.Rows[i]);
                        rtnStatus = Sql_AdminItem.DeleteSvcDtl(dt.Rows[i]);
                        rtnStatus = Sql_AdminItem.DeleteImgDtl(dt.Rows[i]);
                        
                        
                    }
                    if (!rtnStatus) break;
                }

//                dt = Sql_AdminItem.SelectItemInitInfo();
                strJson = _common.MakeJson("Y", "Success");
                return Json(strJson);
            }
            catch(Exception e)
            {
                strJson = e.Message;
                return Json(strJson);
            }
        }

        /// <summary>
        /// 상품 상세 정보 전체 조회 쿼리
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult fnGetItemDteilAll(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();
                DataSet ds = new DataSet();
                DataTable dt = new DataTable();
                DataTable rtnDt = JsonConvert.DeserializeObject<DataTable>(vJsonData);

                //호텔 담당자 정보
                dt = Sql_AdminItem.SelectHotelDetail(rtnDt.Rows[0]);
                dt.TableName = "HOTEL";

                ds.Tables.Add(dt);
                //세미나 정보
                dt = Sql_AdminItem.SelectConfDetail(rtnDt.Rows[0]);
                dt.TableName = "CONF";
                ds.Tables.Add(dt);

                //숙박 정보
                dt = Sql_AdminItem.SelectRoomDetail(rtnDt.Rows[0]);
                dt.TableName = "ROOM";
                ds.Tables.Add(dt);

                //식사 정보
                dt = Sql_AdminItem.SelectMealDetail(rtnDt.Rows[0]);
                dt.TableName = "MEAL";
                ds.Tables.Add(dt);

                //기타 정보
                dt = Sql_AdminItem.SelectSVCDetail(rtnDt.Rows[0]);
                dt.TableName = "SVC";
                ds.Tables.Add(dt);

                //이미지
                dt = Sql_AdminItem.SelectIMGDetail(rtnDt.Rows[0]);
                dt.TableName = "IMG";
                ds.Tables.Add(dt);

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


                return Json(strJson);

            }
            catch (Exception e)
            {
                strJson = e.Message;
                return Json(strJson);
            }
        }



        [HttpPost]
        public ActionResult fnGetItemConfDetail(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();
                DataTable rtnDt = JsonConvert.DeserializeObject<DataTable>(vJsonData);
                DataTable dt = Sql_AdminItem.SelectConfDetail(rtnDt.Rows[0]);
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
        public ActionResult fnSaveHotelDtl(JsonData value)
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
                        rtnStatus = Sql_AdminItem.InsertHotelDtl(dt.Rows[i]);
                    }
                    else if (dt.Rows[i]["INSFLAG"].ToString() == "U")
                    {
                        rtnStatus = Sql_AdminItem.UpdateHotelDtl(dt.Rows[i]);
                    }
                    else if (dt.Rows[i]["INSFLAG"].ToString() == "D")
                    {
                        rtnStatus = Sql_AdminItem.DeleteHotelDtl(dt.Rows[i]);
                    }


                    if (!rtnStatus) break;
                }

                dt = Sql_AdminItem.SelectHotelDetail(dt.Rows[0]);
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
        public ActionResult fnSaveConfDtl(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();

                DataTable dt = new DataTable();
                dt = JsonConvert.DeserializeObject<DataTable>(vJsonData);
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    if(dt.Rows[i]["INSFLAG"].ToString() == "I")
                    {
                        rtnStatus = Sql_AdminItem.InsertConfDtl(dt.Rows[i]);
                    }
                    else if(dt.Rows[i]["INSFLAG"].ToString() == "U")
                    {
                        rtnStatus = Sql_AdminItem.UpdateConfDtl(dt.Rows[i]);
                    }
                    else if(dt.Rows[i]["INSFLAG"].ToString() == "D")
                    {
                        rtnStatus = Sql_AdminItem.DeleteConfDtl(dt.Rows[i]);
                    }

                    
                    if (!rtnStatus) break;
                }

                dt = Sql_AdminItem.SelectConfDetail(dt.Rows[0]);
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
        public ActionResult fnSaveRoomDtl(JsonData value)
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
                        rtnStatus = Sql_AdminItem.InsertRoomDtl(dt.Rows[i]);
                    }
                    else if (dt.Rows[i]["INSFLAG"].ToString() == "U")
                    {
                        rtnStatus = Sql_AdminItem.UpdateRoomDtl(dt.Rows[i]);
                    }
                    else if (dt.Rows[i]["INSFLAG"].ToString() == "D")
                    {
                        rtnStatus = Sql_AdminItem.DeleteRoomDtl(dt.Rows[i]);
                    }


                    if (!rtnStatus) break;
                }

                dt = Sql_AdminItem.SelectRoomDetail(dt.Rows[0]);
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
        public ActionResult fnSaveMealDtl(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();

                DataTable dt = new DataTable();
                dt = JsonConvert.DeserializeObject<DataTable>(vJsonData);
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    if(dt.Rows[i]["INSFLAG"].ToString() == "I")
                    {
                        rtnStatus = Sql_AdminItem.InsertMealDtl(dt.Rows[i]);
                    }
                    else if (dt.Rows[i]["INSFLAG"].ToString() == "U")
                    {
                        rtnStatus = Sql_AdminItem.UpdateMealDtl(dt.Rows[i]);
                    }
                    else if (dt.Rows[i]["INSFLAG"].ToString() == "D")
                    {
                        rtnStatus = Sql_AdminItem.DeleteMealDtl(dt.Rows[i]);
                    }
                    if (!rtnStatus) break;
                }

                dt = Sql_AdminItem.SelectMealDetail(dt.Rows[0]);
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
        public ActionResult fnSaveSvcDtl(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();

                DataTable dt = new DataTable();
                dt = JsonConvert.DeserializeObject<DataTable>(vJsonData);
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    if (dt.Rows[i]["INSFLAG"].ToString() == "I") {
                        rtnStatus = Sql_AdminItem.InsertSvcDtl(dt.Rows[i]);
                    }
                    else if (dt.Rows[i]["INSFLAG"].ToString() == "U")
                    {
                        rtnStatus = Sql_AdminItem.UpdateSvcDtl(dt.Rows[i]);
                    }
                    else if (dt.Rows[i]["INSFLAG"].ToString() == "D")
                    {
                        rtnStatus = Sql_AdminItem.DeleteSvcDtl(dt.Rows[i]);
                    }
                    if (!rtnStatus) break;
                }

                dt = Sql_AdminItem.SelectSVCDetail(dt.Rows[0]);
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
        public ActionResult fnSaveImgDtl(JsonData value)
        {
            string vJsonData = value.vJsonData.ToString();
            DataTable dt = new DataTable();
            dt = JsonConvert.DeserializeObject<DataTable>(vJsonData);


            try
            {
                for(int i = 0; i < dt.Rows.Count; i++)
                {
                    if (dt.Rows[i]["INSFLAG"].ToString() == "I")
                    {
                        rtnStatus = Sql_AdminItem.InsertImgDtl(dt.Rows[i]);
                    }
                    else if (dt.Rows[i]["INSFLAG"].ToString() == "U") {
                        rtnStatus = Sql_AdminItem.UpdateImgDtl(dt.Rows[i]);
                    }
                    else if (dt.Rows[i]["INSFLAG"].ToString() == "D") {
                        rtnStatus = Sql_AdminItem.DeleteImgDtl(dt.Rows[i]);
                    }
                }

                dt = Sql_AdminItem.SelectIMGDetail(dt.Rows[0]);
                strJson = _common.MakeJson("Y", "Success", dt);
                return Json(strJson);
            }
            catch(Exception e){
                strJson = e.Message;
                return Json(strJson);
            }
        }

        #endregion


    }
}
