using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;

namespace WORKSHOP.Models.Query
{
    public class Sql_Community
    {
        private static string sSql = "";
        private static bool rtnBool = false;
        private static DataTable dt = new DataTable();


        #region ※※조회 화면※※
        /// <summary>
        /// 제목 리스트 조회
        /// </summary>
        /// <param name="dr"></param>
        /// <returns></returns>
        public static DataTable GetTopicList(DataRow dr)
        {
            sSql = "";
            if (dr["PAGE_TYPE"].ToString() == "FRONT") //사용자 화면
            { 
            sSql += " SELECT * ";
            sSql += "   FROM (SELECT ROWNUM AS RNUM,";
            sSql += "                FLOOR ( (ROWNUM - 1) / 20 + 1) AS PAGE,";
            sSql += "                COUNT (*) OVER () AS TOTCNT,";
            sSql += "           A.*";
            sSql += "           FROM(";
            }


            sSql += "SELECT LIST.* ";
            sSql += "FROM ( ";
            sSql += "       SELECT MNGT_NO, ";
            sSql += "               HEAD_ID, ";
            sSql += "               (CASE WHEN HEAD_ID = '0' THEN MNGT_NO ELSE HEAD_ID END) AS MAPPING_ID, ";
            sSql += "               SCREAT_YN, ";
            sSql += "               TOPIC, ";
            sSql += "               VIEW_CNT, ";
            sSql += "               USR_TYPE, ";
            sSql += "               COMM_NUM, ";
            sSql += "               INS_USR, ";
            sSql += "               INS_DT, ";
            sSql += "               (SUBSTR(INS_DT,0,8))AS WRITE_DT, ";
            //댓글 유무 플래그
            sSql += "               (CASE WHEN REPLY_YN IS NULL THEN 'N' ELSE REPLY_YN END) AS REPLY_YN ";
            sSql += "       FROM COMMUNITY_MST M";
            //댓글 유무 플래그
            sSql += "       LEFT JOIN (SELECT MST_NO , 'Y' AS REPLY_YN FROM COMMUNITY_DTL GROUP BY MST_NO ) B";
            sSql += "           ON M.MNGT_NO = B.MST_NO ";

            sSql += "     ) LIST ";
            sSql += "WHERE 1=1 ";
            //관리자페이지에서만 체크
            if (dr.Table.Columns.Contains("USR_TYPE"))
            {
                if(dr["USR_TYPE"].ToString()!= "")
                {
                    sSql += " AND USR_TYPE != '" + dr["USR_TYPE"].ToString()+"' ";
                }
            }
            //관리자 조회조건
            if (dr.Table.Columns.Contains("AD_TYPE"))
            {
                if (dr["DATA"].ToString() != "" && dr["AD_TYPE"].ToString() != "ALL") 
                {
                    sSql += " AND " + dr["AD_TYPE"].ToString() + " LIKE '%"+dr["DATA"].ToString()+"%' ";
                }
            }

            sSql += "ORDER BY MAPPING_ID, INS_DT ";

            if (dr["PAGE_TYPE"].ToString() == "FRONT")//사용자 화면
            { 
            sSql += " ) A";
            sSql += ")WHERE PAGE = " + dr["PAGE"].ToString();
            sSql += " ORDER BY RNUM DESC";
            }
            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);
            dt.TableName = "COMMUNITY";

            return dt;
        }

