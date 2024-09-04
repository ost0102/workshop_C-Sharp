using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;

namespace WORKSHOP.Models.Query
{
    public class Sql_Service

    {
        private static string sSql = "";
        private static bool rtnBool = false;
       
        public string Search_Notice(DataRow dr)
        {


            sSql = "";
            sSql += " SELECT * ";
            sSql += "   FROM (SELECT ROWNUM AS RNUM,";
            sSql += "                FLOOR ( (ROWNUM - 1) / 10 + 1) AS PAGE,";
            sSql += "                COUNT (*) OVER () AS TOTCNT,";
            sSql += "           A.*";
            sSql += "           FROM ( SELECT *";
            sSql += "            FROM NOTICE";
            sSql += "           WHERE USE_YN = 'y'";
            if (dr.Table.Columns.Contains("NOTICE_ID")) {
                if (dr["NOTICE_ID"].ToString() != "") {
                    sSql += "           AND NOTICE_ID = '" + dr["NOTICE_ID"].ToString() + "'";
                }
            }
            sSql += "           ORDER BY REGDT DESC";
            sSql += " ) A";
            sSql += ")WHERE PAGE = " + dr["PAGE"].ToString();

            return sSql;

        }
        public string Cnt_Notice(DataRow dr)
        {


            sSql = "";
            sSql += "  UPDATE ";
            sSql += " NOTICE SET";
            sSql += " CNT =" + dr["CNT"].ToString(); ;
            sSql += " WHERE NOTICE_ID = " + dr["NOTICE_ID"].ToString();

            return sSql;

        }
        public string Cnt_Review(DataRow dr)
        {


            sSql = "";
            sSql += "  UPDATE ";
            sSql += " CUST_COMT SET";
            sSql += " CNT =" + dr["CNT"].ToString(); ;
            sSql += " WHERE MNGT_NO = " + "'"+ dr["REVIEW_ID"].ToString()+ "'";

            return sSql;

        }

        //public string SearchCnt_Notice(DataRow dr)
        // {


        //     sSql = "";
        //     sSql = " SELECT * ";
        //     sSql += "   FROM (SELECT ROWNUM AS RNUM,";
        //     sSql += "                FLOOR ( (ROWNUM - 1) / 10 + 1) AS PAGE,";
        //     sSql += "                COUNT (*) OVER () AS TOTCNT,";
        //     sSql += "           A.*";
        //     sSql += "           FROM ( SELECT *";
        //     sSql += "            FROM NOTICE";
        //     sSql += "           WHERE USE_YN = 'y'";
        //     sSql += "           ORDER BY REGDT DESC";
        //     sSql += " ) A";
        //     sSql += ")WHERE PAGE = " + dr["PAGE"].ToString();

        //     return sSql;

        // }
        public string Search_Review(DataRow dr)
        {


            sSql = "";
            sSql += " SELECT * ";
            sSql += "   FROM (SELECT ROWNUM AS RNUM,";
            sSql += "                FLOOR ( (ROWNUM - 1) / 10 + 1) AS PAGE,";
            sSql += "                COUNT (*) OVER () AS TOTCNT,";
            sSql += "           A.*";
            sSql += "           FROM ( SELECT *";
            sSql += "            FROM CUST_COMT";
            sSql += "           WHERE 1 = 1";
            if (dr.Table.Columns.Contains("REVIEW_ID"))
            {
                if (dr["REVIEW_ID"].ToString() != "")
                {
                    sSql += "           AND MNGT_NO = '" + dr["REVIEW_ID"].ToString() + "'";
                }
            }
            sSql += "           ORDER BY INS_DT DESC";
            sSql += " ) A";
            sSql += ")WHERE PAGE = " + dr["PAGE"].ToString();

            return sSql;

        }

        public string Search_NoticeList(DataRow dr)
        {


            sSql = "";
            sSql += " SELECT * ";
            sSql += "   FROM (SELECT ROWNUM AS RNUM,";
            sSql += "                FLOOR ( (ROWNUM - 1) / 10 + 1) AS PAGE,";
            sSql += "                COUNT (*) OVER () AS TOTCNT,";
            sSql += "           A.*";
            sSql += "           FROM ( SELECT *";
            sSql += "            FROM NOTICE A";
            sSql += "           WHERE 1 = 1";
            sSql += "           AND USE_YN = 'y'";
            if (dr["From_Date"].ToString() != "" && dr["To_Date"].ToString() != "")
            {
                sSql += " AND ((REPLACE (A.REGDT, '-', '') BETWEEN '" + dr["From_Date"].ToString() + "' AND '" + dr["To_Date"].ToString() + "')";
            }
            if (dr["STATUS"].ToString() != "")
            {
                if (dr["STATUS"].ToString() == "T")
                {
                    sSql += "  AND A.TITLE LIKE '%" + dr["KEYWORD"].ToString() + "%'";
                }
                else if (dr["STATUS"].ToString() == "C")
                {
                    sSql += "  AND A.CONTENT LIKE '%" + dr["KEYWORD"].ToString() + "%'";
                }
            }
            else
            {
                if (dr["KEYWORD"].ToString() != "")
                {
                    sSql += "  AND (A.TITLE LIKE '%" + dr["KEYWORD"].ToString() + "%' OR A.CONTENT LIKE '%" + dr["KEYWORD"].ToString() + "%')";
                }
            }
            sSql += "         )  ORDER BY REGDT DESC";
            sSql += " ) A";
            sSql += ")WHERE PAGE = " + dr["PAGE"].ToString();

            return sSql;
        }

        public string Search_ReviewList(DataRow dr)
        {


            sSql = "";
            sSql += " SELECT * ";
            sSql += "   FROM (SELECT ROWNUM AS RNUM,";
            sSql += "                FLOOR ( (ROWNUM - 1) / 10 + 1) AS PAGE,";
            sSql += "                COUNT (*) OVER () AS TOTCNT,";
            sSql += "           A.*";
            sSql += "           FROM ( SELECT *";
            sSql += "            FROM CUST_COMT A";
            sSql += "           WHERE 1 = 1";
            if (dr["From_Date"].ToString() != "" && dr["To_Date"].ToString() != "")
            {
                sSql += " AND ((SUBSTR (A.INS_DT, 0, 8) BETWEEN '" + dr["From_Date"].ToString() + "' AND '" + dr["To_Date"].ToString() + "')";
            }
            if (dr["STATUS"].ToString() != "")
            {
                if (dr["STATUS"].ToString() == "T")
                {
                    sSql += "  AND A.CMT_SUBJECT LIKE '%" + dr["KEYWORD"].ToString() + "%'";
                }
                else if (dr["STATUS"].ToString() == "C")
                {
                    sSql += "  AND A.CMT_CONTENTS LIKE '%" + dr["KEYWORD"].ToString() + "%'";
                }
            }
            else
            {
                if (dr["KEYWORD"].ToString() != "")
                {
                    sSql += "  AND (A.CMT_SUBJECT LIKE '%" + dr["KEYWORD"].ToString() + "%' OR A.CMT_CONTENTS LIKE '%" + dr["KEYWORD"].ToString() + "%')";
                }
            }
            sSql += "         )  ORDER BY INS_DT DESC";
            sSql += " ) A";
            sSql += ")WHERE PAGE = " + dr["PAGE"].ToString();

            return sSql;
        }
    }
}