using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;

namespace WORKSHOP.Models.Query
{
    public class Sql_Estimate
    {
        private static string sSql = "";
        private static bool rtnBool = false;
        private static DataTable dt = new DataTable();


        public string SimpleMyQuotList_Query(DataRow dr)
        {

            sSql = "";
            sSql += "             SELECT MAX(A.STRT_YMD) AS STRT_YMD,";
            sSql += "                    MAX(A.END_YMD) AS END_YMD,";
            sSql += "                    MAX(COMM_CD) AS COMM_CD,";
            sSql += "                    MAX(A.AREA) AS AREA,";
            sSql += "                    MAX(A.HEAD_CNT) AS HEAD_CNT,";
            sSql += "                    MAX(A.MIN_PRC) AS MIN_PRC,";
            sSql += "                    MAX(A.MIN_PRC) AS MIN_PRC,";
            sSql += "                    MAX(A.RMK) AS RMK,";
            sSql += "                        A.REQ_NO,";
            sSql += "                    MAX(A.RMK) AS RMK,";
            sSql += "                     WM_CONCAT (B.SVC_NM) AS SVC_CD,";
            sSql += "                    MAX(A.QUOT_TYPE) AS QUOT_TYPE,";
            sSql += "                    WM_CONCAT(C.FILE_PATH || '/' || C.FILE_NM) AS FILE_PATH  ";
            sSql += "               FROM QUOT_REQ_MST A";
            sSql += "                    LEFT JOIN QUOT_REQ_SVC B";
            sSql += "                       ON A.REQ_NO = B.REQ_NO";
            sSql += "                    LEFT JOIN COMM_CODE C";
            sSql += "                       ON B.SVC_CD = C.COMM_CD AND C.GRP_CD = 'A5'";
            sSql += "                          WHERE     1 = 1";
            sSql += "                    AND A.REQ_EMAIL = '" + dr["REQ_EMAIL"] + "'";
            sSql += "                    GROUP BY A.REQ_NO";



            return sSql;

        }
        public string RegionView_Query(DataRow dr)
        {

            sSql = "";
            sSql += "             SELECT GRP_CD, COMM_NM ";
            sSql += "               FROM COMM_CODE ";
            sSql += "             WHERE 1=1 ";
            sSql += "                  AND GRP_CD = 'A1' ";
            sSql += "                  AND USE_YN = 'Y' ";

            return sSql;

        }
        

        public string ComPareQuotRoom_Query(DataRow dr)
        {

            sSql = "";
            sSql += " SELECT B.ROOM_NM, B.ROOM_CNT, B.PRC";
            sSql += "   FROM QUOT_MNG_MST A ";
            sSql += "   LEFT JOIN QUOT_MNG_ROOM B ";
            sSql += "             ON A.QUOT_NO = B.QUOT_NO";
            sSql += " WHERE A.QUOT_NO = '" + dr["QUOT_NO"] + "' ";

            return sSql;

        }

        public string ComPareQuotMeal_Query(DataRow dr)
        {

            sSql = "";
            sSql += " SELECT B.QUOT_SEQ,B.MEAL_NM, B.PRC";
            sSql += "   FROM QUOT_MNG_MST A ";
            sSql += "   LEFT JOIN QUOT_MNG_MEAL B ";
            sSql += "             ON A.QUOT_NO = B.QUOT_NO";
            sSql += " WHERE A.QUOT_NO = '" + dr["QUOT_NO"] + "' ";

            return sSql;

        }
        public string ComPareQuotSvc_Query(DataRow dr)
        {

            sSql = "";
            sSql += " SELECT B.QUOT_SEQ, B.SVC_NM,B.PRC, (SELECT IMG_PATH || '/' || IMG_NM FROM ITEM_DTL_IMG WHERE ITEM_CD = A.ITEM_CD AND ROWNUM = 1) AS IMG_PATH ";
            sSql += " ,(SELECT FILE_PATH || '/' || FILE_NM FROM COMM_CODE WHERE COMM_NM = B.SVC_NM AND ROWNUM = 1) AS SVC_PATH ";
            sSql += "   FROM QUOT_MNG_MST A ";
            sSql += "   LEFT JOIN QUOT_MNG_SVC B ";
            sSql += "             ON A.QUOT_NO = B.QUOT_NO";
            sSql += " WHERE A.QUOT_NO = '" + dr["QUOT_NO"] + "' ";

            return sSql;

        }

        public string ComPareQuotConf_Query(DataRow dr)
        {

            sSql = "";
            sSql += " SELECT B.QUOT_SEQ, B.CONF_TYPE, B.ITEM_CD, B.ITEM_SEQ , B.PRC";
            sSql += "   FROM QUOT_MNG_MST A ";
            sSql += "   LEFT JOIN QUOT_MNG_CONF B ";
            sSql += "             ON A.QUOT_NO = B.QUOT_NO";
            sSql += " WHERE A.QUOT_NO = '" + dr["QUOT_NO"] + "' ";

            return sSql;

        }
        public string ComPareQuotMst_Query(DataRow dr)
        {

            sSql = "";
            sSql += " SELECT A.QUOT_NO , A.TOT_AMT, A.RMK, A.ITEM_CD, A.ITEM_NM,A.TOT_AMT , A.QUOT_DT, TO_CHAR(ADD_MONTHS(A.QUOT_DT,1), 'YYYYMMDD') AS QUOT_VALDT ,A.REQ_MNGT_NO ,B.AREA, B.ITEM_TYPE , B.ITEM_GRD, B.ITEM_GRD, B.ADDR1, B.ADDR2, B.ZIPCODE, B.HOME_URL,(SELECT IMG_PATH || '/' || IMG_NM FROM ITEM_DTL_IMG WHERE ITEM_CD = A.ITEM_CD AND ROWNUM = 1) AS IMG_PATH";
            sSql += " , C.STRT_YMD, C.END_YMD , A.QUOT_STATUS , A.FILE_PATH, A.FILE_NM ,C.HEAD_CNT , (SELECT BKG_STATUS FROM BKG_MST WHERE REQ_NO = C.REQ_NO) AS REQ_STATUS";
            sSql += "   FROM QUOT_MNG_MST A ";
            sSql += "   LEFT JOIN ITEM_MST B ";
            sSql += "             ON A.ITEM_CD = B.ITEM_CD ";
            sSql += "   LEFT JOIN QUOT_REQ_MST C ";
            sSql += "             ON A.REQ_MNGT_NO = C.REQ_NO ";
            sSql += " WHERE A.QUOT_NO = '" + dr["QUOT_NO"] + "' ";

            return sSql;

        }
        public string ComPareQuotInq_Query(DataRow dr)
        {

            sSql = "";
            sSql += " SELECT INQ_TYPE, INQ_CONTENT";
            sSql += "    ,(SELECT MAX(INQ_CNT) FROM INQUIRY_MST WHERE MNGT_NO = '"+dr["QUOT_NO"]+"' AND INQ_TYPE = '"+dr["INQ_TYPE"]+"') AS INQ_CNT, INQ_YMD , ANSWER , ANS_YMD ,USER_TYPE";
            sSql += " FROM INQUIRY_MST";
            sSql += " WHERE 1=1";
            sSql += "      AND MNGT_NO = '" + dr["QUOT_NO"] + "'";
            sSql += "      AND INQ_TYPE = '" + dr["INQ_TYPE"] + "'";
            sSql += "      ORDER BY INQ_YMD";
            return sSql;

        }