        /// <summary>
        /// 게시글 내용 조회
        /// </summary>
        /// <param name="dr"></param>
        /// <returns></returns>
        public static DataTable GetCommuDtl(DataRow dr)
        {
            sSql = "";

            sSql += "SELECT MNGT_NO, SCREAT_YN , TOPIC,CONTENT , VIEW_CNT,INS_USR,INS_PW,INS_DT, SUBSTR(INS_DT,0,8)AS WRITE_DT,USR_ID,USR_TYPE,COMM_NUM  ";
            sSql += ", (CASE WHEN (SELECT COUNT(*) FROM COMMUNITY_MST WHERE HEAD_ID = '"+dr["MST_NO"].ToString()+"') >0 THEN 'Y' ELSE 'N' END)AS ANS_YN ";
            sSql += ", (CASE WHEN (SELECT COUNT(*)FROM COMMUNITY_DTL WHERE MST_NO = '" + dr["MST_NO"].ToString() + "')>0 THEN 'Y' ELSE 'N' END )AS RE_YN ";
            sSql += ", (CASE WHEN (SELECT COUNT(*) FROM COMMUNITY_MST WHERE HEAD_ID = '"+ dr["MST_NO"].ToString() + "') > 0 THEN (SELECT CONTENT FROM COMMUNITY_MST WHERE HEAD_ID = '"+dr["MST_NO"].ToString()+"')  ELSE CONTENT END) ANS_CONTENT ";
            sSql += " FROM COMMUNITY_MST ";
            sSql += "WHERE 1=1 ";
            sSql += "AND MNGT_NO = '" +dr["MST_NO"].ToString()+"' " ;

            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);
            dt.TableName = "CONTENT";


