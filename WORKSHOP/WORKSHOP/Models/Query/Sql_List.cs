using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;

namespace WORKSHOP.Models.Query
{
    public class Sql_List
    {
        private static string sSql = "";
        private static bool rtnBool = false;
        private static DataTable dt = new DataTable();

        public string fnGetList_Query(DataRow dr)
        {
            sSql = "";

            sSql += " SELECT * FROM ( ";
            sSql += " SELECT  ROWNUM   AS RNUM,";
            sSql += "                 FLOOR ( (ROWNUM - 1) / 10 + 1) AS PAGE,";
            sSql += "                 COUNT (*) OVER () AS TOTCNT,";
            sSql += "                 A.*";
            sSql += "  FROM (  ";
            sSql += "  SELECT ";
            sSql += "       MNGT_NO, ";
            sSql += "       ITEM_CD, ";
            sSql += "       AREA, ";
            sSql += "       ITEM_TYPE, ";
            sSql += "       ITEM_NM, ";
            sSql += "       ITEM_GRD, ";
            sSql += "       ADDR1, ";
            sSql += "       ADDR2, ";
            if (dr["TYPE"].ToString() == "ROAD")
            {
                sSql += "       (SELECT LISTAGG(THIS_PATH,'|') WITHIN GROUP (ORDER BY MNGT_NO,IMG_TYPE) AS FULL_IMG FROM(SELECT MNGT_NO, ITEM_SEQ, ITEM_CD, IMG_TYPE, (IMG_PATH || '/' || IMG_NM) AS THIS_PATH FROM ITEM_DTL_IMG) ";
                sSql += "       WHERE 1=1 AND ITEM_CD = MST.ITEM_CD GROUP BY MNGT_NO, ITEM_CD) AS IMG_PATH, ";
            }
            else if (dr["TYPE"].ToString() == "SEARCH")
            {
                sSql += "       (SELECT LISTAGG(THIS_PATH,'|') WITHIN GROUP (ORDER BY MNGT_NO,IMG_TYPE) AS FULL_IMG FROM(SELECT MNGT_NO, ITEM_SEQ, ITEM_CD, IMG_TYPE, (IMG_PATH || '/' || IMG_NM) AS THIS_PATH FROM ITEM_DTL_IMG) ";
                sSql += "       WHERE 1=1 AND ITEM_CD = MST.ITEM_CD GROUP BY MNGT_NO, ITEM_CD) AS IMG_PATH, ";
            }
            sSql += "       ZIPCODE, ";
            sSql += "       HOME_URL, ";
            sSql += "       RMK, ";
            sSql += "       TAG, ";
            sSql += "       USE_YN, ";
            sSql += "       MIN_TO, ";
            sSql += "       MAX_TO, ";
            sSql += "       REC_YN, "; //'Y'일때만 연수다추천
            sSql += "       MAP_X, ";
            sSql += "       MAP_Y ";
            sSql += "  FROM ITEM_MST MST";
            sSql += "   WHERE 1=1 ";
            //sSql += "   AND ROWNUM <= 3 ";
            if (dr["TYPE"].ToString() == "ROAD")
            {
                if (dr["AREA"].ToString() != "")
                {
                    if (dr["AREA"].ToString() != "ALL")
                    {
                        sSql += "   AND AREA = '" + dr["AREA"].ToString() + "'";
                    }
                }
                //sSql += "       AND REC_YN = 'Y' ";
                sSql += "   AND USE_CNT IS NOT NULL";
                sSql += "       AND USE_YN = 'Y' ";
                sSql += "ORDER BY (SELECT SEQ FROM COMM_CODE A WHERE A.COMM_NM = MST.AREA)) A";
            }
            else
            {
                if (dr["AREA"].ToString() != "")
                {
                    if (dr["AREA"].ToString() != "ALL")
                    {
                        sSql += "   AND AREA = '" + dr["AREA"].ToString() + "'";
                    }
                }
                if (dr["ITEM_TYPE"].ToString() != "ALL")
                {
                    sSql += "   AND ITEM_TYPE = '" + dr["ITEM_TYPE"].ToString() + "'";
                }
                if (dr["MAX_TO"].ToString() != "")
                {
                    sSql += "   AND TO_NUMBER(MAX_TO) <= " + "TO_NUMBER" + "('" + (dr["MAX_TO"].ToString()) + "')";
                }
                if (dr["KEYWORD"].ToString() != "")
                {
                    sSql += "  AND (AREA LIKE '%" + dr["KEYWORD"].ToString() + "%' OR ITEM_TYPE LIKE '%" + dr["KEYWORD"].ToString() + "%' OR REPLACE(ITEM_NM, ' ' , '') LIKE '%" + dr["KEYWORD"].ToString() + "%' OR TAG LIKE '%" + dr["KEYWORD"].ToString() + "%')";
                }
                sSql += " AND USE_YN = 'Y' ";
                sSql += "ORDER BY (SELECT SEQ FROM COMM_CODE A WHERE A.COMM_NM = MST.AREA) ) A";
            }
            sSql += ")WHERE PAGE = " + dr["PAGE"].ToString();


            return sSql;
        }