        public string ComPareQuotImg_Query(DataRow dr)
        {

            sSql = "";
            sSql += " SELECT IMG_PATH , IMG_NM FROM ITEM_DTL_IMG ";
            sSql += " WHERE 1=1";
            sSql += "      AND ITEM_CD = '" + dr["ITEM_CD"] + "'";
            sSql += "      AND IMG_TYPE = 'I'";
            return sSql;

        }

        public string SimpleComPareQuotList_Query(DataRow dr)
        {

            sSql = "";
            sSql += " SELECT A.ITEM_CD, A.ITEM_NM,A.TOT_AMT ,B.AREA, B.ITEM_TYPE , B.ITEM_GRD, B.REC_YN,(SELECT NVL(MAX(INQ_CNT), 0)  FROM INQUIRY_MST WHERE MNGT_NO = A.QUOT_NO";
            sSql += ")  AS INQ_CNT,A.QUOT_NO,A.QUOT_STATUS";
            sSql += " ,(SELECT IMG_PATH || '/' || IMG_NM FROM ITEM_DTL_IMG WHERE ITEM_CD = A.ITEM_CD AND ITEM_SEQ = 1) AS IMG_PATH, (SELECT QUOT_TYPE FROM QUOT_REQ_MST WHERE REQ_NO =A.REQ_MNGT_NO) AS QUOT_TYPE";
            sSql += "   FROM QUOT_MNG_MST A ";
            sSql += "   LEFT JOIN ITEM_MST B ";
            sSql += "             ON A.ITEM_CD = B.ITEM_CD ";
            sSql += "   LEFT JOIN INQUIRY_MST C ";
            sSql += "             ON A.REQ_MNGT_NO = C.MNGT_NO ";
            sSql += " WHERE REQ_MNGT_NO = '" + dr["REQ_NO"] + "' ";

            return sSql;

        }

        public string QuotReserveSearch_Query(DataRow dr)
        {

            sSql = "";
            sSql += "SELECT REQ_NO";
            sSql += "  FROM  BKG_MST";
            sSql += " WHERE REQ_NO = '" + dr["REQ_NO"] + "'";

            return sSql;

        }
        public string QuotReserveRoomSearch_Query(DataRow dr)
        {

            sSql = "";
            sSql += "SELECT QUOT_NO, ROOM_NM, ROOM_CNT,PRC";
            sSql += "  FROM  QUOT_MNG_ROOM";
            sSql += " WHERE QUOT_NO = '" + dr["QUOT_NO"] + "'";

            return sSql;

        }

        public string QuotReserveMealSearch_Query(DataRow dr)
        {

            sSql = "";
            sSql += "SELECT QUOT_NO,MEAL_CD,MEAL_NM,PRC";
            sSql += "  FROM  QUOT_MNG_MEAL";
            sSql += " WHERE QUOT_NO = '" + dr["QUOT_NO"] + "'";


            return sSql;

        }
        public string QuotReserveSvcSearch_Query(DataRow dr)
        {

            sSql = "";
            sSql += "SELECT QUOT_NO, SVC_CD, SVC_NM,PRC";
            sSql += "  FROM  QUOT_MNG_SVC";
            sSql += " WHERE QUOT_NO = '" + dr["QUOT_NO"] + "'";

            return sSql;

        }

        public string QuotReserveConfSearch_Query(DataRow dr)
        {

            sSql = "";
            sSql += "SELECT QUOT_NO, CONF_TYPE, ITEM_CD, ITEM_SEQ, PRC";
            sSql += "  FROM  QUOT_MNG_CONF";
            sSql += " WHERE QUOT_NO = '" + dr["QUOT_NO"] + "'";


            return sSql;

        }

