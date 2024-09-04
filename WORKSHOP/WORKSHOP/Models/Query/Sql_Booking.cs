using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;

namespace WORKSHOP.Models.Query
{
    public class Sql_Booking
    {
        private static string sSql = "";
        private static bool rtnBool = false;
        private static DataTable dt = new DataTable();


        #region ※※조회 화면※※
        public static DataTable GetBkgList_Query(DataRow dr)
        {
            sSql = "";

            sSql += "SELECT  'Q' AS INSFLAG,  BM.BKG_STATUS, BM.BKG_NO, BM.CUST_NM, BM.ITEM_CD ,  BM.STRT_DT , BM.END_DT , BM.TOT_AMT , BM.RMK, BM.CUST_EMAIL, BM.CUST_TEL ,";

            sSql += " IM.ITEM_NM , IM.AREA";

            sSql += " FROM BKG_MST  BM ";
            sSql += " JOIN ITEM_MST IM ";
            sSql += "   ON  BM.ITEM_CD = IM.ITEM_CD ";
            sSql += " WHERE 1=1 ";
            if (dr.Table.Columns.Contains("DATE"))
            {

                sSql += " AND (STRT_DT LIKE '" + dr["DATE"].ToString().Trim() + "%' ";
                sSql += "       OR END_DT LIKE '" + dr["DATE"].ToString().Trim() + "%' )";
            }
            if (dr.Table.Columns.Contains("BKG_STATUS"))
            {
                if(dr["BKG_STATUS"].ToString() != "" && dr["BKG_STATUS"].ToString() != "ALL")
                {
                    sSql += "AND BKG_STATUS = '"+dr["BKG_STATUS"]+"' ";
                }
                
            }
            if (dr.Table.Columns.Contains("ITEM_NM"))
            {
                if (dr["ITEM_NM"].ToString() != "" )
                {
                    sSql += "AND IM.ITEM_NM LIKE '%" + dr["ITEM_NM"] + "%' ";
                }
            }
            if (dr.Table.Columns.Contains("CUST_NM"))
            {
                if (dr["CUST_NM"].ToString() != "")
                {
                    sSql += "AND BM.CUST_NM LIKE '%" + dr["CUST_NM"] + "%' ";
                }
            }
            sSql += " ORDER BY NVL(BM.UPD_DT, BM.INS_DT) DESC ";

            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);

            return dt;
        }


        public static DataTable SelectBkgAllDetail(DataRow dr)
        {

            sSql = "";
            sSql += "SELECT CONF_TYPE AS REQ_CONTENT ";
            sSql += " , 'Q'AS INSFLAG ";
            sSql += "   , 0 AS REQ_NUM ";
            sSql += "   , BKG_NO ";
            sSql += "   , BKG_SEQ ";
            sSql += "   , 'CONF' AS REQ_STATUS ";
            sSql += "   , NVL(PRC,'0') AS PRC";
            sSql += "   FROM BKG_CONF ";
            sSql += " WHERE 1=1 ";
            sSql += " AND BKG_NO = '"+dr["BKG_NO"].ToString()+"' ";
            
            sSql += " UNION ";

            sSql += "SELECT ROOM_NM AS REQ_CONTENT ";
            sSql += " , 'Q'AS INSFLAG ";
            sSql += "   , ROOM_CNT AS REQ_NUM ";
            sSql += "   , BKG_NO ";
            sSql += "   , BKG_SEQ ";
            sSql += "   , 'ROOM' AS REQ_STATUS ";
            sSql += "   , NVL(PRC,'0') AS PRC";
            sSql += "   FROM BKG_ROOM ";
            sSql += " WHERE 1=1 ";
            sSql += " AND BKG_NO = '" + dr["BKG_NO"].ToString() + "' ";

            sSql += " UNION ";

            sSql += "SELECT MEAL_NM AS REQ_CONTENT ";
            sSql += " , 'Q'AS INSFLAG ";
            sSql += "   , 0 AS REQ_NUM ";
            sSql += "   , BKG_NO ";
            sSql += "   , BKG_SEQ ";
            sSql += "   , 'MEAL' AS REQ_STATUS ";
            sSql += "   , NVL(PRC,'0') AS PRC";   
            sSql += "   FROM BKG_MEAL ";
            sSql += " WHERE 1=1 ";
            sSql += " AND BKG_NO = '" + dr["BKG_NO"].ToString() + "' ";

            sSql += " UNION ";

            sSql += "SELECT SVC_NM AS REQ_CONTENT ";
            sSql += " , 'Q'AS INSFLAG ";
            sSql += "   , 0 AS REQ_NUM ";
            sSql += "   , BKG_NO ";
            sSql += "   , BKG_SEQ ";
            sSql += "   , 'SVC' AS REQ_STATUS ";
            sSql += "   , NVL(PRC,'0')AS PRC ";
            sSql += "   FROM BKG_SVC ";
            sSql += " WHERE 1=1 ";
            sSql += " AND BKG_NO = '" + dr["BKG_NO"].ToString() + "' ";

            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);

