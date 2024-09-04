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
    public class JoinController : Controller
    {
        DataSet ds = new DataSet();
        DataTable dt = new DataTable();
        DataTable Resultdt = new DataTable();

        Sql_Cust SC = new Sql_Cust();

        string strJson = "";
        string strResult = "";

        public ActionResult Index()
        {
            return View();
        }


        public class JsonData
        {
            public string vJsonData { get; set; }
        }

        /// 회원가입 - 회원가입 등록
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        [HttpPost]
        public string fnRegister(JsonData value)
        {
            int nResult = 0;
            string DB_con = _DataHelper.ConnectionString;

            strResult = value.vJsonData.ToString();

            dt = JsonConvert.DeserializeObject<DataTable>(strResult);

            try
            {
                nResult = _DataHelper.ExecuteNonQuery(SC.InsertRegister_Query(dt.Rows[0]), CommandType.Text);
                if(nResult == 1)
                {
                    strJson = _common.MakeJson("Y","가입 성공");
                }
                else
                {
                    strJson = _common.MakeJson("N", "가입 실패");
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

        public string isCheckID(JsonData value)
        {
            try
            {
                strResult = value.vJsonData.ToString();

                dt = JsonConvert.DeserializeObject<DataTable>(strResult);

                Resultdt = _DataHelper.ExecuteDataTable(Sql_Cust.isCheckID_Query(dt.Rows[0]), CommandType.Text);
                if (Resultdt.Rows.Count > 0)
                {
                    strJson = _common.MakeJson("N", "이메일이 존재합니다.");
                }
                else
                {
                    strJson = _common.MakeJson("Y", "");
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