        public string QuotReserve_Query(DataRow dr)
        {

            sSql = "";
            sSql += "INSERT INTO BKG_MST (BKG_NO , ITEM_CD , QUOT_NO , REQ_NO , TOT_AMT , RMK , STRT_DT , END_DT , INS_USR ,INS_DT , CUST_NM, CUST_EMAIL, CUST_TEL,HEAD_CNT,GRP_CD)";
            sSql += "SELECT '" + dr["BKG_NO"] + "' ";
            sSql += "     , A.ITEM_CD";
            sSql += "     , QUOT_NO";
            sSql += "     , REQ_MNGT_NO";
            sSql += "     , TOT_AMT ";
            sSql += "     , A.RMK";
            sSql += "     , STRT_YMD";
            sSql += "     , END_YMD";
            sSql += "     , '" + dr["INS_USR"] + "'";
            sSql += "     , TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS')";
            sSql += "     , '" + dr["CUST_NM"] + "'";
            sSql += "     , '" + dr["CUST_EMAIL"] + "'";
            sSql += "     , '" + dr["CUST_TEL"] + "'";
            sSql += "     , B.HEAD_CNT ";
            sSql += "     , B.GRP_CD ";
            sSql += "FROM QUOT_MNG_MST A";
            sSql += "        LEFT OUTER JOIN QUOT_REQ_MST B ON B.REQ_NO = A.REQ_MNGT_NO ";
            sSql += "WHERE QUOT_NO = '" + dr["QUOT_NO"] + "'";

            return sSql;

        }
        public string QuotReserveRoom_Query(DataRow dr, DataRow dr1)
        {
            sSql = "";
            sSql += " INSERT INTO BKG_ROOM (BKG_NO,";
            sSql += "                       BKG_SEQ,";
            sSql += "                       ROOM_NM,";
            sSql += "                       ROOM_CNT,";
            sSql += "                       PRC,";
            sSql += "                       INS_USR,";
            sSql += "                       INS_DT)";
            sSql += " VALUES (";
            sSql += " '" + dr1["BKG_NO"] + "',";
            sSql += " (SELECT NVL(MAX(BKG_SEQ),0) + 1 FROM BKG_ROOM WHERE BKG_NO = '" + dr1["BKG_NO"] + "'),";
            sSql += " '" + dr["ROOM_NM"] + "',";
            sSql += " '" + dr["ROOM_CNT"] + "',";
            sSql += " '" + dr["PRC"] + "',";
            sSql += " '" + dr1["INS_USR"] + "',";
            sSql += "  TO_CHAR(SYSDATE, 'YYYYMMDDHH24MISS')";
            sSql += " )";

            return sSql;

        }
        public string QuotReserveMeal_Query(DataRow dr, DataRow dr1)
        {

            sSql = "";
            sSql += " INSERT INTO BKG_MEAL (BKG_NO,";
            sSql += "                       BKG_SEQ,";
            sSql += "                       MEAL_CD,";
            sSql += "                       MEAL_NM,";
            sSql += "                       PRC,";
            sSql += "                       INS_USR,";
            sSql += "                       INS_DT)";
            sSql += " VALUES (";
            sSql += " '" + dr1["BKG_NO"] + "',";
            sSql += " (SELECT NVL(MAX(BKG_SEQ),0) + 1 FROM BKG_MEAL WHERE BKG_NO = '" + dr1["BKG_NO"] + "'),";
            sSql += " '" + dr["MEAL_CD"] + "',";
            sSql += " '" + dr["MEAL_NM"] + "',";
            sSql += " '" + dr["PRC"] + "',";
            sSql += " '" + dr1["INS_USR"] + "',";
            sSql += "  TO_CHAR(SYSDATE, 'YYYYMMDDHH24MISS')";
            sSql += " )";

            return sSql;

        }
        public string QuotReserveSvc_Query(DataRow dr, DataRow dr1)
        {

            sSql = "";
            sSql += " INSERT INTO BKG_SVC (BKG_NO,";
            sSql += "                       BKG_SEQ,";
            sSql += "                       SVC_CD,";
            sSql += "                       SVC_NM,";
            sSql += "                       PRC,";
            sSql += "                       INS_USR,";
            sSql += "                       INS_DT)";
            sSql += " VALUES (";
            sSql += " '" + dr1["BKG_NO"] + "',";
            sSql += " (SELECT NVL(MAX(BKG_SEQ),0) + 1 FROM BKG_SVC WHERE BKG_NO = '" + dr1["BKG_NO"] + "'),";
            sSql += " '" + dr["SVC_CD"] + "',";
            sSql += " '" + dr["SVC_NM"] + "',";
            sSql += " '" + dr["PRC"] + "',";
            sSql += " '" + dr1["INS_USR"] + "',";
            sSql += "  TO_CHAR(SYSDATE, 'YYYYMMDDHH24MISS')";
            sSql += " )";

            return sSql;

        }
        public string QuotReserveConf_Query(DataRow dr, DataRow dr1)
        {

            sSql = "";
            sSql += " INSERT INTO BKG_CONF (BKG_NO,";
            sSql += "                       BKG_SEQ,";
            sSql += "                       ITEM_CD,";
            sSql += "                       ITEM_SEQ,";
            sSql += "                       CONF_TYPE,";
            sSql += "                       PRC,";
            sSql += "                       INS_USR,";
            sSql += "                       INS_DT)";
            sSql += " VALUES (";
            sSql += " '" + dr1["BKG_NO"] + "',";
            sSql += " (SELECT NVL(MAX(BKG_SEQ),0) + 1 FROM BKG_CONF WHERE BKG_NO = '" + dr1["BKG_NO"] + "'),";
            sSql += " '" + dr["ITEM_CD"] + "',";
            sSql += " '" + dr["ITEM_SEQ"] + "',";
            sSql += " '" + dr["CONF_TYPE"] + "',";
            sSql += " '" + dr["PRC"] + "',";
            sSql += " '" + dr1["INS_USR"] + "',";
            sSql += "  TO_CHAR(SYSDATE, 'YYYYMMDDHH24MISS')";
            sSql += " )";

            return sSql;

        }
        public string QuotReserveComUpadate_Query(DataRow dr)
        {

            sSql = "";
            sSql += " UPDATE  QUOT_REQ_MST SET STATUS = 'Y' WHERE REQ_NO ='" + dr["REQ_NO"] + "'";

            return sSql;

        }
        public string QuotReserveHeadUpdate_Query(DataRow dr)
        {

            sSql = "";
            sSql += " UPDATE  QUOT_MNG_MST SET QUOT_STATUS = 'Y' WHERE QUOT_NO ='" + dr["QUOT_NO"] + "'";

            return sSql;

        }

