using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;

namespace WORKSHOP.Models.Query
{
    public class Sql_FAQ
    {
        private static string sSql = "";
        private static bool rtnBool = false;
        private static DataTable dt = new DataTable();


        public static DataTable SelectFAQList(DataRow dr)
        {
            sSql = "	SELECT MNGT_NO ";
            sSql += "     , REQ_NO ";
            sSql += "     , MNGT_SEQ ";
            sSql += "     , INQ_YMD ";
            sSql += "     , INQ_TYPE ";
            sSql += "     , AREA ";
            sSql += "     , STRT_YMD ";
            sSql += "     , END_YMD ";
            sSql += "     , MIN_PRC ";
            sSql += "     , MAX_PRC ";
            sSql += "     , HEAD_CNT  ";
            sSql += "     , ITEM_CD  ";
            sSql += "     , ITEM_NM  ";
            sSql += "     , SVC_NM ";
            sSql += "     , RMK ";
            sSql += "     , INQ_USR ";
            sSql += "     , STATUS ";
            sSql += "     ,COUNT (*) OVER () AS TOTCNT";
            sSql += "    FROM ( ";
            sSql += " SELECT A.MNGT_NO ";
            sSql += "          ,  C.REQ_NO ";
            sSql += "          ,  A.MNGT_SEQ ";
            sSql += "          ,   A.INQ_YMD ";
            sSql += "          ,  A.INQ_TYPE ";
            sSql += "          ,  C.AREA ";
            sSql += "          ,  C.STRT_YMD ";
            sSql += "          ,  C.END_YMD ";
            sSql += "          ,  C.MIN_PRC ";
            sSql += "          ,  C.MAX_PRC ";
            sSql += "          ,  C.HEAD_CNT ";
            sSql += "          ,  B.ITEM_CD ";
            sSql += "          , (SELECT ITEM_NM FROM ITEM_MST WHERE ITEM_CD = B.ITEM_CD) AS ITEM_NM";
            sSql += "          ,  (SELECT WM_CONCAT(SVC_NM) FROM QUOT_REQ_SVC WHERE REQ_NO = C.REQ_NO) AS SVC_NM ";
            sSql += "          , C.RMK ";
            sSql += "          , A.INQ_USR ";
            sSql += "          , A.STATUS ";
            sSql += "          , COUNT (*) OVER () AS TOTCNT ";
            sSql += "  FROM INQUIRY_MST A ";
            sSql += "  LEFT OUTER JOIN BKG_MST B ON A.MNGT_NO = B.BKG_NO ";
            sSql += "  INNER JOIN QUOT_REQ_MST C ON B.REQ_NO = C.REQ_NO  ";
            sSql += " WHERE 1 = 1";
            sSql += " AND A.MNGT_SEQ = (SELECT MAX(B.MNGT_SEQ) FROM INQUIRY_MST B WHERE B.MNGT_NO = A.MNGT_NO)";
            if (dr.Table.Columns.Contains("STRT_YMD"))
            {
                if (dr["STRT_YMD"].ToString() != "")
                {
                    sSql += " AND A.INQ_YMD >= '" + dr["STRT_YMD"] + "'";
                }
            }
            if (dr.Table.Columns.Contains("END_YMD"))
            {
                if (dr["END_YMD"].ToString() != "")
                {
                    sSql += " AND A.INQ_YMD <= '" + dr["END_YMD"] + "'";
                }
            }
            if (dr["STATUS"].ToString() == "A")
            {
                sSql += " AND A.STATUS = 'N' ";
            }
            else
            {
                sSql += " AND A.STATUS = 'Y' ";
            }
            sSql += " UNION ";
            sSql += " SELECT A.MNGT_NO ";
            sSql += "          ,  C.REQ_NO ";
            sSql += "          ,  A.MNGT_SEQ ";
            sSql += "          ,   A.INQ_YMD ";
            sSql += "          ,  A.INQ_TYPE ";
            sSql += "          ,  C.AREA ";
            sSql += "          ,  C.STRT_YMD ";
            sSql += "          ,  C.END_YMD ";
            sSql += "          ,  C.MIN_PRC ";
            sSql += "          ,  C.MAX_PRC ";
            sSql += "          ,  C.HEAD_CNT ";
            sSql += "          ,  B.ITEM_CD ";
            sSql += "          , (SELECT ITEM_NM FROM ITEM_MST WHERE ITEM_CD = B.ITEM_CD) AS ITEM_NM";
            sSql += "          ,  (SELECT WM_CONCAT(SVC_NM) FROM QUOT_REQ_SVC WHERE REQ_NO = C.REQ_NO) AS SVC_NM ";
            sSql += "          , C.RMK ";
            sSql += "          , A.INQ_USR ";
            sSql += "          , A.STATUS ";
            sSql += "          , COUNT (*) OVER () AS TOTCNT ";
            sSql += "  FROM INQUIRY_MST A ";
            sSql += "  LEFT OUTER JOIN QUOT_MNG_MST B ON A.MNGT_NO = B.QUOT_NO ";
            sSql += "  INNER JOIN QUOT_REQ_MST C ON B.REQ_MNGT_NO = C.REQ_NO  ";
            sSql += " WHERE 1 = 1";
            sSql += " AND A.MNGT_SEQ = (SELECT MAX(B.MNGT_SEQ) FROM INQUIRY_MST B WHERE B.MNGT_NO = A.MNGT_NO)";
            if (dr.Table.Columns.Contains("STRT_YMD")) { 
                if (dr["STRT_YMD"].ToString() != "")
                {
                    sSql += " AND A.INQ_YMD >= '" + dr["STRT_YMD"] + "'";
                }
            }
            if (dr.Table.Columns.Contains("END_YMD"))
            {
                if (dr["END_YMD"].ToString() != "")
                {
                    sSql += " AND A.INQ_YMD <= '" + dr["END_YMD"] + "'";
                }
            }
            if (dr["STATUS"].ToString() != "A")
            {
                sSql += " AND A.STATUS = '"+dr["STATUS"].ToString()+"' ";
            }
            //else
            //{
            //    sSql += " AND A.STATUS = 'Y' ";
            //}
            sSql += " ORDER BY  INQ_YMD DESC, MNGT_SEQ DESC ";
            sSql += " ) ";
            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);
            return dt;
        }

