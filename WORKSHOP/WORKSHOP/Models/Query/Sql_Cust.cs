using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;

namespace WORKSHOP.Models.Query
{
    public class Sql_Cust
    {
        private static string sSql = "";
        private static bool rtnBool = false;
        private static DataTable dt = new DataTable();

        public static DataTable SelectCustInfo(DataRow dr)
        {
            sSql = " SELECT 'Q' AS INSFLAG , A.* FROM CUST_INFO A";
            sSql += " WHERE 1 = 1 ";
            sSql += " AND USER_TYPE <> 'Z'";
            if (dr.Table.Columns.Contains("S_GRP_CD"))
            {
                if (dr["S_GRP_CD"].ToString().Trim() != "" && dr["S_GRP_CD"].ToString().Trim() != "전체")
                {
                    sSql += "   AND GRP_CD = '" + dr["S_GRP_CD"].ToString().Trim() + "' ";
                }
            }
            if (dr.Table.Columns.Contains("S_CUST_NAME"))
            {
                if (dr["S_CUST_NAME"].ToString().Trim() != "")
                {
                    sSql += "   AND CUST_NAME LIKE '%" + dr["S_CUST_NAME"].ToString().Trim() + "%' ";
                }
            }
            if (dr.Table.Columns.Contains("S_COMPANY"))
            {
                if (dr["S_COMPANY"].ToString().Trim() != "")
                {
                    sSql += "   AND COMPANY LIKE '%" + dr["S_COMPANY"].ToString().Trim() + "%' ";
                }
            }
            //if (dr["TAG"].ToString() != "")
            //{
            //    sSql += " AND TAG LIKE '%" + dr["TAG"].ToString().Trim() + "%' ";
            //}
            if (dr.Table.Columns.Contains("S_DEPARTURE"))
            {
                if (dr["S_DEPARTURE"].ToString().Trim() != "")
                {
                    sSql += "   AND DEPARTURE LIKE '%" + dr["S_DEPARTURE"].ToString().Trim() + "%' ";
                }
            }
            if (dr.Table.Columns.Contains("S_USE_YN"))
            {
                if (dr["S_USE_YN"].ToString() != "" && dr["S_USE_YN"].ToString() != "A")
                {
                    sSql += " AND APV_YN = '" + dr["S_USE_YN"].ToString().Trim() + "' ";
                }
            }
            if (dr.Table.Columns.Contains("S_ADMIN_YN"))
            {
                if (dr["S_ADMIN_YN"].ToString() != "" && dr["S_ADMIN_YN"].ToString() != "A")
                {
                    sSql += " AND ADMIN_YN = '" + dr["S_ADMIN_YN"].ToString().Trim() + "' ";
                }
            }
            sSql += " ORDER BY NVL(UPD_DT,INS_DT) DESC";

            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);
            dt.TableName = "CUST_INFO";
            return dt;
        }