        public string QuotInquire_Query(DataRow dr)
        {

            sSql = "";
            sSql += " INSERT INTO INQUIRY_MST ";
            sSql += "      (MNGT_NO , MNGT_SEQ, INQ_TYPE, INQ_CONTENT, INQ_CNT , INQ_USR, INQ_YMD, USER_TYPE)";
            sSql += "      VALUES (";
            sSql += "        '" + dr["QUOT_NO"] + "'";
            sSql += " ,(SELECT  NVL(MAX(MNGT_SEQ),0) + 1 FROM INQUIRY_MST WHERE MNGT_NO = '" + dr["QUOT_NO"] + "')";
            sSql += "      , '" + dr["INQ_TYPE"] + "'";
            sSql += "      , '" + dr["INQ_CONTENT"] + "'"; ;
            sSql += " ,(SELECT  NVL(MAX(INQ_CNT),0) + 1 FROM INQUIRY_MST WHERE MNGT_NO = '" + dr["QUOT_NO"] + "')";
            sSql += "      , '" + dr["INQ_USR"] + "'";
            sSql += "      , TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS')";
            sSql += "      , 'U'";
            sSql += "      )";
            return sSql;

        }

        public string QuotInquireDetail_Query(DataRow dr)
        {

            sSql = "";
            sSql += " SELECT INQ_TYPE, INQ_CONTENT ";
            sSql += " ,(SELECT MAX(INQ_CNT) FROM INQUIRY_MST WHERE MNGT_NO = '"+ dr["QUOT_NO"] + "')AS  INQ_CNT, INQ_YMD, ANSWER, ANS_YMD, USER_TYPE";
            sSql += " FROM INQUIRY_MST";
            sSql += " WHERE 1=1";
            sSql += "      AND MNGT_NO = '" + dr["QUOT_NO"] + "'";
            if (dr.Table.Columns.Contains("INQ_TYPE"))
            {
                if (dr["INQ_TYPE"].ToString() != "")
                {
                    sSql += "      AND INQ_TYPE = '" + dr["INQ_TYPE"] + "'";
                }
            }
            sSql += "      ORDER BY INQ_YMD";
            return sSql;

        }

        public string EstimateRoom_Query(DataRow dr)
        {

            sSql = "";
            sSql += " SELECT ROOM_NM, ROOM_CNT";
            sSql += "   FROM QUOT_REQ_ROOM A ";
            sSql += "   LEFT JOIN QUOT_REQ_MST B";
            sSql += "    ON A.REQ_NO = B.REQ_NO";
            sSql += "    WHERE A.REQ_NO ='" + dr["REQ_NO"] + "'";
            return sSql;

        }

        public string EstimateMeal_Query(DataRow dr)
        {

            sSql = "";
            sSql += "     SELECT MEAL_NM";
            sSql += "   FROM QUOT_REQ_MEAL A ";
            sSql += "   LEFT JOIN QUOT_REQ_MST B";
            sSql += "    ON A.REQ_NO = B.REQ_NO";
            sSql += "    WHERE A.REQ_NO ='" + dr["REQ_NO"] + "'";

            return sSql;

        }

        public string EstimateConf_Query(DataRow dr)
        {

            sSql = "";
            sSql += " SELECT CONF_TYPE ";
            sSql += "   FROM QUOT_REQ_CONF A ";
            sSql += "   LEFT JOIN QUOT_REQ_MST B";
            sSql += "    ON A.REQ_NO = B.REQ_NO";
            sSql += "    WHERE A.REQ_NO ='" + dr["REQ_NO"] + "'";
            return sSql;

        }

        public string EstimateSvc_Query(DataRow dr)
        {

            sSql = "";
            sSql += " SELECT SVC_NM ,REQ_SEQ";
            sSql += "   FROM QUOT_REQ_SVC A ";
            sSql += "   LEFT JOIN QUOT_REQ_MST B";
            sSql += "    ON A.REQ_NO = B.REQ_NO";
            sSql += "    WHERE A.REQ_NO ='" + dr["REQ_NO"] + "'";
            return sSql;

        }