        public static DataTable SelectFAQDetail(DataRow dr)
        {
            sSql = " SELECT MNGT_NO ";
            sSql += "          ,  MNGT_SEQ ";
            sSql += "          ,  INQ_CONTENT ";
            sSql += "          ,  ANSWER ";
            sSql += "  FROM INQUIRY_MST A ";
            sSql += " WHERE 1 = 1";
            sSql += " AND MNGT_NO = '" + dr["MNGT_NO"].ToString() + "'";
            sSql += " AND MNGT_SEQ = " + dr["MNGT_SEQ"].ToString();
            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);
            return dt;
        }

        public static bool UpdateFAQ(DataRow dr)
        {
         
            sSql = " UPDATE INQUIRY_MST ";
            sSql += " SET ANSWER = '" + dr["ANSWER"].ToString() + "'";
            sSql += " , ANS_USR = '" + dr["INS_USR"].ToString() + "'";
            sSql += " , ANS_YMD = TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS')";
            sSql += " , STATUS = 'Y'";
            sSql += " WHERE MNGT_NO = '" + dr["MNGT_NO"].ToString() + "'";
            sSql += " AND MNGT_SEQ = " + dr["MNGT_SEQ"].ToString();

            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }

        public static bool UpdateAnswer(DataRow dr)
        {
            
            sSql = "";
            sSql += " INSERT INTO INQUIRY_MST ";
            sSql += "      (MNGT_NO , MNGT_SEQ, INQ_TYPE, INQ_CONTENT,  INQ_USR, INQ_YMD, USER_TYPE )";
            sSql += "      VALUES (";
            sSql += "        '" + dr["MNGT_NO"].ToString() + "'";
            sSql += " ,(SELECT  NVL(MAX(MNGT_SEQ),0) + 1 FROM INQUIRY_MST WHERE MNGT_NO = '" + dr["MNGT_NO"].ToString() + "')";
            sSql += "      , (SELECT MAX(INQ_TYPE) FROM INQUIRY_MST WHERE MNGT_NO = '"+dr["MNGT_NO"].ToString()+"')";
            sSql += "      , '" + dr["ANSWER"].ToString() + "'"; ;
            sSql += "      , '" + dr["INS_USR"].ToString() + "'";
            sSql += "      , TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS')";
            sSql += "      , '"+dr["USER_TYPE"].ToString()+"' ";
            sSql += "      )";
            

            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }

        public static DataTable SearchFAQDtl_Query(DataRow dr)
        {
            sSql = "";
            sSql += "SELECT INQ_TYPE, INQ_CONTENT, INQ_CNT, INQ_YMD, ANSWER, ANS_YMD,USER_TYPE";
            sSql += " FROM INQUIRY_MST ";
            sSql += " WHERE 1=1 ";
            sSql += " AND MNGT_NO = '"+dr["MNGT_NO"].ToString()+"' ";
            //sSql += " AND MNGT_SEQ <= '" + dr["MNGT_SEQ"].ToString() +"' ";
            sSql += " ORDER BY MNGT_SEQ ";

            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);
            return dt;
        }

        public static DataTable SearchDtlData_Query(DataRow dr)
        {

            sSql = "";
            sSql += "SELECT QUOT_NO AS MNGT_NO , 'CONF' AS ITEM_TYPE , QUOT_SEQ AS MNGT_SEQ, CONF_TYPE AS ITEM_NM  , 0 AS ITEM_CNT, PRC   ";
            sSql += "FROM QUOT_MNG_CONF                                                                                                   ";
            sSql += "WHERE QUOT_NO = '" + dr["MNGT_NO"].ToString() + "'                                                                              ";
            sSql += "UNION                                                                                                                ";
            sSql += "SELECT QUOT_NO AS MNGT_NO, 'ROOM' AS ITEM_TYPE , QUOT_SEQ AS MNGT_SEQ, ROOM_NM AS ITEM_NM, ROOM_CNT AS ITEM_CNT, PRC ";
            sSql += "FROM QUOT_MNG_ROOM                                                                                                   ";
            sSql += "WHERE QUOT_NO = '" + dr["MNGT_NO"].ToString() + "'                                                                              ";
            sSql += "UNION                                                                                                                ";
            sSql += "SELECT QUOT_NO AS MNGT_NO, 'MEAL' AS ITEM_TYPE , QUOT_SEQ AS MNGT_SEQ, MEAL_NM AS ITEM_NM , 0 AS ITEM_CNT , PRC      ";
            sSql += "FROM QUOT_MNG_MEAL                                                                                                   ";
            sSql += "WHERE QUOT_NO = '" + dr["MNGT_NO"].ToString() + "'                                                                              ";
            sSql += "UNION                                                                                                                ";
            sSql += "SELECT QUOT_NO AS MNGT_NO, 'SVC' AS ITEM_TYPE ,QUOT_SEQ AS MNGT_SEQ, SVC_NM AS ITEM_NM , 0 AS ITEM_CNT , PRC         ";
            sSql += "FROM QUOT_MNG_SVC                                                                                                    ";
            sSql += "WHERE QUOT_NO = '" + dr["MNGT_NO"].ToString() + "'                                                                              ";
            sSql += "UNION                                                                                                                ";
            sSql += "SELECT BKG_NO AS MNGT_NO, 'CONF' AS ITEM_TYPE ,BKG_SEQ AS MNGT_SEQ, CONF_TYPE AS ITEM_NM ,0 AS ITEM_CNT , PRC        ";
            sSql += "FROM BKG_CONF                                                                                                        ";
            sSql += "WHERE BKG_NO = '" + dr["MNGT_NO"].ToString() + "'                                                                                ";
            sSql += "UNION                                                                                                                ";
            sSql += "SELECT BKG_NO AS MNGT_NO, 'ROOM' AS ITEM_TYPE , BKG_SEQ AS MNGT_SEQ, ROOM_NM AS ITEM_NM , ROOM_CNT AS ITEM_CNT , PRC ";
            sSql += "FROM BKG_ROOM                                                                                                        ";
            sSql += "WHERE BKG_NO = '" + dr["MNGT_NO"].ToString() + "'                                                                                ";
            sSql += "UNION                                                                                                                ";
            sSql += "SELECT BKG_NO AS MNGT_NO, 'MEAL' AS ITEM_TYPE , BKG_SEQ AS MNGT_SEQ, MEAL_NM AS ITEM_NM , 0 AS ITEM_CNT , PRC        ";
            sSql += "FROM BKG_MEAL                                                                                                        ";
            sSql += "WHERE BKG_NO = '" + dr["MNGT_NO"].ToString() + "'                                                                                ";
            sSql += "UNION                                                                                                                ";
            sSql += "SELECT BKG_NO AS MNGT_NO, 'SVC' AS ITEM_TYPE , BKG_SEQ  AS MNGT_SEQ, SVC_NM AS ITEM_NM , 0 AS ITEM_CNT , PRC         ";
            sSql += "FROM BKG_SVC                                                                                                         ";
            sSql += "WHERE BKG_NO = '" + dr["MNGT_NO"].ToString() + "'             ";

            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);
            return dt;
        }

    }
}