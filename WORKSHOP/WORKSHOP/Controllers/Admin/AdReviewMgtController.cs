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
    public class AdReviewMgtController : Controller
    {
        bool rtnStatus = false;
        //
        // GET: /business/       


        public ActionResult ReviewMgt()
        {
            return View();
        }

        public class JsonData
        {
            public string vJsonData { get; set; }
        }
        string strJson = "";


        [HttpPost]
        public ActionResult fnSaveExcel(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();

                DataTable dt = new DataTable();
                dt = JsonConvert.DeserializeObject<DataTable>(vJsonData);
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    rtnStatus = Sql_Cust.insertCustomerExcel(dt.Rows[i]);
                    if (!rtnStatus) break;
                }
                strJson = _common.MakeJson("Y", "Success", dt);
                return Json(strJson);
            }
            catch (Exception e)
            {
                strJson = e.Message;
                return Json(strJson);
            }
        }




        #region 리뷰관리 Controller
        /// <summary>
        /// 리뷰 메인 조회
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public ActionResult fnGetRvList(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();

                DataTable dt = new DataTable();
                dt = JsonConvert.DeserializeObject<DataTable>(vJsonData);
                dt = Sql_AdminReview.GetRvList_Query(dt.Rows[0]);
                dt.TableName = "MAINLIST";


                strJson = _common.MakeJson("Y", "Success", dt);
                return Json(strJson);
            }
            catch(Exception e){
                strJson = e.Message;
                return Json(strJson);
            }
        }

        /// <summary>
        /// 리뷰 업데이트
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public ActionResult fnUpdateRvList(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();
                DataTable dt = new DataTable();
                DataSet ds = new DataSet();

                ds = JsonConvert.DeserializeObject<DataSet>(vJsonData);

                dt = ds.Tables["LIST"];

                for (int i= 0; i< dt.Rows.Count; i++)
                {
                    if(dt.Rows[i]["INSFLAG"].ToString() == "D")
                    {
                        rtnStatus = Sql_AdminReview.DeleteRvList_Query(dt.Rows[i]);
                    }
                    if (!rtnStatus) break;
                }
                dt = ds.Tables["SearchParam"];
                dt = Sql_AdminReview.GetRvList_Query(dt.Rows[0]);
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
