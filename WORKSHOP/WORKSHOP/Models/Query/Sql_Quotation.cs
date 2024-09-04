using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;

namespace WORKSHOP.Models.Query
{
    public class Sql_Quotation
    {
        private static string sSql = "";
        private static bool rtnBool = false;
        private static DataTable dt = new DataTable();
        public static bool InsertConfirmQuotation(DataRow dr)
        {
            sSql = "";
            sSql += " INSERT INTO  QUOT_MNG_MST (QUOT_NO , REQ_MNGT_NO , TOT_AMT , INS_USR , INS_DT , UPD_USR , UPD_DT ) VALUES( ";
            sSql += "         TO_CHAR(SYSDATE, 'YYYYMMDDHH24MISS') ";
            sSql += "        , '" + dr["REQ_NO"].ToString().Trim() + "'";
            sSql += "        , '" + dr["TOT_AMT"].ToString().Trim() + "'";
            sSql += "        , '" + dr["REQ_NM"].ToString().Trim() + "'";
            sSql += "        , TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS')";
            sSql += "        , '" + dr["REQ_NM"].ToString().Trim() + "'";
            sSql += "        , TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS'))";

            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }

        public static bool UpdateQuotation(DataRow dr)
        {
            sSql = "";
            sSql += "BEGIN";
            sSql += " UPDATE QUOT_REQ_MST ";
            sSql += "      SET FILE_NM  = '" + dr["FILE_NM"].ToString().Trim() + "'";
            sSql += "        , FILE_PATH  = '" + dr["FILE_PATH"].ToString().Trim() + "'";
            sSql += "        , UPD_USR  = '" + dr["REQ_NM"].ToString().Trim() + "'";
            sSql += "        , UPD_DT  = TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS')";
            sSql += "   WHERE REQ_NO = '" + dr["REQ_NO"].ToString().Trim() + "';";
            sSql += " UPDATE QUOT_MNG_MST ";
            sSql += "      SET FILE_NM  = '" + dr["FILE_NM"].ToString().Trim() + "'";
            sSql += "        , FILE_PATH  = '" + dr["FILE_PATH"].ToString().Trim() + "'";
            sSql += "        , UPD_USR  = '" + dr["REQ_NM"].ToString().Trim() + "'";
            sSql += "        , UPD_DT  = TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS')";
            sSql += "   WHERE REQ_MNGT_NO = '" + dr["REQ_NO"].ToString().Trim() + "';";
            sSql += "END;";

            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }


        public static bool UpdateQuotationItem(DataRow dr)
        {
            sSql = "";
            sSql += " UPDATE QUOT_REQ_MST ";
            sSql += "      SET ITEM_CD  = '" + dr["ITEM_CD"].ToString().Trim() + "'";
            sSql += "        , ITEM_NM  = '" + dr["ITEM_NM"].ToString().Trim() + "'";
            sSql += "        , UPD_USR  = '" + dr["REQ_NM"].ToString().Trim() + "'";
            sSql += "        , UPD_DT  = TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS')";
            sSql += "   WHERE REQ_NO = '" + dr["REQ_NO"].ToString().Trim() + "'";

            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }

        public static bool UpdateEmailSend(DataRow dr)
        {
            sSql = "";

            if (dr.Table.Columns.Contains("PAGE_TYPE")) // 등록 화면일때 
            {
                sSql += " UPDATE QUOT_MNG_MST ";
            }
            else // 리스트에서 간편견적 건 메일 보낼때
            {
                sSql += " UPDATE QUOT_REQ_MST ";
            }
            

 
            sSql += "      SET EMAIL_YN  = 'Y'";
            sSql += "      , UPD_USR = 'WEB' ";
            sSql += "      , UPD_DT = TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS') ";
            sSql += " WHERE 1=1 ";
            if (dr.Table.Columns.Contains("PAGE_TYPE")) // 등록 화면일때 
            {
                sSql += "AND QUOT_NO = '"+dr["QUOT_NO"].ToString().Trim()+"' ";
            }
            else
            {
                sSql += "   AND REQ_NO = '" + dr["MNGT_NO"].ToString().Trim() + "'";
            }





            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }

        public static bool UpdateBkgEmailSend(DataRow dr)
        {
            sSql = "";
            sSql += " UPDATE BKG_MST ";
            sSql += "      SET EMAIL_YN  = 'Y'";
            sSql += "   WHERE BKG_NO = '" + dr["BKG_NO"].ToString().Trim() + "'";

            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }


        public static DataTable SelectQuotALL(DataRow dr)
        {
            sSql = " SELECT 'Q' AS INSFLAG ,  A.*  ,(SELECT WM_CONCAT(SVC_NM) FROM QUOT_REQ_SVC WHERE REQ_NO = A.REQ_NO) AS SVC_NM, SUBSTR(INS_DT,0,8)AS REQ_DT";
            //sSql += ", NVL(QUOT_CNT,'0')AS QUOT_YN ";
            sSql += " , (CASE WHEN A.QUOT_TYPE = 'B' THEN NVL(QUOT_CNT,'0') ";
            sSql += "       WHEN A.QUOT_TYPE != 'B' THEN NVL(QUOT_CNT, '-1')  END) AS QUOT_YN ";
            sSql += " FROM QUOT_REQ_MST A ";
            sSql += " LEFT JOIN (SELECT REQ_MNGT_NO, COUNT(REQ_MNGT_NO)AS QUOT_CNT FROM QUOT_MNG_MST GROUP BY REQ_MNGT_NO)QM ";
            sSql += "    ON A.REQ_NO = QM.REQ_MNGT_NO ";

            sSql += "WHERE QUOT_TYPE != 'C' ";
            
            if(dr.Table.Columns.Contains("S_STRT_YMD") && dr.Table.Columns.Contains("S_END_YMD"))
            {
                if (dr["S_STRT_YMD"].ToString() != "" && dr["S_END_YMD"].ToString() != "")
                {
                    sSql += " AND SUBSTR(INS_DT,0,8) BETWEEN '" + dr["S_STRT_YMD"].ToString() + "' AND '" + dr["S_END_YMD"].ToString() + "' ";
                }
            }
                //if (dr["STRT_YMD"].ToString() != "" )
                //{
                //    sSql += "AND STRT_YMD >= '" + dr["STRT_YMD"].ToString() + "'";
                //}
                //if (dr["END_YMD"].ToString() != "")
                //{
                //    sSql += "AND END_YMD <= '" + dr["END_YMD"].ToString() + "'";
                //}
            if (dr.Table.Columns.Contains("S_AREA")){
                if (dr["S_AREA"].ToString() != "" && dr["S_AREA"].ToString() != "전체")
                {
                    sSql += "AND AREA = '" + dr["S_AREA"].ToString() + "'";
                }
            
            }
            if (dr.Table.Columns.Contains("S_REQ_NM"))
            {
                if (dr["S_REQ_NM"].ToString() != "")
                {
                    sSql += "AND REQ_NM LIKE '%" + dr["S_REQ_NM"].ToString() + "%'";
                }
            }
            if (dr.Table.Columns.Contains("S_STATUS"))
            {
                if (dr["S_STATUS"].ToString() != "" && dr["S_STATUS"].ToString() != "ALL")
                {
                    sSql += "AND EMAIL_YN = '" + dr["S_STATUS"].ToString() + "'";
                }
            }
            if (dr.Table.Columns.Contains("S_QUOT_YN"))
            {
                if (dr["S_QUOT_YN"].ToString() != "" && dr["S_QUOT_YN"].ToString() != "ALL")
                {
                    if(dr["S_QUOT_YN"].ToString() == "0") // 미등록
                    {
                        sSql += "AND NVL(QUOT_CNT,'0') = '" + dr["S_QUOT_YN"].ToString() + "'";
                    }
                    else // 등록
                    {
                        sSql += "AND NVL(QUOT_CNT,'0') != '0'";
                    }
                    
                }
            }
            if (dr.Table.Columns.Contains("S_USER_TYPE"))
            {
                if (dr["S_USER_TYPE"].ToString() != "" && dr["S_USER_TYPE"].ToString() != "ALL")
                {
                    sSql += "AND USER_TYPE = '" + dr["S_USER_TYPE"].ToString() + "'";
                }
            }
            if (dr.Table.Columns.Contains("S_QUOT_TYPE"))
            {
                if (dr["S_QUOT_TYPE"].ToString() != "" && dr["S_QUOT_TYPE"].ToString() != "ALL")
                {
                    sSql += "AND QUOT_TYPE = '" + dr["S_QUOT_TYPE"].ToString() + "'";
                }
            }

            sSql += " ORDER BY NVL(UPD_DT,INS_DT) DESC";
            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);
            return dt;
        }


        public static DataSet SelectQuotMstNew(DataRow dr)
        {
            DataSet ds = new DataSet();
            string mngt_no = "";


            //헤더 조회 쿼리
            sSql = "";
            sSql += "SELECT 'M' AS INSFLAG , A.* , '' AS TOT_AMT , '' AS QUOT_NO ";
            sSql += " FROM QUOT_REQ_MST A ";
            sSql += " WHERE 1=1 ";
            if(dr["REQ_NO"].ToString() != "")
            {
                sSql+= " AND REQ_NO = '" +dr["REQ_NO"].ToString()+ "' ";
            }
            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);
            dt.TableName = "MAIN";
            ds.Tables.Add(dt);
            mngt_no = dt.Rows[0]["QUOT_NO"].ToString();




