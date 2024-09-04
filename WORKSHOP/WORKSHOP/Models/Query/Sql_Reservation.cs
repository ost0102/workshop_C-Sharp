using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;

namespace WORKSHOP.Models.Query
{
    public class Sql_Reservation

    {
        private static string sSql = "";
        private static bool rtnBool = false;
        private static DataTable dt = new DataTable();



        public string ReserveInquirySelect_Query(DataRow dr)
        {

            sSql = "";
            sSql += " SELECT INQ_TYPE, INQ_CONTENT";
            sSql += " ,(SELECT MAX(INQ_CNT) FROM INQUIRY_MST WHERE MNGT_NO = '"+dr["BKG_NO"]+"' AND INQ_TYPE = '"+dr["INQ_TYPE"]+"')AS INQ_CNT";
            sSql += " , INQ_YMD, ANSWER, ANS_YMD,USER_TYPE";
            sSql += " FROM INQUIRY_MST";
            sSql += " WHERE 1=1";
            sSql += "      AND MNGT_NO = '" + dr["BKG_NO"] + "'";
            sSql += "      AND INQ_TYPE = '" + dr["INQ_TYPE"] + "'";
            sSql += "      ORDER BY INQ_YMD";

            return sSql;

        }

        public string ReservCancelAlert_Query(DataRow dr)
        {


            sSql = "";
            sSql += "UPDATE BKG_MST";
            sSql += "   SET BKG_STATUS = 'C'";
            sSql += " WHERE BKG_NO = '" + dr["BKG_NO"] + "'";

            return sSql;

        }


        public string UpdateBkgHeader(DataRow dr)
        {


            sSql = "";
            sSql += "UPDATE BKG_MST";
            sSql += "   SET STRT_DT = '" + dr["STRT_YMD"] + "'";
            sSql += "    , END_DT = '" + dr["END_YMD"] + "'";
            sSql += "   , HEAD_CNT = '" + dr["HEAD_CNT"] + "'";
            sSql += "   , RMK = '" + dr["RMK"] + "'";
            sSql += "    , UPD_USR = '" + dr["INS_USR"] + "'";
            sSql += "   , UPD_DT = TO_CHAR(SYSDATE, 'YYYYMMDDHH24MISS')";
            sSql += " WHERE BKG_NO = '" + dr["BKG_NO"] + "'";

            return sSql;

        }

        public string DeleteBkgDetail(DataRow dr)
        {


            sSql = "BEGIN";
            sSql += " DELETE ";
            sSql += "   FROM BKG_ROOM ";
            sSql += "  WHERE BKG_NO = '" + dr["BKG_NO"] + "';";
            sSql += " DELETE ";
            sSql += "   FROM BKG_CONF ";
            sSql += "  WHERE BKG_NO = '" + dr["BKG_NO"] + "';";
            sSql += " DELETE ";
            sSql += "   FROM BKG_MEAL ";
            sSql += "  WHERE BKG_NO = '" + dr["BKG_NO"] + "';";
            sSql += " DELETE ";
            sSql += "   FROM BKG_SVC ";
            sSql += "  WHERE BKG_NO = '" + dr["BKG_NO"] + "';";
            sSql += "END;";


            return sSql;

        }
        public string InsertReserveRoom_Query(DataRow dr, string mngt_no)
        {

            sSql = "";
            sSql += "INSERT INTO BKG_ROOM";
            sSql += "       (BKG_NO,BKG_SEQ, ROOM_NM, ROOM_CNT, INS_USR, INS_DT )";
            sSql += "VALUES ( ";
            sSql += " '" + mngt_no + "'";
            sSql += " , (SELECT NVL(MAX(BKG_SEQ),0)+1 FROM BKG_ROOM WHERE BKG_NO = '" + mngt_no + "')";
            sSql += " , '" + dr["ROOM_NM"].ToString() + "'";
            sSql += " , '" + dr["ROOM_CNT"].ToString() + "'";
            sSql += " , '" + dr["INS_USR"].ToString() + "'";
            sSql += " , TO_CHAR(SYSDATE, 'YYYYMMDDHH24MISS')";
            sSql += "      )";

            return sSql;
        }