        public string fnGetListCount_Query(DataRow dr)
        {
            sSql = "";


            sSql += "  SELECT ";
            sSql += "       MAP_X, ";
            sSql += "       MAP_Y, ";
            sSql += "       ITEM_CD, ";
            sSql += "       AREA ";
            sSql += "  FROM ITEM_MST MST";
            sSql += "   WHERE 1=1 ";
            if (dr["AREA"].ToString() != "")
            {
                if (dr["AREA"].ToString() != "ALL")
                {
                    sSql += "   AND AREA = '" + dr["AREA"].ToString() + "'";
                }
            }
            if (dr["ITEM_TYPE"].ToString() != "ALL")
            {
                sSql += "   AND ITEM_TYPE = '" + dr["ITEM_TYPE"].ToString() + "'";
            }
            if (dr["MAX_TO"].ToString() != "")
            {
                sSql += "   AND TO_NUMBER(MAX_TO) <= " + "TO_NUMBER" + "('" + (dr["MAX_TO"].ToString()) + "')";
            }
            if (dr["KEYWORD"].ToString() != "")
            {
                sSql += "  AND (AREA LIKE '%" + dr["KEYWORD"].ToString() + "%' OR ITEM_TYPE LIKE '%" + dr["KEYWORD"].ToString() + "%' OR REPLACE(ITEM_NM, ' ' , '') LIKE '%" + dr["KEYWORD"].ToString() + "%' OR TAG LIKE '%" + dr["KEYWORD"].ToString() + "%')";
            }
            
            sSql += " AND USE_YN = 'Y' ";
            


            return sSql;
        }

        public string fnGetComment_Query(DataRow dr)
        {
            sSql = "";

            sSql += " SELECT * FROM ( ";
            sSql += " SELECT  ROWNUM   AS RNUM,";
            sSql += "                 FLOOR ( (ROWNUM - 1) / 10 + 1) AS PAGE,";
            sSql += "                 COUNT (*) OVER () AS TOTCNT,";
            sSql += "                 A.*";
            sSql += "  FROM (  ";
            sSql += "SELECT CC.MNGT_NO, ";
            sSql += "       CC.EMAIL, ";
            sSql += "       CC.MNGT_SEQ, ";
            sSql += "       CC.BKG_NO, ";
            sSql += "       CC.QUOT_NO, ";
            sSql += "       CC.ITEM_NO, ";
            sSql += "       CC.CMT_SUBJECT, ";
            sSql += "       CC.CMT_SCORE, ";
            sSql += "       CC.CMT_CONTENTS, ";
            sSql += "       CC.CMT_IMG1_PATH, ";
            sSql += "       CC.CMT_IMG2_PATH, ";
            sSql += "       CC.CMT_IMG3_PATH, ";
            sSql += "       CC.CMT_IMG4_PATH, ";
            sSql += "       IM.ITEM_NM, ";
            sSql += "       IM.TAG ";
            sSql += "  FROM CUST_COMT CC";
            sSql += " INNER JOIN ITEM_MST IM";
            sSql += "         ON CC.ITEM_NO = IM.ITEM_CD";
            sSql += " WHERE 1=1 ";
            sSql += " ORDER BY CC.INS_DT DESC) A ";
            sSql += ")WHERE PAGE = " + dr["PAGE"].ToString();

            return sSql;
        }

    }
}