using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Collections;

namespace WORKSHOP.Models.Query
{
    public class Sql_Notice
    {
        private static string sSql = "";
        private static bool rtnBool = false;
        private static DataTable dt = new DataTable();
        public static DataTable fnAdminNotice_Query(DataRow dr)
        {
            string sSql = "";

            sSql += "                         SELECT  ROW_NUMBER () OVER (ORDER BY B.REGDT) NUM,B.*          ";
            sSql += "                         FROM ( SELECT  A.*  ";
            sSql += "                             FROM NOTICE A  ";
            sSql += "                           WHERE 1 = 1  ";
            if (dr["STRT_YMD"].ToString() != "")
            {
                sSql += "                           AND REPLACE(REGDT,'-','') >= '" + dr["STRT_YMD"] + "'";
            }
            if (dr["END_YMD"].ToString() != "")
            {
                sSql += "                           AND REPLACE(REGDT,'-','') <= '" + dr["END_YMD"] + "'";
            }
            if (dr["TITLE"].ToString() != "")
            {
                sSql += "                           AND TITLE LIKE '%" + dr["TITLE"] + "%'";
            }
            if (dr["CONTENT"].ToString() != "")
            {
                sSql += "                           AND CONTENT LIKE '%" + dr["CONTENT"] + "%'";
            }

            sSql += "                            ) B  ORDER BY B.REGDT DESC";

            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);
            return dt;
        }

        public string fnAdminNoticeView_Query(string noticeID)
        {
            sSql = "";

            sSql += " SELECT 'VIEW' AS FLAG, V.* FROM NOTICE V ";
            sSql += " WHERE V.NOTICE_ID = " + noticeID + " ";

            return sSql;
        }

        public static bool fnAdminNoticeDel_Query(string noticeID)
        {
            sSql = "";

            sSql += " DELETE FROM NOTICE ";
            sSql += " WHERE NOTICE_ID = " + noticeID + " ";

            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }

