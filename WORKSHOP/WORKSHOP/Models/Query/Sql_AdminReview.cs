using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;

namespace WORKSHOP.Models.Query
{
    public class Sql_AdminReview
    {
        static bool rtnBool = false;
        static DataTable dt = new DataTable();
        static string sSql = "";


        #region 리뷰 관리 쿼리

        #region 조회 쿼리
        public static DataTable GetRvList_Query(DataRow dr) 
        {
            sSql = "";
            
            sSql += "SELECT 'Q' AS INSFLAG , CO.MNGT_NO, CO.MNGT_SEQ, CO.BKG_NO, CO.QUOT_NO, CO.CMT_SCORE, CO.CMT_SUBJECT,CO.CMT_CONTENTS, CI.CUST_NAME, IM.ITEM_NM, CO.INS_DT, CO.EMAIL, CO.ITEM_NO ";
            sSql += " , CMT_IMG1_PATH, CMT_IMG2_PATH, CMT_IMG3_PATH, CMT_IMG4_PATH , (CMT_IMG1_PATH ||'|'|| CMT_IMG2_PATH ||'|'|| CMT_IMG3_PATH ||'|'|| CMT_IMG4_PATH)AS FULL_PATH ";
            sSql += "FROM CUST_COMT CO ";
            sSql += "JOIN CUST_INFO CI ";
            sSql += "  ON CO.EMAIL = CI.EMAIL ";
            sSql += "JOIN ITEM_MST IM ";
            sSql += "  ON CO.ITEM_NO = IM.ITEM_CD ";
            sSql += "WHERE 1=1 ";


            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);
            return dt;
        }

        #endregion


        #region 삭제 쿼리
        public static bool DeleteRvList_Query(DataRow dr)
        {
            sSql = "";
            sSql += "DELETE CUST_COMT ";
            sSql += " WHERE 1=1 ";
            sSql += " AND MNGT_NO = '"+dr["MNGT_NO"].ToString().Trim()+"' ";
            sSql += " AND MNGT_SEQ = '" + dr["MNGT_SEQ"].ToString().Trim() + "' ";
            sSql += " AND ITEM_NO = '" +dr["ITEM_NO"].ToString().Trim()+ "' ";
            sSql += " AND EMAIL = '"+dr["EMAIL"].ToString().Trim()+"' ";


            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
                if (cnt > 0) rtnBool = true;
            return rtnBool;
        }
        #endregion 

        #endregion

    }
}