            return ds;
        }


        public static DataSet SelectOnlineQuotMst(DataRow dr)
        {
            DataSet ds = new DataSet();
            string mngt_no = "";

            #region 헤더 조회 쿼리
            sSql = "";
            sSql += "SELECT 'M' AS INSFLAG , A.* , '' AS TOT_AMT , '' AS QUOT_NO ";
            sSql += " FROM QUOT_REQ_MST A ";
            sSql += " WHERE 1=1 ";
            if (dr["REQ_NO"].ToString() != "")
            {
                sSql += " AND REQ_NO = '" + dr["REQ_NO"].ToString() + "' ";
            }
            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);
            dt.TableName = "MAIN";
            ds.Tables.Add(dt);
            mngt_no = dt.Rows[0]["REQ_NO"].ToString();
            #endregion



            #region 디테일 조회
            sSql = "";
            sSql += "SELECT 'Q' AS INSFLAG, A.* , ''AS PRC FROM QUOT_REQ_CONF A ";
            sSql += "WHERE 1=1 ";
            sSql += "AND A.REQ_NO = '"+mngt_no+"' ";

            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);
            dt.TableName = "CONFERENCE";
            ds.Tables.Add(dt);


            sSql = "";
            sSql += "SELECT 'Q' AS INSFLAG, A.*, ''AS PRC  FROM QUOT_REQ_ROOM A ";
            sSql += "WHERE 1=1 ";
            sSql += "AND A.REQ_NO = '" + mngt_no + "' ";

            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);
            dt.TableName = "ROOM";
            ds.Tables.Add(dt);


            sSql = "";
            sSql += "SELECT 'Q' AS INSFLAG, A.*, ''AS PRC  FROM QUOT_REQ_MEAL A ";
            sSql += "WHERE 1=1 ";
            sSql += "AND A.REQ_NO = '" + mngt_no + "' ";

            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);
            dt.TableName = "MEAL";
            ds.Tables.Add(dt);


            sSql = "";
            sSql += "SELECT 'Q' AS INSFLAG, A.*, ''AS PRC  FROM QUOT_REQ_SVC A ";
            sSql += "WHERE 1=1 ";
            sSql += "AND A.REQ_NO = '" + mngt_no + "' ";

            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);
            dt.TableName = "SERVICE";
            ds.Tables.Add(dt);

            #endregion


            dt = new DataTable();
            dt.Columns.Add("trxCode");
            dt.Columns.Add("trxMsg");
            DataRow row1 = dt.NewRow();
            row1["trxCode"] = "Y";
            row1["trxMsg"] = "success";
            dt.Rows.Add(row1);
            dt.TableName = "Result";
            ds.Tables.Add(dt);


            return ds;
        }


        public static DataSet SelectQuotMst(DataRow dr)
        {
            DataSet ds = new DataSet();
            string mngt_no = "";
            sSql = " SELECT 'Q' AS INSFLAG ,  A.* , B.QUOT_NO , B.TOT_AMT FROM QUOT_REQ_MST A  ";
            sSql += " LEFT OUTER JOIN QUOT_MNG_MST B ON A.REQ_NO = B.REQ_MNGT_NO WHERE 1 = 1";
            if (dr["REQ_NO"].ToString() != "")
            {
                sSql += "AND A.REQ_NO = '" + dr["REQ_NO"].ToString() + "'";
            }
            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);
            dt.TableName = "MAIN";
            ds.Tables.Add(dt);
            mngt_no = dt.Rows[0]["QUOT_NO"].ToString();

            sSql = " SELECT 'Q' AS INSFLAG ,  A.*  FROM  QUOT_MNG_CONF A ";
            sSql += "  WHERE 1 = 1 ";
            sSql += "AND A.QUOT_NO = '" + mngt_no + "'";

            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);
            dt.TableName = "CONFERENCE";
            ds.Tables.Add(dt);

            sSql = " SELECT 'Q' AS INSFLAG ,  A.*  FROM  QUOT_MNG_ROOM A ";
            sSql += "  WHERE 1 = 1 ";
            sSql += "AND A.QUOT_NO = '" + mngt_no + "'";

            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);
            dt.TableName = "ROOM";
            ds.Tables.Add(dt);


            sSql = " SELECT 'Q' AS INSFLAG ,  A.*  FROM  QUOT_MNG_MEAL A ";
            sSql += "  WHERE 1 = 1 ";
            sSql += "AND A.QUOT_NO = '" + mngt_no + "'";

            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);
            dt.TableName = "MEAL";
            ds.Tables.Add(dt);



            sSql = " SELECT 'Q' AS INSFLAG ,  A.*  FROM  QUOT_MNG_SVC A ";
            sSql += "  WHERE 1 = 1 ";
            sSql += "AND A.QUOT_NO = '" + mngt_no + "'";

            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);
            dt.TableName = "SERVICE";
            ds.Tables.Add(dt);
            
            dt = new DataTable();
            dt.Columns.Add("trxCode");
            dt.Columns.Add("trxMsg");
            DataRow row1 = dt.NewRow();
            row1["trxCode"] = "Y";
            row1["trxMsg"] = "success";
            dt.Rows.Add(row1);
            dt.TableName = "Result";
            ds.Tables.Add(dt);

            return ds;
        }

        public static DataTable SelectQuotAllDetail(DataRow dr)
        {
            sSql = " SELECT CONF_TYPE AS REQ_CONTENT	";
            sSql += "          ,  0 AS REQ_NUM	";
            sSql += "          ,  REQ_NO	";
            sSql += "          ,  'CONF' AS REQ_STATUS	";
            sSql += "          ,  0 AS  PRC	";
            sSql += "    FROM QUOT_REQ_CONF 	";
            sSql += " WHERE REQ_NO =  '" + dr["REQ_NO"].ToString() + "'	";
            sSql += " UNION 	";
            sSql += " SELECT ROOM_NM AS REQ_CONTENT	";
            sSql += "          ,  ROOM_CNT AS REQ_NUM 	";
            sSql += "          ,  REQ_NO	";
            sSql += "          ,  'ROOM' AS REQ_STATUS	";
            sSql += "          ,  0 AS PRC	";
            sSql += "   FROM QUOT_REQ_ROOM	";
            sSql += "   WHERE REQ_NO =  '" + dr["REQ_NO"].ToString() + "'	";
            sSql += " UNION	";
            sSql += " SELECT SVC_NM AS REQ_CONTENT	";
            sSql += "            ,  0 AS REQ_NUM	";
            sSql += "          ,  REQ_NO	";
            sSql += "          ,  'SVC' AS REQ_STATUS	";
            sSql += "          ,  0 AS PRC	";
            sSql += "     FROM QUOT_REQ_SVC	";
            sSql += "     WHERE REQ_NO =  '" + dr["REQ_NO"].ToString() + "'	";
            sSql += " UNION    	";
            sSql += " SELECT MEAL_NM AS REQ_CONTENT	";
            sSql += "           ,  0 AS REQ_NUM	";
            sSql += "          ,  REQ_NO	";
            sSql += "          ,  'MEAL' AS REQ_STATUS	";
            sSql += "          ,  0 AS PRC	";
            sSql += "    FROM QUOT_REQ_MEAL     	";
            sSql += "    WHERE REQ_NO =  '" + dr["REQ_NO"].ToString() + "'   	";

            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);
            return dt;
        }

        public static DataTable SelectQuotList(DataRow dr)
        {
            sSql = "	SELECT A.AREA , ";
            sSql += "	  A.ITEM_NM, ";
            sSql += "	  A.REQ_EMAIL, ";
            sSql += "	  A.USER_TYPE, ";
            sSql += "	  A.QUOT_TYPE, ";
            sSql += "	  (SELECT PSWD FROM CUST_INFO WHERE EMAIL = A.REQ_EMAIL) AS PSWD, ";
            sSql += "	  A.REQ_NO, ";
            sSql += "	  A.REQ_NO AS MNGT_NO , ";
            sSql += "	  TO_CHAR(TO_DATE(A.STRT_YMD),'YYYY.MM.DD') AS STRT_YMD, ";
            sSql += "	  TO_CHAR(TO_DATE(A.END_YMD),'YYYY.MM.DD') AS END_YMD, ";
            sSql += "	  A.MIN_PRC, ";
            sSql += "	  A.MAX_PRC, ";
            sSql += "	  A.HEAD_CNT, ";
            sSql += "	  NVL(B.FILE_PATH ,A.FILE_PATH) AS FILE_PATH , ";
            sSql += "	  NVL(B.FILE_NM , A.FILE_NM) AS FILE_NM, ";
            sSql += "	  B.TOT_AMT, ";
            sSql += "	  TO_CHAR(TO_DATE(A.INS_DT,'YYYYMMDDHH24MISS'),'YYYY.MM.DD') AS INS_DT, ";
            sSql += "	  TO_CHAR(ADD_MONTHS(TO_DATE(A.INS_DT,'YYYYMMDDHH24MISS'), 1),'YYYY.MM.DD') AS ADD_DT, ";
            sSql += "	 '견적' AS TITLE  ";
            sSql += "	  FROM QUOT_REQ_MST A";
            sSql += "	  LEFT OUTER JOIN  QUOT_MNG_MST B ON A.REQ_NO = B.REQ_MNGT_NO";
            sSql += " WHERE REQ_NO = '" + dr["MNGT_NO"].ToString() + "'";
            if (dr.Table.Columns.Contains("QUOT_NO"))
            {
                sSql += " AND QUOT_NO = '"+dr["QUOT_NO"].ToString()+"'"; 
            }


            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);
            return dt;
        }

        public static DataTable SelectBkgList(DataRow dr)
        {

            sSql = " SELECT B.AREA , ";
            sSql += "             B.ITEM_NM, ";
            sSql += "	  A.BKG_NO, ";
            sSql += "             A.CUST_EMAIL AS REQ_EMAIL, ";
            sSql += "	  (SELECT PSWD FROM CUST_INFO WHERE EMAIL = A.CUST_EMAIL) AS PSWD, ";
            sSql += "             TO_CHAR(TO_DATE(B.STRT_YMD),'YYYY.MM.DD') AS STRT_YMD, ";
            sSql += "             TO_CHAR(TO_DATE(B.END_YMD),'YYYY.MM.DD') AS END_YMD, ";
            sSql += "             B.MIN_PRC, ";
            sSql += "             B.MAX_PRC, ";
            sSql += "             B.HEAD_CNT, ";
            sSql += "             TO_CHAR(TO_DATE(A.INS_DT,'YYYYMMDDHH24MISS'),'YYYY.MM.DD') AS INS_DT, ";
            sSql += "            '예약확정' AS TITLE, ";
            sSql += "            C.TOT_AMT, ";
            sSql += "            A.FILE_PATH, ";
            sSql += "            A.FILE_NM ";
            sSql += "  FROM BKG_MST A  ";
            sSql += "  LEFT OUTER JOIN QUOT_REQ_MST B ON A.REQ_NO = B.REQ_NO   ";
            sSql += "  LEFT OUTER JOIN QUOT_MNG_MST C ON A.QUOT_NO = C.QUOT_NO ";
            sSql += "  WHERE 1 = 1";
            sSql += "  AND A.BKG_NO = '" + dr["BKG_NO"].ToString() + "'";

            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);
            return dt;
        }

        /// <summary>
        /// 신규 견적 헤더 저장 및 업데이트
        /// </summary>
        /// <param name="dr"></param>
        /// <returns></returns>
        public static bool SaveMngQuotList_Query(DataRow dr)
        {
            sSql = "";
            sSql += "MERGE INTO QUOT_MNG_MST ";
            sSql += " USING DUAL ";
            sSql += "   ON (QUOT_NO = '" + dr["QUOT_NO"].ToString().Trim() + "') ";
            // 업데이트
            sSql += "   WHEN MATCHED THEN ";
            sSql += "      UPDATE SET TOT_AMT = '" + dr["TOT_AMT"].ToString().Trim() + "',  ";
            sSql += "                 ITEM_NM = '"+dr["ITEM_NM"].ToString().Trim()+"' , ";
            sSql += "                 ITEM_CD = '" + dr["ITEM_CD"].ToString().Trim() + "' , ";
            sSql += "                 FILE_PATH = '" + dr["FILE_PATH"].ToString().Trim() + "' , ";
            sSql += "                 FILE_NM = '" + dr["FILE_NM"].ToString().Trim() + "' , ";
            sSql += "                 QUOT_DT = TO_CHAR(SYSDATE,'YYYYMMDD') , ";
            sSql += "                 UPD_USR = 'WEB', ";
            sSql += "                 UPD_DT = TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS') ";

            //추가
            sSql += "   WHEN NOT MATCHED THEN ";
            sSql += "       INSERT (QUOT_NO , REQ_MNGT_NO , TOT_AMT, RMK, HEAD_CNT, AREA, ITEM_CD , ITEM_NM, FILE_NM , FILE_PATH, INS_USR, INS_DT , QUOT_DT )";
            sSql += "       VALUES( ";
            sSql += "               '" + dr["QUOT_NO"].ToString().Trim() + "', ";
            sSql += "               '" + dr["REQ_NO"].ToString().Trim() + "', ";
            sSql += "               '" + dr["TOT_AMT"].ToString().Trim() + "', ";
            sSql += "               '" + dr["RMK"].ToString().Trim() + "', ";
            sSql += "               '" + dr["HEAD_CNT"].ToString().Trim() + "', ";
            sSql += "               '" + dr["AREA"].ToString().Trim() + "', ";
            sSql += "               '" + dr["ITEM_CD"].ToString().Trim() + "', ";
            sSql += "               '" + dr["ITEM_NM"].ToString().Trim() + "', ";
            sSql += "               '" + dr["FILE_NM"].ToString().Trim() + "', ";
            sSql += "               '" + dr["FILE_PATH"].ToString().Trim() + "', ";
            sSql += "               'WEB', ";
            sSql += "               TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS'),";
            sSql += "               TO_CHAR(SYSDATE,'YYYYMMDD')";
            sSql += "               ) ";



            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }


        public static DataTable SelectEasyList_Qyuery(DataRow dr)
        {


            sSql = "";

            sSql += "SELECT *  FROM QUOT_MNG_MST ";
            sSql += " WHERE QUOT_NO = '" +dr["QUOT_NO"].ToString()+"' ";
            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);
            return dt;
        }

        public static DataTable SelectToastMessage()
        {

            sSql = " SELECT 'A' AS TITLE , COUNT(A.REQ_NO) AS MNGT_NO FROM QUOT_REQ_MST  A WHERE STATUS = 'N'";
            sSql += " UNION";
            sSql += " SELECT 'B' AS TITLE , COUNT(A.BKG_NO) AS MNGT_NO FROM BKG_MST A WHERE BKG_STATUS = 'N'";
            sSql += " UNION";
            sSql += " SELECT 'C' AS TITLE , COUNT(A.MNGT_NO) AS MNGT_NO FROM INQUIRY_MST A WHERE STATUS = 'N'";
            sSql += " UNION";
            sSql += " SELECT 'D' AS TITLE , COUNT(A.BKG_MOD_NO) AS MNGT_NO FROM BKG_MOD_MST A WHERE MOD_YN = 'N'";


            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);
            return dt;
        }
        #region 온라인 견적 저장시 





        public static bool SaveMngCONF_Query(DataRow dr)
        {
            sSql = "";


            sSql += "MERGE INTO QUOT_MNG_CONF ";
            sSql += " USING DUAL ";
            sSql += "   ON (QUOT_NO = '" + dr["QUOT_NO"].ToString().Trim() + "'";
            sSql += "       AND QUOT_SEQ = '"+dr["REQ_SEQ"].ToString().Trim()+"' )";

            sSql += " WHEN MATCHED THEN ";
            sSql += "       UPDATE SET CONF_TYPE = '"+dr["CONF_TYPE"].ToString().Trim()+"', ";
            sSql += "                  UPD_USR = 'WEB', ";
            if(dr["PRC"].ToString().Trim() != "") // 수정 저장시에는 저장
            {
                sSql += "                  PRC = '" + dr["PRC"].ToString().Trim() + "' ";
            }
            sSql += "                  UPD_DT = TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS') ";


            sSql += "WHEN NOT MATCHED THEN ";

            sSql += "INSERT (QUOT_NO, QUOT_SEQ, CONF_TYPE , INS_USR, INS_DT) VALUES( ";
            sSql += " '" +dr["QUOT_NO"].ToString().Trim()+"' ";
            sSql += " , '"+dr["REQ_SEQ"].ToString().Trim()+"' ";
            sSql += " , '"+dr["CONF_TYPE"].ToString().Trim()+"' ";
            sSql += " , 'WEB' ";
            sSql += " , TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS') ";
            sSql += " )";
            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;

        }



        public static bool SaveMngROOM_Query(DataRow dr)
        {
            sSql = "";


            sSql += "MERGE INTO QUOT_MNG_ROOM ";
            sSql += " USING DUAL ";
            sSql += "   ON (QUOT_NO = '" + dr["QUOT_NO"].ToString().Trim() + "'";
            sSql += "       AND QUOT_SEQ = '" + dr["REQ_SEQ"].ToString().Trim() + "' )";

            sSql += " WHEN MATCHED THEN ";
            sSql += "       UPDATE SET ROOM_NM = '" + dr["ROOM_NM"].ToString().Trim() + "', ";
            sSql += "                  ROOM_CNT = '" + dr["ROOM_CNT"].ToString().Trim() + "', ";
            sSql += "                  UPD_USR = 'WEB', ";
            if (dr["PRC"].ToString().Trim() != "") // 수정 저장시에는 저장
            {
                sSql += "                  PRC = '" + dr["PRC"].ToString().Trim() + "' ";
            }
            sSql += "                  UPD_DT = TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS') ";


            sSql += "WHEN NOT MATCHED THEN ";

            sSql += "INSERT (QUOT_NO, QUOT_SEQ, ROOM_NM , ROOM_CNT , INS_USR, INS_DT) VALUES( ";
            sSql += " '" + dr["QUOT_NO"].ToString().Trim() + "' ";
            sSql += " , '" + dr["REQ_SEQ"].ToString().Trim() + "' ";
            sSql += " , '" + dr["ROOM_NM"].ToString().Trim() + "' ";
            sSql += " , '" + dr["ROOM_CNT"].ToString().Trim() + "' ";
            sSql += " , 'WEB' ";
            sSql += " , TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS') ";
            sSql += " )";
            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;

        }




        public static bool SaveMngMEAL_Query(DataRow dr)
        {
            sSql = "";


            sSql += "MERGE INTO QUOT_MNG_MEAL ";
            sSql += " USING DUAL ";
            sSql += "   ON (QUOT_NO = '" + dr["QUOT_NO"].ToString().Trim() + "'";
            sSql += "       AND QUOT_SEQ = '" + dr["REQ_SEQ"].ToString().Trim() + "' )";

            sSql += " WHEN MATCHED THEN ";
            sSql += "       UPDATE SET MEAL_NM = '" + dr["MEAL_NM"].ToString().Trim() + "', ";
            sSql += "                  UPD_USR = 'WEB', ";
            if (dr["PRC"].ToString().Trim() != "") // 수정 저장시에는 저장
            {
                sSql += "                  PRC = '" + dr["PRC"].ToString().Trim() + "' ";
            }
            sSql += "                  UPD_DT = TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS') ";


            sSql += "WHEN NOT MATCHED THEN ";

            sSql += "INSERT (QUOT_NO, QUOT_SEQ, MEAL_NM , INS_USR, INS_DT) VALUES( ";
            sSql += " '" + dr["QUOT_NO"].ToString().Trim() + "' ";
            sSql += " , '" + dr["REQ_SEQ"].ToString().Trim() + "' ";
            sSql += " , '" + dr["MEAL_NM"].ToString().Trim() + "' ";
            sSql += " , 'WEB' ";
            sSql += " , TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS') ";
            sSql += " )";
            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;

        }



        public static bool SaveMngSVC_Query(DataRow dr)
        {
            sSql = "";


            sSql += "MERGE INTO QUOT_MNG_SVC ";
            sSql += " USING DUAL ";
            sSql += "   ON (QUOT_NO = '" + dr["QUOT_NO"].ToString().Trim() + "'";
            sSql += "       AND QUOT_SEQ = '" + dr["REQ_SEQ"].ToString().Trim() + "' )";

            sSql += " WHEN MATCHED THEN ";
            sSql += "       UPDATE SET SVC_NM = '" + dr["SVC_NM"].ToString().Trim() + "', ";
            sSql += "                  UPD_USR = 'WEB', ";
            if (dr["PRC"].ToString().Trim() != "") // 수정 저장시에는 저장
            {
                sSql += "                  PRC = '" + dr["PRC"].ToString().Trim() + "' ";
            }
            sSql += "                  UPD_DT = TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS') ";


            sSql += "WHEN NOT MATCHED THEN ";

            sSql += "INSERT (QUOT_NO, QUOT_SEQ, SVC_NM , INS_USR, INS_DT) VALUES( ";
            sSql += " '" + dr["QUOT_NO"].ToString().Trim() + "' ";
            sSql += " , '" + dr["REQ_SEQ"].ToString().Trim() + "' ";
            sSql += " , '" + dr["SVC_NM"].ToString().Trim() + "' ";
            sSql += " , 'WEB' ";
            sSql += " , TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS') ";
            sSql += " )";
            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;

        }




        public static DataSet SelectOnLineALL(DataRow dr)
        {
            DataSet ds = new DataSet();
            string mngt_no = "";

            #region 헤더 조회 쿼리
            sSql = "";
            sSql += "SELECT 'Q' AS INSFLAG , A.* , '' AS TOT_AMT , A.REQ_MNGT_NO AS REQ_NO , B.STRT_YMD, B.END_YMD,  B.REQ_NM ,  B.REQ_EMAIL, B.REQ_TEL, B.MIN_PRC , B.MAX_PRC , B.RMK";
            sSql += " FROM QUOT_MNG_MST A ";
            sSql += " LEFT JOIN QUOT_REQ_MST B ";
            sSql += " ON A.REQ_MNGT_NO = B.REQ_NO ";
            sSql += " WHERE 1=1 ";
            if (dr["QUOT_NO"].ToString() != "" )
            {
                sSql += " AND QUOT_NO = '" + dr["QUOT_NO"].ToString() + "' ";
            }
            
            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);
            dt.TableName = "MAIN";
            ds.Tables.Add(dt);
            mngt_no = dt.Rows[0]["QUOT_NO"].ToString();
            #endregion



            #region 디테일 조회
            sSql = "";
            sSql += "SELECT 'Q' AS INSFLAG, A.* FROM QUOT_MNG_CONF A ";
            sSql += "WHERE 1=1 ";
            sSql += "AND A.QUOT_NO = '" + mngt_no + "' ";

            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);
            dt.TableName = "CONF";
            ds.Tables.Add(dt);


            sSql = "";
            sSql += "SELECT 'Q' AS INSFLAG, A.* FROM QUOT_MNG_ROOM A ";
            sSql += "WHERE 1=1 ";
            sSql += "AND A.QUOT_NO = '" + mngt_no + "' ";

            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);
            dt.TableName = "ROOM";
            ds.Tables.Add(dt);


            sSql = "";
            sSql += "SELECT 'Q' AS INSFLAG, A.* FROM QUOT_MNG_MEAL A ";
            sSql += "WHERE 1=1 ";
            sSql += "AND A.QUOT_NO = '" + mngt_no + "' ";

            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);
            dt.TableName = "MEAL";
            ds.Tables.Add(dt);


            sSql = "";
            sSql += "SELECT 'Q' AS INSFLAG, A.* FROM QUOT_MNG_SVC A ";
            sSql += "WHERE 1=1 ";
            sSql += "AND A.QUOT_NO = '" + mngt_no + "' ";

            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);
            dt.TableName = "SVC";
            ds.Tables.Add(dt);

            #endregion


            dt = new DataTable();
            dt.Columns.Add("trxCode");
            dt.Columns.Add("trxMsg");
            DataRow row1 = dt.NewRow();
            row1["trxCode"] = "Y";
            row1["trxMsg"] = "success";
            dt.Rows.Add(row1);
            dt.TableName = "Result";
            ds.Tables.Add(dt);


            return ds;
        }


        #endregion


        /// <summary>
        /// 헤더 + 리스트 조회 쿼리
        /// </summary>
        /// <param name="dr"></param>
        /// <returns></returns>
        public static DataTable SelectThisQoutListAll_Query(DataRow dr)
        {
            sSql = "";

            #region 헤더 정보
            //sSql += "SELECT 'M' AS INSFLAG ";
            //sSql += "     , '' AS QUOT_NO ";
            //sSql += "     , QUOT_TYPE ";
            //sSql += "     , STATUS ";
            //sSql += "     , AREA ";
            //sSql += "     , ITEM_CD ";
            //sSql += "     , ITEM_NM ";
            //sSql += "     , STRT_YMD ";
            //sSql += "     , END_YMD ";
            //sSql += "     , MIN_PRC ";
            //sSql += "     , MAX_PRC ";
            //sSql += "     , HEAD_CNT ";
            //sSql += "     , RMK ";
            //sSql += "     , REQ_NM ";
            //sSql += "     , REQ_EMAIL ";
            //sSql += "     , REQ_TEL ";
            //sSql += "     , FILE_NM ";
            //sSql += "     , FILE_PATH ";
            //sSql += "     , EMAIL_YN ";
            //sSql += "     , '' AS TOT_AMT ";
            //sSql += " FROM QUOT_REQ_MST ";
            //sSql += " WHERE REQ_NO = '"+dr["REQ_NO"].ToString().Trim()+"' ";


            #endregion

            //sSql += " UNION ";

            #region 견적 자료들 

            sSql += " SELECT 'Q' AS INSFLAG ";
            sSql += "       , QMM.QUOT_NO ";
            sSql += "       , RM.REQ_NO ";
            sSql += "       , RM.QUOT_TYPE ";
            sSql += "       , RM.STATUS ";
            sSql += "       , QMM.AREA ";
            sSql += "       , QMM.ITEM_CD ";
            sSql += "       , QMM.ITEM_NM ";
            sSql += "       , RM.STRT_YMD ";
            sSql += "       , RM.END_YMD ";
            sSql += "       , RM.MIN_PRC ";
            sSql += "       , RM.MAX_PRC ";
            sSql += "       , RM.HEAD_CNT ";
            sSql += "       , QMM.RMK ";
            sSql += "       , RM.REQ_NM ";
            sSql += "       , RM.REQ_EMAIL ";
            sSql += "       , RM.REQ_TEL ";
            sSql += "       , QMM.QUOT_NM AS FILE_NM ";
            sSql += "       , QMM.QUOT_PATH AS FILE_PATH ";
            sSql += "       , RM.EMAIL_YN ";
            sSql += "       , QMM.TOT_AMT ";
            sSql += " FROM QUOT_MNG_MST QMM ";
            sSql += " JOIN QUOT_REQ_MST RM ";
            sSql += "   ON QMM.REQ_MNGT_NO = RM.REQ_NO ";
            sSql += "  AND QMM.REQ_MNGT_NO = '"+dr["REQ_NO"].ToString().Trim()+"' ";
            sSql += "  AND qMM.QUOT_NO = '"+dr["QUOT_NO"].ToString().Trim()+"' ";

            #endregion





            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);
            return dt;


        }

        #region 세미나 정보
        /// <summary>
        /// 조회
        /// </summary>
        /// <param name="dr"></param>
        /// <returns></returns>
        public static DataTable SelectQtuotConfDtl(DataRow dr)
        {

            sSql = "";

            sSql += " SELECT 'Q' AS INSFLAG ";
            sSql += "       , QUOT_NO ";
            sSql += "       , QUOT_SEQ ";
            sSql += "       , ITEM_CD  AS CONF_CD ";
            sSql += "       , CONF_TYPE ";
            sSql += "       , PRC ";
            sSql += "       , NVL((SELECT SUM(PRC) FROM QUOT_MNG_CONF WHERE QUOT_NO = '"+dr["QUOT_NO"].ToString().Trim()+"'),0) AS TOT_PRC  ";
            sSql += " FROM QUOT_MNG_CONF ";
            sSql += " WHERE QUOT_NO = '"+dr["QUOT_NO"].ToString().Trim()+"' ";
            sSql += " ORDER BY QUOT_SEQ ";

            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);
            return dt;
        }


        public static bool InsertConfDtl(DataRow dr)
        {
            sSql = "";

            sSql += "INSERT INTO QUOT_MNG_CONF ";
            sSql += " ( QUOT_NO , QUOT_SEQ, CONF_TYPE  , PRC , INS_USR , INS_DT) ";
            sSql += " VALUES (";
            sSql += "  '"+dr["QUOT_NO"].ToString().Trim()+"' ";
            sSql += " , (SELECT NVL(MAX(QUOT_SEQ),0)+1 FROM QUOT_MNG_CONF WHERE QUOT_NO = '"+dr["QUOT_NO"] +"')";
            sSql += " , '" + dr["CONF_TYPE"].ToString().Trim() + "' ";
            sSql += " , '" + dr["PRC"].ToString().Trim() + "' ";
            sSql += " , 'WEB' ";
            sSql += " , TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS') ";
            sSql += ") ";


            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }

        public static bool InsertConfDtlFirst(DataRow dr,string MNGT_NO)
        {
            sSql = "";

            sSql += "INSERT INTO QUOT_MNG_CONF ";
            sSql += " ( QUOT_NO , QUOT_SEQ, CONF_TYPE  , PRC , INS_USR , INS_DT) ";
            sSql += " VALUES (";
            sSql += "  '" + MNGT_NO + "' ";
            sSql += " , (SELECT NVL(MAX(QUOT_SEQ),0)+1 FROM QUOT_MNG_CONF WHERE QUOT_NO = '" + MNGT_NO + "')";
            sSql += " , '" + dr["CONF_TYPE"].ToString().Trim() + "' ";
            sSql += " , '" + dr["PRC"].ToString().Trim() + "' ";
            sSql += " , 'WEB' ";
            sSql += " , TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS') ";
            sSql += ") ";


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

            sSql += "UPDATE QUOT_MNG_CONF ";
            sSql += "   SET CONF_TYPE = '" + dr["CONF_TYPE"].ToString().Trim() + "' ";
            sSql += "     , PRC = '" + dr["PRC"].ToString().Trim() + "' ";
            sSql += "     , UPD_USR = 'WEB'";
            sSql += "     , UPD_DT = TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS') ";
            sSql += "   WHERE 1=1 ";
            sSql += "   AND QUOT_NO = '" + dr["QUOT_NO"].ToString().Trim() + "' ";
            sSql += "   AND QUOT_SEQ = '" + dr["QUOT_SEQ"].ToString().Trim() + "' ";



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
            sSql += " DELETE QUOT_MNG_CONF ";
            sSql += "       WHERE 1=1 ";
            sSql += "       AND QUOT_NO = '" + dr["QUOT_NO"].ToString().Trim() + "' ";
                sSql += "       AND QUOT_SEQ = '" + dr["QUOT_SEQ"].ToString().Trim() + "' ";


            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }


        /// <summary>
        /// 상품 변경시
        /// </summary>
        /// <param name="MNGT_NO"></param>
        /// <returns></returns>
        public static bool DeleteConfDtlALL(string MNGT_NO)
        {
            sSql = "";
            sSql += " DELETE QUOT_MNG_CONF ";
            sSql += "       WHERE 1=1 ";
            sSql += "       AND QUOT_NO = '"+MNGT_NO+"' ";

            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }

        #endregion


        #region 식사 정보
        public static DataTable SelectQtuotMealDtl(DataRow dr)
        {

            sSql = "";

            sSql += " SELECT 'Q' AS INSFLAG ";
            sSql += "       , QUOT_NO ";
            sSql += "       , QUOT_SEQ ";
            sSql += "       , MEAL_CD ";
            sSql += "       , MEAL_NM ";
            sSql += "       , PRC ";
            sSql += "       , NVL((SELECT SUM(PRC) FROM QUOT_MNG_MEAL WHERE QUOT_NO='"+dr["QUOT_NO"].ToString().Trim()+"'),0)AS TOT_PRC ";
            sSql += " FROM QUOT_MNG_MEAL ";
            sSql += " WHERE QUOT_NO = '" + dr["QUOT_NO"].ToString().Trim() + "' ";
            sSql += " ORDER BY QUOT_SEQ ";

            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);
            return dt;
        }



        public static bool InsertMealDtl(DataRow dr)
        {
            sSql = "";

            sSql += "INSERT INTO QUOT_MNG_MEAL ";
            sSql += " ( QUOT_NO , QUOT_SEQ, MEAL_CD, MEAL_NM  , PRC , INS_USR , INS_DT) ";
            sSql += " VALUES (";
            sSql += "  '" + dr["QUOT_NO"].ToString().Trim() + "' ";
            sSql += " , (SELECT NVL(MAX(QUOT_SEQ),0)+1 FROM QUOT_MNG_MEAL WHERE QUOT_NO = '" + dr["QUOT_NO"] + "')";
            sSql += " , '" + dr["MEAL_CD"].ToString().Trim() + "' ";
            sSql += " , '" + dr["MEAL_NM"].ToString().Trim() + "' ";
            sSql += " , '" + dr["PRC"].ToString().Trim() + "' ";
            sSql += " , 'WEB' ";
            sSql += " , TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS') ";
            sSql += ") ";


            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }

        public static bool InsertMealDtlFirst(DataRow dr, string MNGT_NO)
        {
            sSql = "";

            sSql += "INSERT INTO QUOT_MNG_MEAL ";
            sSql += " ( QUOT_NO , QUOT_SEQ, MEAL_CD, MEAL_NM  , PRC , INS_USR , INS_DT) ";
            sSql += " VALUES (";
            sSql += "  '" + MNGT_NO + "' ";
            sSql += " , (SELECT NVL(MAX(QUOT_SEQ),0)+1 FROM QUOT_MNG_MEAL WHERE QUOT_NO = '" + MNGT_NO + "')";
            sSql += " , '" + dr["MEAL_CD"].ToString().Trim() + "' ";
            sSql += " , '" + dr["MEAL_NM"].ToString().Trim() + "' ";
            sSql += " , '" + dr["PRC"].ToString().Trim() + "' ";
            sSql += " , 'WEB' ";
            sSql += " , TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS') ";
            sSql += ") ";


            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }

        #endregion


        #region 숙박 정보

        public static DataTable SelectQtuotRoomDtl(DataRow dr)
        {

            sSql = "";

            sSql += " SELECT 'Q' AS INSFLAG ";
            sSql += "       , QUOT_NO ";
            sSql += "       , QUOT_SEQ ";
            sSql += "       , ROOM_NM ";
            sSql += "       , ROOM_CNT ";
            sSql += "       , PRC ";
            sSql += "       , NVL((SELECT SUM(PRC) FROM QUOT_MNG_ROOM WHERE QUOT_NO = '"+dr["QUOT_NO"].ToString().Trim()+"'),0) AS TOT_PRC ";
            sSql += " FROM QUOT_MNG_ROOM ";
            sSql += " WHERE QUOT_NO = '" + dr["QUOT_NO"].ToString().Trim() + "' ";
            sSql += " ORDER BY QUOT_SEQ ";

            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);
            return dt;
        }

        public static bool InsertRoomDtl(DataRow dr)
        {
            sSql = "";

            sSql += "INSERT INTO QUOT_MNG_ROOM ";
            sSql += " ( QUOT_NO , QUOT_SEQ, ROOM_NM , ROOM_CNT  , PRC , INS_USR , INS_DT) ";
            sSql += " VALUES (";
            sSql += " '" + dr["QUOT_NO"].ToString().Trim() + "' ";
            sSql += " , (SELECT NVL(MAX(QUOT_SEQ),0)+1 FROM QUOT_MNG_ROOM WHERE QUOT_NO = '" + dr["QUOT_NO"] + "')";
            sSql += " , '" + dr["ROOM_NM"].ToString().Trim() + "' ";
            sSql += " , '" + dr["ROOM_CNT"].ToString().Trim() + "' ";
            sSql += " , '" + dr["PRC"].ToString().Trim() + "' ";
            sSql += " , 'WEB' ";
            sSql += " , TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS') ";
            sSql += ") ";


            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }

        public static bool InsertRoomDtlFirst(DataRow dr, string MNGT_NO)
        {
            sSql = "";

            sSql += "INSERT INTO QUOT_MNG_ROOM ";
            sSql += " ( QUOT_NO , QUOT_SEQ, ROOM_NM , ROOM_CNT  , PRC , INS_USR , INS_DT) ";
            sSql += " VALUES (";
            sSql += " '" + MNGT_NO  + "' ";
            sSql += " , (SELECT NVL(MAX(QUOT_SEQ),0)+1 FROM QUOT_MNG_ROOM WHERE QUOT_NO = '" + MNGT_NO + "')";
            sSql += " , '" + dr["ROOM_NM"].ToString().Trim() + "' ";
            sSql += " , '" + dr["ROOM_CNT"].ToString().Trim() + "' ";
            sSql += " , '" + dr["PRC"].ToString().Trim() + "' ";
            sSql += " , 'WEB' ";
            sSql += " , TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS') ";
            sSql += ") ";


            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }


        #endregion


        #region 부가서비스 정보

        public static DataTable SelectQtuotSvcDtl(DataRow dr)
        {

            sSql = "";

            sSql += " SELECT 'Q' AS INSFLAG ";
            sSql += "       , QUOT_NO ";
            sSql += "       , QUOT_SEQ ";
            sSql += "       , SVC_CD ";
            sSql += "       , SVC_NM ";
            sSql += "       , PRC AS PRC";
            sSql += "       , NVL((SELECT SUM(PRC) FROM QUOT_MNG_SVC WHERE QUOT_NO = '"+dr["QUOT_NO"].ToString().Trim()+"'),0) AS TOT_PRC";
            sSql += " FROM QUOT_MNG_SVC ";
            sSql += " WHERE QUOT_NO = '" + dr["QUOT_NO"].ToString().Trim() + "' ";
            sSql += " ORDER BY QUOT_SEQ ";

            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);
            return dt;
        }


        public static bool InsertSvcDtl(DataRow dr)
        {
            sSql = "";

            sSql += "INSERT INTO QUOT_MNG_SVC ";
            sSql += " ( QUOT_NO , QUOT_SEQ, SVC_CD, SVC_NM  , PRC , INS_USR , INS_DT) ";
            sSql += " VALUES (";
            sSql += " '" + dr["QUOT_NO"].ToString().Trim() + "' ";
            sSql += " , (SELECT NVL(MAX(QUOT_SEQ),0)+1 FROM QUOT_MNG_SVC WHERE QUOT_NO = '" + dr["QUOT_NO"] + "')";
            sSql += " , '" + dr["SVC_CD"].ToString().Trim() + "' ";
            sSql += " , '" + dr["SVC_NM"].ToString().Trim() + "' ";
            sSql += " , '" + dr["PRC"].ToString().Trim() + "' ";
            sSql += " , 'WEB' ";
            sSql += " , TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS') ";
            sSql += ") ";


            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }


        public static bool InsertSvcDtlFirst(DataRow dr,string MNGT_NO)
        {
            sSql = "";

            sSql += "INSERT INTO QUOT_MNG_SVC ";
            sSql += " ( QUOT_NO , QUOT_SEQ, SVC_CD, SVC_NM  , PRC , INS_USR , INS_DT) ";
            sSql += " VALUES (";
            sSql += " '" + MNGT_NO + "' ";
            sSql += " , (SELECT NVL(MAX(QUOT_SEQ),0)+1 FROM QUOT_MNG_SVC WHERE QUOT_NO = '" + MNGT_NO + "')";
            sSql += " , '" + dr["SVC_CD"].ToString().Trim() + "' ";
            sSql += " , '" + dr["SVC_NM"].ToString().Trim() + "' ";
            sSql += " , '" + dr["PRC"].ToString().Trim() + "' ";
            sSql += " , 'WEB' ";
            sSql += " , TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS') ";
            sSql += ") ";


            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }

        #endregion


        public static DataTable SelectQuotManage(DataRow dr)
        {
            sSql = "  SELECT 'Q' AS INSFLAG ";
            sSql += "  , A.REQ_MNGT_NO AS REQ_NO ";
            sSql += "  , A.ITEM_CD ";
            sSql += "  , A.ITEM_NM ";
            sSql += "  , A.AREA ";
            sSql += "  , MAX(A.INS_DT) AS INS_DT ";
            sSql += "  , MAX(B.QUOT_TYPE) AS QUOT_TYPE ";
            sSql += "  , MAX(B.STATUS) AS STATUS ";
            sSql += "  , MAX(B.STRT_YMD) AS STRT_YMD ";
            sSql += "  , MAX(B.END_YMD) AS END_YMD ";
            sSql += "  , MAX(B.REQ_NM) AS REQ_NM ";
            sSql += "  , MAX(B.REQ_CUST_NM) AS REQ_CUST_NM ";
            sSql += "  , MAX(B.REQ_EMAIL) AS REQ_EMAIL ";
            sSql += "  , MAX(B.REQ_TEL) AS REQ_TEL ";
            sSql += "  , COUNT(A.REQ_MNGT_NO) AS QUOT_SEQ ";
            sSql += "  FROM QUOT_MNG_MST A ";
            sSql += "  LEFT OUTER JOIN QUOT_REQ_MST B ON A.REQ_MNGT_NO = B.REQ_NO ";
            sSql += "  WHERE 1 = 1";
            sSql += "  AND USER_TYPE != 'B'";
            //if (dr["STRT_YMD"].ToString() != "")
            //{
            //    sSql += "AND STRT_YMD = '" + dr["STRT_YMD"].ToString() + "'";
            //}
            //if (dr["END_YMD"].ToString() != "")
            //{
            //    sSql += "AND END_YMD = '" + dr["END_YMD"].ToString() + "'";
            //}
            if (dr.Table.Columns.Contains("AREA"))
            {
                if (dr["AREA"].ToString() != "")
                {
                    sSql += "AND AREA = '" + dr["AREA"].ToString() + "'";
                }
            }
            if (dr.Table.Columns.Contains("REQ_NM"))
            {
                if (dr["REQ_NM"].ToString() != "")
                {
                    sSql += "AND REQ_NM LIKE '%" + dr["REQ_NM"].ToString() + "%'";
                }
            }
            if (dr.Table.Columns.Contains("STATUS"))
            {
                if (dr["STATUS"].ToString() != "")
                {
                    sSql += "AND EMAIL_YN = '" + dr["STATUS"].ToString() + "'";
                }
            }
            if (dr.Table.Columns.Contains("QUOT_TYPE"))
            {
                if (dr["QUOT_TYPE"].ToString() != "" && dr["QUOT_TYPE"].ToString() != "ALL")
                {
                    sSql += "AND QUOT_TYPE = '" + dr["QUOT_TYPE"].ToString() + "'";
                }
            }
            if (dr.Table.Columns.Contains("REQ_NM"))
            {
                if (dr["REQ_NM"].ToString() != "")
                {
                    sSql += "AND REQ_NM LIKE '%" + dr["REQ_NM"].ToString() + "%'";
                }
            }
            if (dr.Table.Columns.Contains("REQ_CUST_NM"))
            {
                if (dr["REQ_CUST_NM"].ToString() != "")
                {
                    sSql += "AND REQ_CUST_NM LIKE '%" + dr["REQ_CUST_NM"].ToString() + "%'";
                }
            }
            if (dr.Table.Columns.Contains("ITEM_NM"))
            {
                if (dr["ITEM_NM"].ToString() != "")
                {
                    sSql += "AND A.ITEM_NM LIKE '%" + dr["ITEM_NM"].ToString() + "%'";
                }
            }


            sSql += "  GROUP BY REQ_MNGT_NO , A.AREA, A.ITEM_CD , A.ITEM_NM ";
            sSql += "  ORDER BY INS_DT DESC";
            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);
            return dt;
        }


        public static DataTable SelectQuotManageDetail(DataRow dr)
        {
            sSql = "SELECT 'Q' AS INSFLAG,	";
            sSql += "       A.QUOT_NO,	";
            sSql += "       A.REQ_MNGT_NO AS REQ_NO,	";
            sSql += "       B.QUOT_TYPE AS QUOT_TYPE,	";
            sSql += "       B.STATUS AS STATUS,	";
            sSql += "       B.AREA,	";
            sSql += "       A.ITEM_CD,	";
            sSql += "       A.ITEM_NM,	";
            sSql += "       B.MIN_PRC,	";
            sSql += "       B.MAX_PRC,	";
            sSql += "       B.HEAD_CNT,	";
            sSql += "       B.RMK,	";
            sSql += "       A.FILE_NM,	";
            sSql += "       A.FILE_PATH,	";
            sSql += "       A.EMAIL_YN,	";
            sSql += "       A.TOT_AMT,	";
            sSql += "       B.STRT_YMD AS STRT_YMD,	";
            sSql += "       B.END_YMD AS END_YMD,	";
            sSql += "       B.REQ_NM AS REQ_NM,	";
            sSql += "       B.REQ_CUST_NM AS REQ_CUST_NM,	";
            sSql += "       B.REQ_EMAIL AS REQ_EMAIL,	";
            sSql += "       B.REQ_TEL AS REQ_TEL	";
            sSql += "  FROM    QUOT_MNG_MST A	";
            sSql += "       LEFT OUTER JOIN	";
            sSql += "          QUOT_REQ_MST B	";
            sSql += "       ON A.REQ_MNGT_NO = B.REQ_NO	";

            sSql += " WHERE 1 = 1 AND USER_TYPE IS NOT NULL AND A.REQ_MNGT_NO = '";
            if (dr.Table.Columns.Contains("MNGT_NO"))
            {
                sSql += dr["MNGT_NO"].ToString() + "'	";
            }
            else
            {
                sSql += dr["REQ_NO"].ToString() + "'	";
            }
            
            sSql += " ORDER BY NVL(A.UPD_DT,A.INS_DT) DESC";
            // 널 값이 아닌거

            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);

            return dt;
        }
        //조회
        public static DataTable SelectConfDetail(DataRow dr)
        {
            sSql = " SELECT 'Q' AS INSFLAG, A.* ";
            sSql += " FROM QUOT_MNG_CONF A ";
            sSql += " WHERE 1=1 ";
            sSql += " AND QUOT_NO = '" + dr["QUOT_NO"].ToString() + "' ";
            sSql += " ORDER BY ITEM_SEQ ";

            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);
            return dt;
        }

        //조회
        public static DataTable SelectRoomDetail(DataRow dr)
        {
            sSql = " SELECT 'Q' AS INSFLAG, A.* ";
            sSql += " FROM QUOT_MNG_ROOM A ";
            sSql += " WHERE 1=1 ";
            sSql += " AND QUOT_NO = '" + dr["QUOT_NO"].ToString() + "' ";
            sSql += " ORDER BY ITEM_SEQ ";

            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);
            return dt;
        }

        //조회
        public static DataTable SelectMealDetail(DataRow dr)
        {
            sSql = " SELECT 'Q' AS INSFLAG, A.* ";
            sSql += " FROM QUOT_MNG_MEAL A ";
            sSql += " WHERE 1=1 ";
            sSql += " AND QUOT_NO = '" + dr["QUOT_NO"].ToString() + "' ";
            sSql += " ORDER BY ITEM_SEQ ";

            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);
            return dt;
        }

        //조회
        public static DataTable SelectSVCDetail(DataRow dr)
        {
            sSql = " SELECT 'Q' AS INSFLAG, A.* ";
            sSql += " FROM ITEM_DTL_ETC A ";
            sSql += " WHERE 1=1 ";
            sSql += " AND QUOT_NO = '" + dr["QUOT_NO"].ToString() + "' ";
            sSql += " ORDER BY ITEM_SEQ ";

            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);
            return dt;
        }

        /// <summary>
        /// 숙박정보 업데이트
        /// </summary>
        /// <param name="dr"></param>
        /// <returns></returns>        
        public static bool UpdateRoomDtl(DataRow dr)
        {
            sSql = "";
            sSql += "UPDATE QUOT_MNG_ROOM ";
            sSql += "   SET ROOM_NM = '" + dr["ROOM_NM"].ToString().Trim() + "' ";
            sSql += "     , ROOM_CNT = '" + dr["ROOM_CNT"].ToString().Trim() + "' ";
            sSql += "     , PRC = '" + dr["PRC"].ToString().Trim() + "' ";
            sSql += "     , UPD_USR = 'WEB' ";
            sSql += "     , UPD_DT = TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS')";
            sSql += "   WHERE 1=1 ";
            sSql += "   AND QUOT_NO = '" + dr["QUOT_NO"].ToString().Trim() + "' ";
            sSql += "   AND QUOT_SEQ = '" + dr["QUOT_SEQ"].ToString().Trim() + "' ";


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
            sSql += "   AND QUOT_NO = '" + dr["QUOT_NO"].ToString().Trim() + "' ";
            sSql += "   AND QUOT_SEQ = '" + dr["QUOT_SEQ"].ToString().Trim() + "' ";

            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }


        public static bool DeleteRoomDtlALL(string MNGT)
        {
            sSql = "";
            sSql += "DELETE QUOT_MNG_ROOM ";
            sSql += "   WHERE 1=1 ";
            sSql += "   AND QUOT_NO = '" + MNGT + "' ";
            

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
            sSql += "UPDATE QUOT_MNG_MEAL ";
            sSql += "   SET MEAL_CD = '" + dr["MEAL_CD"].ToString().Trim() + "' ";
            sSql += "     , MEAL_NM = '" + dr["MEAL_NM"].ToString().Trim() + "' ";
            sSql += "     , PRC = '" + dr["PRC"].ToString().Trim() + "' ";
            sSql += "   WHERE 1=1 ";
            sSql += "   AND QUOT_NO = '" + dr["QUOT_NO"].ToString().Trim() + "' ";
            sSql += "   AND QUOT_SEQ = '" + dr["QUOT_SEQ"].ToString().Trim() + "' ";


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
            sSql += "DELETE QUOT_MNG_MEAL ";
            sSql += "   WHERE 1=1 ";
            sSql += "   AND QUOT_NO = '" + dr["QUOT_NO"].ToString().Trim() + "' ";
            sSql += "   AND QUOT_SEQ = '" + dr["QUOT_SEQ"].ToString().Trim() + "' ";

            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }


        public static bool DeleteMealDtlALL(string MNGT)
        {
            sSql = "";
            sSql += "DELETE QUOT_MNG_MEAL ";
            sSql += "   WHERE 1=1 ";
            sSql += "   AND QUOT_NO = '" + MNGT + "' ";
            

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
            sSql += "UPDATE QUOT_MNG_SVC ";
            sSql += "   SET SVC_CD = '" + dr["SVC_CD"].ToString().Trim() + "' ";
            sSql += "     , SVC_NM = '" + dr["SVC_NM"].ToString().Trim() + "' ";
            sSql += "     , PRC = '" + dr["PRC"].ToString().Trim() + "' ";
            sSql += "     , UPD_USR = 'WEB' ";
            sSql += "     , UPD_DT = TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS')";
            sSql += "   WHERE 1=1 ";
            sSql += "   AND QUOT_NO = '" + dr["QUOT_NO"].ToString().Trim() + "' ";
            sSql += "   AND QUOT_SEQ = '" + dr["QUOT_SEQ"].ToString().Trim() + "' ";

            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }

        public static bool DeleteSvcDtl(DataRow dr)
        {
            sSql = "";
            sSql += "DELETE QUOT_MNG_SVC ";
            sSql += "   WHERE 1=1 ";
            sSql += "   AND QUOT_NO = '" + dr["QUOT_NO"].ToString().Trim() + "' ";
            sSql += "   AND QUOT_SEQ = '" + dr["QUOT_SEQ"].ToString().Trim() + "' ";


            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }


        public static bool DeleteSvcDtlALL(string MNGT)
        {
            sSql = "";
            sSql += "DELETE QUOT_MNG_SVC ";
            sSql += "   WHERE 1=1 ";
            sSql += "   AND QUOT_NO = '" + MNGT + "' ";
           

            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }


        public static bool SaveQuotationConf(DataRow dr , string MNGT_NO)
        {
            sSql = "";
            sSql += "INSERT INTO QUOT_MNG_CONF(QUOT_NO , QUOT_SEQ , CONF_TYPE , PRC , INS_USR , INS_DT) ";
            sSql += "   VALUES (";
            sSql += "'" + MNGT_NO + "'";
            sSql += " , (SELECT NVL(MAX(QUOT_SEQ),0)+1 FROM QUOT_MNG_CONF WHERE QUOT_NO = '" + MNGT_NO + "')";
            sSql += " , '" + dr["REQ_CONTENT"] + "'";
            sSql += " , " + dr["PRC"];
            sSql += " , 'WEB'";
            sSql += " , TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS')";
            sSql += " )";

            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }

        public static bool SaveQuotationRoom(DataRow dr, string MNGT_NO)
        {
            sSql = "";
            sSql += "INSERT INTO QUOT_MNG_ROOM(QUOT_NO , QUOT_SEQ , ROOM_NM , ROOM_CNT , PRC , INS_USR , INS_DT) ";
            sSql += "   VALUES (";
            sSql += "'" + MNGT_NO + "'";
            sSql += " , (SELECT NVL(MAX(QUOT_SEQ),0)+1 FROM QUOT_MNG_ROOM WHERE QUOT_NO = '" + MNGT_NO + "')";
            sSql += " , '" + dr["REQ_CONTENT"] + "'";
            sSql += " , " + dr["REQ_NUM"];
            sSql += " , " + dr["PRC"];
            sSql += " , 'WEB'";
            sSql += " , TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS')";
            sSql += " )";

            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }

        public static bool SaveQuotationMeal(DataRow dr, string MNGT_NO)
        {
            sSql = "";
            sSql += "INSERT INTO QUOT_MNG_MEAL(QUOT_NO , QUOT_SEQ , MEAL_NM , PRC , INS_USR , INS_DT) ";
            sSql += "   VALUES (";
            sSql += "'" + MNGT_NO + "'";
            sSql += " , (SELECT NVL(MAX(QUOT_SEQ),0)+1 FROM QUOT_MNG_MEAL WHERE QUOT_NO = '" + MNGT_NO + "')";
            sSql += " , '" + dr["REQ_CONTENT"] + "'";
            sSql += " , " + dr["PRC"];
            sSql += " , 'WEB'";
            sSql += " , TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS')";
            sSql += " )";


            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }

        public static bool SaveQuotationSvc(DataRow dr, string MNGT_NO)
        {
            sSql = "";
            sSql += "INSERT INTO QUOT_MNG_SVC(QUOT_NO , QUOT_SEQ , SVC_NM , PRC , INS_USR , INS_DT) ";
            sSql += "   VALUES (";
            sSql += "'" + MNGT_NO + "'";
            sSql += " , (SELECT NVL(MAX(QUOT_SEQ),0)+1 FROM QUOT_MNG_SVC WHERE QUOT_NO = '" + MNGT_NO + "')";
            sSql += " , '" + dr["REQ_CONTENT"] + "'";
            sSql += " , " + dr["PRC"];
            sSql += " , 'WEB'";
            sSql += " , TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS')";
            sSql += " )";

            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }

        public static bool SaveQuotationHeader(DataRow dr, string MNGT_NO , int TOT_AMT)
        {
            sSql = "";
            sSql += "INSERT INTO QUOT_MNG_MST(QUOT_NO , REQ_MNGT_NO , TOT_AMT , ITEM_CD , ITEM_NM , QUOT_DT , QUOT_STATUS , HEAD_CNT , INS_USR , INS_DT) ";
            sSql += "   VALUES (";
            sSql += "'" + MNGT_NO + "'";
            sSql += " , '" + dr["REQ_NO"] + "'";
            sSql += " , " + TOT_AMT ; 
            sSql += " , (SELECT ITEM_CD FROM QUOT_REQ_MST WHERE REQ_NO = '" + dr["REQ_NO"] + "')";
            sSql += " , (SELECT ITEM_NM FROM QUOT_REQ_MST WHERE REQ_NO = '" + dr["REQ_NO"] + "')";
            sSql += " , TO_CHAR(SYSDATE,'YYYYMMDD')";
            sSql += " , 'Y'";
            sSql += " , (SELECT HEAD_CNT FROM QUOT_REQ_MST WHERE REQ_NO = '" + dr["REQ_NO"] + "')";
            sSql += " , 'WEB'";
            sSql += " , TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS')";
            sSql += " )";

            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }
        #region Ek 리뉴얼


        public static bool UpdateMngQuot(DataRow dr)
        {
            sSql = "";



            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }

        public static bool InsertNewMngtQuot(DataRow dr)
        {
            sSql = "";
            sSql += "MERGE INTO QUOT_MNG_MST ";
            sSql += " USING DUAL ";
            sSql += "   ON (QUOT_NO = '" + dr["QUOT_NO"].ToString().Trim() + "') ";
            // 업데이트
            sSql += "   WHEN MATCHED THEN ";
            sSql += "      UPDATE SET TOT_AMT = '" + dr["TOT_AMT"].ToString().Trim() + "',  ";
            sSql += "                 ITEM_NM = '" + dr["ITEM_NM"].ToString().Trim() + "' , ";
            sSql += "                 ITEM_CD = '" + dr["ITEM_CD"].ToString().Trim() + "' , ";
            sSql += "                 FILE_PATH = '" + dr["FILE_PATH"].ToString().Trim() + "' , ";
            sSql += "                 FILE_NM = '" + dr["FILE_NM"].ToString().Trim() + "' , ";
            sSql += "                 QUOT_DT = TO_CHAR(SYSDATE,'YYYYMMDD') , ";
            sSql += "                 UPD_USR = 'WEB', ";
            sSql += "                 UPD_DT = TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS') ";

            //추가
            sSql += "   WHEN NOT MATCHED THEN ";
            sSql += "       INSERT (QUOT_NO , REQ_MNGT_NO , TOT_AMT, RMK, HEAD_CNT, AREA , ITEM_CD , ITEM_NM, FILE_NM , FILE_PATH, INS_USR, INS_DT , QUOT_DT )";
            sSql += "       VALUES( ";
            sSql += "               '" + dr["QUOT_NO"].ToString().Trim() + "', ";
            sSql += "               '" + dr["REQ_NO"].ToString().Trim() + "', ";
            sSql += "               '" + dr["TOT_AMT"].ToString().Trim() + "', ";
            sSql += "               '" + dr["RMK"].ToString().Trim() + "', ";
            sSql += "               '" + dr["HEAD_CNT"].ToString().Trim() + "', ";
            sSql += "               '" + dr["AREA"].ToString().Trim() + "', ";
            sSql += "               '" + dr["ITEM_CD"].ToString().Trim() + "', ";
            sSql += "               '" + dr["ITEM_NM"].ToString().Trim() + "', ";
            sSql += "               '" + dr["FILE_NM"].ToString().Trim() + "', ";
            sSql += "               '" + dr["FILE_PATH"].ToString().Trim() + "', ";
            sSql += "               'WEB', ";
            sSql += "               TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS'),";
            sSql += "               TO_CHAR(SYSDATE,'YYYYMMDD')";
            sSql += "               ) ";


            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }

        public static DataSet Select_ReqList_Query(DataRow dr)
        {
            DataSet ds = new DataSet();
            string mngt_no = "";

            #region 헤더 조회 쿼리
            sSql = "";
            sSql += "SELECT 'M' AS INSFLAG , A.* , '' AS TOT_AMT , '' AS QUOT_NO ";
            sSql += " FROM QUOT_REQ_MST A ";
            sSql += " WHERE 1=1 ";
            if (dr["REQ_NO"].ToString() != "")
            {
                sSql += " AND REQ_NO = '" + dr["REQ_NO"].ToString() + "' ";
            }
            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);
            dt.TableName = "MAIN";
            ds.Tables.Add(dt);
            mngt_no = dt.Rows[0]["REQ_NO"].ToString();
            #endregion



            #region 디테일 조회
            sSql = "";
            sSql += "SELECT 'Q' AS INSFLAG, A.* , ''AS PRC FROM QUOT_REQ_CONF A ";
            sSql += "WHERE 1=1 ";
            sSql += "AND A.REQ_NO = '" + mngt_no + "' ";

            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);
            dt.TableName = "CONFERENCE";
            ds.Tables.Add(dt);


            sSql = "";
            sSql += "SELECT 'Q' AS INSFLAG, A.*, ''AS PRC  FROM QUOT_REQ_ROOM A ";
            sSql += "WHERE 1=1 ";
            sSql += "AND A.REQ_NO = '" + mngt_no + "' ";

            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);
            dt.TableName = "ROOM";
            ds.Tables.Add(dt);


            sSql = "";
            sSql += "SELECT 'Q' AS INSFLAG, A.*, ''AS PRC  FROM QUOT_REQ_MEAL A ";
            sSql += "WHERE 1=1 ";
            sSql += "AND A.REQ_NO = '" + mngt_no + "' ";

            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);
            dt.TableName = "MEAL";
            ds.Tables.Add(dt);


            sSql = "";
            sSql += "SELECT 'Q' AS INSFLAG, A.*, ''AS PRC  FROM QUOT_REQ_SVC A ";
            sSql += "WHERE 1=1 ";
            sSql += "AND A.REQ_NO = '" + mngt_no + "' ";

            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);
            dt.TableName = "SERVICE";
            ds.Tables.Add(dt);

            #endregion


            dt = new DataTable();
            dt.Columns.Add("trxCode");
            dt.Columns.Add("trxMsg");
            DataRow row1 = dt.NewRow();
            row1["trxCode"] = "Y";
            row1["trxMsg"] = "success";
            dt.Rows.Add(row1);
            dt.TableName = "Result";
            ds.Tables.Add(dt);


            return ds;
        }



        public static DataSet SelectMngQuotList_Query(DataRow dr)
        {
            DataSet ds = new DataSet();

            string mngt_no = "";
            if(dr["CONNECT"].ToString() == "first") // 첫 조회
            {
                if (dr["PAGE_TYPE"].ToString() == "ONLINE") //등록 버튼으로 접근시 (저장후)
                {
                    mngt_no = dr["QUOT_NO"].ToString(); // 견적번호
                }
                else
                {
                    mngt_no = dr["QUOT_NO"].ToString(); // 견적 요청번호
                }
            }
            else
            {
                mngt_no = dr["MNGT_NO"].ToString(); // 요청 번호 (화면에서 저장 버튼 클릭)
            }
            



            sSql = "";
            sSql += "SELECT A.QUOT_NO AS MNGT_NO, 'Q' AS INSFLAG , A.* ";
            sSql += " , B.REQ_NO AS REQ_NO , MIN_PRC, MAX_PRC, STRT_YMD, END_YMD , REQ_NM , REQ_EMAIL, REQ_CUST_NM , REQ_TEL";
            sSql += " , (CASE WHEN TOT_AMT IS NULL THEN 'N' ";
            sSql += " WHEN A.TOT_AMT IS NOT NULL THEN 'Y' END)AS QUOT_STATE ";
            sSql += " FROM QUOT_MNG_MST A ";
            sSql += " LEFT JOIN QUOT_REQ_MST B ";
            sSql += "   ON A.REQ_MNGT_NO = B.REQ_NO ";
            sSql += "WHERE 1=1 ";
            if(dr["CONNECT"].ToString() == "first")
            {
                //if (dr["PAGE_TYPE"].ToString() == "ONLINE")
                //{
                //    sSql += " AND QUOT_NO = '" + mngt_no + "' ";
                //}
                //else
                //{
                    sSql += " AND REQ_MNGT_NO = '" + mngt_no + "' ";
                //}
            }
            else
            {
                sSql += " AND REQ_MNGT_NO = '" + mngt_no + "' ";
            }
            sSql += " ORDER BY NVL(A.UPD_DT,A.INS_DT) DESC ";
            
            


            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);
            dt.TableName = "MNG_MAIN";
            ds.Tables.Add(dt);


            dt = new DataTable();
            dt.Columns.Add("trxCode");
            dt.Columns.Add("trxMsg");
            DataRow row1 = dt.NewRow();
            row1["trxCode"] = "Y";
            row1["trxMsg"] = "success";
            dt.Rows.Add(row1);
            dt.TableName = "Result";
            ds.Tables.Add(dt);

            return ds;
        }

        #endregion






        #region 리스트-> 등록


        public static bool MakeNewMst(DataRow dr)
        {
            int cnt;
            /// 헤더
            sSql = "";
            sSql += "INSERT INTO QUOT_MNG_MST ( QUOT_NO , REQ_MNGT_NO , RMK , INS_USR, INS_DT , AREA, ITEM_CD, ITEM_NM, QUOT_DT, HEAD_CNT ) ";
            sSql += " SELECT '" + dr["QUOT_NO"].ToString() + "'AS QUOT_NO , REQ_NO , RMK, 'WEB', TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS')AS INS_DT, AREA, ITEM_CD, ITEM_NM, SUBSTR(INS_DT,0,8)AS QUOT_DT , HEAD_CNT ";
            sSql += "  FROM QUOT_REQ_MST ";
            sSql += "  WHERE REQ_NO = '"+dr["REQ_NO"].ToString()+"' ";


             cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;


            // 세미나
            sSql = "";
            sSql += "INSERT INTO QUOT_MNG_CONF (QUOT_NO, QUOT_SEQ , CONF_TYPE, INS_USR , INS_DT )";
            sSql += " SELECT '"+dr["QUOT_NO"].ToString()+ "'AS QUOT_NO ,  REQ_SEQ , CONF_TYPE , 'WEB' , TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS')  ";
            sSql += " FROM QUOT_REQ_CONF ";
            sSql += " WHERE REQ_NO = '"+dr["REQ_NO"].ToString()+"' ";


            cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;


            // 숙박
            sSql = "";
            sSql += "INSERT INTO QUOT_MNG_ROOM (QUOT_NO, QUOT_SEQ, ROOM_NM, ROOM_CNT, INS_USR, INS_DT )";
            sSql += " SELECT '" + dr["QUOT_NO"].ToString() + "', REQ_SEQ, ROOM_NM, ROOM_CNT , 'WEB' , TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS') ";
            sSql += " FROM QUOT_REQ_ROOM ";
            sSql += " WHERE REQ_NO = '"+dr["REQ_NO"].ToString()+"' ";
            cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;

            //식사
            sSql = "";
            sSql += "INSERT INTO QUOT_MNG_MEAL (QUOT_NO, QUOT_SEQ, MEAL_NM, INS_USR, INS_DT )";
            sSql += " SELECT '" + dr["QUOT_NO"].ToString() + "', REQ_SEQ, MEAL_NM , 'WEB' , TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS') ";
            sSql += " FROM QUOT_REQ_MEAL ";
            sSql += " WHERE REQ_NO = '" + dr["REQ_NO"].ToString() + "' ";
            cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;

            //부가서비스
            sSql = "";
            sSql += "INSERT INTO QUOT_MNG_SVC (QUOT_NO, QUOT_SEQ, SVC_NM, INS_USR, INS_DT )";
            sSql += " SELECT '" + dr["QUOT_NO"].ToString() + "', REQ_SEQ, SVC_NM , 'WEB' , TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS') ";
            sSql += " FROM QUOT_REQ_SVC ";
            sSql += " WHERE REQ_NO = '" + dr["REQ_NO"].ToString() + "' ";
            cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;

            return rtnBool;
        }


        #endregion

    }

}