        public static DataTable AdminNoticeView_Query(string noticeID)
        {
            sSql = "";
            sSql += " SELECT 'VIEW' AS FLAG, V.* FROM NOTICE V ";
            sSql += " WHERE V.NOTICE_ID = " + noticeID + " ";

            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);
            return dt;

        }

        public static DataTable fnAdminNotice_Query(string noticeID)
        {
            sSql = "";

            sSql += "                         SELECT * FROM             ";
            sSql += "                         ( SELECT ROW_NUMBER() OVER(ORDER BY A.REGDT) NUM, A.*  ";
            sSql += "                             FROM NOTICE A  ";
            sSql += "                           WHERE A.NOTICE_YN = 'y' ";         
            sSql += "                           ORDER BY A.REGDT DESC )  ";
            sSql += "";


            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);
            return dt;

        }


        public static bool NoticeInsert_Query(Hashtable ht)
        {
            sSql = "";

            sSql += " INSERT INTO NOTICE(NOTICE_ID , TITLE , CNT , WRITER , USE_YN , NOTICE_YN , REGDT , CONTENT ) VALUES ( ";
            sSql += "  (SELECT NVL(MAX(NOTICE_ID), 0) + 1 FROM NOTICE) ";     //NOTICE_ID
            sSql += " , '" + ht["TITLE"].ToString() + "'";                    //TITLE
            sSql += " , 0";                                                   //CNT
            sSql += " , '" + ht["USR_ID"].ToString() + "'";                   //WRITER
            sSql += " , '" + ht["USE_YN"].ToString() + "'";                   //USE_YN
            sSql += " , '" + ht["NOTICE_YN"].ToString() + "'";                //NOTICE_YN
            sSql += " , TO_CHAR(SYSDATE, 'YYYY-MM-DD')";                      //REGDT
            //sSql += " , '" + ht["FILE"].ToString() + "'";                     //FILE
            //sSql += " , '" + ht["FILE_NAME"].ToString() + "'";                //FILE_NAME
            //sSql += " , '" + ht["FILE1"].ToString() + "'";                    //FILE1
            //sSql += " , '" + ht["FILE1_NAME"].ToString() + "'";               //FILE1_NAME
            //sSql += " , '" + ht["FILE2"].ToString() + "'";                    //FILE2
            //sSql += " , '" + ht["FILE2_NAME"].ToString() + "'";               //FILE2_NAME
            //sSql += " , '" + ht["CONTENT"].ToString().Substring(1300,1300) + "'";               //FILE2_NAME


            //TWKIM 20211124 - CLOB 데이터 타입은 한번에 4000byte 이상 데이터가 들어가지 않아서 아래와 같이 쪼개서 넣으면 데이터가 삽입 가능하기 때문에 로직 추가 하였습니다.
            int nConentLength = ht["CONTENT"].ToString().Trim().Length;

            if (nConentLength < 1000)
            {
                sSql += " , '" + ht["CONTENT"].ToString() + "'";                  //CONTENT
            }
            else
            {
                int nFor = (nConentLength / 1000) + 1;
                string strContent = "";

                for (int i = 1; i <= nFor; i++)
                {
                    if (i == 1)
                    {
                        strContent += " TO_CLOB('" + ht["CONTENT"].ToString().Substring(0, (1000 * i)) + "') ";
                    }
                    else
                    {
                        //마지막
                        if (i == nFor)
                        {
                            strContent += " || TO_CLOB('" + ht["CONTENT"].ToString().Substring((1000 * (i - 1)), (ht["CONTENT"].ToString().Length - 1) - (1000 * (i - 1))) + "') ";
                        }
                        else
                        {
                            strContent += " || TO_CLOB('" + ht["CONTENT"].ToString().Substring((1000 * (i - 1)), 1000) + "') ";
                        }
                    }
                }

                sSql += " , " + strContent + " ";                  //CONTENT
            }
            sSql += " ) ";

            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }

        public static bool NoticeUpdate_Query(Hashtable ht)
        {
            sSql = "";

            sSql += " UPDATE NOTICE SET " + "\r\n";
            sSql += "     TITLE = '" + ht["TITLE"].ToString() + "' " + "\r\n";
            sSql += "    , USE_YN = '" + ht["USE_YN"].ToString() + "' " + "\r\n";
            sSql += "    , NOTICE_YN = '" + ht["NOTICE_YN"].ToString() + "' " + "\r\n";
            sSql += "    , EDITDT = TO_CHAR(SYSDATE, 'YYYY-MM-DD') " + "\r\n";
            //if (ht.ContainsKey("FILE"))
            //{
            //    sSql += "    , \"FILE\" = '" + ht["FILE"].ToString() + "'" + "\r\n";                          //FILE
            //    sSql += "    , FILE_NAME = '" + ht["FILE_NAME"].ToString() + "'" + "\r\n";                          //FILE
            //}
            //if (ht.ContainsKey("FILE1"))
            //{
            //    sSql += "    , FILE1 = '" + ht["FILE1"].ToString() + "'";                          //FILE
            //    sSql += "    , FILE1_NAME = '" + ht["FILE1_NAME"].ToString() + "'" + "\r\n";                          //FILE
            //}
            //if (ht.ContainsKey("FILE2"))
            //{
            //    sSql += "    , FILE2 = '" + ht["FILE2"].ToString() + "'" + "\r\n";                          //FILE
            //    sSql += "    , FILE2_NAME = '" + ht["FILE2_NAME"].ToString() + "'" + "\r\n";                          //FILE
            //}

            //TWKIM 20211124 - CLOB 데이터 타입은 한번에 4000byte 이상 데이터가 들어가지 않아서 아래와 같이 쪼개서 넣으면 데이터가 삽입 가능하기 때문에 로직 추가 하였습니다.
            int nConentLength = ht["CONTENT"].ToString().Trim().Length;

            if (nConentLength < 1000)
            {
                sSql += "    , CONTENT = '" + ht["CONTENT"].ToString() + "'" + "\r\n";                 //FILE2_NAME
            }
            else
            {
                int nFor = (nConentLength / 1000) + 1;
                string strContent = "";

                for (int i = 1; i <= nFor; i++)
                {
                    if (i == 1)
                    {
                        strContent += " TO_CLOB('" + ht["CONTENT"].ToString().Substring(0, (1000 * i)) + "') ";
                    }
                    else
                    {
                        //마지막
                        if (i == nFor)
                        {
                            strContent += " || TO_CLOB('" + ht["CONTENT"].ToString().Substring((1000 * (i - 1)), (ht["CONTENT"].ToString().Length - 1) - (1000 * (i - 1))) + "') ";
                        }
                        else
                        {
                            strContent += " || TO_CLOB('" + ht["CONTENT"].ToString().Substring((1000 * (i - 1)), 1000) + "') ";
                        }
                    }
                }

                sSql += "    , CONTENT = " + strContent + "" + "\r\n";                 //FILE2_NAME                
            }
            sSql += " WHERE NOTICE_ID = " + ht["NOTICE_ID"].ToString() + " " + "\r\n";

            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }
    }
}