        //세미나
        public string InsertReserveSemina_Query(DataRow dr, string mngt_no)
        {

            sSql = "";
            sSql += "INSERT INTO BKG_CONF";
            sSql += "       (BKG_NO,BKG_SEQ ,CONF_TYPE, INS_USR, INS_DT)";
            sSql += "VALUES ( ";
            sSql += " '" + mngt_no + "'";
            sSql += " , (SELECT NVL(MAX(BKG_SEQ),0)+1  FROM BKG_CONF WHERE BKG_NO = '" + mngt_no + "')";
            sSql += " , '" + dr["CONF_TYPE"].ToString() + "'";
            sSql += " , '" + dr["INS_USR"].ToString() + "'";
            sSql += " , TO_CHAR(SYSDATE, 'YYYYMMDDHH24MISS')";
            sSql += "      )";

            return sSql;
        }

        //음식
        public string InsertReserveFood_Query(DataRow dr, string mngt_no)
        {

            sSql = "";
            sSql += "INSERT INTO BKG_MEAL";
            sSql += "       (BKG_NO, BKG_SEQ, MEAL_NM, INS_USR, INS_DT)";
            sSql += "VALUES ( ";
            sSql += " '" + mngt_no + "'";
            sSql += " , (SELECT NVL(MAX(BKG_SEQ),0)+1  FROM BKG_MEAL WHERE BKG_NO = '" + mngt_no + "')";
            sSql += " , '" + dr["MEAL_NM"].ToString() + "'";
            sSql += " , '" + dr["INS_USR"].ToString() + "'";
            sSql += " , TO_CHAR(SYSDATE, 'YYYYMMDDHH24MISS')";
            sSql += "      )";

            return sSql;
        }

        //부가서비스
        public string InsertReserveEtc_Query(DataRow dr, string mngt_no)
        {

            sSql = "";
            sSql += "INSERT INTO BKG_SVC";
            sSql += "       (BKG_NO ,BKG_SEQ, SVC_NM, INS_USR, INS_DT)";
            sSql += "VALUES ( ";
            sSql += " '" + mngt_no + "'";
            sSql += " , (SELECT NVL(MAX(BKG_SEQ),0)+1  FROM BKG_SVC WHERE BKG_NO = '" + mngt_no + "')";
            sSql += " , '" + dr["SVC_NM"].ToString() + "'";
            sSql += " , '" + dr["INS_USR"].ToString() + "'";
            sSql += " , TO_CHAR(SYSDATE, 'YYYYMMDDHH24MISS')";
            sSql += "      )";

            return sSql;
        }

