using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;

namespace WORKSHOP.Models.Query
{
    public class Sql_Korea
    {
        private static string sSql = "";
        private static DataTable dt = new DataTable();

        public string CntRegion_Query(DataRow dr)
        {
            sSql = "";
            sSql += " SELECT* FROM(";
            if (dr["TYPE"].ToString() == "ROAD")
            {
                sSql += " SELECT TO_CHAR(SUM(USE_CNT)) AS CNT ,";
            } else {
                sSql += " SELECT TO_CHAR(COUNT(*)) AS CNT ,";
            }
            //sSql += " SELECT TO_CHAR(COUNT(*)) AS CNT ,";
            //sSql += " SELECT TO_CHAR(SUM(USE_CNT)) AS CNT ,";
            sSql += " (SELECT TO_NUMBER(OPTION1) FROM COMM_CODE WHERE GRP_CD = 'A1' AND COMM_NM = IM.AREA) AS X, ";
            sSql += " (SELECT TO_NUMBER(OPTION2) FROM COMM_CODE WHERE GRP_CD = 'A1' AND COMM_NM = IM.AREA) AS Y, ";
            sSql += " (SELECT TO_NUMBER(OPTION3) FROM COMM_CODE WHERE GRP_CD = 'A1' AND COMM_NM = IM.AREA) AS IMG_X, ";
            sSql += " (SELECT TO_NUMBER(OPTION4) FROM COMM_CODE WHERE GRP_CD = 'A1' AND COMM_NM = IM.AREA) AS IMG_Y, ";
            sSql += " (SELECT COMM_CD FROM COMM_CODE WHERE GRP_CD = 'A1' AND COMM_NM = IM.AREA) AS CODE, ";
            sSql += " IM.AREA ";
            if (dr["TYPE"].ToString() == "ROAD")
            {
                sSql += " FROM ITEM_MST IM WHERE 1 = 1";
            } else if (dr["TYPE"].ToString() == "SEARCH")
            {
                sSql += " FROM ITEM_MST IM WHERE 1 = 1";
            }
            else
            {
                sSql += " FROM CUST_COMT CC INNER JOIN ITEM_MST IM ON CC.ITEM_NO = IM.ITEM_CD ";
            }
            if (dr["TYPE"].ToString() == "ROAD") {
                sSql += " AND IM.USE_CNT IS NOT NULL ";
            }
            else {
                if (dr["AREA"].ToString() != "ALL")
                {
                    sSql += "   AND AREA = '" + dr["AREA"].ToString() + "'";
                }
                if (dr["ITEM_TYPE"].ToString() != "ALL")
                {
                    sSql += "   AND ITEM_TYPE = '" + dr["ITEM_TYPE"].ToString() + "'";
                }
                //if (dr["MIN_TO"].ToString() != "")
                //{
                //    sSql += "   AND TO_NUMBER(MIN_TO) >= " + "TO_NUMBER" + "('" + (dr["MIN_TO"].ToString()) + "')";
                //}
                if (dr["MAX_TO"].ToString() != "")
                {
                    sSql += "   AND TO_NUMBER(MAX_TO) <= " + "TO_NUMBER" + "('" + (dr["MAX_TO"].ToString()) + "')";
                }
                if (dr["KEYWORD"].ToString() != "")
                {
                    sSql += "  AND (AREA LIKE '%" + dr["KEYWORD"].ToString() + "%' OR ITEM_TYPE LIKE '%" + dr["KEYWORD"].ToString() + "%' OR ITEM_NM LIKE '%" + dr["KEYWORD"].ToString() + "%' OR TAG LIKE '%" + dr["KEYWORD"].ToString() + "%')";
                }
            }
            sSql += "GROUP BY AREA ";
            sSql += ") ";
            sSql += "WHERE 1=1 ";
            sSql += "AND CNT != 0 ";
            //COMM_CODE OPTIION1, OPTION2에 따라 텍스트(숫자) 좌표
            //korea.js CntImg() 안에 코드값은 핀 고정값
            return sSql;
        }

        public string TextClickItemSearch_Query(DataRow dr)
        {
            sSql = "";

            sSql += "SELECT MST.MNGT_NO, ";
            sSql += "       MST.ITEM_CD, ";
            sSql += "       MST.AREA, ";
            sSql += "       MST.ITEM_TYPE, ";
            sSql += "       MST.ITEM_NM, ";
            sSql += "       MST.ITEM_GRD, ";
            sSql += "       MST.ADDR1, ";
            sSql += "       MST.ADDR2, ";
            sSql += "       (SELECT LISTAGG(THIS_PATH,'|') WITHIN GROUP (ORDER BY MNGT_NO,IMG_TYPE DESC) AS FULL_IMG FROM(SELECT MNGT_NO, ITEM_SEQ, ITEM_CD, IMG_TYPE, (IMG_PATH || '/' || IMG_NM) AS THIS_PATH FROM ITEM_DTL_IMG) ";
            sSql += "       WHERE 1=1 AND ITEM_CD = MST.ITEM_CD GROUP BY MNGT_NO, ITEM_CD) AS IMG_PATH, ";
            sSql += "       MST.ZIPCODE, ";
            sSql += "       MST.HOME_URL, ";
            sSql += "       MST.RMK, ";
            sSql += "       MST.TAG, ";
            sSql += "       MST.USE_YN, ";
            sSql += "       MST.MIN_TO, ";
            sSql += "       MST.MAX_TO, ";
            sSql += "       MST.REC_YN ";
            sSql += "  FROM ITEM_MST MST";
            sSql += " WHERE 1 = 1";
            if (dr["ITEM_CD"].ToString() != "")
            {
                sSql += "   AND ITEM_CD = '"  + dr["ITEM_CD"].ToString() + "'";
            }

            return sSql;
        }