            return dt;
        }


        public static bool UpdateBkgDtl_Query(DataRow dr)
        {

            sSql = "";
            sSql += "UPDATE BKG_" + dr["REQ_STATUS"].ToString()+" " ; // 테이블 네임
            sSql += "SET PRC = '" + dr["PRC"].ToString() + "' ";

            if(dr["REQ_STATUS"].ToString() == "CONF")
            {
                sSql += " , CONF_TYPE = '"+dr["REQ_CONTENT"].ToString() +"' ";
            }
            if (dr["REQ_STATUS"].ToString() == "ROOM")
            {
                sSql += " , ROOM_NM = '" + dr["REQ_CONTENT"].ToString() + "' ";
                sSql += " , ROOM_CNT = '" + dr["REQ_NUM"].ToString() + "' ";
            }
            if (dr["REQ_STATUS"].ToString() == "MEAL")
            {
                sSql += " , MEAL_NM = '" + dr["REQ_CONTENT"].ToString() + "' ";
            }
            if (dr["REQ_STATUS"].ToString() == "SVC")
            {
                sSql += " , SVC_NM = '" + dr["REQ_CONTENT"].ToString() + "' ";
            }

            sSql += "WHERE 1=1 ";
            sSql += " AND BKG_NO = '" + dr["BKG_NO"].ToString() + "' ";
            sSql += " AND BKG_SEQ = '" + dr["BKG_SEQ"].ToString() + "' ";

            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;

            return rtnBool;
        }

        public static bool UpdateTotalPrc(DataRow dr, int tot_amt)
        {
            sSql = "";

            sSql += "UPDATE BKG_MST ";
            sSql += " SET TOT_AMT = '" +tot_amt.ToString()+"' ";
            sSql += "  , UPD_USR = 'WEB' ";
            sSql += "   , UPD_DT = TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS')";
            sSql += " WHERE 1=1 ";
            sSql += " AND BKG_NO = '"+dr["BKG_NO"].ToString()+"' ";



            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;

            return rtnBool;
        }

        /// <summary>
        /// 예약 플래그 업데이트
        /// </summary>
        /// <param name="dr"></param>
        /// <returns></returns>
        public static bool UpdateBkgFlag(DataRow dr)
        {
            sSql = "";

            sSql += "UPDATE BKG_MST ";
            sSql += " SET BKG_STATUS = '" +dr["STATUS"].ToString().Trim()+"' ";
            sSql += " WHERE 1=1 ";
            sSql += " AND BKG_NO = '" +dr["BKG_NO"].ToString().Trim()+"' ";

            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;

            return rtnBool;

        }

        public static DataTable SearchBkgItem(DataRow dr)
        {
            sSql = "";

            sSql += "SELECT ITEM_CD ";
            sSql += "FROM BKG_MST ";
            sSql += "WHERE 1=1 ";
            sSql += " AND BKG_NO = '"+dr["BKG_NO"].ToString().Trim()+"' ";



            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);

            return dt;
        }


        public static bool UpdateItemCnt(DataRow dr)
        {
            sSql = "";

            sSql += "UPDATE ITEM_MST ";
            sSql += " SET USE_CNT = (SELECT NVL(USE_CNT,0)+1 FROM ITEM_MST WHERE ITEM_CD = '"+dr["ITEM_CD"].ToString()+"' ) ";
            sSql += " WHERE ITEM_CD = '"+dr["ITEM_CD"].ToString()+"' ";

            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;

            return rtnBool;

        }

