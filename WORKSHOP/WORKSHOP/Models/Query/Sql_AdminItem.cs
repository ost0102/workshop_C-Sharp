using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;

namespace WORKSHOP.Models.Query
{
    public class Sql_AdminItem
    {
        static bool rtnBool = false;
        static DataTable dt = new DataTable();
        static string sSql = "";


        #region 상품 등록 쿼리
        /// <summary>
        /// MST 상품조회 쿼리
        /// </summary>
        /// <returns></returns>
        public static DataTable SelectItemInfo(DataRow dr)
        {
            sSql = " SELECT 'Q' AS INSFLAG , 'MST'AS ITEM_SEQ, A.MNGT_NO , A.ITEM_CD , A.AREA , A.ITEM_TYPE, A.ITEM_NM, A.ITEM_GRD, A.ADDR1, A.ADDR2, A.ZIPCODE, A.HOME_URL, A.RMK, A.TAG , A.USE_YN , A.USE_CNT, A.MIN_TO, A.MAX_TO,";
            sSql += "DECODE(NVL(A.REC_YN,'N'),'N',0,1) AS REC_YN , MAP_X, MAP_Y ";
            sSql += "FROM ITEM_MST A";
            sSql += " WHERE 1 = 1";
            //sSql += "   AND SUBSTR(INS_DT,0,8) BETWEEN '" + dr["START_YMD"].ToString().Trim() +"' AND '" +dr["END_YMD"].ToString()+"' ";
            if(dr["GRP_CD"].ToString().Trim() != "" && dr["GRP_CD"].ToString().Trim() != "전체")
            {
                sSql += "   AND AREA = '"+dr["GRP_CD"].ToString().Trim()+"' ";
            }
            if (dr["ITEM_NM"].ToString().Trim() != "" )
            {
                sSql += "   AND ITEM_NM LIKE '%" +dr["ITEM_NM"].ToString().Trim()+"%' ";
            }
            if (dr["ITEM_GRD"].ToString().Trim() != "" && dr["ITEM_GRD"].ToString().Trim() != "전체")
            {
                sSql += "   AND ITEM_GRD = '" + dr["ITEM_GRD"].ToString().Trim() + "' ";
            }
            //if (dr["TAG"].ToString() != "")
            //{
            //    sSql += " AND TAG LIKE '%" + dr["TAG"].ToString().Trim() + "%' ";
            //}
            if (dr["ITEM_TYPE"].ToString() != "" && dr["ITEM_TYPE"].ToString() != "전체")
            {
                sSql += " AND ITEM_TYPE = '" + dr["ITEM_TYPE"].ToString().Trim() + "' ";
            }
            if (dr["USE_YN"].ToString() != "" && dr["USE_YN"].ToString() != "A")
            {
                sSql += " AND USE_YN = '" + dr["USE_YN"].ToString().Trim() + "' ";
            }
            sSql += " ORDER BY NVL(UPD_DT,INS_DT) DESC";
            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);
            return dt;
        }