        public string ReservationSearch_Query(DataRow dr)
        {
            
            sSql = "";
            sSql += "                           SELECT * FROM (";
            sSql += "                            SELECT A.BKG_NO,";
            sSql += "                                    MAX (A.QUOT_NO) AS QUOT_NO,";
            sSql += "                                    MAX (A.STRT_DT) AS STRT_DT,";
            sSql += "                                    MAX (A.END_DT) AS END_DT,";
            sSql += "                                    MAX (A.TOT_AMT) AS TOT_AMT,";
            sSql += "                                    MAX (A.CUST_EMAIL) AS CUST_EMAIL,";
            sSql += "                                    MAX (B.AREA) AS AREA,";
            sSql += "                                    MAX (B.ITEM_CD) AS ITEM_CD,";
            sSql += "                                    MAX (B.ITEM_NM) AS ITEM_NM,";
            sSql += "                                    MAX (B.ITEM_GRD) AS ITEM_GRD,";
            sSql += "                                    MAX (B.ITEM_TYPE) AS ITEM_TYPE,";
            sSql += "                                    MAX (C.IMG_PATH)  AS IMG_PATH,";
            sSql += "                                    MAX (C.IMG_NM) AS IMG_NM,";
            sSql += "                                    MAX(D.QUOT_TYPE) AS QUOT_TYPE,";
            sSql += "                                    MAX(A.BKG_STATUS) AS BKG_STATUS,";
            sSql += "                                    MAX (A.RMK) AS RMK,";
            sSql += "                                    MAX((SELECT QUOT_NO FROM QUOT_MNG_MST WHERE A.QUOT_NO = QUOT_NO)) AS MNG_NO,";
            sSql += "                                    MAX(A.INS_DT) AS INS_DT";
            sSql += "                               FROM BKG_MST A";
            sSql += "                                    LEFT JOIN ITEM_MST B";
            sSql += "                                       ON A.ITEM_CD = B.ITEM_CD";
            sSql += "                                    LEFT JOIN ITEM_DTL_IMG C";
            sSql += "                                       ON A.ITEM_CD = C.ITEM_CD AND ITEM_SEQ = 1";
            sSql += "                                    INNER JOIN QUOT_REQ_MST D";
            sSql += "                                       ON A.REQ_NO = D.REQ_NO";
            sSql += "                              WHERE     1 = 1";
            if (dr["GRP_CD"].ToString() != "")
            {
                sSql += "                           AND (A.GRP_CD = '" + dr["GRP_CD"] + "' OR A.CUST_EMAIL = '" + dr["CUST_EMAIL"] + "')";
            }
            else
            {
                sSql += "                           AND A.CUST_EMAIL = '" + dr["CUST_EMAIL"] + "'";
            }
            if (dr["MNGT_NO"].ToString() != "")
            {
                sSql += "                                    AND A.BKG_NO = '" + dr["MNGT_NO"] + "'";
            }
            else if (dr["QUOT_NO"].ToString() != "")
            {
                sSql += "                                    AND A.QUOT_NO = '" + dr["QUOT_NO"] + "'";
            }
            else
            {
                if (dr["AREA"].ToString() != "" && dr["AREA"].ToString() != "ALL")
                {
                    sSql += "                           AND B.AREA = '" + dr["AREA"] + "'";
                }
                if (dr["STRT_DT"].ToString() != "" && dr["END_DT"].ToString() != "")
                {
                    sSql += " AND ((SUBSTR (A.INS_DT, 0, 8) BETWEEN '" + dr["STRT_DT"].ToString() + "' AND '" + dr["END_DT"].ToString() + "')";
                    sSql += " OR (A.STRT_DT BETWEEN '" + dr["STRT_DT"].ToString() + "' AND '" + dr["END_DT"].ToString() + "')";
                    sSql += " OR (A.END_DT BETWEEN '" + dr["STRT_DT"].ToString() + "' AND '" + dr["END_DT"].ToString() + "'))";
                }
                if (dr["QUOT_TYPE"].ToString() != "")
                {
                    sSql += "                           AND D.QUOT_TYPE = '" + dr["QUOT_TYPE"] + "' ";
                }
                if (dr["BKG_STATUS"].ToString() != "")
                {
                    sSql += "                                    AND A.BKG_STATUS = '" + dr["BKG_STATUS"] + "'";
                }
            }
            sSql += "                              GROUP BY BKG_NO";
            sSql += "                           ) A  WHERE 1 = 1         ";
            sSql += "ORDER BY INS_DT DESC         ";


            return sSql;

        }


        public string ReserveBottomRoom_Query(DataRow dr)
        {
            sSql = "";
            sSql += "                           SELECT ROOM_NM, ROOM_CNT ";
            sSql += "                              FROM BKG_ROOM";
            sSql += "                             WHERE 1=1";
            sSql += "                                AND  BKG_NO ='" + dr["BKG_NO"] + "'";

            return sSql;
        }

        public string ReserveBottomMeal_Query(DataRow dr)
        {
            sSql = "";
            sSql += "                           SELECT MEAL_NM,BKG_SEQ ";
            sSql += "                              FROM BKG_MEAL";
            sSql += "                             WHERE 1=1";
            sSql += "                                AND  BKG_NO ='" + dr["BKG_NO"] + "'";

            return sSql;
        }

        public string ReserveBottomSvc_Query(DataRow dr)
        {
            sSql = "";
            sSql += "                           SELECT SVC_NM,BKG_SEQ ";
            sSql += "                              FROM BKG_SVC";
            sSql += "                             WHERE 1=1";
            sSql += "                                AND  BKG_NO ='" + dr["BKG_NO"] + "'";

            return sSql;
        }