        public string EstimateSearch_Query(DataRow dr)
        {
            sSql = "";
            sSql += "             SELECT MAX(A.STRT_YMD) AS STRT_YMD,";
            sSql += "                    MAX(A.END_YMD) AS END_YMD,";
            sSql += "                    MAX(COMM_CD) AS COMM_CD,";
            sSql += "                    MAX(A.AREA) AS AREA,";
            sSql += "                    MAX(A.HEAD_CNT) AS HEAD_CNT,";
            sSql += "                    MAX(A.QUOT_TYPE) AS QUOT_TYPE,";
            sSql += "                    MAX(A.MIN_PRC) AS MIN_PRC,";
            sSql += "                    MAX(A.MAX_PRC) AS MAX_PRC,";
            sSql += "                        A.REQ_NO,";
            sSql += "                    MAX(A.RMK) AS RMK,";
            sSql += "                    MAX(A.STATUS) AS STATUS,";
            sSql += "                     WM_CONCAT (B.SVC_NM) AS SVC_CD,";
            sSql += "                    WM_CONCAT(C.FILE_PATH || '/' || C.FILE_NM) AS FILE_PATH, ";
            sSql += "                    MAX(A.INS_DT) AS INS_DT, ";
            sSql += "              (SELECT WM_CONCAT(CONF_TYPE) FROM QUOT_REQ_CONF  WHERE REQ_NO = A.REQ_NO) AS CONF_TYPE,";
            sSql += "              (SELECT WM_CONCAT(ROOM_NM) FROM QUOT_REQ_ROOM  WHERE REQ_NO = A.REQ_NO) AS ROOM_NM,";
            sSql += "              (SELECT WM_CONCAT(ROOM_CNT) FROM QUOT_REQ_ROOM  WHERE REQ_NO = A.REQ_NO) AS ROOM_CNT,";
            sSql += "              (SELECT WM_CONCAT(MEAL_NM) FROM QUOT_REQ_MEAL  WHERE REQ_NO = A.REQ_NO) AS MEAL_NM,";
            sSql += "              (SELECT WM_CONCAT(SVC_NM) FROM QUOT_REQ_SVC  WHERE REQ_NO = A.REQ_NO) AS SVC_NM,";
            sSql += "              MAX(A.FILE_PATH)  AS QUOT_FILE_PATH,";  //************************ 지워져있었음
            sSql += "              MAX(A.FILE_NM)   AS QUOT_FILE_NM,"; //************************ 지워져있었음
            sSql += "              MAX((SELECT IMG_PATH || '/' || IMG_NM FROM ITEM_DTL_IMG WHERE ITEM_CD = A.ITEM_CD AND ITEM_SEQ = 1)) AS IMG_PATH";
            sSql += "               FROM QUOT_REQ_MST A";
            sSql += "                    LEFT JOIN QUOT_REQ_SVC B";
            sSql += "                       ON A.REQ_NO = B.REQ_NO";
            sSql += "                    LEFT JOIN COMM_CODE C";
            sSql += "                       ON B.SVC_CD = C.COMM_CD AND C.GRP_CD = 'A5'";
            sSql += "                          WHERE     1 = 1";
            if (dr["GRP_CD"].ToString() != "")
            {
                sSql += "                           AND (A.GRP_CD = '" + dr["GRP_CD"] + "' OR A.REQ_EMAIL = '" + dr["REQ_EMAIL"] + "')";
            }
            else
            {
                sSql += "                           AND A.REQ_EMAIL = '" + dr["REQ_EMAIL"] + "'";
            }
            if (dr["MNGT_NO"].ToString() != "") {
                sSql += "               AND A.REQ_NO = '" + dr["MNGT_NO"].ToString() + "'";
            }
            else
            {
                if (dr["QUOT_TYPE"].ToString() != "")
                {
                    if (dr["QUOT_TYPE"].ToString() == "A")
                    {
                        sSql += "                           AND A.QUOT_TYPE = '" + dr["QUOT_TYPE"] + "' ";
                        if (dr["STATUS"].ToString() != "") { 
                            if (dr["STATUS"].ToString() == "Y")
                        {
                            sSql += "                           AND A.FILE_PATH IS NOT NULL";
                        }
                        else if(dr["STATUS"].ToString() == "N")
                        {
                            sSql += "                           AND A.FILE_PATH IS NULL";
                        }
                        }
                    }
                    else if(dr["QUOT_TYPE"].ToString() == "B")
                    {
                            sSql += "                           AND A.QUOT_TYPE = '" + dr["QUOT_TYPE"] + "' ";
                        if (dr["STATUS"].ToString() != "")
                        { 
                            sSql += "                           AND A.STATUS = '" + dr["STATUS"] + "'";
                        }
                    }
                }
                if (dr["AREA"].ToString() != "" && dr["AREA"].ToString() != "ALL")
                {
                    sSql += "                           AND A.AREA = '" + dr["AREA"] + "'";
                }
                if(dr["STRT_YMD"].ToString() != "" && dr["END_YMD"].ToString() != "")
                {
                    sSql += " AND ((SUBSTR (A.INS_DT, 0, 8) BETWEEN '" + dr["STRT_YMD"].ToString() + "' AND '" + dr["END_YMD"].ToString() + "')";
                    sSql += " OR (A.STRT_YMD BETWEEN '" + dr["STRT_YMD"].ToString() + "' AND '" + dr["END_YMD"].ToString() + "')";
                    sSql += " OR (A.END_YMD BETWEEN '" + dr["STRT_YMD"].ToString() + "' AND '" + dr["END_YMD"].ToString() + "'))";
                }
            }
            sSql += "                    GROUP BY A.REQ_NO";
            sSql += "                    ORDER BY INS_DT DESC";
            return sSql;

        }
        
        public string QuotComplete_Query(DataRow dr)
        {
            sSql = "";
            sSql += "             SELECT MAX(A.STRT_YMD) AS STRT_YMD,";
            sSql += "                    MAX(A.END_YMD) AS END_YMD,";
            sSql += "                    MAX(COMM_CD) AS COMM_CD,";
            sSql += "                    MAX(A.AREA) AS AREA,";
            sSql += "                    MAX(A.HEAD_CNT) AS HEAD_CNT,";
            sSql += "                        A.REQ_NO,";
            sSql += "                    MAX(A.RMK) AS RMK,";
            sSql += "                    MAX(A.STATUS) AS STATUS,";
            sSql += "                    MAX(A.MAX_PRC) AS MAX_PRC,";
            sSql += "                    MAX(A.MIN_PRC) AS MIN_PRC,";
            sSql += "                     WM_CONCAT (B.SVC_NM) AS SVC_CD,";
            sSql += "                    WM_CONCAT(C.FILE_PATH || '/' || C.FILE_NM) AS FILE_PATH  ";
            sSql += "               FROM QUOT_REQ_MST A";
            sSql += "                    LEFT JOIN QUOT_REQ_SVC B";
            sSql += "                       ON A.REQ_NO = B.REQ_NO";
            sSql += "                    LEFT JOIN COMM_CODE C";
            sSql += "                       ON B.SVC_CD = C.COMM_CD AND C.GRP_CD = 'A5'";
            sSql += "                          WHERE     1 = 1";
            sSql += "                           AND A.REQ_EMAIL = '" + dr["REQ_EMAIL"] + "'";
            sSql += "                           AND A.QUOT_TYPE = '" + dr["QUOT_TYPE"] + "' ";
            sSql += "                           AND A.AREA = '" + dr["AREA"] + "'";
            sSql += "                           AND A.STRT_YMD >= '" + dr["STRT_YMD"] + "' ";
            sSql += "                           AND A.END_YMD <= '" + dr["END_YMD"] + "' ";
            if (dr["STATUS"].ToString() != "")
            {
                sSql += "                           AND A.STATUS = 'Y' ";
            }
            if (dr["USER_TYPE"].ToString() != "")
            {
                sSql += "                           AND A.USER_TYPE = '" + dr["USER_TYPE"] + "' ";
            }
            sSql += "                    GROUP BY A.REQ_NO";
            return sSql;

        }
        public string HomeEstimateIteminfo_Query(DataRow dr)
        {
            sSql = "";
            sSql += "SELECT IM.AREA,";
            sSql += "       IM.ITEM_NM,";
            sSql += "       IM.ITEM_CD, ";
            sSql += "       IM.ITEM_GRD,";
            sSql += "       IM.ADDR1,";
            sSql += "       IM.ADDR2,";
            sSql += "       IM.TAG,";
            sSql += "       IM.HOME_URL,";
            sSql += "       IDI.IMG_PATH,";
            sSql += "       IDI.IMG_NM,";
            sSql += "       IDI.IMG_TYPE";
            sSql += "  FROM ITEM_MST IM";
            sSql += "  LEFT JOIN ITEM_DTL_IMG IDI";
            sSql += "         ON IM.ITEM_CD = IDI.ITEM_CD";
            sSql += "      WHERE 1 = 1";
            sSql += "        AND IM.ITEM_CD = '" + dr["ITEM_CD"].ToString() + "'";
            sSql += "  ORDER BY IMG_TYPE , ITEM_SEQ ";

            return sSql; 
        }