            return dt;
        }

        /// <summary>
        /// 댓글 조회
        /// </summary>
        /// <param name="dr"></param>
        /// <returns></returns>
        public static DataTable GetReplyList(DataRow dr)
        {
            sSql = "";

            sSql += "SELECT MNGT_NO "; // 댓글 관리번호
            sSql += "   , MST_NO "; // 게시글 번호
            sSql += "   , HEAD_ID "; // 댓글 , 대댓글 판별
            sSql += "   , (CASE WHEN HEAD_ID = '0' THEN MNGT_NO ELSE HEAD_ID END) AS MAPPING_ID "; // 정렬을 위한 조건값
            sSql += "   , CONTENT "; //내용
            sSql += "   , INS_USR "; //작성자
            sSql += "   , INS_PW "; //댓글 비밀번호
            sSql += "   , INS_DT "; //작성일
            sSql += "   , (SUBSTR(INS_DT,0,8)) AS WRITE_DT "; // 작성일(표기)
            sSql += "   , (CASE WHEN LOCK_YN IS NULL THEN 'N' ELSE LOCK_YN END) AS LOCK_YN "; // 댓글 삭제 불가 유무 ( Y일때 삭제 불가 )
            sSql += " FROM COMMUNITY_DTL DT";
            sSql += "   LEFT JOIN (SELECT HEAD_ID AS HI ,'Y' AS LOCK_YN FROM COMMUNITY_DTL WHERE HEAD_ID != '0' AND MST_NO = '"+dr["MST_NO"].ToString()+"' GROUP BY HEAD_ID ) SUB";
            sSql += "   ON DT.MNGT_NO = SUB.HI ";
            sSql += " WHERE 1=1 ";
            sSql += " AND MST_NO = '"+dr["MST_NO"].ToString()+"' ";

            sSql += " ORDER BY MAPPING_ID DESC, HEAD_ID, INS_DT ";


            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);
            dt.TableName = "REPLY";

            return dt;
        }

        public static DataTable Search_NoticeView(DataRow dr)
        {
            sSql = "";
            sSql += " SELECT 'PREV' AS FLAG , A.* FROM COMMUNITY_MST A WHERE A.COMM_NUM = (SELECT MAX(COMM_NUM) FROM COMMUNITY_MST WHERE COMM_NUM< '" + dr["COMM_NUM"].ToString() + "'AND  USR_TYPE <> 'M' AND SCREAT_YN != 'Y')";
            sSql += " UNION ALL";
            sSql += " SELECT 'NEXT' AS FLAG , B.* FROM COMMUNITY_MST B WHERE B.COMM_NUM = (SELECT MIN(COMM_NUM) FROM COMMUNITY_MST WHERE COMM_NUM> '" + dr["COMM_NUM"].ToString() + "' AND SCREAT_YN != 'Y' )";

            dt = _DataHelper.ExecuteDataTable(sSql, CommandType.Text);
            dt.TableName = "NOTICE_NUM";

            return dt;
        }


        public static bool UpdateCommuView(DataRow dr)
        {
            bool rtnBool = false;
            sSql = "";

            sSql += "UPDATE COMMUNITY_MST "; // 댓글 관리번호
            sSql += "  SET VIEW_CNT =  VIEW_CNT + 1"; // 게시글 번호
            sSql += " WHERE 1=1 ";
            sSql += " AND MNGT_NO = '" + dr["MST_NO"].ToString() + "' ";

            int i = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (i > 0) {
                rtnBool = true;
            }
            return rtnBool;
        }


        /// <summary>
        /// 댓글,대댓글 등록
        /// </summary>
        /// <param name="dr"></param>
        /// <returns></returns>
        public string InsertReplyList(DataRow dr)
        {
            sSql = "";
            sSql += "INSERT INTO COMMUNITY_DTL ";
            sSql += "     (MNGT_NO ";
            sSql += "   , MST_NO ";
            sSql += "   , CONTENT ";
            sSql += "   , HEAD_ID ";
            sSql += "   , INS_USR ";
            sSql += "   , INS_PW ";
            sSql += "   , INS_DT) ";
            sSql += "VALUES (";
            sSql += "        '" + dr["MNGT_NO"].ToString() + "'";
            sSql += "   ,     '" + dr["MST_NO"].ToString() + "'";
            sSql += "   ,     '" + dr["CONTENT"].ToString() + "'";
            sSql += "   ,     '" + dr["HEAD_ID"].ToString() + "'";
            sSql += "   ,     '" + dr["INS_USR"].ToString() + "'";
            sSql += "   ,   (SELECT PSWD FROM CUST_INFO WHERE EMAIL = '" + dr["USR_ID"].ToString() + "')";
            sSql += "   , TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS'))";


            return sSql;

        }

        /// <summary>
        /// 댓글 삭제 쿼리
        /// </summary>
        /// <param name="dr"></param>
        /// <returns></returns>
        public static bool DeleteReply(DataRow dr)
        {
            sSql = "";

            sSql += "DELETE FROM COMMUNITY_DTL ";
            sSql += " WHERE MNGT_NO = '"+dr["MNGT_NO"].ToString()+"' ";
            
            //관리자일때만 해당 대댓글까지 전체 삭제 되도록 
            if (dr.Table.Columns.Contains("AD_OPTION"))
            {
                if(dr["AD_OPTION"].ToString() == "D")
                {
                    sSql += " OR HEAD_ID = '" + dr["MNGT_NO"].ToString() + "' ";
                }
            }


            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }

        /// <summary>
        /// 게시글 삭제 쿼리
        /// </summary>
        /// <param name="dr"></param>
        /// <returns></returns>
        public static bool DeleteCommu(DataRow dr)
        {
            

            //관리자 일경우 댓글쪽도 다 삭제 되도록
            if (dr.Table.Columns.Contains("AD_OPTION"))
            {
                if(dr["AD_OPTION"].ToString() == "D")
                {
                    sSql = "";
                    sSql += "DELETE FROM COMMUNITY_DTL ";
                    sSql += "WHERE MST_NO = '"+dr["MNGT_NO"].ToString()+"'";

                    int cnt1 = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
                    if (cnt1 > 0) rtnBool = true;
                }
            }

            sSql = "";

            sSql += "DELETE FROM COMMUNITY_MST ";
            sSql += " WHERE MNGT_NO = '"+dr["MNGT_NO"].ToString()+"' ";
            if (dr.Table.Columns.Contains("AD_OPTION"))
            {
                if(dr["AD_OPTION"].ToString() == "D")
                {
                    sSql += "   OR HEAD_ID = '" + dr["MNGT_NO"].ToString() + "' ";
                }
            }
            
            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }


        /// <summary>
        /// 게시글 추가
        /// </summary>
        /// <param name="dr"></param>
        /// <returns></returns>
        public static bool InsertCommuMst(DataRow dr)
        {

            #region 컨텐츠 내용 스플릿
            int nContentLen = dr["CONTENT"].ToString().Trim().Length;
            string strContent = "";
            if(nContentLen > 1000)
            {
                int endContentLen = (nContentLen / 1000) + 1;

                for (int i = 1; i <= endContentLen; i++)
                {
                    if (i == 1)
                    {
                        strContent += "TO_CLOB('" + dr["CONTENT"].ToString().Substring(0, (1000 * i)) + "') ";
                    }
                    else
                    {
                        if (i == endContentLen)
                        {
                            strContent += " || TO_CLOB('" + dr["CONTENT"].ToString().Substring((1000 * (i - 1)), (dr["CONTENT"].ToString().Length - 1) - (1000 * (i - 1))) + "') ";
                        }
                        else
                        {
                            strContent += " || TO_CLOB('" + dr["CONTENT"].ToString().Substring((1000 * (i - 1)), 1000) + "')";
                        }
                    }
                }
            }
            #endregion 


            sSql = "";

            sSql += " MERGE INTO COMMUNITY_MST A                                                                                              " ;
            
            sSql += "     USING DUAL                                                                                                         " ;
            if (dr["PAGE_TYPE"].ToString() == "FRONT")
            {
                sSql += "     ON(A.MNGT_NO = '" + dr["MNGT_NO"].ToString() + "')                                                                                                 ";
            }
            else if(dr["PAGE_TYPE"].ToString() == "BACK")
            {
                sSql += "     ON(A.HEAD_ID = '" + dr["HEAD_ID"].ToString() + "')                                                                                                 ";
            }
            sSql += " WHEN MATCHED THEN                                                                                                      " ;

            #region 업데이트
            sSql += "     UPDATE SET                                                                                                         " ;
            sSql += "     A.SCREAT_YN = '"+dr["SCREAT_YN"].ToString()+"'                                                                                                   " ;
            sSql += "     ,A.TOPIC = '"+dr["TOPIC"].ToString()+"'                                                                                                       " ;
            
            if (nContentLen < 1000)
            {
                sSql += "     ,A.CONTENT = '" + dr["CONTENT"].ToString() + "'                                                                                                     ";
            }
            else
            {

                sSql += "   , A.CONTENT = " +strContent+" ";
            }
            if(dr["USR_TYPE"].ToString() == "N") // 비회원 업데이트시
            {
                if(dr["SCREAT_YN"].ToString() == "Y") //비밀글일 경우
                {
                    sSql += "   ,A.INS_PW = '"+ YJIT.Utils.StringUtils.Md5Hash((string)dr["INS_PW"]) + "' ";
                }
                else // 일반 글일경우
                {
                    sSql += "   ,A.INS_PW = 'N' ";
                }
            }
            else if(dr["USR_TYPE"].ToString() == "M")
            {
                sSql += "   ,A.INS_PW = '"+dr["INS_PW"].ToString()+"' ";
            }
            //sSql += "     ,A.INS_PW = '"+dr["INS_PW"].ToString()+"'                                                                                                      " ; 
            sSql += "     ,A.UPD_USR = '"+dr["USER"].ToString()+"'                                                                                                     " ;
            sSql += "     ,A.UPD_DT = TO_CHAR(SYSDATE, 'YYYYMMDDHH24MISS')                                                                    " ;
            #endregion

            #region 인서트
            sSql += " WHEN NOT MATCHED THEN                                                                                                  " ;
            sSql += "     INSERT(A.MNGT_NO, HEAD_ID, SCREAT_YN, TOPIC, CONTENT, VIEW_CNT, USR_TYPE, INS_USR, INS_PW, INS_DT, COMM_NUM, USR_ID)       " ;
            sSql += "     VALUES(                                                                                                            " ;
            sSql += "           '"+dr["MNGT_NO"].ToString()+"', ";
            if(dr["PAGE_TYPE"].ToString() == "FRONT") // 사용자 화면 HEAD_ID
            {
                sSql += "               '0', ";
            }
            else // 관리자 화면HEAD_ID
            {
                sSql += "           '" + dr["HEAD_ID"].ToString() + "', ";
            }
            sSql += "       '"+dr["SCREAT_YN"].ToString()+"', ";
            sSql += "       '" + dr["TOPIC"].ToString() + "', ";
            if(nContentLen < 1000)
            {
                sSql += "       '"+dr["CONTENT"].ToString()+"' ,";
            }
            else
            {
                sSql += "       "+strContent+",";
            }
            sSql += "       '0', ";
            sSql += "       '" + dr["USR_TYPE"].ToString() + "', ";
            sSql += "       '" + dr["USER"].ToString() + "', ";
            if(dr["USR_TYPE"].ToString() == "M") // 관리자 이전글 패스워드 가져와서 
            {
                    sSql += "       '" + dr["INS_PW"].ToString() + "', "; 
            }
            else // 사용자
            {
                if(dr["USR_TYPE"].ToString() == "A")
                {
                    if (dr.Table.Columns.Contains("USR_ID")) {
                        sSql += "   (SELECT  PSWD FROM CUST_INFO WHERE EMAIL = '"+dr["USR_ID"].ToString()+"') , ";
                    }
                }
                else if (dr["USR_TYPE"].ToString() == "N")
                {
                    if(dr["SCREAT_YN"].ToString() == "Y") // 비회원 비밀글
                    {
                        sSql += "   '" + YJIT.Utils.StringUtils.Md5Hash((string)dr["INS_PW"]) + "' , ";
                    }
                    else
                    {
                        sSql += "   'N', ";
                    }
                    
                }
            }
            //if(dr["SCREAT_YN"].ToString() == "Y" ) //비밀글일 때
            //{
            //    sSql += "       '" + dr["INS_PW"].ToString() + "', ";
            //}
            //else
            //{
            //    sSql += "       'N', ";
            //}
            sSql += "       TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS') , ";
            if(dr["PAGE_TYPE"].ToString() == "FRONT") // 사용자 화면 순번
            {
                sSql += "       NVL((SELECT MAX(COMM_NUM)+1 FROM COMMUNITY_MST),1), ";
            }
            else // 관리자 화면 순번
            {
                sSql += "           0,  ";
            }

            sSql += "   '"+dr["USR_ID"].ToString()+"' ";

            sSql += "     )                                                                                                                  " ;
            #endregion


            int cnt = _DataHelper.ExecuteNonQuery(sSql, CommandType.Text);
            if (cnt > 0) rtnBool = true;
            return rtnBool;
        }


        public string CheckPW_Query(DataRow dr)
        {
            sSql = "";
            sSql += "SELECT *";
            sSql += "FROM CUST_INFO";
            sSql += " WHERE 1=1 AND ";
            sSql += "   EMAIL = '" + dr["USR_ID"].ToString() + "' ";
            sSql += "  AND PSWD = '" + YJIT.Utils.StringUtils.Md5Hash((string)dr["INS_PW"]) + "' ";

            return sSql;
        }
        #endregion
        public string Content_Check_Query(DataRow dr)
        {
            sSql = "";
            sSql += "SELECT *";
            sSql += "FROM COMMUNITY_MST ";
            sSql += " WHERE 1=1 AND ";
            sSql += " MNGT_NO = '"+dr["MNGT_NO"].ToString()+"' ";
            sSql += " AND INS_PW = '" + YJIT.Utils.StringUtils.Md5Hash((string)dr["INS_PW"]) + "' ";



            return sSql;
        }
    }
}