        public string ReserveBottomConf_Query(DataRow dr)
        {
            sSql = "";
            sSql += "                           SELECT CONF_TYPE,BKG_SEQ ";
            sSql += "                              FROM BKG_CONF";
            sSql += "                             WHERE 1=1";
            sSql += "                                AND  BKG_NO ='" + dr["BKG_NO"] + "'";

            return sSql;
        }

        public string ReserveBottomMst_Query(DataRow dr)
        {
            sSql = "";
            sSql += "                           SELECT RMK ";
            sSql += "                              FROM BKG_MST";
            sSql += "                             WHERE 1=1";
            sSql += "                                AND  BKG_NO ='" + dr["BKG_NO"] + "'";

            return sSql;
        }
        public string ReserveDetailRoom_Query(DataRow dr)
        {
            sSql = "";
            sSql += "                           SELECT BKG_NO,BKG_SEQ,ROOM_NM,ROOM_CNT,PRC";
            sSql += "                              FROM BKG_ROOM";
            sSql += "                             WHERE 1=1";
            sSql += "                                AND  BKG_NO ='" + dr["BKG_NO"] + "'";
            return sSql;

        }
        public string ReserveDetailMeal_Query(DataRow dr)
        {
            sSql = "";
            sSql += "                           SELECT BKG_NO,BKG_SEQ,MEAL_NM,PRC";
            sSql += "                              FROM BKG_MEAL";
            sSql += "                             WHERE 1=1";
            sSql += "                                AND  BKG_NO ='" + dr["BKG_NO"] + "'";
            return sSql;
        }
        public string ReserveDetailSvc_Query(DataRow dr)
        {
            sSql = "";
            sSql += "                           SELECT BKG_NO,BKG_SEQ,SVC_NM,PRC,(SELECT FILE_PATH || '/' || FILE_NM FROM COMM_CODE WHERE COMM_NM = A.SVC_NM AND ROWNUM = 1) AS SVC_PATH ";
            sSql += "                              FROM BKG_SVC A";
            sSql += "                             WHERE 1=1";
            sSql += "                                AND  BKG_NO ='" + dr["BKG_NO"] + "'";
            return sSql;
        }
        public string ReserveDetailConf_Query(DataRow dr)
        {
            sSql = "";
            sSql += "                           SELECT BKG_NO,BKG_SEQ, CONF_TYPE, PRC";
            sSql += "                              FROM BKG_CONF";
            sSql += "                             WHERE 1=1";
            sSql += "                                AND  BKG_NO ='" + dr["BKG_NO"] + "'";
            return sSql;
        }
        public string ReserveDetailMst_Query(DataRow dr)
        {
            sSql = "";
            sSql += "                           SELECT BKG_NO,TOT_AMT, A.RMK , B.MAX_PRC , B.MIN_PRC, A.STRT_DT , A.END_DT, A.FILE_PATH , A.FILE_NM , A.ITEM_CD";
            sSql += "                              , (SELECT MNGT_NO FROM CUST_COMT WHERE BKG_NO = A.BKG_NO) AS REVIEW_YN,A.HEAD_CNT";
            sSql += "                              FROM BKG_MST A";
            sSql += "                               LEFT OUTER JOIN QUOT_REQ_MST B ON A.REQ_NO = B.REQ_NO   ";
            sSql += "                             WHERE 1=1";
            sSql += "                                AND  BKG_NO ='" + dr["BKG_NO"] + "'";
            return sSql;
        }

        public string ReserveInquire_Query(DataRow dr)
        {

            sSql = "";
            sSql += " INSERT INTO INQUIRY_MST ";
            sSql += "      (MNGT_NO , MNGT_SEQ, INQ_TYPE, INQ_CONTENT, INQ_CNT , INQ_USR, INQ_YMD, USER_TYPE )";
            sSql += "      VALUES (";
            sSql += "        '" + dr["BKG_NO"] + "'";
            sSql += " ,(SELECT  NVL(MAX(MNGT_SEQ),0) + 1 FROM INQUIRY_MST WHERE MNGT_NO = '" + dr["BKG_NO"] + "')";
            sSql += "      , '" + dr["INQ_TYPE"] + "'";
            sSql += "      , '" + dr["INQ_CONTENT"] + "'"; ;
            sSql += " ,(SELECT  NVL(MAX(INQ_CNT),0) + 1 FROM INQUIRY_MST WHERE MNGT_NO = '" + dr["BKG_NO"] + "')";
            sSql += "      , '" + dr["INQ_USR"] + "'";
            sSql += "      , TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS')";
            sSql += "      , 'U' ";
            sSql += "      )";
            return sSql;

        }

