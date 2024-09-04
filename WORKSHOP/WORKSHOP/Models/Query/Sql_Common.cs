using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;

namespace WORKSHOP.Models.Query
{
    public class Sql_Common
    {
        static bool rtnBool = false;
        static DataTable dt = new DataTable();
        public static DataTable SelectCustInfo(DataRow dr)
        {
            string sSql = "";
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
            sSql += "        AND UPPER(EMAIL) = UPPER('" + dr["ID"] + "') ";
            sSql += "        AND PSWD = '" + YJIT.Utils.StringUtils.Md5Hash((string)dr["PWD"]) + "' ";
            sSql += "        AND ADMIN_YN = 'Y' ";

            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);
            return dt;
        }
        public static DataTable SelectGrpCommonHeader(DataRow dr)
        {
            string sSql = "";
            sSql = " SELECT * FROM COMM_GRP WHERE  1 = 1 ";
            if (dr["GRP_CD"].ToString() != "")
            {
                sSql += " AND GRP_NM = '" + dr["GRP_CD"].ToString().Trim() + "'";
            }

            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);
            return dt;
        }
        public static DataTable checkID(DataRow dr)
        {
            string sSql = "";
            sSql = " SELECT EMAIL FROM CUST_INFO WHERE EMAIL = '" + dr["EMAIL"].ToString() + "'";

            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);
            return dt;
        }

        public static DataTable SelectGrpCommon(DataRow dr)
        {
            string sSql = "";
            sSql = " SELECT * FROM COMM_GRP WHERE  1 = 1 ";
            if (dr["GRP_NM"].ToString() != "")
            {
                sSql += " AND GRP_CD = '" + dr["GRP_NM"].ToString().Trim() + "'";
            }

            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);
            return dt;
        }

        public static DataTable SelectGrpCommonAll()
        {
            string sSql = "";
            sSql = " SELECT * FROM COMM_GRP WHERE  1 = 1 ";

            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);
            return dt;
        }

        public static DataTable SelectGrpCommonDetail(DataRow dr)
        {
            string sSql = "";
            sSql = " SELECT 'Q' AS INSFLAG , A.* FROM COMM_CODE A WHERE  1 = 1 ";
            if (dr["GRP_CD"].ToString() != "")
            {
                sSql += " AND GRP_CD = '" + dr["GRP_CD"].ToString().Trim() + "'";
            }
            sSql += " ORDER BY SEQ";

            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);
            return dt;
        }


        public static DataTable SelectGrpCommonDetailTest(DataRow dr)
        {
            string sSql = "";
            sSql = " SELECT COMM_CD , COMM_NM FROM COMM_CODE A WHERE GRP_CD = '" + dr["GRP_CD"].ToString().Trim() + "' ORDER BY SEQ";

            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);
            return dt;
        }

        public static bool InsertCommGrp(DataRow dr)
        {
            string sSql = "";
            sSql = "";
            sSql += " INSERT INTO COMM_GRP ";
            sSql += "      (GRP_CD , GRP_NM , INS_USR , INS_DT , UPD_USR  , UPD_DT)   ";
            sSql += "      VALUES (";
            sSql += "      '" + dr["GRP_NM"].ToString().Trim() + "'";
            sSql += "      , '" + dr["GRP_NM"].ToString().Trim() + "'";
            sSql += "      , '" + dr["INS_USR"].ToString().Trim() + "'";
            sSql += "      , TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS')";
            sSql += "      , '" + dr["INS_USR"].ToString().Trim() + "'";
            sSql += "      , TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS')";
            sSql += "      )";
            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }

        public static bool UpdateCommGrp(DataRow dr)
        {
            string sSql = "";
            sSql = "";
            sSql += " UPDATE COMM_GRP ";
            sSql += "      GRP_NM =  '" + dr["GRP_NM"].ToString().Trim() + "'";
            sSql += "      UPD_USR =  '" + dr["INS_USR"].ToString().Trim() + "'";
            sSql += "      UPD_DT =  TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS')";
            sSql += "      WHERE GRP_CD = '" + dr["GRP_CD"].ToString() + "'";
            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }

        public static bool DeleteCommGrp(DataRow dr)
        {
            string sSql = "";
            sSql = " BEGIN";
            sSql += " DELETE COMM_GRP ";
            sSql += "      WHERE GRP_CD = '" + dr["GRP_CD"].ToString() + "';";
            sSql += " DELETE COMM_CODE ";
            sSql += "      WHERE GRP_CD = '" + dr["GRP_CD"].ToString() + "';";
            sSql += " END;";
            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }

        public static bool InsertCommDetail(DataRow dr)
        {
            string sSql = "";
            sSql = "";
            sSql += " INSERT INTO COMM_CODE ";
            sSql += "      (GRP_CD , COMM_CD ,COMM_NM,OPTION1,OPTION2,SEQ , FILE_NM , FILE_PATH , INS_USR , INS_DT , UPD_USR  , UPD_DT)   ";
            sSql += "      VALUES (";
            sSql += "      '" + dr["GRP_CD"].ToString().Trim() + "'";
            sSql += "      , '" + dr["COMM_CD"].ToString().Trim() + "'";
            sSql += "      , '" + dr["COMM_NM"].ToString().Trim() + "'";
            sSql += "      , '" + dr["OPTION1"].ToString().Trim() + "'";
            sSql += "      , '" + dr["OPTION2"].ToString().Trim() + "'";
            if (dr["SEQ"].ToString() == "0")
            {
                sSql += "      , (SELECT NVL(MAX(SEQ),0)+1 FROM COMM_CODE WHERE GRP_CD = '" + dr["GRP_CD"].ToString().Trim() + "')";
            }
            else {
                sSql += "      , " + dr["SEQ"] + "";
            }
            sSql += "      , '" + dr["FILE_NM"].ToString().Trim() + "'";
            sSql += "      , '" + dr["FILE_PATH"].ToString().Trim() + "'";
            sSql += "      , '" + dr["INS_USR"].ToString().Trim() + "'";
            sSql += "      , TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS')";
            sSql += "      , '" + dr["INS_USR"].ToString().Trim() + "'";
            sSql += "      , TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS')";
            sSql += "      )";
            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }

        public static bool UpdateCommDetail(DataRow dr)
        {
            string sSql = "";
            sSql = "";
            sSql += " UPDATE COMM_CODE ";
            sSql += "      SET COMM_CD  = '" + dr["COMM_CD"].ToString().Trim() + "'";
            sSql += "        , COMM_NM  = '" + dr["COMM_NM"].ToString().Trim() + "'";
            sSql += "        , OPTION1  = '" + dr["OPTION1"].ToString().Trim() + "'";
            sSql += "        , OPTION2  = '" + dr["OPTION2"].ToString().Trim() + "'";
            sSql += "        , FILE_NM  = '" + dr["FILE_NM"].ToString().Trim() + "'";
            sSql += "        , FILE_PATH  = '" + dr["FILE_PATH"].ToString().Trim() + "'";
            sSql += "        , UPD_USR  = '" + dr["INS_USR"].ToString().Trim() + "'";
            sSql += "        , UPD_DT  = TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS')";
            sSql += "   WHERE GRP_CD = '" + dr["GRP_CD"].ToString().Trim() + "'";
            sSql += "   AND SEQ  = " + dr["SEQ"] ;

            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }

        public static bool DeleteCommDetail(DataRow dr)
        {
            string sSql = "";
            sSql = "";
            sSql += " DELETE COMM_CODE ";
            sSql += "   WHERE GRP_CD = '" + dr["GRP_CD"].ToString().Trim() + "'";
            sSql += "   AND SEQ  = " + dr["SEQ"];

            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }
    }
}