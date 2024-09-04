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
    public class CommunityController : Controller
    {
        string strJson = "";
        DataSet ds = new DataSet();
        bool rtnStatus = false;
        //
        // GET: /Quotation/

        public ActionResult Index()
        {
            ViewBag.MENU_NM = "Community";
            return View();
        }




        public class JsonData
        {
            public string vJsonData { get; set; }
        }


        #region 커뮤니티 조회 관련

        /// <summary>
        /// 메인 리스트 조회
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public ActionResult fnGetTopicList(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();
                DataTable dt = new DataTable();

                dt = JsonConvert.DeserializeObject<DataTable>(vJsonData);
                dt = Sql_Community.GetTopicList(dt.Rows[0]);


                strJson = _common.MakeJson("Y", "Success", dt);

                return Json(strJson);
            }
            catch(Exception e)
            {
                strJson = e.Message;
                return Json(strJson);
            }
        }


        /// <summary>
        /// 댓글 조회 + 내용조회
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public  ActionResult fnGetContentDtl(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();
                DataTable sdt = new DataTable();
                DataTable dt = new DataTable();
                DataTable rdt = new DataTable();
                DataTable adt = new DataTable();
                DataSet ds = new DataSet();

                sdt = JsonConvert.DeserializeObject<DataTable>(vJsonData);


                rtnStatus = Sql_Community.UpdateCommuView(sdt.Rows[0]);
                adt = Sql_Community.GetCommuDtl(sdt.Rows[0]);
                ds.Tables.Add(adt);


                dt = Sql_Community.GetReplyList(sdt.Rows[0]);
                ds.Tables.Add(dt);

                dt = Sql_Community.Search_NoticeView(adt.Rows[0]);
                ds.Tables.Add(dt);

                #region 결과 값 테이블 바인딩
                rdt.Columns.Add("trxCode");
                rdt.Columns.Add("trxMsg");
                DataRow dr1 = rdt.NewRow();
                dr1["trxCode"] = "Y";
                dr1["trxMsg"] = "Success";
                rdt.Rows.Add(dr1);
                rdt.TableName = "Result";
                ds.Tables.Add(rdt);
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

        [HttpPost]
        public ActionResult fnSaveAdminCommu(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();
                

                DataTable dt = new DataTable();

                dt = JsonConvert.DeserializeObject<DataTable>(vJsonData);

                rtnStatus = Sql_Community.InsertCommuMst(dt.Rows[0]);

                strJson = _common.MakeJson("Y", "Success");
                return Json(strJson);

            }
            catch(Exception e)
            {
                strJson = e.Message;
                return Json(strJson);
            }
        }


        #endregion
        [HttpPost]
        public string fnInsertReplyList(JsonData value)
        {
            int nResult = 0;
            string strResult = "";
            DataTable dt = new DataTable();
            DataTable rdt = new DataTable();
            DataTable vdt = new DataTable();
            DataTable adt = new DataTable();
            DataSet ds = new DataSet();

            strResult = value.vJsonData.ToString();
            dt = JsonConvert.DeserializeObject<DataTable>(strResult);

            Sql_Community SC = new Sql_Community();
            try
            {
                nResult = _DataHelper.ExecuteNonQuery(SC.InsertReplyList(dt.Rows[0]), CommandType.Text);

                if (nResult == 1)
                {
                    strJson = _common.MakeJson("Y", "Sucess");
                }
                else
                {
                    strJson = _common.MakeJson("N", "Fail");
                    return strJson;
                }

                vdt = Sql_Community.GetReplyList(dt.Rows[0]);
                ds.Tables.Add(vdt);

                adt = Sql_Community.GetCommuDtl(dt.Rows[0]);
                ds.Tables.Add(adt);

                dt = Sql_Community.Search_NoticeView(adt.Rows[0]);
                ds.Tables.Add(dt);

                #region 결과 값 테이블 바인딩
                rdt.Columns.Add("trxCode");
                rdt.Columns.Add("trxMsg");
                DataRow dr1 = rdt.NewRow();
                dr1["trxCode"] = "Y";
                dr1["trxMsg"] = "Success";
                rdt.Rows.Add(dr1);
                rdt.TableName = "Result";
                ds.Tables.Add(rdt);
                #endregion

                strJson = JsonConvert.SerializeObject(ds);
                return strJson;
            }
            catch (Exception e)
            {
                strJson = _common.MakeJson("E", e.Message);
                return strJson;
            }
        }

        [HttpPost]
        public string fnDeleteReplyList(JsonData value)
        {
            
            string strResult = "";
            DataTable dt = new DataTable();
            DataTable ckdt = new DataTable();
            DataTable vdt = new DataTable();
            DataTable rdt = new DataTable();
            DataTable adt = new DataTable();


            strResult = value.vJsonData.ToString();
            dt = JsonConvert.DeserializeObject<DataTable>(strResult); // mngt , email , pw

            Sql_Community SC = new Sql_Community();
            try
            {

                if(dt.Rows[0]["PAGE_TYPE"].ToString() == "FRONT")
                {
                    ckdt = _DataHelper.ExecuteDataTable(SC.CheckPW_Query(dt.Rows[0]), CommandType.Text);


                    if (ckdt.Rows.Count == 0)
                    {
                        strJson = _common.MakeJson("N", "값 불러오기 실패", ckdt);
                        return strJson;
                    }
                    else
                    {
                        strJson = _common.MakeJson("Y", "값 불러오기 성공", ckdt);
                    }
                }

                
                rtnStatus = Sql_Community.DeleteReply(dt.Rows[0]);

                if (rtnStatus == true)
                {
                    strJson = _common.MakeJson("Y", "Sucess");
                }
                else
                {
                    strJson = _common.MakeJson("N", "Fail");
                    return strJson;
                }

                
                vdt = Sql_Community.GetReplyList(dt.Rows[0]);
                ds.Tables.Add(vdt);

                adt = Sql_Community.GetCommuDtl(dt.Rows[0]);
                ds.Tables.Add(adt);

                dt = Sql_Community.Search_NoticeView(adt.Rows[0]);
                ds.Tables.Add(dt);

                #region 결과 값 테이블 바인딩
                rdt.Columns.Add("trxCode");
                rdt.Columns.Add("trxMsg");
                DataRow dr1 = rdt.NewRow();
                dr1["trxCode"] = "Y";
                dr1["trxMsg"] = "Success";
                rdt.Rows.Add(dr1);
                rdt.TableName = "Result";
                ds.Tables.Add(rdt);
                #endregion

                strJson = JsonConvert.SerializeObject(ds);
                return strJson;

            }
            catch (Exception e)
            {
                strJson = _common.MakeJson("E", e.Message);
                return strJson;
            }
        }
        [HttpPost]
        public string fnChecked_Pwd(JsonData value)
        {
            string strResult = "";
            DataTable dt = new DataTable();
            DataTable ckdt = new DataTable();

            Sql_Community SC = new Sql_Community();

            strResult = value.vJsonData.ToString();
            dt = JsonConvert.DeserializeObject<DataTable>(strResult); // mngt , email , pw

            dt = _DataHelper.ExecuteDataTable(SC.Content_Check_Query(dt.Rows[0]), CommandType.Text);
            dt.TableName = "COMMUNITY";
            if (dt.Rows.Count == 0)
            {
                strJson = _common.MakeJson("N", "값 불러오기 실패", dt);
                return strJson;
            }
            else
            {
                strJson = _common.MakeJson("Y", "값 불러오기 성공", dt);
            }
            return strJson;

        }

        [HttpPost]
        public string fnDeleteCommuList(JsonData value)
        {


            try
            {
                string strResult = "";
                DataTable dt = new DataTable();
                DataTable ckdt = new DataTable();


                strResult = value.vJsonData.ToString();
                dt = JsonConvert.DeserializeObject<DataTable>(strResult); // mngt , email , pw

                Sql_Community SC = new Sql_Community();
                //if (dt.Rows[0]["PAGE_TYPE"].ToString() == "FRONT") // 사용자 단에서의 체크로직
                //{
                //    ckdt = _DataHelper.ExecuteDataTable(SC.Content_Check_Query(dt.Rows[0]), CommandType.Text);


                //    if (ckdt.Rows.Count == 0)
                //    {
                //        strJson = _common.MakeJson("N", "값 불러오기 실패", ckdt);
                //        return strJson;
                //    }
                //    else
                //    {
                //        strJson = _common.MakeJson("Y", "값 불러오기 성공", ckdt);
                //    }

                //}


                rtnStatus = Sql_Community.DeleteCommu(dt.Rows[0]);


                strJson = _common.MakeJson("Y", "Success", dt);

                return strJson;
            }
            catch(Exception e)
            {
                strJson = _common.MakeJson("E", e.Message);
                return strJson;
            }
        }



        

        [HttpPost]
        public string fnCommModify(JsonData value)
        {
            string strResult = "";
            DataTable dt = new DataTable();
            DataTable ckdt = new DataTable();

            Sql_Community SC = new Sql_Community();

            strResult = value.vJsonData.ToString();
            dt = JsonConvert.DeserializeObject<DataTable>(strResult); // mngt , email , pw
            dt = Sql_Community.GetCommuDtl(dt.Rows[0]);
            if (dt.Rows.Count == 0)
            {
                strJson = _common.MakeJson("N", "값 불러오기 실패", dt);
                return strJson;
            }
            else
            {
                strJson = _common.MakeJson("Y", "값 불러오기 성공", dt);
            }
            return strJson;

        }

        //[HttpPost]
        //public string fnInsertReplyReList(JsonData value)
        //{
        //    int nResult = 0;
        //    string strResult = "";
        //    DataTable dt = new DataTable();


        //    strResult = value.vJsonData.ToString();
        //    dt = JsonConvert.DeserializeObject<DataTable>(strResult);

        //    Sql_Community SC = new Sql_Community();
        //    try
        //    {
        //        nResult = _DataHelper.ExecuteNonQuery(SC.InsertReplyList(dt.Rows[0]), CommandType.Text);

        //        if (nResult == 1)
        //        {
        //            strJson = _common.MakeJson("Y", "Sucess");
        //        }
        //        else
        //        {
        //            strJson = _common.MakeJson("N", "Fail");
        //            return strJson;
        //        }

        //        dt = Sql_Community.GetReplyList(dt.Rows[0]);

        //        strJson = _common.MakeJson("Y", "Success", dt);


        //        return strJson;
        //    }
        //    catch (Exception e)
        //    {
        //        strJson = _common.MakeJson("E", e.Message);
        //        return strJson;
        //    }
        //}

    }
}
