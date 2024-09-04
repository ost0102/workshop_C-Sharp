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
    public class ModifyController : Controller
    {
        DataTable dt = new DataTable();
        DataTable Resultdt = new DataTable();

        Sql_Cust SC = new Sql_Cust();

        string strJson = "";
        string strResult = "";
        public class JsonData
        {
            public string vJsonData { get; set; }
        }
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public string ModifyUser(JsonData value)
        {
            string DB_con = _DataHelper.ConnectionString;
            int Resultdt = 0;

            strResult = value.vJsonData.ToString();
            dt = JsonConvert.DeserializeObject<DataTable>(strResult);

            try
            {
                Resultdt = _DataHelper.ExecuteNonQuery(SC.ModifyUser_Query(dt.Rows[0]), CommandType.Text);

                if (Resultdt > 0)
                {
                    strJson = _common.MakeJson("Y", "수정 성공");
                }
                else
                {
                    strJson = _common.MakeJson("N", "수정 실패");
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
        public string ChkNowPSWD(JsonData value)
        {
            string DB_con = _DataHelper.ConnectionString;

            strResult = value.vJsonData.ToString();
            dt = JsonConvert.DeserializeObject<DataTable>(strResult);

            try
            {
                Resultdt = _DataHelper.ExecuteDataTable(SC.ChkNowPSWD_Query(dt.Rows[0]), CommandType.Text);

                if (Resultdt != null)
                {
                    if (Resultdt.Rows.Count == 0)
                    {
                        strJson = _common.MakeJson("E", "아이디와 비밀번호가 없습니다.");
                    }
                    else
                    {
                        if (Resultdt.Rows[0]["PSWD"].ToString() == YJIT.Utils.StringUtils.Md5Hash((string)dt.Rows[0]["PSWD"]))
                        {
                            strJson = _common.MakeJson("Y", "Success");
                        }
                        else
                        {
                            strJson = _common.MakeJson("N", "현재 비밀번호가 아닙니다.");
                        }
                    }
                }
                else
                {
                    strJson = _common.MakeJson("E", "아이디와 비밀번호가 없습니다.");
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
        public string GetModifyInfo(JsonData value)
        {
            string DB_con = _DataHelper.ConnectionString;

            strResult = value.vJsonData.ToString();
            dt = JsonConvert.DeserializeObject<DataTable>(strResult);

            try
            {
                Resultdt = _DataHelper.ExecuteDataTable(SC.GetModifyInfo_Query(dt.Rows[0]), CommandType.Text);
                Resultdt.TableName = "UserInfo";

                if (Resultdt.Rows.Count == 0)
                {
                    strJson = _common.MakeJson("N", "Fail");
                }
                else
                {
                    strJson = _common.MakeJson("Y", "Success", Resultdt);
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