        public string TextClickSearch_Query(DataRow dr)
        {
            sSql = "";

            sSql += " SELECT * FROM ( ";
            sSql += "SELECT ROWNUM AS RNUM, ";
            sSql += "            FLOOR((ROWNUM - 1) / 10+1) AS PAGE,";
            sSql += "            COUNT (*) OVER() AS TOTCNT,";
            sSql += "            A.*";
            sSql += "FROM(";
            sSql += "SELECT MST.MNGT_NO, ";
            sSql += "       MST.ITEM_CD, ";
            sSql += "       MST.AREA, ";
            sSql += "       MST.ITEM_TYPE, ";
            sSql += "       MST.ITEM_NM, ";
            sSql += "       MST.ITEM_GRD, ";
            sSql += "       MST.ADDR1, ";
            sSql += "       MST.ADDR2, ";
            if (dr["TYPE"].ToString() == "ROAD")
            {
                sSql += "       (SELECT LISTAGG(THIS_PATH,'|') WITHIN GROUP (ORDER BY MNGT_NO,IMG_TYPE) AS FULL_IMG FROM(SELECT MNGT_NO, ITEM_SEQ, ITEM_CD, IMG_TYPE, (IMG_PATH || '/' || IMG_NM) AS THIS_PATH FROM ITEM_DTL_IMG) ";
                sSql += "       WHERE 1=1 AND ITEM_CD = MST.ITEM_CD GROUP BY MNGT_NO, ITEM_CD) AS IMG_PATH, ";
            }
            else if (dr["TYPE"].ToString() == "SEARCH")
            {
                sSql += "       (SELECT LISTAGG(THIS_PATH,'|') WITHIN GROUP (ORDER BY MNGT_NO,IMG_TYPE DESC) AS FULL_IMG FROM(SELECT MNGT_NO, ITEM_SEQ, ITEM_CD, IMG_TYPE, (IMG_PATH || '/' || IMG_NM) AS THIS_PATH FROM ITEM_DTL_IMG) ";
                sSql += "       WHERE 1=1 AND ITEM_CD = MST.ITEM_CD GROUP BY MNGT_NO, ITEM_CD) AS IMG_PATH, ";
            }
            sSql += "       MST.ZIPCODE, ";
            sSql += "       MST.HOME_URL, ";
            sSql += "       MST.RMK, ";
            sSql += "       MST.TAG, ";
            sSql += "       MST.USE_YN, ";
            sSql += "       MST.MIN_TO, ";
            sSql += "       MST.MAX_TO, ";
            sSql += "       MST.REC_YN, ";
            if (dr["TYPE"].ToString() == "COMMENT")
            {
                sSql += "MST.USE_CNT, ";
                sSql += "CC.EMAIL, ";
                sSql += "CC.MNGT_SEQ, ";
                sSql += "CC.BKG_NO, ";
                sSql += "CC.QUOT_NO, ";
                sSql += "CC.ITEM_NO, ";
                sSql += "CC.CMT_SUBJECT, ";
                sSql += "CC.CMT_SCORE, ";
                sSql += "CC.CMT_CONTENTS, ";
                sSql += "CC.CMT_IMG1_PATH, ";
                sSql += "CC.CMT_IMG2_PATH, ";
                sSql += "CC.CMT_IMG3_PATH, ";
                sSql += "CC.CMT_IMG4_PATH ";
            } else
            {
                sSql += "MST.USE_CNT";
            }
            sSql += "  FROM ITEM_MST MST";
            if (dr["TYPE"].ToString() == "COMMENT")
            {
                sSql += " INNER JOIN CUST_COMT CC ON CC.ITEM_NO = MST.ITEM_CD";
            }
                sSql += " WHERE 1 = 1";
            if (dr["TYPE"].ToString() == "ROAD")
            {
                sSql += "   AND AREA = '" + dr["AREA"].ToString() + "'";
                sSql += "   AND USE_CNT IS NOT NULL";
            }
            else if (dr["TYPE"].ToString() == "SEARCH") {
                if (dr["AREA"].ToString() != "ALL")
                {
                    sSql += "   AND AREA = '" + dr["AREA"].ToString() + "'";
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
                    sSql += "  AND (AREA LIKE '%" + dr["KEYWORD"].ToString() + "%' OR ITEM_TYPE LIKE '%" + dr["KEYWORD"].ToString() + "%' OR ITEM_NM LIKE '%" + dr["KEYWORD"].ToString() + "%' OR TAG LIKE '%" + dr["KEYWORD"].ToString() + "%')";
                }

            } else if (dr["TYPE"].ToString() == "COMMENT")
            {
                sSql += " AND AREA = '" + dr["AREA"].ToString() + "'";
            }
            sSql += "   ) A ";
            sSql += ")WHERE PAGE = " + dr["PAGE"].ToString();

            return sSql;
        }


    }
}