#endregion

        #region ※※수정 화면 쿼리※※

        #region ※헤더 테이블※

        /// <summary>
        /// 헤더 조회
        /// </summary>
        /// <param name="dr"></param>
        /// <returns></returns>
        public static DataTable fnSearchBkg_Query(DataRow dr)
        {
            sSql = "";

            sSql += " SELECT 'Q' AS INSFLAG, BM.BKG_NO, BM.BKG_STATUS, BM.ITEM_CD, BM.TOT_AMT , BM.FILE_PATH, BM.FILE_NM , BM.EMAIL_YN, BM.HEAD_CNT, BM.RMK ";
            sSql += " , BM.CUST_NM, BM.CUST_EMAIL, BM.CUST_TEL, BM.STRT_DT, BM.END_DT ";
            sSql += " , IM.ITEM_NM, IM.AREA ";
            sSql += " , BM.HEAD_CNT , BM.EMAIL_YN ";
            sSql += " FROM BKG_MST BM";
            sSql += " LEFT JOIN ITEM_MST IM ";
            sSql += " ON BM.ITEM_CD = IM.ITEM_CD ";
            sSql += " WHERE 1=1 ";
            sSql += " AND BKG_NO = '"+dr["BKG_NO"].ToString().Trim()+"' ";

            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);

            return dt;
        }



        public static bool UpDateHd_Query(DataRow dr) {
            sSql = "";

            sSql += "UPDATE BKG_MST ";
            sSql += " SET ITEM_CD = '"+dr["ITEM_CD"].ToString().Trim()+"' ";
            sSql += "       , FILE_NM = '' ";
            sSql += "       , FILE_PATH = '' ";
            sSql += " WHERE 1=1";
            sSql += " AND BKG_NO = '"+dr["BKG_NO"].ToString().Trim()+"' ";

            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }


        public static bool UpdateFilePath(DataRow dr)
        {
            sSql = "";

            sSql += "UPDATE BKG_MST ";
            sSql += " SET FILE_PATH ='"+dr["FILE_PATH"].ToString().Trim()+"' ";
            sSql += " , FILE_NM ='"+ dr["FILE_NM"].ToString().Trim() + "' ";
            sSql += " WHERE 1=1 ";
            sSql += " AND BKG_NO ='"+dr["BKG_NO"].ToString().Trim()+"' ";


            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }


        public static bool UpdateBkgList(DataRow dr)
        {
            sSql = "";

            sSql += "UPDATE BKG_MST ";
            sSql += " SET HEAD_CNT ='" + dr["HEAD_CNT"].ToString().Trim() + "' ";
            sSql += " , TOT_AMT ='" + dr["TOT_AMT"].ToString().Trim() + "' ";
            sSql += " WHERE 1=1 ";
            sSql += " AND BKG_NO ='" + dr["BKG_NO"].ToString().Trim() + "' ";


            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }


        public static bool fnUpdateHd_Query(DataRow dr)
        {
            sSql = "";
            sSql += "UPDATE BKG_MST ";
            sSql += " SET HEAD_CNT = '"+dr["HEAD_CNT"].ToString()+"' ";
            sSql += " , TOT_AMT = '"+dr["TOT_AMT"].ToString()+"' ";
            sSql += " , STRT_DT = '" + dr["STRT_DT"].ToString()+"' ";
            sSql += " , END_DT = '" + dr["END_DT"].ToString() + "' ";

            sSql += "WHERE 1=1 ";
            sSql += " AND BKG_NO = '"+dr["BKG_NO"].ToString()+"' ";

            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }

        #endregion





        #region ※디테일 테이블※

        #region 조회
        public static DataTable fnSearchBkgConf_Query(DataRow dr)
        {
            sSql = "";

            sSql += " SELECT 'Q'AS INSFLAG , BKG_NO , BKG_SEQ , ITEM_CD, ITEM_SEQ, CONF_TYPE, PRC ";
            sSql += " , NVL((SELECT SUM(PRC) FROM BKG_CONF WHERE BKG_NO ='"+dr["BKG_NO"].ToString().Trim()+"'),0) AS SUM_PRC";
            sSql += " FROM BKG_CONF ";
            sSql += " WHERE 1=1 ";
            sSql += " AND BKG_NO = '" +dr["BKG_NO"].ToString().Trim()+"' ";
            sSql += " ORDER BY BKG_SEQ ";

            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);
            return dt;
        }



        public static DataTable fnSearchBkgRoom_Query(DataRow dr)
        {
            sSql = "";

            sSql += " SELECT 'Q'AS INSFLAG , BKG_NO, BKG_SEQ, ROOM_NM , ROOM_CNT, PRC";
            sSql += " , NVL((SELECT SUM(PRC) FROM BKG_ROOM WHERE BKG_NO ='" + dr["BKG_NO"].ToString().Trim() + "'),0) AS SUM_PRC";
            sSql += " FROM BKG_ROOM ";
            sSql += " WHERE 1=1 ";
            sSql += " AND BKG_NO = '" + dr["BKG_NO"].ToString().Trim() + "' ";
            sSql += " ORDER BY BKG_SEQ ";


            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);
            return dt;
        }


        public static DataTable fnSearchBkgMeal_Query(DataRow dr)
        {
            sSql = "";

            sSql += " SELECT 'Q'AS INSFLAG , BKG_NO, BKG_SEQ, MEAL_CD, MEAL_NM, PRC ";
            sSql += " , NVL((SELECT SUM(PRC) FROM BKG_MEAL WHERE BKG_NO ='" + dr["BKG_NO"].ToString().Trim() + "'),0) AS SUM_PRC";
            sSql += " FROM BKG_MEAL ";
            sSql += " WHERE 1=1 ";
            sSql += " AND BKG_NO = '" + dr["BKG_NO"].ToString().Trim() + "' ";
            sSql += " ORDER BY BKG_SEQ ";

            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);
            return dt;
        }

        public static DataTable fnSearchBkgSvc_Query(DataRow dr)
        {
            sSql = "";

            sSql += " SELECT 'Q'AS INSFLAG , BKG_NO, BKG_SEQ, SVC_CD, SVC_NM, PRC ";
            sSql += " , NVL((SELECT SUM(PRC) FROM BKG_SVC WHERE BKG_NO ='" + dr["BKG_NO"].ToString().Trim() + "'),0) AS SUM_PRC";
            sSql += " FROM BKG_SVC ";
            sSql += " WHERE 1=1 ";
            sSql += " AND BKG_NO = '" + dr["BKG_NO"].ToString().Trim() + "' ";
            sSql += " ORDER BY BKG_SEQ ";

            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);
            return dt;
        }
        #endregion


        #region ※추가※

        public static bool fnInsertBkgConf_Query(DataRow dr)
        {
            sSql = "";

            sSql += "INSERT INTO BKG_CONF ";
            sSql += " (BKG_NO, BKG_SEQ , CONF_TYPE , PRC , INS_USR , INS_DT )";
            sSql += " VALUES(";
            sSql += "       '"+dr["BKG_NO"].ToString().Trim()+"' ";
            sSql += "       , (SELECT NVL(MAX(BKG_SEQ),0)+1 FROM BKG_CONF WHERE BKG_NO = '"+dr["BKG_NO"].ToString().Trim()+"') ";
            sSql += "       , '"+dr["CONF_TYPE"].ToString().Trim()+"' ";
            sSql += "       , '"+dr["PRC"].ToString().Trim()+"' ";
            sSql += "       , 'WEB' ";
            sSql += "       , TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS')";
            sSql += "       ) ";

            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }


        public static bool fnInsertBkgRoom_Query(DataRow dr)
        {
            sSql = "";

            sSql += "INSERT INTO BKG_ROOM ";
            sSql += " (BKG_NO, BKG_SEQ, ROOM_NM, ROOM_CNT, PRC, INS_USR, INS_DT )";
            sSql += " VALUES( ";
            sSql += "           '" + dr["BKG_NO"].ToString().Trim() + "' ";
            sSql += "           , (SELECT NVL(MAX(BKG_SEQ),0)+1 FROM BKG_ROOM WHERE BKG_NO = '"+dr["BKG_NO"].ToString().Trim()+"') ";
            sSql += "           , '" + dr["ROOM_NM"].ToString().Trim() + "' ";
            sSql += "           , '" + dr["ROOM_CNT"].ToString().Trim() + "' ";
            sSql += "           , '" + dr["PRC"].ToString().Trim() + "' ";
            sSql += "           , 'WEB' ";
            sSql += "           , TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS') ";
            sSql += "       ) ";


            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;

        }


        public static bool fnInsertBkgMeal_Query(DataRow dr)
        {
            sSql = "";

            sSql += "INSERT INTO BKG_MEAL ";
            sSql += " (BKG_NO, BKG_SEQ, MEAL_NM,  PRC, INS_USR, INS_DT )";
            sSql += " VALUES( ";
            sSql += "           '" + dr["BKG_NO"].ToString().Trim() + "' ";
            sSql += "           , (SELECT NVL(MAX(BKG_SEQ),0)+1 FROM BKG_MEAL WHERE BKG_NO = '" + dr["BKG_NO"].ToString().Trim() + "') ";
            sSql += "           , '" + dr["MEAL_NM"].ToString().Trim() + "' ";
            sSql += "           , '" + dr["PRC"].ToString().Trim() + "' ";
            sSql += "           , 'WEB' ";
            sSql += "           , TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS') ";
            sSql += "       ) ";


            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;

        }



        public static bool fnInsertBkgSvc_Query(DataRow dr)
        {
            sSql = "";

            sSql += "INSERT INTO BKG_SVC ";
            sSql += " (BKG_NO, BKG_SEQ, SVC_NM,  PRC, INS_USR, INS_DT )";
            sSql += " VALUES( ";
            sSql += "           '" + dr["BKG_NO"].ToString().Trim() + "' ";
            sSql += "           , (SELECT NVL(MAX(BKG_SEQ),0)+1 FROM BKG_MEAL WHERE BKG_NO = '" + dr["BKG_NO"].ToString().Trim() + "') ";
            sSql += "           , '" + dr["SVC_NM"].ToString().Trim() + "' ";
            sSql += "           , '" + dr["PRC"].ToString().Trim() + "' ";
            sSql += "           , 'WEB' ";
            sSql += "           , TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS') ";
            sSql += "       ) ";


            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;

        }


        #endregion

        #region ※수정※

        public static bool fnUpdateBkgConf_Query(DataRow dr)
        {
            sSql = "";

            sSql += " UPDATE BKG_CONF ";
            sSql += " SET CONF_TYPE = '"+dr["CONF_TYPE"].ToString().Trim()+"' ";
            sSql += "   , PRC = '"+dr["PRC"].ToString().Trim()+"' ";
            sSql += "   , UPD_USR ='WEB'";
            sSql += "   , UPD_DT = TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS') ";
            sSql += "  WHERE 1=1 ";
            sSql += "  AND BKG_NO = '"+dr["BKG_NO"].ToString().Trim()+"' ";
            sSql += "  AND BKG_SEQ = '"+dr["BKG_SEQ"].ToString().Trim()+"' ";


            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }


        public static bool fnUpdateBkgRoom_Query(DataRow dr)
        {
            sSql = "";

            sSql += " UPDATE BKG_ROOM ";
            sSql += " SET ROOM_NM = '" + dr["ROOM_NM"].ToString().Trim() + "' ";
            sSql += "   , ROOM_CNT = '" + dr["ROOM_CNT"].ToString().Trim() + "' ";
            sSql += "   , PRC = '" + dr["PRC"].ToString().Trim() + "' ";
            sSql += "   , UPD_USR ='WEB'";
            sSql += "   , UPD_DT = TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS') ";
            sSql += "  WHERE 1=1 ";
            sSql += "  AND BKG_NO = '" + dr["BKG_NO"].ToString().Trim() + "' ";
            sSql += "  AND BKG_SEQ = '" + dr["BKG_SEQ"].ToString().Trim() + "' ";


            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }


        public static bool fnUpdateBkgMeal_Query(DataRow dr)
        {
            sSql = "";

            sSql += " UPDATE BKG_MEAL ";
            sSql += " SET MEAL_NM = '" + dr["MEAL_NM"].ToString().Trim() + "' ";
            sSql += "   , PRC = '" + dr["PRC"].ToString().Trim() + "' ";
            sSql += "   , UPD_USR ='WEB'";
            sSql += "   , UPD_DT = TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS') ";
            sSql += "  WHERE 1=1 ";
            sSql += "  AND BKG_NO = '" + dr["BKG_NO"].ToString().Trim() + "' ";
            sSql += "  AND BKG_SEQ = '" + dr["BKG_SEQ"].ToString().Trim() + "' ";


            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }


        public static bool fnUpdateBkgSvc_Query(DataRow dr)
        {
            sSql = "";

            sSql += " UPDATE BKG_SVC ";
            sSql += " SET SVC_NM = '" + dr["SVC_NM"].ToString().Trim() + "' ";
            sSql += "   , PRC = '" + dr["PRC"].ToString().Trim() + "' ";
            sSql += "   , UPD_USR ='WEB'";
            sSql += "   , UPD_DT = TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS') ";
            sSql += "  WHERE 1=1 ";
            sSql += "  AND BKG_NO = '" + dr["BKG_NO"].ToString().Trim() + "' ";
            sSql += "  AND BKG_SEQ = '" + dr["BKG_SEQ"].ToString().Trim() + "' ";


            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }


        #endregion

        #region ※삭제※
        public static bool fnDeleteBkgConf_Query(DataRow dr)
        {
            sSql = "";

            sSql += " DELETE BKG_CONF ";
            sSql += " WHERE 1=1 ";
            sSql += " AND BKG_NO = '"+dr["BKG_NO"].ToString().Trim()+"' ";
            sSql += " AND BKG_SEQ = '"+dr["BKG_SEQ"].ToString().Trim()+"' ";
            sSql += " AND CONF_TYPE = '" +dr["CONF_TYPE"].ToString().Trim()+"' ";
                
            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }


        public static bool fnDeleteBkgRoom_Query(DataRow dr)
        {
            sSql = "";

            sSql += " DELETE BKG_ROOM ";
            sSql += " WHERE 1=1 ";
            sSql += " AND BKG_NO = '" + dr["BKG_NO"].ToString().Trim() + "' ";
            sSql += " AND BKG_SEQ = '" + dr["BKG_SEQ"].ToString().Trim() + "' ";
            sSql += " AND ROOM_NM = '" + dr["ROOM_NM"].ToString().Trim() + "' ";

            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }


        public static bool fnDeleteBkgMeal_Query(DataRow dr)
        {
            sSql = "";

            sSql += " DELETE BKG_MEAL ";
            sSql += " WHERE 1=1 ";
            sSql += " AND BKG_NO = '" + dr["BKG_NO"].ToString().Trim() + "' ";
            sSql += " AND BKG_SEQ = '" + dr["BKG_SEQ"].ToString().Trim() + "' ";
            sSql += " AND MEAL_NM = '" + dr["MEAL_NM"].ToString().Trim() + "' ";

            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }



        public static bool fnDeleteBkgSvc_Query(DataRow dr)
        {
            sSql = "";

            sSql += " DELETE BKG_SVC ";
            sSql += " WHERE 1=1 ";
            sSql += " AND BKG_NO = '" + dr["BKG_NO"].ToString().Trim() + "' ";
            sSql += " AND BKG_SEQ = '" + dr["BKG_SEQ"].ToString().Trim() + "' ";
            sSql += " AND SVC_NM = '" + dr["SVC_NM"].ToString().Trim() + "' ";

            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }


        #endregion

        #region 전체 삭제
        public static bool fnAllDeleteBkgConf_Query(DataRow dr)
        {
            sSql = "";

            sSql += " DELETE BKG_CONF ";
            sSql += " WHERE 1=1 ";
            sSql += " AND BKG_NO = '" + dr["BKG_NO"].ToString().Trim() + "' ";

            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }


        public static bool fnAllDeleteBkgRoom_Query(DataRow dr)
        {
            sSql = "";

            sSql += " DELETE BKG_ROOM ";
            sSql += " WHERE 1=1 ";
            sSql += " AND BKG_NO = '" + dr["BKG_NO"].ToString().Trim() + "' ";

            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }


        public static bool fnAllDeleteBkgMeal_Query(DataRow dr)
        {
            sSql = "";

            sSql += " DELETE BKG_MEAL ";
            sSql += " WHERE 1=1 ";
            sSql += " AND BKG_NO = '" + dr["BKG_NO"].ToString().Trim() + "' ";

            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }



        public static bool fnAllDeleteBkgSvc_Query(DataRow dr)
        {
            sSql = "";

            sSql += " DELETE BKG_SVC ";
            sSql += " WHERE 1=1 ";
            sSql += " AND BKG_NO = '" + dr["BKG_NO"].ToString().Trim() + "' ";

            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }

        #endregion

        #endregion

        #endregion




        #region ※※수정 요청 화면 쿼리※※

        public static bool UpdateModFlag(DataRow dr)
        {
            sSql = "";

            sSql += "UPDATE BKG_MOD_MST SET  ";
            sSql += " MOD_YN = '"+dr["BKG_MOD_FLAG"].ToString().Trim() +"' ";
            sSql += " WHERE 1=1 ";
            sSql += " AND BKG_MOD_NO = '"+dr["BKG_MOD_NO"].ToString().Trim()+"' ";
            sSql += " AND BKG_MOD_SEQ = '" + dr["BKG_MOD_SEQ"].ToString().Trim() + "' ";

            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;

            return rtnBool;
        }

        public static bool UpdateBKGheadFlag(DataRow dr)
        {
            sSql = "";
            sSql += "UPDATE BKG_MST ";
            sSql += " SET BKG_STATUS = 'M' ";
            sSql += "   , UPD_USR = 'WEB' ";
            sSql += "   , UPD_DT = TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS') ";
            sSql += " WHERE 1=1 ";
            sSql += " AND BKG_NO = (SELECT BKG_NO FROM BKG_MOD_MST WHERE BKG_MOD_NO = '"+dr["BKG_MOD_NO"].ToString()+"')";


            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;

            return rtnBool;

        }


        #region 조회
        public static DataTable SelectBkgOrgHd_Query(DataRow dr)
        {
            sSql = "";

            sSql += "SELECT 'Q'AS INSFLAG";
            sSql += "       , BM.BKG_STATUS,  BM.BKG_NO , BM.CUST_NM, BM.CUST_TEL, BM.CUST_EMAIL , BM.TOT_AMT";
            sSql += "       , IM.ITEM_NM , IM.AREA ";
            sSql += " FROM BKG_MST BM ";
            sSql += " LEFT JOIN ITEM_MST IM ";
            sSql += " ON BM.ITEM_CD = IM.ITEM_CD ";
            sSql += " WHERE 1=1 ";
            sSql += " AND BKG_NO = '"+dr["BKG_NO"].ToString().Trim()+"' ";


            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);

            return dt;
        }
        

        public static DataTable SelectBkgModHd_Query(DataRow dr)
        {
            sSql = "";

            sSql += "SELECT 'Q'AS INSFLAG,  BMM.BKG_NO,  BMM.BKG_MOD_NO , BMM.BKG_MOD_SEQ, BMM.STRT_YMD AS STRT_DT, BMM.END_YMD AS END_DT , BMM.HEAD_CNT, BMM.MIN_PRC, BMM.MAX_PRC, BMM.RMK ";
            sSql += "   ,  B.ITEM_NM , B.AREA ";
            sSql += " FROM BKG_MOD_MST BMM";
            sSql += " LEFT JOIN (SELECT BM.BKG_NO , IM.ITEM_NM , IM.AREA FROM BKG_MST BM";
            sSql += "            LEFT JOIN ITEM_MST IM ON BM.ITEM_CD = IM.ITEM_CD ) B ";
            sSql += "   ON BMM.BKG_NO = B.BKG_NO ";
            sSql += " WHERE 1=1 ";
            sSql += " AND BMM.BKG_NO = '" + dr["BKG_NO"].ToString().Trim()+"' ";
            sSql += " AND BMM.BKG_MOD_NO = '" + dr["BKG_MOD_NO"].ToString().Trim() + "' ";
            sSql += " AND BMM.BKG_MOD_SEQ = '" + dr["BKG_MOD_SEQ"].ToString().Trim() + "' ";

            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);

            return dt;
        }

        public static DataTable SelectBkgModConf_Query(DataRow dr)
        {

            sSql = "";

            sSql += "SELECT 'Q' AS INSFLAG , MC.BKG_MOD_NO, MC.BKG_CONF_SEQ, MC.BKG_MOD_SEQ, MC.CONF_TYPE ";
            sSql += "FROM BKG_MOD_CONF MC ";
            sSql += "WHERE 1=1 ";
            //sSql += "AND BKG_NO = '"+dr["BKG_NO"].ToString().Trim()+"' ";
            sSql += "AND BKG_MOD_NO = '" + dr["BKG_MOD_NO"].ToString().Trim() + "' ";
            sSql += "AND BKG_MOD_SEQ = '" + dr["BKG_MOD_SEQ"].ToString().Trim() + "' ";

            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);

            return dt;
        }


        public static DataTable SelectBkgModRoom_Query(DataRow dr)
        {

            sSql = "";

            sSql += "SELECT 'Q' AS INSFLAG , MR.BKG_MOD_NO, MR.BKG_ROOM_SEQ, MR.BKG_MOD_SEQ, MR.ROOM_NM, MR.ROOM_CNT ";
            sSql += "FROM BKG_MOD_ROOM MR ";
            sSql += "WHERE 1=1 ";
            //sSql += "AND BKG_NO = '" + dr["BKG_NO"].ToString().Trim() + "' ";
            sSql += "AND BKG_MOD_NO = '" + dr["BKG_MOD_NO"].ToString().Trim() + "' ";
            sSql += "AND BKG_MOD_SEQ = '" + dr["BKG_MOD_SEQ"].ToString().Trim() + "' ";

            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);

            return dt;
        }


        public static DataTable SelectBkgModMeal_Query(DataRow dr)
        {
            sSql = "";

            sSql += "SELECT 'Q'AS INSFLAG , MM.BKG_MOD_NO, MM.BKG_MEAL_SEQ, MM.BKG_MOD_SEQ, MM.MEAL_NM ";
            sSql += "FROM BKG_MOD_MEAL MM ";
            sSql += "WHERE 1=1 ";
            //sSql += "AND BKG_NO = '" + dr["BKG_NO"].ToString().Trim() + "' ";
            sSql += "AND BKG_MOD_NO = '" + dr["BKG_MOD_NO"].ToString().Trim() + "' ";
            sSql += "AND BKG_MOD_SEQ = '" + dr["BKG_MOD_SEQ"].ToString().Trim() + "' ";


            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);

            return dt;
        }


        public static DataTable SelectBkgModSvc_Query(DataRow dr)
        {

            sSql = "";

            sSql += "SELECT 'Q'AS INSFLAG, MS.BKG_MOD_NO, MS.BKG_MOD_SEQ, MS.BKG_SVC_SEQ, MS.SVC_NM ";
            sSql += " FROM BKG_MOD_SVC MS ";
            sSql += "WHERE 1=1 ";
            //sSql += " AND BKG_NO = '" + dr["BKG_NO"].ToString().Trim() + "' ";
            sSql += " AND BKG_MOD_NO = '" + dr["BKG_MOD_NO"].ToString().Trim() + "' ";
            sSql += "AND BKG_MOD_SEQ = '" + dr["BKG_MOD_SEQ"].ToString().Trim() + "' ";

            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);

            return dt;
        }

        #endregion

        #endregion


        #region ※※수정요청 리스트 쿼리※※
        public static DataTable SelectModList_Query(DataRow dr)
        {
            sSql = "";

            sSql += "SELECT 'Q'AS INSFLAG, BM.BKG_NO , MM.BKG_MOD_NO, MM.BKG_MOD_SEQ , MM.MOD_YN ";
            sSql += " ,(CASE WHEN (SELECT COUNT(BKG_MOD_SEQ) FROM BKG_MOD_CONF WHERE BKG_MOD_NO = MM.BKG_MOD_NO) = 0 THEN 'N' ";
            sSql += "   WHEN (SELECT COUNT(BKG_MOD_SEQ) FROM BKG_MOD_CONF WHERE BKG_MOD_NO = MM.BKG_MOD_NO) != 0 THEN 'Y' END) AS MOD_CONF_YN ";
            sSql += " ,(CASE WHEN (SELECT COUNT(BKG_MOD_SEQ) FROM BKG_MOD_ROOM WHERE BKG_MOD_NO = MM.BKG_MOD_NO) = 0 THEN 'N' ";
            sSql += "   WHEN (SELECT COUNT(BKG_MOD_SEQ) FROM BKG_MOD_ROOM WHERE BKG_MOD_NO = MM.BKG_MOD_NO) != 0 THEN 'Y' END) AS MOD_ROOM_YN ";
            sSql += " ,(CASE WHEN (SELECT COUNT(BKG_MOD_SEQ) FROM BKG_MOD_MEAL WHERE BKG_MOD_NO = MM.BKG_MOD_NO) = 0 THEN 'N' ";
            sSql += "   WHEN (SELECT COUNT(BKG_MOD_SEQ) FROM BKG_MOD_MEAL WHERE BKG_MOD_NO = MM.BKG_MOD_NO) != 0 THEN 'Y' END) AS MOD_MEAL_YN ";
            sSql += " ,(CASE WHEN (SELECT COUNT(BKG_MOD_SEQ) FROM BKG_MOD_SVC WHERE BKG_MOD_NO = MM.BKG_MOD_NO) = 0 THEN 'N' ";
            sSql += "   WHEN (SELECT COUNT(BKG_MOD_SEQ) FROM BKG_MOD_SVC WHERE BKG_MOD_NO = MM.BKG_MOD_NO) != 0 THEN 'Y' END) AS MOD_SVC_YN ";
            sSql += " , BM.CUST_NM ";
            sSql += " , BM.CUST_TEL ";
            sSql += " , BM.CUST_EMAIL ";
            sSql += " , MM.STRT_YMD ";
            sSql += " , MM.END_YMD ";
            sSql += " , SUBSTR(MM.INS_DT,0,8) AS REQ_YMD ";
            //ekkim - 추가 로직
            sSql += " , BM.TOT_AMT ";
            sSql += " , QM.AREA ";
            sSql += " , QM.ITEM_NM ";
            sSql += "   , QM.ITEM_CD";
            //

            sSql += " FROM BKG_MOD_MST MM ";
            sSql += " LEFT JOIN BKG_MST BM ";
            sSql += "   ON MM.BKG_NO = BM.BKG_NO ";
            //ekkim - 추가 로직 
            sSql += " LEFT JOIN QUOT_MNG_MST QM ";
            sSql += "       ON BM.QUOT_NO = QM.QUOT_NO ";
            //
            sSql += " WHERE 1=1 ";
            sSql += " AND BM.BKG_STATUS != 'C' ";
            if(dr["STRT_YMD"].ToString().Trim()!= "" && dr["END_YMD"].ToString().Trim() != "")
            {
                sSql += " AND SUBSTR(MM.INS_DT,0,8) BETWEEN '"+dr["STRT_YMD"].ToString()+"' AND '" +dr["END_YMD"].ToString()+"' ";
            }
            //if (dr["STRT_YMD"].ToString().Trim() != "")
            //{
            //    sSql += " AND MM.STRT_YMD >= '" + dr["STRT_YMD"].ToString() +"'";

            //}
            //if (dr["END_YMD"].ToString().Trim() != "")
            //{
            //    sSql += " AND MM.END_YMD <= '" + dr["END_YMD"].ToString() + "'";

            //}
            if (dr["MOD_YN"].ToString().Trim() != "" && dr["MOD_YN"].ToString().Trim() != "ALL")
            {
                sSql += " AND MM.MOD_YN = '" + dr["MOD_YN"].ToString() + "'";

            }
            if (dr["CUST_NM"].ToString().Trim() != "")
            {
                sSql += " AND BM.CUST_NM = '" + dr["CUST_NM"].ToString() + "'";

            }
            if (dr["CUST_EMAIL"].ToString().Trim() != "")
            {
                sSql += " AND BM.CUST_EMAIL = '" + dr["CUST_EMAIL"].ToString() + "'";

            }
            sSql += " ORDER BY MM.INS_DT DESC ";


            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);

            return dt;
        }
        #endregion

    }
}