        public static DataTable SelectConfDetail(DataRow dr)
        {
            sSql = " SELECT CONF_TYPE || NVL('('||MAX_NUM||'명)','') AS CONF_CD , CONF_TYPE FROM ITEM_DTL_CONF WHERE ITEM_CD = '" + dr["ITEM_CD"].ToString() + "' AND USE_YN = 'Y' ";

            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);
            return dt;
        }


        public static DataTable SelectRoomDetail(DataRow dr)
        {
            sSql = "SELECT ROOM_NM ";
            sSql += " FROM ITEM_DTL_ROOM WHERE ITEM_CD = '"+dr["ITEM_CD"].ToString().Trim()+"' AND USE_YN = 'Y' ";


            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);
            return dt;
        }

        public static DataTable SelectMealDetail(DataRow dr)
        {
            sSql = "SELECT MEAL_NM ";
            sSql += " FROM ITEM_DTL_MEAL WHERE ITEM_CD = '"+ dr["ITEM_CD"].ToString().Trim() + "' AND USE_YN = 'Y' ";

            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);
            return dt;
        }


        public static DataTable SelectSvcDetail(DataRow dr)
        {
            sSql = "SELECT SVC_NM ";
            sSql += " FROM ITEM_DTL_ETC WHERE ITEM_CD = '" + dr["ITEM_CD"].ToString().Trim() + "' AND USE_YN = 'Y' ";

            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);
            return dt;
        }


        public static DataTable SelectItemInfo(DataRow dr)
        {
            sSql = " SELECT 'Q' AS INSFLAG , A.* FROM ITEM_MST A";
            sSql += " WHERE 1 = 1";
            if (dr["ITEM_NM"].ToString() != "")
            {
                sSql += " AND ITEM_NM LIKE '%" + dr["ITEM_NM"].ToString() + "%'";
            }
            if (dr["AREA"].ToString() != "")
            {
                sSql += " AND AREA = '" + dr["AREA"].ToString() + "'";
            }
            if (dr["TAG"].ToString() != "")
            {
                sSql += " AND TAG LIKE '%" + dr["TAG"].ToString() + "%'";
            }

            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);
            return dt;
        }


        public static DataTable SelectItemOneInfo(DataRow dr)
        {
            sSql = "";
            sSql += "SELECT IM.* ,  IDH.* ";
            sSql += " FROM ITEM_MST IM";
            sSql += " LEFT JOIN ITEM_DTL_HOTEL IDH ";
            sSql += " ON IM.ITEM_CD  = IDH.MNGT_NO ";
            sSql += " WHERE 1=1 ";
            sSql += " AND IM.ITEM_CD = '" + dr["ITEM_CD"].ToString()+"'";

            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);
            return dt;
        }

        public static DataTable SelectGrpInfo(DataRow dr)
        {
            sSql = " SELECT * FROM COMM_CODE WHERE GRP_CD = '" +dr["GRP_CD"].ToString() +"' AND USE_YN = 'Y' ORDER BY SEQ";

            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);
            dt.TableName = "GRP_INFO";
            return dt;
        }

        public static string isCheckID_Query(DataRow dr)
        {

            sSql = "";
            sSql += " SELECT EMAIL ";
            sSql += "        , APV_YN";
            sSql += " FROM CUST_INFO ";
            sSql += " WHERE 1=1 ";
            sSql += " AND UPPER(EMAIL) = UPPER('" + dr["EMAIL"] + "') ";

            return sSql;
        }
        
        public string InsertRegister_Query(DataRow dr)
        {
            sSql = "";
            sSql += " INSERT INTO CUST_INFO ";
            sSql += "      (MNGT_NO , EMAIL , PSWD , CUST_NAME , TELNO , COMPANY , DEPARTURE , USER_TYPE , APV_YN , INS_USR , INS_DT, UPD_USR, UPD_DT, ADMIN_YN )   ";
            sSql += "      VALUES (";
            sSql += "       '" + dr["MNGT_NO"] + "'";
            sSql += "      , '" + dr["EMAIL"] + "'";
            sSql += "      , '" + YJIT.Utils.StringUtils.Md5Hash((string)dr["PSWD"]) + "'";
            sSql += "      , '" + dr["CUST_NAME"] + "'";
            sSql += "      , '" + dr["TELNO"] + "'";
            sSql += "      , '" + dr["COMPANY"] + "'";
            sSql += "      , '" + dr["DEPARTURE"] + "'";
            sSql += "      , '" + dr["USER_TYPE"] + "'";
            sSql += "      , '" + dr["APV_YN"] + "'";
            sSql += "      , 'WEB'";
            sSql += "      , TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS')";
            sSql += "      , 'WEB'";
            sSql += "      , TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS')";
            sSql += "      , 'N'";
            sSql += "      )";

            return sSql;
        }

        public string GetRegister_Query(DataRow dr)
        {

            sSql = "";
            sSql += " SELECT ";
            sSql += " A.MNGT_NO , ";
            sSql += " A.EMAIL , ";
            sSql += " A.GRP_CD , ";
            sSql += " A.PSWD , ";
            sSql += " A.CUST_NAME , ";
            sSql += " A.TELNO , ";
            sSql += " A.COMPANY, ";
            sSql += " A.DEPARTURE, ";
            sSql += " A.USER_TYPE, ";
            sSql += " A.APV_YN, ";
            sSql += " A.INS_USR, ";
            sSql += " A.INSDATE, ";
            sSql += " A.UPD_USR, ";
            sSql += " A.UPDDATE ";
            sSql += " FROM CUST_INFO A ";
            sSql += " WHERE A.EMAIL = '" + dr["EMAIL"] + "' ";

            return sSql;
        }

        public string ModifyUser_Query(DataRow dr)
        {

            sSql = "";
            sSql += " UPDATE CUST_INFO SET ";
            if (dr["CHAR_PSWD"].ToString() != "")
            {
                sSql += " PSWD = '" + YJIT.Utils.StringUtils.Md5Hash((string)dr["CHAR_PSWD"]) + "' ,";
            }
            sSql += " CUST_NAME = '" + dr["CUST_NAME"] + "' , ";
            sSql += " TELNO = '" + dr["TELNO"] + "' ,";
            sSql += " COMPANY = '" + dr["COMPANY"] + "' ,";
            sSql += " DEPARTURE = '" + dr["DEPARTURE"] + "' ";
            sSql += " WHERE ";
            sSql += " EMAIL = '" + dr["EMAIL"] + "'  ";
            sSql += " AND PSWD = '" + YJIT.Utils.StringUtils.Md5Hash((string)dr["PSWD"]) + "' ";

            return sSql;
        }

        public static string GetMailLogin(string email , string pswd) {

            sSql = "";
            sSql += " SELECT * ";
            sSql += " FROM CUST_INFO ";
            sSql += " WHERE 1=1 ";
            sSql += " AND UPPER(EMAIL) = UPPER('" + email + "') ";
            sSql += " AND PSWD = '" + pswd + "' ";

            return sSql;
        }

        public static bool updateEmail(DataRow dr)
        {

            sSql = "";
            sSql += " UPDATE CUST_INFO SET ";
            sSql += " EMAIL_YN = 'Y' ";
            sSql += " WHERE ";
            sSql += " EMAIL = '" + dr["EMAIL"] + "'  ";

            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;

            return rtnBool;
        }

        public string ChkNowPSWD_Query(DataRow dr)
        {

            sSql = "";

            sSql += "  SELECT PSWD ";
            sSql += "    FROM CUST_INFO ";
            sSql += "    WHERE 1=1 ";
            sSql += "  	AND EMAIL = '" + dr["EMAIL"] + "' ";

            return sSql;
        }

        public string GetModifyInfo_Query(DataRow dr)
        {

            sSql = "";

            sSql += "  SELECT EMAIL, ";
            sSql += "         CUST_NAME, ";
            sSql += "         TELNO, ";
            sSql += "         COMPANY, ";
            sSql += "         DEPARTURE ";
            sSql += "    FROM CUST_INFO ";
            sSql += "    WHERE 1=1 ";
            sSql += "  	AND EMAIL = '" + dr["EMAIL"] + "' ";

            return sSql;
        }

        public static bool insertCustomerInfo(DataRow dr)
        {
            sSql = "";
            sSql += " INSERT INTO CUST_INFO ";
            sSql += "      (MNGT_NO , EMAIL , PSWD , CUST_NAME , TELNO ,GRP_CD , COMPANY , DEPARTURE  ,USER_TYPE ,  APV_YN , INS_USR , INS_DT, UPD_USR, UPD_DT , ADMIN_YN)   ";
            sSql += "      VALUES (";
            sSql += "        TO_CHAR(SYSDATE, 'YYYYMMDDHH24MISS') ";
            //sSql += "        '" + dr["MNGT_NO"] + "'";
            sSql += "      , '" + dr["EMAIL"] + "'";
            sSql += "      , '" + YJIT.Utils.StringUtils.Md5Hash((string)dr["PSWD"]) + "'";
            sSql += "      , '" + dr["CUST_NAME"] + "'";
            sSql += "      , '" + dr["TELNO"] + "'";
            sSql += "      , '" + dr["GRP_CD"] + "'";
            sSql += "      , '" + dr["COMPANY"] + "'";
            sSql += "      , '" + dr["DEPARTURE"] + "'";
            if (dr["ADMIN_YN"].ToString() == "Y")
            {
                sSql += "      , 'M'";
            }
            else
            {
                sSql += "      , '" + dr["USER_TYPE"] + "'";
            }
            sSql += "      , '" + dr["APV_YN"] + "'";
            sSql += "      , 'WEB'";
            sSql += "      , TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS')";
            sSql += "      , 'WEB'";
            sSql += "      , TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS')";
            sSql += "      , '" + dr["ADMIN_YN"] + "'";
            sSql += "      )";

            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }

        public static bool insertCustomerExcel(DataRow dr)
        {
            sSql = "";
            sSql += " INSERT INTO CUST_INFO ";
            sSql += "      (MNGT_NO , EMAIL , PSWD , CUST_NAME , TELNO , COMPANY , DEPARTURE , USER_TYPE , INS_USR , INS_DT, UPD_USR, UPD_DT)   ";
            sSql += "      VALUES (";
            sSql += "        TO_CHAR(SYSDATE, 'YYYYMMDDHH24MISS') ";
            //sSql += "        '" + dr["MNGT_NO"] + "'";
            sSql += "      , '" + dr["EMAIL"] + "'";
            sSql += "      , '" + YJIT.Utils.StringUtils.Md5Hash((string)dr["PSWD"]) + "'";
            sSql += "      , '" + dr["CUST_NAME"] + "'";
            sSql += "      , '" + dr["TELNO"] + "'";
            sSql += "      , '" + dr["COMPANY"] + "'";
            sSql += "      , '" + dr["DEPARTURE"] + "'";
            sSql += "      , 'A'";
            sSql += "      , 'WEB'";
            sSql += "      , TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS')";
            sSql += "      , 'WEB'";
            sSql += "      , TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS')";
            sSql += "      )";

            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }
        public static bool UpdateCustomerInfo(DataRow dr)
        {
            sSql = "";
            sSql += " UPDATE CUST_INFO ";
            sSql += "      SET GRP_CD  = '" + dr["GRP_CD"].ToString().Trim() + "'";
            sSql += "        , CUST_NAME  = '" + dr["CUST_NAME"].ToString().Trim() + "'";
            sSql += "        , TELNO  = '" + dr["TELNO"].ToString().Trim() + "'";
            sSql += "        , COMPANY  = '" + dr["COMPANY"].ToString().Trim() + "'";
            sSql += "        , DEPARTURE  = '" + dr["DEPARTURE"].ToString().Trim() + "'";
            if (dr["ADMIN_YN"].ToString() == "Y")
            {
                sSql += "        , USER_TYPE  = 'M'";
            }
            else
            {
                sSql += "        , USER_TYPE  = '" + dr["USER_TYPE"].ToString().Trim() + "'";
            }
            sSql += "        , APV_YN  = '" + dr["APV_YN"].ToString().Trim() + "'";
            sSql += "        , ADMIN_YN  = '" + dr["ADMIN_YN"].ToString().Trim() + "'";
            sSql += "        , UPD_USR  = 'WEB'";
            sSql += "        , UPD_DT  = TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS')";
            sSql += "   WHERE MNGT_NO = '" + dr["MNGT_NO"].ToString().Trim() + "'";
            sSql += "   AND EMAIL  = '" + dr["EMAIL"] + "'";

            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }

        public static bool DeleteCustomerInfo(DataRow dr)
        {
            sSql = "";
            sSql += " DELETE CUST_INFO ";
            sSql += "   WHERE MNGT_NO = '" + dr["MNGT_NO"].ToString().Trim() + "'";
            sSql += "   AND EMAIL  = '" + dr["EMAIL"] + "'";


            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }

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
        public string FindID_Query(DataRow dr)
        {
            sSql = "";
            sSql += " SELECT EMAIL ";
            sSql += " FROM CUST_INFO ";
            sSql += " WHERE 1=1 ";
            sSql += " AND TRIM(CUST_NAME) = '" + dr["CUST_NAME"] + "'";
            sSql += " AND TRIM(TELNO) = '" + dr["TELNO"] + "'";

            return sSql;
        }

        public string FindPW_Query(DataRow dr)
        {
            sSql = "";
            sSql += " SELECT ";
            sSql += " EMAIL ";
            sSql += " ,CUST_NAME ";
            sSql += " ,(SELECT EMAIL FROM CUST_INFO WHERE EMAIL = '" + dr["EMAIL"] + "') AS SEND_EMAIL ";  //이름바꿔야함******************************
            sSql += " FROM CUST_INFO ";
            sSql += " WHERE 1=1  ";
            sSql += " AND EMAIL = '" + dr["EMAIL"] + "' ";
            //sSql += " AND CUST_NAME = '" + dr["CUST_NAME"] + "' ";

            return sSql;
        }

        public string SetNewPW_Query(DataRow dr, string strPSWD, string hiddenPSWD)
        {

            sSql = "";
            sSql += " UPDATE ";
            sSql += " CUST_INFO ";
            sSql += " SET ";
            sSql += " PSWD = '" + YJIT.Utils.StringUtils.Md5Hash(strPSWD) + "' ,";
            sSql += " CHAR_PSWD = '" + hiddenPSWD + "' ,";
            sSql += " UPD_USR = '" + dr["EMAIL"] + "' ,";
            sSql += " UPD_DT = TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS')";
            sSql += " WHERE 1=1 AND ";
            sSql += " EMAIL = '" + dr["EMAIL"] + "'";

            return sSql;
        }

        public string fnInsertcomment_Query(DataRow dr)
        {
            sSql = "";
            sSql += " INSERT INTO CUST_COMT ";
            sSql += " (MNGT_NO, EMAIL, MNGT_SEQ, CNT, BKG_NO, ITEM_NO, CMT_SUBJECT, CMT_SCORE, CMT_CONTENTS, CMT_IMG1_PATH, CMT_IMG2_PATH, CMT_IMG3_PATH, CMT_IMG4_PATH, INS_USR, INS_DT) ";
            sSql += " VALUES ( "; // QUOT_NO빠져있음 bkg_mst테이블에이씀
            sSql += " '" + dr["MNGT_NO"] + "'";
            sSql += " , '" + dr["EMAIL"] + "'";
            sSql += " , (SELECT  NVL(MAX(MNGT_SEQ),0) + 1 FROM CUST_COMT WHERE MNGT_NO = '" + dr["MNGT_NO"] + "')";
            sSql += " ,  0 ";
            sSql += " , '" + dr["BKG_NO"] + "'";
            sSql += " , '" + dr["ITEM_NO"] + "'";
            sSql += " , '" + dr["CMT_SUBJECT"] + "'";
            sSql += " , '" + dr["CMT_SCORE"] + "'";
            sSql += " , '" + dr["CMT_CONTENTS"] + "'";
            sSql += " , '" + dr["CMT_IMG1_PATH"] + "'";
            sSql += " , '" + dr["CMT_IMG2_PATH"] + "'";
            sSql += " , '" + dr["CMT_IMG3_PATH"] + "'";
            sSql += " , '" + dr["CMT_IMG4_PATH"] + "'";
            sSql += " , '" + dr["CUST_NAME"] + "'";
            sSql += " , TO_CHAR(SYSDATE, 'YYYYMMDDHH24MISS') ";
            sSql += "   )";

            return sSql;
        }

        public string fnInsertmilage_Query(DataRow dr)
        {
            sSql = "";
            sSql += " INSERT INTO CUST_MILEAGE ";
            sSql += " (MNGT_NO, MNGT_SEQ, EMAIL, BKG_NO, GRP_CD, MILEAGE,  USED_DATE, USED_MILEAGE, INS_USR, INS_DT) ";
            sSql += " VALUES ( ";
            sSql += " '" + dr["MNGT_NO"] + "'";
            sSql += " , (SELECT NVL(MAX(MNGT_SEQ),0) + 1 FROM CUST_MILEAGE WHERE MNGT_NO = '" + dr["MNGT_NO"] + "')";
            sSql += " , '" + dr["EMAIL"] + "'";
            sSql += " , '" + dr["BKG_NO"] + "'";
            sSql += " , '" + dr["GRP_CD"] + "'";
            sSql += " , (SELECT NVL(MAX(MILEAGE), 0)  + " + dr["TOT_AMT"] + " FROM CUST_MILEAGE WHERE MNGT_NO = '" + dr["MNGT_NO"] + "'"; //MAX값의 현재마일리지
            sSql += "    AND MNGT_SEQ = (SELECT MAX(MNGT_SEQ) FROM CUST_MILEAGE WHERE MNGT_NO = '" + dr["MNGT_NO"] + "'))"; //MAX값의 현재마일리지
            //sSql += " , TO_CHAR(ADD_MONTHS(USED_DATE, 1), 'YYYYMMDD') AS EXPIRED_DATE "; //유효날짜
            sSql += " , TO_CHAR(SYSDATE, 'YYYYMMDD') "; //사용날짜
            sSql += " , '" + dr["TOT_AMT"] + "'"; //사용마일리지(적립마일리지)
            sSql += " , '" + dr["CUST_NAME"] + "'"; 
            sSql += " , TO_CHAR(SYSDATE, 'YYYYMMDDHH24MISS') ";
            sSql += "   )";

            return sSql;
        }
        public string GetCommentInfo_Query(DataRow dr)
        {
            sSql = "";
            sSql += " SELECT * ";
            sSql += "   FROM( ";
            sSql += "   SELECT BKG.BKG_NO ";
            sSql += "        , BKG.BKG_STATUS ";
            sSql += "        , BKG.ITEM_CD ";
            sSql += "        , NVL(CM.CNT, 0) CNT ";
            sSql += "        , IM.ITEM_NM ";
            sSql += "        , BKG.INS_DT ";
            sSql += "        , IM.TAG ";
            sSql += "        , BKG.TOT_AMT ";
            sSql += "     FROM BKG_MST BKG ";
            sSql += "     LEFT JOIN (SELECT COUNT(*) AS CNT, ITEM_NO, BKG_NO ";
            sSql += "                  FROM CUST_COMT WHERE EMAIL = '" + dr["EMAIL"] + "'";
            sSql += "                  GROUP BY ITEM_NO, BKG_NO) CM ";
            sSql += "            ON BKG.BKG_NO = CM.BKG_NO ";
            sSql += "     LEFT JOIN ITEM_MST IM ";
            sSql += "            ON BKG.ITEM_CD = IM.ITEM_CD ";
            sSql += "           AND IM.USE_YN = 'Y' ";
            sSql += "         WHERE 1=1 ";
            sSql += "           AND BKG_STATUS = 'F' ";
            sSql += "           AND BKG.CUST_EMAIL = (SELECT EMAIL FROM CUST_INFO WHERE EMAIL = '" + dr["EMAIL"] + "') "; //세션의 메일값으로 변경
            sSql += "         ORDER BY NVL(BKG.UPD_DT, BKG.INS_DT)DESC ";
            sSql += "      ) ";
            sSql += "   WHERE CNT = '0' ";
            sSql += "     AND ROWNUM = 1 ";

            return sSql;
        }
        public string GetCommenttopList_Query(DataRow dr)
        {
            sSql = "";
            sSql += " SELECT * ";
            sSql += "   FROM( ";
            sSql += "   SELECT BKG.BKG_NO ";
            sSql += "        , BKG.BKG_STATUS ";
            sSql += "        , BKG.ITEM_CD ";
            sSql += "        , NVL(CM.CNT, 0) CNT ";
            sSql += "        , BKG.CONFIRM_DATE ";
            sSql += "        , (SELECT ITEM_NM FROM ITEM_MST IM WHERE BKG.ITEM_CD = IM.ITEM_CD) AS ITEM_NM";
            sSql += "     FROM BKG_MST BKG ";
            sSql += "     LEFT JOIN (SELECT COUNT(*) AS CNT, ITEM_NO, BKG_NO ";
            sSql += "                  FROM CUST_COMT WHERE EMAIL ='" + dr["EMAIL"] + "'"; ;
            sSql += "                  GROUP BY ITEM_NO, BKG_NO) CM ";
            sSql += "            ON BKG.BKG_NO = CM.BKG_NO ";
            sSql += "         WHERE 1=1 ";
            sSql += "           AND BKG_STATUS = 'F' ";
            sSql += "           AND BKG.CUST_EMAIL = '" + dr["EMAIL"] + "'"; //세션의 메일값으로 변경
            sSql += "         ORDER BY NVL(BKG.UPD_DT, BKG.INS_DT) DESC ";
            sSql += "      ) ";
            sSql += "   WHERE CNT = '0' ";
            sSql += "     AND ROWNUM = 1 ";

            return sSql;
        }

        public string GetCommentList_Query(DataRow dr)
        {
            sSql = "";
            sSql += " SELECT CC.CMT_SCORE, ";
            sSql += "       CC.INS_DT, ";
            sSql += "       (SELECT ITEM_NM FROM ITEM_MST IM WHERE BKG.ITEM_CD = IM.ITEM_CD) AS ITEM_NM ";
            sSql += "     FROM CUST_COMT CC ";
            sSql += "     LEFT JOIN BKG_MST BKG ";
            sSql += "            ON CC.BKG_NO = BKG.BKG_NO ";
            sSql += "         WHERE CC.EMAIL = '" + dr["EMAIL"] + "' ";
            sSql += "         ORDER BY INS_DT DESC";

            return sSql;
        }

        public string GetQuoation_Query(DataRow dr)
        {
            sSql = "";

            sSql += "	SELECT  ";
            sSql += "        'Q' AS TYPE, ";
            sSql += "        COUNT (*) OVER () AS TOTCNT, ";
            sSql += "        INS_DT,  ";
            sSql += "        ITEM_NM, ";
            sSql += "       CASE WHEN  (SELECT REQ_MNGT_NO FROM QUOT_MNG_MST WHERE REQ_MNGT_NO = A.REQ_NO AND ROWNUM = 1) IS NULL THEN 'N' ELSE 'Y' END AS STATUS ";
            sSql += "   FROM  QUOT_REQ_MST  A ";
            sSql += "         WHERE REQ_EMAIL = '" + dr["EMAIL"] + "' ";
            sSql += "         AND QUOT_TYPE = 'B' ";
            sSql += "   UNION ";
            sSql += "   SELECT  ";
            sSql += "       'B' AS TYPE, ";
            sSql += "        COUNT (*) OVER () AS TOTCNT, ";
            sSql += "        INS_DT, ";
            sSql += "        (SELECT ITEM_NM FROM ITEM_MST WHERE ITEM_CD = A.ITEM_CD) AS ITEM_NM, ";
            sSql += "        BKG_STATUS ";
            sSql += "   FROM  BKG_MST  A";
            sSql += "         WHERE CUST_EMAIL = '" + dr["EMAIL"] + "' ";
            sSql += "          ORDER BY INS_DT DESC";

            return sSql;
        }

        public string GetUserMileage_Query(DataRow dr)
        {
            sSql = "";
            sSql += " SELECT MNGT_NO, ";
            sSql += "       MNGT_SEQ, ";
            sSql += "          EMAIL, ";
            sSql += "         GRP_CD, ";
            sSql += "        MILEAGE, ";
            sSql += "   EXPIRED_DATE, ";
            sSql += "      USED_DATE, ";
            sSql += "   USED_MILEAGE, ";
            sSql += "        INS_USR, ";
            sSql += "         INS_DT, ";
            sSql += "         USE_YN ";
            sSql += "     FROM CUST_MILEAGE ";
            sSql += "         WHERE 1 = 1 ";
            if (dr["GRP_CD"].ToString() == "")
            {
                sSql += "           AND EMAIL = '" + dr["EMAIL"] + "' ";
            }
            if (dr["GRP_CD"].ToString() != "")
            {
                sSql += "           AND GRP_CD = '" + dr["GRP_CD"] + "' ";
            }
            sSql += "         ORDER BY USED_DATE DESC";
            return sSql;
        }

        //public string GetUserMileagePopup_Query(DataRow dr)
        //{
        //    sSql = "";
        //    sSql += " SELECT CM.USED_DATE, ";
        //    sSql += "      CC.CMT_SUBJECT, ";
        //    sSql += "          CC.INS_USR, ";
        //    sSql += "     CM.USED_MILEAGE, ";
        //    sSql += "           CM.USE_YN ";
        //    sSql += "     FROM CUST_MILEAGE CM ";
        //    sSql += "    INNER JOIN CUST_COMT CC ";
        //    sSql += "            ON CM.MNGT_NO = CC.MNGT_NO";
        //    sSql += "         WHERE 1 = 1 ";
        //    sSql += "           AND CM.EMAIL = '" + dr["EMAIL"] + "' ";
        //    sSql += "         ORDER BY USED_DATE DESC";
        //    return sSql;
        //}

        //public string SearchMileage_Query(DataRow dr)
        //{
        //    sSql = "";
        //    sSql += " SELECT CM.USED_DATE, ";
        //    sSql += "      CC.CMT_SUBJECT, ";
        //    sSql += "          CC.INS_USR, ";
        //    sSql += "     CM.USED_MILEAGE, ";
        //    sSql += "           CM.USE_YN ";
        //    sSql += "     FROM CUST_MILEAGE CM ";
        //    sSql += "    INNER JOIN CUST_COMT CC ";
        //    sSql += "            ON CM.MNGT_NO = CC.MNGT_NO";
        //    sSql += "         WHERE 1 = 1 ";
        //    sSql += "           AND CM.EMAIL = '" + dr["EMAIL"] + "' ";
        //    if (dr["USED_DATE"].ToString() != "")
        //    {
        //        sSql += "   AND TO_NUMBER(USED_DATE) >= " + "TO_NUMBER" + "('" + (dr["USED_DATE"].ToString()) + "')";
        //    }
        //    if (dr["USED_DATE1"].ToString() != "")
        //    {
        //        sSql += "   AND TO_NUMBER(USED_DATE) <= " + "TO_NUMBER" + "('" + (dr["USED_DATE1"].ToString()) + "')";
        //    }
        //    sSql += "         ORDER BY USED_DATE DESC";

        //    return sSql;
        //}
        public string fnSearchMg(DataRow dr)
        {


            sSql = "";
            sSql = " SELECT * ";
            sSql += "   FROM (SELECT ROWNUM AS RNUM,";
            sSql += "                FLOOR ( (ROWNUM - 1) / 10 + 1) AS PAGE,";
            sSql += "                COUNT (*) OVER () AS TOTCNT,";
            sSql += "           A.*";
            sSql += "           FROM ( SELECT CM.*, (SELECT ITEM_NM FROM ITEM_MST WHERE ITEM_CD = B.ITEM_CD) ITEM_NM";
            sSql += "            FROM CUST_MILEAGE CM";
            sSql += "            LEFT JOIN BKG_MST B";
            sSql += "                   ON CM.BKG_NO = B.BKG_NO";
            sSql += "           WHERE 1 = 1 ";
            if (dr["GRP_CD"].ToString() == "")
            {
                sSql += "             AND EMAIL = '" + dr["EMAIL"] + "' ";
            } else
            {
                sSql += "             AND CM.GRP_CD = '" + dr["GRP_CD"] + "' ";
            }
            if (dr["USED_DATE"].ToString() != "")
            {
                sSql += "   AND TO_NUMBER(USED_DATE) >= " + "TO_NUMBER" + "('" + (dr["USED_DATE"].ToString()) + "')";
            }
            if (dr["USED_DATE1"].ToString() != "")
            {
                sSql += "   AND TO_NUMBER(USED_DATE) <= " + "TO_NUMBER" + "('" + (dr["USED_DATE1"].ToString()) + "')";
            }
            sSql += "           ORDER BY CM.INS_DT DESC";
            sSql += " ) A";
            sSql += ")WHERE PAGE = " + dr["PAGE"].ToString();

            return sSql;

        }
    }
}