        public string ReserveInquireDetail_Query(DataRow dr)
        {


            sSql = "";
            sSql += " SELECT INQ_TYPE, INQ_CONTENT, INQ_CNT, INQ_YMD, ANSWER, ANS_YMD, USER_TYPE";
            sSql += " FROM INQUIRY_MST";
            sSql += " WHERE 1=1";
            sSql += "      AND MNGT_NO = '" + dr["BKG_NO"] + "'";
            sSql += "      AND INQ_TYPE = '" + dr["INQ_TYPE"] + "'";
            sSql += "      ORDER BY INQ_YMD";

            return sSql;

        }
        public string SelectBkgStatus(DataRow dr)
        {


            sSql = "";
            sSql += " SELECT BKG_STATUS FROM BKG_MST WHERE BKG_NO = '" + dr["BKG_NO"] + "'";

            return sSql;

        }

        public string ResGetCommentInfo_Query(DataRow dr)
        {


            sSql = "";
            sSql += " SELECT ITEM.ITEM_NM , ITEM.TAG , ITEM.ITEM_CD , BKG.TOT_AMT FROM BKG_MST BKG  LEFT OUTER JOIN ITEM_MST ITEM ON BKG.ITEM_CD = ITEM.ITEM_CD  WHERE BKG.ITEM_CD = '" + dr["ITEM_CD"] +  "'";
            sSql += " AND BKG.BKG_NO = '" + dr["BKG_NO"] + "'";

            return sSql;

        }




        //메인
        public string ModifyReserveMst_Query(DataRow dr)
        {

            sSql = "";
            sSql += "INSERT INTO BKG_MOD_MST";
            sSql += " (BKG_MOD_NO, BKG_MOD_SEQ, BKG_NO , STRT_YMD, END_YMD, MIN_PRC, MAX_PRC, HEAD_CNT, RMK, INS_USR, INS_DT, MOD_YN)";
            sSql += "VALUES ( ";
            sSql += " '" + dr["BKG_MOD_NO"].ToString() + "'";
            sSql += " , (SELECT NVL(MAX(BKG_MOD_SEQ),0) + 1 FROM BKG_MOD_MST WHERE BKG_NO = '" + dr["BKG_NO"].ToString() + "')";
            sSql += " , '" + dr["BKG_NO"].ToString() + "'";
            sSql += " , '" + dr["STRT_YMD"].ToString() + "'";
            sSql += " , '" + dr["END_YMD"].ToString() + "'";
            sSql += " , '" + dr["MIN_PRC"].ToString() + "'";
            sSql += " , '" + dr["MAX_PRC"].ToString() + "'";
            sSql += " , '" + dr["HEAD_CNT"].ToString() + "'";
            sSql += " , '" + dr["RMK"].ToString() + "'";
            sSql += " , '" + dr["INS_USR"].ToString() + "'";
            sSql += " , TO_CHAR(SYSDATE, 'YYYYMMDDHH24MISS')";
            sSql += " , 'N'";
            sSql += " )";

            return sSql;
        }

