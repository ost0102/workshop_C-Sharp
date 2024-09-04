using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;

namespace WORKSHOP.Models.Query
{
    public class Sql_Quot
    {
        private static string sSql = "";
        private static bool rtnBool = false;
        private static DataTable dt = new DataTable();


        public string Regionshow_Query(DataRow dr)
        {

            sSql = "";
            sSql += "SELECT * ";
            sSql += "  FROM COMM_CODE ";
            sSql += " WHERE 1=1 ";
            sSql += " AND USE_YN = 'Y' ";
            sSql += " AND GRP_CD = '" + dr["GRP_CD"].ToString() + "' " ;
            sSql += " ORDER BY SEQ";


            return sSql;
        }

        public string Addoption_Query(DataRow dr)
        {

            sSql = "";
            sSql += "SELECT * ";
            sSql += "  FROM COMM_CODE ";
            sSql += " WHERE 1=1 ";
            sSql += " AND USE_YN = 'Y' ";
            sSql += " AND GRP_CD = '" + dr["GRP_CD"].ToString() + "' ";
            sSql += " ORDER BY SEQ";


            return sSql;
        }


        public string QuotRequire_Query(DataRow dr, string Mngt_No)
        {

            sSql = "";
            sSql += " INSERT INTO QUOT_REQ_MST ";
            sSql += "      (REQ_NO , QUOT_TYPE ,TOPIC , AREA , STRT_YMD , END_YMD , MIN_PRC , MAX_PRC , HEAD_CNT , RMK, REQ_NM , REQ_EMAIL, REQ_TEL ,USER_TYPE";
            if (dr.Table.Columns.Contains("REQ_CUST_NM"))
            {
                sSql += ", REQ_CUST_NM ";
            }
            if (dr.Table.Columns.Contains("GRP_CD"))
            {
                if (dr["GRP_CD"].ToString() != "")
                {
                    {
                        sSql += ", GRP_CD";
                    }
                }
            }

            sSql += ",INS_USR , INS_DT, UPD_USR, UPD_DT)   ";
            sSql += "      VALUES (";
            sSql += "        '" + Mngt_No + "'";
            sSql += "      , '" + dr["QUOT_TYPE"] + "'";
            sSql += "      , '" + dr["TOPIC"] + "'";
            sSql += "      , '" + dr["AREA"] + "'";
            sSql += "      , '" + dr["STRT_YMD"] + "'";
            sSql += "      , '" + dr["END_YMD"] + "'";
            sSql += "      , '" + dr["MIN_PRC"] + "'";
            sSql += "      , '" + dr["MAX_PRC"] + "'";
            sSql += "      , '" + dr["HEAD_CNT"] + "'";
            sSql += "      , '" + dr["RMK"] + "'";
            sSql += "      , '" + dr["REQ_NM"] + "'";
            sSql += "      , '" + dr["REQ_EMAIL"] + "'";
            sSql += "      , '" + dr["REQ_TEL"] + "'";
            sSql += "      , '" + dr["USER_TYPE"] + "'";
            if (dr.Table.Columns.Contains("REQ_CUST_NM"))
                if (dr["REQ_CUST_NM"].ToString() != "")
                {
                    {
                    sSql += "      , '" + dr["REQ_CUST_NM"] + "'";
                }
            }
            if (dr.Table.Columns.Contains("GRP_CD"))
                if (dr["GRP_CD"].ToString() != "")
                {
                    {
                        sSql += "      , '" + dr["GRP_CD"] + "'";
                    }
                }
            sSql += "      , '" + dr["REQ_NM"] + "'";
            sSql += "      , TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS')";
            sSql += "      , '" + dr["REQ_NM"] + "'";
            sSql += "      , TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS')";
            sSql += "      )";
     


            return sSql;
        }

        public string AddOptSend_Query(DataRow dr, string Mngt_No)
        {

            sSql = "";
            sSql += " INSERT INTO QUOT_REQ_SVC ";
            sSql += "      (REQ_NO , REQ_SEQ, SVC_CD, SVC_NM, INS_USR , INS_DT, UPD_USR, UPD_DT)";
            sSql += "      VALUES (";
            sSql += "        '" + Mngt_No + "'";
            sSql += "      , (SELECT  NVL(MAX(REQ_SEQ),0) + 1 FROM QUOT_REQ_SVC WHERE REQ_NO = '" + Mngt_No + "')";
            sSql += "      , '" + dr["SVC_CD"] + "'";
            sSql += "      , '" + dr["SVC_NM"] + "'"; ;
            sSql += "      , '" + dr["REQ_NM"] + "'";
            sSql += "      , TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS')";
            sSql += "      , '" + dr["REQ_NM"] + "'";
            sSql += "      , TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS')";
            sSql += "      )";


            return sSql;
        }

        
    }
}