        public static DataTable SelectItemInitInfo()
        {
            sSql = " SELECT 'Q' AS INSFLAG , A.MNGT_NO , A.ITEM_CD , A.AREA , A.ITEM_TYPE, A.ITEM_NM, A.ITEM_GRD, A.ADDR1, A.ADDR2, A.ZIPCODE, A.HOME_URL, A.RMK, A.TAG , A.USE_YN , A.MIN_TO, A.MAX_TO, A.USE_CNT ,";
            sSql += "DECODE(NVL(A.REC_YN,'N'),'N',0,1) AS REC_YN ";
            sSql += "FROM ITEM_MST A";
            sSql += " WHERE 1 = 1";
            sSql += " ORDER BY NVL(UPD_DT,INS_DT) DESC";

            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);
            return dt;
        }


        public static bool InsertItemMST(DataRow dr)
        {
            sSql = "";
            sSql += " INSERT INTO ITEM_MST ";
            sSql += "   (MNGT_NO, ITEM_CD, AREA , ITEM_TYPE, ITEM_NM , ITEM_GRD, MIN_TO , MAX_TO,  ADDR1, ADDR2, ZIPCODE, HOME_URL, RMK, TAG , USE_YN , USE_CNT , REC_YN , MAP_X , MAP_Y , INS_USR , INS_DT) ";
            sSql += " VALUES ( ";
            sSql += "           '" + dr["MNGT_NO"].ToString().Trim() + "' ";
            sSql += "           , '" + dr["ITEM_CD"].ToString().Trim() + "' ";
            sSql += "           , '" + dr["AREA"].ToString().Trim() + "' ";
            sSql += "           , '" + dr["ITEM_TYPE"].ToString().Trim() + "' ";
            sSql += "           , '" + dr["ITEM_NM"].ToString().Trim() + "' ";
            sSql += "           , '" + dr["ITEM_GRD"].ToString().Trim() + "' ";
            sSql += "           , '" + dr["MIN_TO"].ToString().Trim() + "' ";
            sSql += "           , '" + dr["MAX_TO"].ToString().Trim() + "' ";
            sSql += "           , '" + dr["ADDR1"].ToString().Trim() + "' ";
            sSql += "           , '" + dr["ADDR2"].ToString().Trim() + "' ";
            sSql += "           , '" + dr["ZIPCODE"].ToString().Trim() + "' ";
            sSql += "           , '" + dr["HOME_URL"].ToString().Trim() + "' ";
            sSql += "           , '" + dr["RMK"].ToString().Trim() + "' ";
            sSql += "           , '" + dr["TAG"].ToString().Trim() + "' ";
            sSql += "           , '" + dr["USE_YN"].ToString().Trim() + "' ";
            sSql += "           , '" + dr["USE_CNT"].ToString().Trim() + "' ";
            if (dr["REC_YN"].ToString().Trim() == "1")
            {
                sSql += "           , 'Y' ";
            }
            else
            {
                sSql += "           , 'N' ";
            }

            sSql += "           , " + dr["MAP_X"].ToString().Trim();
            sSql += "           , " + dr["MAP_Y"].ToString().Trim();
            sSql += "           , 'WEB' ";
            sSql += "           , TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS') ";
            sSql += "       )";

            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }

        public static bool insertItemExcel(DataRow dr , string mngt_no)
        {
            sSql = "";
            sSql += " INSERT INTO ITEM_MST ";
            sSql += "   (MNGT_NO, ITEM_CD, AREA , ITEM_TYPE, ITEM_NM , ITEM_GRD,  ADDR1, HOME_URL , USE_YN , USE_CNT , INS_USR , INS_DT) ";
            sSql += " VALUES ( ";
            sSql += "           '" + mngt_no + "' ";
            sSql += "           , '" + mngt_no + "' ";
            sSql += "           , '" + dr["AREA"].ToString().Trim() + "' ";
            sSql += "           , '" + dr["ITEM_TYPE"].ToString().Trim() + "' ";
            sSql += "           , '" + dr["ITEM_NM"].ToString().Trim() + "' ";
            sSql += "           , '" + dr["ITEM_GRD"].ToString().Trim() + "' ";
            sSql += "           , '" + dr["ADDR1"].ToString().Trim() + "' ";
            sSql += "           , '" + dr["HOME_URL"].ToString().Trim() + "' ";
            sSql += "           , 'Y' ";
            sSql += "           , '" + dr["USE_CNT"].ToString().Trim() + "' ";
            sSql += "           , 'WEB' ";
            sSql += "           , TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS') ";
            sSql += "       )";

            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }



        public static bool UpdateItemMST(DataRow dr)
        {
            sSql = "";

            sSql += "UPDATE ITEM_MST ";
            sSql += "   SET AREA = '" + dr["AREA"].ToString().Trim() + "' ";
            sSql += "     , ITEM_TYPE = '" + dr["ITEM_TYPE"].ToString().Trim() + "' ";
            sSql += "     , ITEM_GRD = '" + dr["ITEM_GRD"].ToString().Trim() + "' ";
            sSql += "     , ITEM_NM = '" + dr["ITEM_NM"].ToString().Trim() + "' ";
            sSql += "     , MIN_TO = '" + dr["MIN_TO"].ToString().Trim() + "' ";
            sSql += "     , MAX_TO = '" + dr["MAX_TO"].ToString().Trim() + "' ";
            sSql += "     , ADDR1 = '" + dr["ADDR1"].ToString().Trim() + "' ";
            sSql += "     , ADDR2 = '" + dr["ADDR2"].ToString().Trim() + "' ";
            sSql += "     , ZIPCODE = '" + dr["ZIPCODE"].ToString().Trim() + "' ";
            sSql += "     , HOME_URL = '" + dr["HOME_URL"].ToString().Trim() + "' ";
            sSql += "     , RMK = '" + dr["RMK"].ToString().Trim() + "' ";
            sSql += "     , TAG = '" + dr["TAG"].ToString().Trim() + "' ";
            sSql += "     , USE_YN = '" + dr["USE_YN"].ToString().Trim() + "' ";
            sSql += "     , USE_CNT = '" + dr["USE_CNT"].ToString().Trim() + "' ";
            sSql += "     , MAP_X = " + dr["MAP_X"].ToString().Trim();
            sSql += "     , MAP_Y = " + dr["MAP_Y"].ToString().Trim();
            if (dr["REC_YN"].ToString().Trim() == "1")
            {
                sSql += " , REC_YN = 'Y' ";
            }
            else
            {
                sSql += "   , REC_YN =  'N' ";
            }
            
            sSql += "     , UPD_USR = 'WEB' ";
            sSql += "     , UPD_DT = TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS') ";
            sSql += " WHERE 1=1 ";
            sSql += "   AND MNGT_NO = '" + dr["MNGT_NO"].ToString().Trim() + "' ";
            sSql += "   AND ITEM_CD = '" + dr["ITEM_CD"].ToString().Trim() + "' ";

            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }

        public static bool DeleteItemMST(DataRow dr)
        {
            sSql = "";

            sSql += "DELETE ITEM_MST ";
            sSql += " WHERE 1=1 ";
            sSql += "   AND MNGT_NO = '" + dr["MNGT_NO"].ToString().Trim() + "' ";
            sSql += "   AND ITEM_CD = '" + dr["ITEM_CD"].ToString().Trim() + "' ";

            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }



        #region 세미나 정보 
        //조회
        public static DataTable SelectHotelDetail(DataRow dr)
        {
            sSql = " SELECT 'Q' AS INSFLAG, A.* ";
            sSql += " FROM ITEM_DTL_HOTEL A ";
            sSql += " WHERE 1=1 ";
            sSql += " AND ITEM_CD = '" + dr["ITEM_CD"].ToString() + "' ";
            sSql += " AND MNGT_NO = '" + dr["MNGT_NO"].ToString() + "' ";
            sSql += " ORDER BY ITEM_SEQ ";

            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);
            return dt;
        }

        //조회
        public static DataTable SelectConfDetail(DataRow dr)
        {
            sSql = " SELECT 'Q' AS INSFLAG, A.* ";
            sSql += " FROM ITEM_DTL_CONF A ";
            sSql += " WHERE 1=1 ";
            sSql += " AND ITEM_CD = '" + dr["ITEM_CD"].ToString() + "' ";
            sSql += " AND MNGT_NO = '" + dr["MNGT_NO"].ToString() + "' ";
            sSql += " ORDER BY ITEM_SEQ ";

            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);
            return dt;
        }

        // 삽입
        public static bool InsertHotelDtl(DataRow dr)
        {
            sSql = "";

            sSql += "INSERT INTO ITEM_DTL_HOTEL ";
            sSql += "   (MNGT_NO , ITEM_SEQ , ITEM_CD , HOTEL_NM, CEO , CRN , HOTEL_ADDR , HOTEL_PIC , HOTEL_TEL, HOTEL_EMAIL, RMK , INS_USR , INS_DT )";
            sSql += "   VALUES ( ";
            sSql += "           '" + dr["MNGT_NO"].ToString().Trim() + "' ";
            sSql += "           , (SELECT NVL(MAX(ITEM_SEQ),0)+1 FROM ITEM_DTL_HOTEL WHERE MNGT_NO = '" + dr["MNGT_NO"].ToString().Trim() + "') ";
            sSql += "           , '" + dr["ITEM_CD"].ToString().Trim() + "' ";
            sSql += "           , '" + dr["HOTEL_NM"].ToString().Trim() + "' ";
            sSql += "           , '" + dr["CEO"].ToString().Trim() + "' ";
            sSql += "           , '" + dr["CRN"].ToString().Trim() + "' ";
            sSql += "           , '" + dr["HOTEL_ADDR"].ToString().Trim() + "' ";
            sSql += "           , '" + dr["HOTEL_PIC"].ToString().Trim() + "' ";
            sSql += "           , '" + dr["HOTEL_TEL"].ToString().Trim() + "' ";
            sSql += "           , '" + dr["HOTEL_EMAIL"].ToString().Trim() + "' ";
            sSql += "           , '" + dr["RMK"].ToString().Trim() + "' ";
            sSql += "           , 'WEB' ";
            sSql += "           , TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS') ";
            sSql += "           ) ";


            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }


            public static bool InsertConfDtl(DataRow dr)
        {
            sSql = "";

            sSql += "INSERT INTO ITEM_DTL_CONF ";
            sSql += "   (MNGT_NO , ITEM_SEQ , ITEM_CD , CONF_TYPE, MAX_NUM , INS_USR, INS_DT, USE_YN )";
            sSql += "   VALUES ( ";
            sSql += "           '" + dr["MNGT_NO"].ToString().Trim() + "' ";
            sSql += "           , (SELECT NVL(MAX(ITEM_SEQ),0)+1 FROM ITEM_DTL_CONF WHERE MNGT_NO = '"+dr["MNGT_NO"].ToString().Trim()+"') ";
            sSql += "           , '" + dr["ITEM_CD"].ToString().Trim() + "' ";
            sSql += "           , '" + dr["CONF_TYPE"].ToString().Trim() + "' ";
            sSql += "           , '" + dr["MAX_NUM"].ToString().Trim() + "' ";
            sSql += "           , 'WEB' ";
            sSql += "           , TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS') ";
            sSql += "           , '" + dr["USE_YN"].ToString().Trim() + "' ";
            sSql += "           ) ";




            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }

        /// <summary>
        /// 세미나 업데이트
        /// </summary>
        /// <param name="dr"></param>
        /// <returns></returns>
        public static bool UpdateConfDtl(DataRow dr)
        {
            sSql = "";

            sSql += "UPDATE ITEM_DTL_CONF ";
            sSql += "   SET CONF_TYPE = '" + dr["CONF_TYPE"].ToString().Trim() + "' ";
            sSql += "     , MAX_NUM = '" + dr["MAX_NUM"].ToString().Trim() + "' ";
            sSql += "     , USE_YN = '" + dr["USE_YN"].ToString().Trim() + "' ";
            sSql += "     , UPD_USR = 'WEB'";
            sSql += "     , UPD_DT = TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS') ";
            sSql += "   WHERE 1=1 ";
            sSql += "   AND MNGT_NO = '" + dr["MNGT_NO"].ToString().Trim() + "' ";
            sSql += "   AND ITEM_SEQ = '" + dr["ITEM_SEQ"].ToString().Trim() + "' ";
            sSql += "   AND ITEM_CD = '" + dr["ITEM_CD"].ToString().Trim() + "' ";



            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }

        public static bool UpdateHotelDtl(DataRow dr)
        {
            sSql = "";

            sSql += "UPDATE ITEM_DTL_HOTEL ";
            sSql += "   SET HOTEL_NM = '" + dr["HOTEL_NM"].ToString().Trim() + "' ";
            sSql += "     , CEO = '" + dr["CEO"].ToString().Trim() + "' ";
            sSql += "     , CRN = '" + dr["CRN"].ToString().Trim() + "' ";
            sSql += "     , HOTEL_ADDR = '" + dr["HOTEL_ADDR"].ToString().Trim() + "' ";
            sSql += "     , HOTEL_PIC = '" + dr["HOTEL_PIC"].ToString().Trim() + "' ";
            sSql += "     , HOTEL_TEL = '" + dr["HOTEL_TEL"].ToString().Trim() + "' ";
            sSql += "     , HOTEL_EMAIL = '" + dr["HOTEL_EMAIL"].ToString().Trim() + "' ";
            sSql += "     , RMK = '" + dr["RMK"].ToString().Trim() + "' ";
            sSql += "     , UPD_USR = 'WEB'";
            sSql += "     , UPD_DT = TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS') ";
            sSql += "   WHERE 1=1 ";
            sSql += "   AND MNGT_NO = '" + dr["MNGT_NO"].ToString().Trim() + "' ";
            sSql += "   AND ITEM_SEQ = '" + dr["ITEM_SEQ"].ToString().Trim() + "' ";
            sSql += "   AND ITEM_CD = '" + dr["ITEM_CD"].ToString().Trim() + "' ";



            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }

        /// <summary>
        /// 세미나 삭제
        /// </summary>
        /// <param name="dr"></param>
        /// <returns></returns>
        public static bool DeleteConfDtl(DataRow dr)
        {

            sSql = "";
            sSql += " DELETE ITEM_DTL_CONF ";
            sSql += "       WHERE 1=1 ";
            sSql += "       AND MNGT_NO = '" + dr["MNGT_NO"].ToString().Trim() + "' ";
            if(dr["ITEM_SEQ"].ToString() != "MST")
            {
                sSql += "       AND ITEM_SEQ = '" + dr["ITEM_SEQ"].ToString().Trim() + "' ";
            }
            

            sSql += "       AND ITEM_CD = '" + dr["ITEM_CD"].ToString().Trim() + "' ";


            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }

        public static bool DeleteHotelDtl(DataRow dr)
        {

            sSql = "";
            sSql += " DELETE ITEM_DTL_HOTEL ";
            sSql += "       WHERE 1=1 ";
            sSql += "       AND MNGT_NO = '" + dr["MNGT_NO"].ToString().Trim() + "' ";
            if (dr["ITEM_SEQ"].ToString() != "MST")
            {
                sSql += "       AND ITEM_SEQ = '" + dr["ITEM_SEQ"].ToString().Trim() + "' ";
            }


            sSql += "       AND ITEM_CD = '" + dr["ITEM_CD"].ToString().Trim() + "' ";


            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }

        #endregion


        #region 숙박 정보
        //조회
        public static DataTable SelectRoomDetail(DataRow dr)
        {
            sSql = " SELECT 'Q' AS INSFLAG, A.* ";
            sSql += " FROM ITEM_DTL_ROOM A ";
            sSql += " WHERE 1=1 ";
            sSql += " AND ITEM_CD = '" + dr["ITEM_CD"].ToString() + "' ";
            sSql += " AND MNGT_NO = '" + dr["MNGT_NO"].ToString() + "' ";
            sSql += " ORDER BY ITEM_SEQ ";

            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);
            return dt;
        }

        /// <summary>
        /// 숙박정보 삽입
        /// </summary>
        /// <param name="dr"></param>
        /// <returns></returns>
        public static bool InsertRoomDtl(DataRow dr)
        {
            sSql = "INSERT INTO ITEM_DTL_ROOM ";
            sSql += " (MNGT_NO, ITEM_SEQ, ITEM_CD, ROOM_NM, MIN_NUM, MAX_NUM, INS_USR, INS_DT, USE_YN) ";
            sSql += " VALUES ( ";
            sSql += "           '" + dr["MNGT_NO"].ToString().Trim() + "' ";
            sSql += "           , (SELECT NVL(MAX(ITEM_SEQ),0)+1 FROM ITEM_DTL_ROOM WHERE MNGT_NO = '"+dr["MNGT_NO"].ToString().Trim()+"') ";
            sSql += "           , '" + dr["ITEM_CD"].ToString().Trim() + "' ";
            sSql += "           , '" + dr["ROOM_NM"].ToString().Trim() + "' ";
            sSql += "           , '" + dr["MIN_NUM"].ToString().Trim() + "' ";
            sSql += "           , '" + dr["MAX_NUM"].ToString().Trim() + "' ";
            sSql += "           , 'WEB' ";
            sSql += "           , TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS') ";
            sSql += "           , '" + dr["USE_YN"].ToString().Trim() + "' ";
            sSql += "           ) ";


            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }

        /// <summary>
        /// 숙박정보 업데이트
        /// </summary>
        /// <param name="dr"></param>
        /// <returns></returns>        
        public static bool UpdateRoomDtl(DataRow dr)
        {
            sSql = "";
            sSql += "UPDATE ITEM_DTL_ROOM ";
            sSql += "   SET ROOM_NM = '" + dr["ROOM_NM"].ToString().Trim() + "' ";
            sSql += "     , MIN_NUM = '" + dr["MIN_NUM"].ToString().Trim() + "' ";
            sSql += "     , MAX_NUM = '" + dr["MAX_NUM"].ToString().Trim() + "' ";
            sSql += "     , USE_YN = '" + dr["USE_YN"].ToString().Trim() + "' ";
            sSql += "     , UPD_USR = 'WEB' ";
            sSql += "     , UPD_DT = TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS')";
            sSql += "   WHERE 1=1 ";
            sSql += "   AND MNGT_NO = '" + dr["MNGT_NO"].ToString().Trim() + "' ";
            sSql += "   AND ITEM_SEQ = '" + dr["ITEM_SEQ"].ToString().Trim() + "' ";
            sSql += "   AND ITEM_CD = '" + dr["ITEM_CD"].ToString().Trim() + "' ";


            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }


        /// <summary>
        /// 숙박정보 삭제
        /// </summary>
        /// <param name="dr"></param>
        /// <returns></returns>
        public static bool DeleteRoomDtl(DataRow dr)
        {
            sSql = "";
            sSql += "DELETE ITEM_DTL_ROOM ";
            sSql += "   WHERE 1=1 ";
            sSql += "   AND MNGT_NO = '" + dr["MNGT_NO"].ToString().Trim() + "' ";
            sSql += "   AND ITEM_SEQ = '" + dr["ITEM_SEQ"].ToString().Trim() + "' ";
            sSql += "   AND ITEM_CD = '" + dr["ITEM_CD"].ToString().Trim() + "' ";

            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }


        #endregion


        #region 식사 정보
        //조회
        public static DataTable SelectMealDetail(DataRow dr)
        {
            sSql = " SELECT 'Q' AS INSFLAG, A.* ";
            sSql += " FROM ITEM_DTL_MEAL A ";
            sSql += " WHERE 1=1 ";
            sSql += " AND ITEM_CD = '" + dr["ITEM_CD"].ToString() + "' ";
            sSql += " AND MNGT_NO = '" + dr["MNGT_NO"].ToString() + "' ";
            sSql += " ORDER BY ITEM_SEQ ";

            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);
            return dt;
        }

        /// <summary>
        /// 식사 정보 삽입
        /// </summary>
        /// <param name="dr"></param>
        /// <returns></returns>
        public static bool InsertMealDtl(DataRow dr)
        {
            sSql = "";

            sSql += "INSERT INTO ITEM_DTL_MEAL ";
            sSql += " (MNGT_NO, ITEM_SEQ, ITEM_CD, MEAL_CD, MEAL_NM, INS_USR, INS_DT, USE_YN) ";
            sSql += "   VALUES ( ";
            sSql += "           '" + dr["MNGT_NO"].ToString().Trim() + "' ";
            sSql += "           , (SELECT NVL(MAX(ITEM_SEQ),0)+1 FROM ITEM_DTL_MEAL WHERE MNGT_NO = '"+dr["MNGT_NO"].ToString().Trim()+"') ";
            sSql += "           , '" + dr["ITEM_CD"].ToString().Trim() + "' ";
            sSql += "           , '" + dr["MEAL_CD"].ToString().Trim() + "' ";
            sSql += "           , '" + dr["MEAL_NM"].ToString().Trim() + "' ";
            sSql += "           , 'WEB' ";
            sSql += "           , TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS') ";
            sSql += "           , '" + dr["USE_YN"].ToString().Trim() + "' ";
            sSql += "           ) ";

            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }

        /// <summary>
        /// 식사정보 업데이트
        /// </summary>
        /// <param name="dr"></param>
        /// <returns></returns>
        public static bool UpdateMealDtl(DataRow dr)
        {
            sSql = "";
            sSql += "UPDATE ITEM_DTL_MEAL ";
            sSql += "   SET MEAL_CD = '" + dr["MEAL_CD"].ToString().Trim() + "' ";
            sSql += "     , MEAL_NM = '" + dr["MEAL_NM"].ToString().Trim() + "' ";
            sSql += "     , USE_YN = '" + dr["USE_YN"].ToString().Trim() + "' ";
            sSql += "   WHERE 1=1 ";
            sSql += "   AND MNGT_NO = '" + dr["MNGT_NO"].ToString().Trim() + "' ";
            sSql += "   AND ITEM_SEQ = '" + dr["ITEM_SEQ"].ToString().Trim() + "' ";
            sSql += "   AND ITEM_CD = '" + dr["ITEM_CD"].ToString().Trim() + "' ";


            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }

        /// <summary>
        /// 식사정보 삭제
        /// </summary>
        /// <param name="dr"></param>
        /// <returns></returns>

        public static bool DeleteMealDtl(DataRow dr)
        {
            sSql = "";
            sSql += "DELETE ITEM_DTL_MEAL ";
            sSql += "   WHERE 1=1 ";
            sSql += "   AND MNGT_NO = '" + dr["MNGT_NO"].ToString().Trim() + "' ";
            if(dr["ITEM_SEQ"].ToString() != "MST")
            {
                sSql += "   AND ITEM_SEQ = '" + dr["ITEM_SEQ"].ToString().Trim() + "' ";
            }
            

            sSql += "   AND ITEM_CD = '" + dr["ITEM_CD"].ToString().Trim() + "' ";
            
            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }

        #endregion

        #region 부가서비스 정보
        //조회
        public static DataTable SelectSVCDetail(DataRow dr)
        {
            sSql = " SELECT 'Q' AS INSFLAG, A.* ";
            sSql += " FROM ITEM_DTL_ETC A ";
            sSql += " WHERE 1=1 ";
            sSql += " AND ITEM_CD = '" + dr["ITEM_CD"].ToString() + "' ";
            sSql += " AND MNGT_NO = '" + dr["MNGT_NO"].ToString() + "' ";
            sSql += " ORDER BY ITEM_SEQ ";

            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);
            return dt;
        }

        /// <summary>
        /// 부가서비스 삽입
        /// </summary>
        /// <param name="dr"></param>
        /// <returns></returns>
        public static bool InsertSvcDtl(DataRow dr)
        {

            sSql = "";
            sSql += "INSERT INTO ITEM_DTL_ETC ";
            sSql += " (MNGT_NO, ITEM_SEQ, ITEM_CD, SVC_CD, SVC_NM, INS_USR, INS_DT, USE_YN ) ";
            sSql += " VALUES( ";
            sSql += "           '" + dr["MNGT_NO"].ToString().Trim() + "' ";
            sSql += "           , (SELECT NVL(MAX(ITEM_SEQ),0)+1 FROM ITEM_DTL_ETC WHERE MNGT_NO = '" +dr["MNGT_NO"].ToString().Trim()+"') ";
            sSql += "           , '" + dr["ITEM_CD"].ToString().Trim() + "' ";
            sSql += "           , '" + dr["SVC_CD"].ToString().Trim() + "' ";
            sSql += "           , '" + dr["SVC_NM"].ToString().Trim() + "' ";
            sSql += "           , 'WEB' ";
            sSql += "           , TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS') ";
            sSql += "           , '" + dr["USE_YN"].ToString().Trim() + "' ";
            sSql += "           ) ";

            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }

        /// <summary>
        /// 부가서비스 업데이트
        /// </summary>
        /// <param name="dr"></param>
        /// <returns></returns>
        public static bool UpdateSvcDtl(DataRow dr)
        {
            sSql = "";
            sSql += "UPDATE ITEM_DTL_ETC ";
            sSql += "   SET SVC_CD = '" + dr["SVC_CD"].ToString().Trim() + "' ";
            sSql += "     , SVC_NM = '" + dr["SVC_NM"].ToString().Trim() + "' ";
            sSql += "     , USE_YN = '" + dr["USE_YN"].ToString().Trim() + "' ";
            sSql += "     , UPD_USR = 'WEB' ";
            sSql += "     , UPD_DT = TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS')";
            sSql += "   WHERE 1=1 ";
            sSql += "   AND MNGT_NO = '" + dr["MNGT_NO"].ToString().Trim() + "' ";
            sSql += "   AND ITEM_SEQ = '" + dr["ITEM_SEQ"].ToString().Trim() + "' ";
            sSql += "   AND ITEM_CD = '" + dr["ITEM_CD"].ToString().Trim() + "' ";

            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }

        public static bool DeleteSvcDtl(DataRow dr)
        {
            sSql = "";
            sSql += "DELETE ITEM_DTL_ETC ";
            sSql += "   WHERE 1=1 ";
            sSql += "   AND MNGT_NO = '" + dr["MNGT_NO"].ToString().Trim() + "' ";
            if(dr["ITEM_SEQ"].ToString() != "MST")
            {
                sSql += "   AND ITEM_SEQ = '" + dr["ITEM_SEQ"].ToString().Trim() + "' ";
            }
            

            sSql += "   AND ITEM_CD = '" + dr["ITEM_CD"].ToString().Trim() + "' ";
            

            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }

        #endregion

        #region 이미지 정보

        public static DataTable SelectIMGDetail(DataRow dr)
        {
            sSql = "";
            sSql += "SELECT MNGT_NO, ITEM_CD, ITEM_SEQ , IMG_NM , IMG_TYPE,IMG_PATH, USE_YN ";
            sSql += "FROM ITEM_DTL_IMG ";
            sSql += "WHERE 1=1 ";
            sSql += "   AND MNGT_NO = '" + dr["MNGT_NO"].ToString().Trim() + "' ";
            sSql += "   AND ITEM_CD = '" + dr["ITEM_CD"].ToString().Trim() + "' ";
            sSql += "ORDER BY ITEM_SEQ ";

            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);
            return dt;
        }

        //삽입
        public static bool InsertImgDtl(DataRow dr)
        {
            sSql = "";
            sSql += "INSERT INTO ITEM_DTL_IMG ";
            sSql += "   (MNGT_NO, ITEM_SEQ, ITEM_CD , IMG_PATH, IMG_NM, IMG_TYPE, INS_USR, INS_DT , USE_YN ) ";
            sSql += "   VALUES( '" + dr["MNGT_NO"].ToString().Trim() + "' ";
            sSql += "       ,  (SELECT NVL(MAX(ITEM_SEQ),0)+1 FROM ITEM_DTL_IMG WHERE MNGT_NO = '"+dr["MNGT_NO"].ToString().Trim()+"') ";
            sSql += "       ,  '" + dr["ITEM_CD"].ToString().Trim() + "' ";
            sSql += "       ,  '" + dr["IMG_PATH"].ToString().Trim() + "' ";
            sSql += "       ,  '" + dr["IMG_NM"].ToString().Trim() + "' ";
            sSql += "       ,  '" + dr["IMG_TYPE"].ToString().Trim() + "' ";
            sSql += "       ,  'WEB' ";
            sSql += "       ,  TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS') ";
            sSql += "       , '"+dr["USE_YN"].ToString().Trim()+"' ";
            sSql += "   )";
            

            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }

        //업데이트
        public static bool UpdateImgDtl(DataRow dr)
        {
            sSql = "";
            sSql += "UPDATE ITEM_DTL_IMG ";
            sSql += "   SET USE_YN = '"+dr["USE_YN"].ToString()+"' ";
            sSql += "     , UPD_USR = 'WEB' ";
            sSql += "     , UPD_DT = TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS') ";
            sSql += " WHERE 1=1 ";
            sSql += "   AND MNGT_NO = '"+dr["MNGT_NO"].ToString().Trim()+"' ";
            sSql += "   AND ITEM_SEQ = '"+dr["ITEM_SEQ"].ToString().Trim()+"' ";
            sSql += "   AND ITEM_CD = '" +dr["ITEM_CD"].ToString().Trim()+"' ";

            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }

        //삭제
        public static bool DeleteImgDtl(DataRow dr)
        {
            sSql = "";
            sSql += "DELETE ITEM_DTL_IMG ";
            sSql += " WHERE 1=1 ";
            sSql += "   AND MNGT_NO = '" +dr["MNGT_NO"].ToString().Trim()+"' ";

            if (dr["ITEM_SEQ"].ToString() != "MST")
            {
                sSql += "   AND ITEM_SEQ = '" + dr["ITEM_SEQ"].ToString().Trim() + "' ";
            }
            
            
            sSql += "   AND ITEM_CD = '" + dr["ITEM_CD"].ToString().Trim() + "' ";
                        

            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }



        #endregion

        #endregion

    }
}