        //숙박
        public string ModifyReserveRoom_Query(DataRow dr, string reqno, string reqnm)
        {

            sSql = "";
            sSql += "INSERT INTO BKG_MOD_ROOM";
            sSql += "       (BKG_MOD_NO, BKG_ROOM_SEQ, BKG_MOD_SEQ, ROOM_NM, ROOM_CNT, INS_USR, INS_DT )";
            sSql += "VALUES ( ";
            sSql += " '" + reqnm + "'";
            sSql += " , (SELECT NVL(MAX(BKG_ROOM_SEQ),0) + 1 FROM BKG_MOD_ROOM WHERE BKG_MOD_NO = '" + reqnm + "')";
            sSql += " , (SELECT NVL(MAX(BKG_MOD_SEQ),0) FROM BKG_MOD_MST WHERE BKG_NO = '" + reqno + "')";
            sSql += " , '" + dr["ROOM_NM"].ToString() + "'";
            sSql += " , '" + dr["ROOM_CNT"].ToString() + "'";
            sSql += " , '" + dr["INS_USR"].ToString() + "'";
            sSql += " , TO_CHAR(SYSDATE, 'YYYYMMDDHH24MISS')";
            sSql += "      )";

            return sSql;
        }

        //세미나
        public string ModifyReserveSemina_Query(DataRow dr, string reqno, string reqnm)
        {

            sSql = "";
            sSql += "INSERT INTO BKG_MOD_CONF";
            sSql += "       (BKG_MOD_NO, BKG_CONF_SEQ,BKG_MOD_SEQ ,CONF_TYPE, INS_USR, INS_DT)";
            sSql += "VALUES ( ";
            sSql += " '" + reqnm + "'";
            sSql += " , (SELECT NVL(MAX(BKG_CONF_SEQ),0) + 1 FROM BKG_MOD_CONF WHERE BKG_MOD_NO = '" + reqnm + "')";
            sSql += " , (SELECT NVL(MAX(BKG_MOD_SEQ),0)  FROM BKG_MOD_MST WHERE BKG_NO = '" + reqno + "')";
            sSql += " , '" + dr["CONF_TYPE"].ToString() + "'";
            sSql += " , '" + dr["INS_USR"].ToString() + "'";
            sSql += " , TO_CHAR(SYSDATE, 'YYYYMMDDHH24MISS')";
            sSql += "      )";

            return sSql;
        }

        //음식
        public string ModifyReserveFood_Query(DataRow dr, string reqno, string reqnm)
        {

            sSql = "";
            sSql += "INSERT INTO BKG_MOD_MEAL";
            sSql += "       (BKG_MOD_NO, BKG_MEAL_SEQ, BKG_MOD_SEQ, MEAL_NM, INS_USR, INS_DT)";
            sSql += "VALUES ( ";
            sSql += " '" + reqnm + "'";
            sSql += " , (SELECT NVL(MAX(BKG_MEAL_SEQ),0) + 1 FROM BKG_MOD_MEAL WHERE BKG_MOD_NO = '" + reqnm + "')";
            sSql += " , (SELECT NVL(MAX(BKG_MOD_SEQ),0)  FROM BKG_MOD_MST WHERE BKG_NO = '" + reqno + "')";
            sSql += " , '" + dr["MEAL_NM"].ToString() + "'";
            sSql += " , '" + dr["INS_USR"].ToString() + "'";
            sSql += " , TO_CHAR(SYSDATE, 'YYYYMMDDHH24MISS')";
            sSql += "      )";

            return sSql;
        }

        //부가서비스
        public string ModifyReserveEtc_Query(DataRow dr, string reqno, string reqnm)
        {

            sSql = "";
            sSql += "INSERT INTO BKG_MOD_SVC";
            sSql += "       (BKG_MOD_NO , BKG_SVC_SEQ,BKG_MOD_SEQ, SVC_NM, INS_USR, INS_DT)";
            sSql += "VALUES ( ";
            sSql += " '" + reqnm + "'";
            sSql += " , (SELECT NVL(MAX(BKG_SVC_SEQ),0) + 1 FROM BKG_MOD_SVC WHERE BKG_MOD_NO = '" + reqnm + "')";
            sSql += " , (SELECT NVL(MAX(BKG_MOD_SEQ),0)  FROM BKG_MOD_MST WHERE BKG_NO = '" + reqno + "')";
            sSql += " , '" + dr["SVC_NM"].ToString() + "'";
            sSql += " , '" + dr["INS_USR"].ToString() + "'";
            sSql += " , TO_CHAR(SYSDATE, 'YYYYMMDDHH24MISS')";
            sSql += "      )";

            return sSql;
        }

    }
}