        public string HomeEstimateconfinfo_Query(DataRow dr)
        {
            sSql = "";
            sSql += "SELECT IDC.MNGT_NO,";
            sSql += "       IDC.ITEM_SEQ,";
            sSql += "       IDC.ITEM_CD, ";
            sSql += "       IDC.CONF_TYPE,";
            sSql += "       IDC.MAX_NUM,";
            sSql += "       IDC.USE_YN";
            sSql += "  FROM ITEM_DTL_CONF IDC";
            sSql += "  LEFT JOIN ITEM_MST IM";
            sSql += "         ON IDC.ITEM_CD = IM.ITEM_CD";
            sSql += "      WHERE 1 = 1";
            sSql += "        AND IDC.USE_YN = 'Y' ";
            sSql += "        AND IDC.ITEM_CD = '" + dr["ITEM_CD"].ToString() + "'";
            sSql += "      ORDER BY IDC.ITEM_SEQ";

            return sSql;
        }

        public string HomeEstimateetcinfo_Query(DataRow dr)
        {
            sSql = "";
            sSql += "SELECT IDE.MNGT_NO,";
            sSql += "       IDE.ITEM_SEQ,";
            sSql += "       IDE.ITEM_CD, ";
            sSql += "       IDE.SVC_CD,";
            sSql += "       IDE.SVC_NM,";
            sSql += "       IDE.USE_YN";
            sSql += "  FROM ITEM_DTL_ETC IDE";
            sSql += "  LEFT JOIN ITEM_MST IM";
            sSql += "         ON IDE.ITEM_CD = IM.ITEM_CD";
            sSql += "      WHERE 1 = 1";
            sSql += "        AND IDE.USE_YN = 'Y' ";
            sSql += "        AND IDE.ITEM_CD = '" + dr["ITEM_CD"].ToString() + "'";
            sSql += "      ORDER BY IDE.ITEM_SEQ";

            return sSql;
        }

        public string HomeEstimateroominfo_Query(DataRow dr)
        {
            sSql = "";
            sSql += "SELECT IDR.MNGT_NO,";
            sSql += "       IDR.ITEM_SEQ,";
            sSql += "       IDR.ITEM_CD, ";
            sSql += "       IDR.ROOM_NM,";
            sSql += "       IDR.MIN_NUM,";
            sSql += "       IDR.MAX_NUM,";
            sSql += "       IDR.USE_YN";
            sSql += "  FROM ITEM_DTL_ROOM IDR";
            sSql += "  LEFT JOIN ITEM_MST IM";
            sSql += "         ON IDR.ITEM_CD = IM.ITEM_CD";
            sSql += "      WHERE 1 = 1";
            sSql += "        AND IDR.USE_YN = 'Y' ";
            sSql += "        AND IDR.ITEM_CD = '" + dr["ITEM_CD"].ToString() + "'";
            sSql += "      ORDER BY IDR.ITEM_SEQ";

            return sSql;
        }

        public string ModifyRoom_Query(DataRow dr)
        {
            sSql = "";

            sSql += "SELECT IDR.ITEM_SEQ, IDR.ROOM_NM , IM.ITEM_NM , NVL(BK_D.ROOM_CNT,0) AS ROOM_CNT ,BK_D.BKG_SEQ   ";
            sSql += "FROM ITEM_DTL_ROOM IDR                                                              ";
            sSql += "LEFT JOIN ITEM_MST IM                                                               ";
            sSql += "   ON IM.MNGT_NO = IDR.MNGT_NO                                                         ";
            sSql += "LEFT OUTER JOIN (SELECT BM.BKG_NO , BR.BKG_SEQ , BM.ITEM_CD , BR.ROOM_NM , BR.ROOM_CNT           ";
            sSql += "                   FROM BKG_ROOM BR                                                                    ";
            sSql += "                   LEFT JOIN BKG_MST BM                                                                ";
            sSql += "                   ON BM.BKG_NO = BR.BKG_NO                                                            ";
            sSql += "                   WHERE BM.ITEM_CD = '"+dr["ITEM_CD"].ToString()+"'                                          ";
            sSql += "                   AND BM.BKG_NO = '"+dr["BKG_NO"].ToString()+"') BK_D                                        ";
            sSql += "ON IDR.ROOM_NM = BK_D.ROOM_NM                                                       ";
            sSql += "WHERE IDR.MNGT_NO = '"+dr["ITEM_CD"].ToString()+"'                                         ";
            sSql += "AND IDR.USE_YN = 'Y'                                                                ";
            sSql += " ORDER BY IDR.ITEM_SEQ                                                              ";

            return sSql;
        }


