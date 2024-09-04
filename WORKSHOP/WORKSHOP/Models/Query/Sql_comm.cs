using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;

namespace WORKSHOP.Models.Query
{
    public class Sql_comm
    {
        private static string sSql = "";
        private static bool rtnBool = false;
        private static DataTable dt = new DataTable();

        public string GetUserInfo(DataRow dr)
        {
            sSql = "";
            sSql += " SELECT MNGT_NO, ";
            sSql += "        EMAIL, ";
            sSql += "        GRP_CD, ";
            sSql += "        CUST_NAME, ";
            sSql += "        TELNO, ";
            sSql += "        COMPANY, ";
            sSql += "        DEPARTURE, ";
            sSql += "        USER_TYPE, ";
            sSql += "        APV_YN ";
            sSql += "        FROM CUST_INFO";
            sSql += "        WHERE 1=1 ";
            //sSql += "        AND APV_YN = 'Y' ";
            sSql += "        AND UPPER(EMAIL) = UPPER('" + dr["EMAIL"] + "') ";
            sSql += "        AND PSWD = '" + YJIT.Utils.StringUtils.Md5Hash((string)dr["PSWD"]) + "' ";

            return sSql;
        }
    }
}