        public string ModifyConf_Query(DataRow dr)
        {
            sSql = "";

            sSql += "SELECT IDR.ITEM_SEQ, IDR.CONF_TYPE , IM.ITEM_NM , NVL(BK_D.CONF_ON,'N') AS CONF_ON, IDR.MAX_NUM, BK_D.BKG_SEQ ";
            sSql += "FROM ITEM_DTL_CONF IDR                                                              ";
            sSql += "LEFT JOIN ITEM_MST IM                                                               ";
            sSql += "ON IM.MNGT_NO = IDR.MNGT_NO                                                         ";
            sSql += "LEFT OUTER JOIN (SELECT BM.BKG_NO , BM.ITEM_CD , BR.BKG_SEQ , BR.CONF_TYPE , 'Y' AS CONF_ON      ";
            sSql += "FROM BKG_CONF BR                                                                    ";
            sSql += "LEFT JOIN BKG_MST BM                                                                ";
            sSql += "ON BM.BKG_NO = BR.BKG_NO                                                            ";
            sSql += "WHERE BM.ITEM_CD = '"+dr["ITEM_CD"].ToString()+"'                                          ";
            sSql += "AND BM.BKG_NO = '"+dr["BKG_NO"].ToString()+"') BK_D                                        ";
            sSql += "ON IDR.CONF_TYPE = BK_D.CONF_TYPE                                                   ";
            sSql += "WHERE IDR.MNGT_NO = '"+dr["ITEM_CD"].ToString()+"'                                         ";
            sSql += "AND IDR.USE_YN = 'Y'                                                                ";
            sSql += " ORDER BY IDR.ITEM_SEQ                                                              ";
            return sSql;
        }

        public string ModifyMeal_Query(DataRow dr)
        {
            sSql = "";

            sSql += "SELECT IDM.ITEM_SEQ, IDM.MEAL_NM , IM.ITEM_NM , NVL(BK_D.MEAL_YN,'N') AS MEAL_YN , NVL(BK_D.PRC,0) AS PRC ,BK_D.BKG_SEQ  ";
            sSql += "FROM ITEM_DTL_MEAL IDM                                                                                    ";
            sSql += "LEFT JOIN ITEM_MST IM                                                                                     ";
            sSql += "ON IM.MNGT_NO = IDM.MNGT_NO                                                                               ";
            sSql += "LEFT OUTER JOIN (SELECT BM.BKG_NO , BM.ITEM_CD , BDM.BKG_SEQ , BDM.MEAL_NM , BDM.PRC ,'Y' AS MEAL_YN                    ";
            sSql += "FROM BKG_MEAL BDM                                                                                         ";
            sSql += "LEFT JOIN BKG_MST BM                                                                                      ";
            sSql += "ON BM.BKG_NO = BDM.BKG_NO                                                                                 ";
            sSql += "WHERE BM.ITEM_CD = '" + dr["ITEM_CD"].ToString() + "'                                                                ";
            sSql += "AND BM.BKG_NO = '" + dr["BKG_NO"].ToString() + "') BK_D                                                              ";
            sSql += "ON IDM.MEAL_NM = BK_D.MEAL_NM                                                                             ";
            sSql += "WHERE IDM.MNGT_NO = '" + dr["ITEM_CD"].ToString() + "'                                                               ";
            sSql += "AND IDM.USE_YN = 'Y'                                                                                      ";
            sSql += " ORDER BY IDM.ITEM_SEQ                                                              ";
            return sSql;
        }

        public string ModifySvc_Query(DataRow dr)
        {
            sSql = "";

            sSql += "SELECT IDE.SVC_NM , IDE.ITEM_SEQ , IM.ITEM_NM , BK_D.PRC , NVL(BK_D.SVC_YN,'N') AS SVC_YN , BK_D.BKG_SEQ    ";
            sSql += "FROM ITEM_DTL_ETC IDE                                                                         ";
            sSql += "LEFT JOIN ITEM_MST IM                                                                         ";
            sSql += "ON IM.MNGT_NO = IDE.MNGT_NO                                                                   ";
            sSql += "LEFT JOIN (SELECT BM.BKG_NO , BS.BKG_SEQ ,BM.ITEM_CD , BS.SVC_NM , BS.PRC , 'Y'AS SVC_YN                  ";
            sSql += "FROM BKG_SVC BS                                                                               ";
            sSql += "LEFT JOIN BKG_MST BM                                                                          ";
            sSql += "ON BM.BKG_NO = BS.BKG_NO                                                                      ";
            sSql += "WHERE BM.ITEM_CD = '" + dr["ITEM_CD"].ToString() + "'                                               ";
            sSql += "AND BM.BKG_NO = '" + dr["BKG_NO"].ToString() + "')BK_D                                                 ";
            sSql += "ON IDE.SVC_NM = BK_D.SVC_NM                                                                   ";
            sSql += "WHERE IDE.MNGT_NO = '"+dr["ITEM_CD"].ToString()+"'                                                   ";
            sSql += "AND IDE.USE_YN = 'Y'                                                                                      ";
            sSql += " ORDER BY IDE.ITEM_SEQ                                                              ";
            return sSql;
        }

        public string HomeEstimatemealinfo_Query(DataRow dr)
        {
            sSql = "";
            sSql += "SELECT IDM.MNGT_NO,";
            sSql += "       IDM.ITEM_SEQ,";
            sSql += "       IDM.ITEM_CD, ";
            sSql += "       IDM.MEAL_CD,";
            sSql += "       IDM.MEAL_NM,";
            sSql += "       IDM.USE_YN";
            sSql += "  FROM ITEM_DTL_MEAL IDM";
            sSql += "  LEFT JOIN ITEM_MST IM";
            sSql += "         ON IDM.ITEM_CD = IM.ITEM_CD";
            sSql += "      WHERE 1 = 1";
            sSql += "        AND IDM.USE_YN = 'Y' ";
            sSql += "        AND IDM.ITEM_CD = '" + dr["ITEM_CD"].ToString() + "'";
            sSql += "      ORDER BY IDM.ITEM_SEQ";

            return sSql;
        }

        //메인
        public string HomeEstimateMain_Query(DataRow dr)
        {

            sSql = "";
            sSql += "INSERT INTO QUOT_REQ_MST";
            sSql += " (REQ_NO, QUOT_TYPE, AREA, ITEM_CD, ITEM_NM, STRT_YMD, END_YMD, MIN_PRC, MAX_PRC, HEAD_CNT, RMK, REQ_NM, REQ_EMAIL, REQ_CUST_NM, REQ_TEL, INS_USR, INS_DT, USER_TYPE, EST_YN,GRP_CD)";
            sSql += "VALUES ( ";
            sSql += " '" + dr["REQ_NO"].ToString() + "'";
            sSql += " , 'B'";
            sSql += " , '" + dr["AREA"].ToString() + "'";
            sSql += " , '" + dr["ITEM_CD"].ToString() + "'";
            sSql += " , '" + dr["ITEM_NM"].ToString() + "'";
            sSql += " , '" + dr["STRT_YMD"].ToString() + "'";
            sSql += " , '" + dr["END_YMD"].ToString() + "'";
            sSql += " , '" + dr["MIN_PRC"].ToString() + "'";
            sSql += " , '" + dr["MAX_PRC"].ToString() + "'";
            sSql += " , '" + dr["HEAD_CNT"].ToString() + "'";
            sSql += " , '" + dr["RMK"].ToString() + "'";
            sSql += " , '" + dr["REQ_NM"].ToString() + "'";
            sSql += " , '" + dr["REQ_EMAIL"].ToString() + "'";
            sSql += " , '" + dr["REQ_CUST_NM"].ToString() + "'";
            sSql += " , '" + dr["REQ_TEL"].ToString() + "'";
            sSql += " , '" + dr["REQ_NM"].ToString() + "'";
            sSql += " , TO_CHAR(SYSDATE, 'YYYYMMDDHH24MISS')";
            sSql += ", '" + dr["USR_TYPE"].ToString() + "'";
            sSql += ", '" + dr["EST_YN"].ToString() + "'";
            sSql += ", '" + dr["GRP_CD"].ToString() + "'";
            sSql += " )";

            return sSql;
        }

        //숙박
        public string HomeEstimateRoom_Query(DataRow dr, string reqno,string reqnm)
        {

            sSql = "";
            sSql += "INSERT INTO QUOT_REQ_ROOM";
            sSql += "       (REQ_NO, REQ_SEQ, ROOM_NM, ROOM_CNT, INS_USR, INS_DT)";
            sSql += "VALUES ( ";
            sSql += " '" + reqno + "'";
            sSql += " , (SELECT NVL(MAX(REQ_SEQ),0) + 1 FROM QUOT_REQ_ROOM WHERE REQ_NO = '" + reqno + "') ";
            sSql += " , '" + dr["ROOM_NM"].ToString() + "'";
            sSql += " , '" + dr["ROOM_CNT"].ToString() + "'";
            sSql += " , '" + reqnm + "'";
            sSql += " , TO_CHAR(SYSDATE, 'YYYYMMDDHH24MISS')";
            sSql += "      )";

            return sSql;
        }

        //세미나
        public string HomeEstimateSemina_Query(DataRow dr, string reqno, string reqnm)
        {

            sSql = "";
            sSql += "INSERT INTO QUOT_REQ_CONF";
            sSql += "       (REQ_NO, REQ_SEQ, CONF_TYPE, INS_USR, INSDATE)";
            sSql += "VALUES ( ";
            sSql += " '" + reqno + "'";
            sSql += " , (SELECT NVL(MAX(REQ_SEQ),0) + 1 FROM QUOT_REQ_CONF WHERE REQ_NO = '" + reqno + "')";
            sSql += " , '" + dr["CONF_TYPE"].ToString() + "'";
            sSql += " , '" + reqnm + "'";
            sSql += " , TO_CHAR(SYSDATE, 'YYYYMMDDHH24MISS')";
            sSql += "      )";

            return sSql;
        }

        //음식
        public string HomeEstimateFood_Query(DataRow dr, string reqno, string reqnm)
        {

            sSql = "";
            sSql += "INSERT INTO QUOT_REQ_MEAL";
            sSql += "       (REQ_NO, REQ_SEQ, MEAL_NM, INS_USR, INS_DT)";
            sSql += "VALUES ( ";
            sSql += " '" + reqno + "'";
            sSql += " , (SELECT NVL(MAX(REQ_SEQ),0) + 1 FROM QUOT_REQ_MEAL WHERE REQ_NO = '" + reqno + "')";
            sSql += " , '" + dr["MEAL_NM"].ToString() + "'";
            sSql += " , '" + reqnm + "'";
            sSql += " , TO_CHAR(SYSDATE, 'YYYYMMDDHH24MISS')";
            sSql += "      )";

            return sSql;
        }

        //부가서비스
        public string HomeEstimateEtc_Query(DataRow dr, string reqno, string reqnm)
        {

            sSql = "";
            sSql += "INSERT INTO QUOT_REQ_SVC";
            sSql += "       (REQ_NO, REQ_SEQ, SVC_NM, INS_USR, INS_DT)";
            sSql += "VALUES ( ";
            sSql += " '" + reqno + "'";
            sSql += " , (SELECT NVL(MAX(REQ_SEQ),0) + 1 FROM QUOT_REQ_SVC WHERE REQ_NO = '" + reqno + "')";
            sSql += " , '" + dr["SVC_NM"].ToString() + "'";
            sSql += " , '" + reqnm + "'";
            sSql += " , TO_CHAR(SYSDATE, 'YYYYMMDDHH24MISS')";
            sSql += "      )";

            return sSql;
        }
    }
}