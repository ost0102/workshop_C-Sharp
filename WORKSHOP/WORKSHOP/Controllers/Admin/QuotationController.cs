using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WORKSHOP.Models;
using WORKSHOP.Models.Query;
using Newtonsoft.Json;
using System.Data;
using System.Net;
using System.Net.Mail;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using System.Collections;

namespace WORKSHOP.Controllers.Admin
{
    public class QuotationController : Controller
    {
        string strJson = "";
        DataSet ds = new DataSet();
        bool rtnStatus = false;
        //
        // GET: /Quotation/

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult quotList()
        {
            return View();
        }
        public ActionResult quotCustomer()
        {
            return View();
        }

        public ActionResult quotMgt()
        {
            return View();
        }

        public ActionResult quotRegist()
        {
            return View();
        }
        public class JsonData
        {
            public string vJsonData { get; set; }
        }


        [HttpPost]
        public ActionResult fnGetQuotList(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();
                DataTable dt = new DataTable();
                dt = JsonConvert.DeserializeObject<DataTable>(vJsonData);
                dt = Sql_Quotation.SelectQuotALL(dt.Rows[0]);
                strJson = _common.MakeJson("Y", "Success", dt);
                return Json(strJson);
            }
            catch (Exception e)
            {
                strJson = e.Message;
                return Json(strJson);
            }
        }


        [HttpPost]
        public ActionResult fnGetQuotManage(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();
                DataTable dt = new DataTable();
                dt = JsonConvert.DeserializeObject<DataTable>(vJsonData);
                dt = Sql_Quotation.SelectQuotManage(dt.Rows[0]);
                strJson = _common.MakeJson("Y", "Success", dt);
                return Json(strJson);
            }
            catch (Exception e)
            {
                strJson = e.Message;
                return Json(strJson);
            }
        }


        [HttpPost]
        public ActionResult fnGetQuotManageDetail(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();
                DataTable dt = new DataTable();
                dt = JsonConvert.DeserializeObject<DataTable>(vJsonData);
                dt = Sql_Quotation.SelectQuotManageDetail(dt.Rows[0]);
                dt.TableName = "MAIN";
                strJson = _common.MakeJson("Y", "Success", dt);
                return Json(strJson);
            }
            catch (Exception e)
            {
                strJson = e.Message;
                return Json(strJson);
            }
        }

        [HttpPost]
        public ActionResult fnSaveQuotation(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();

                DataTable dt = new DataTable();
                dt = JsonConvert.DeserializeObject<DataTable>(vJsonData);

                rtnStatus = Sql_Quotation.UpdateQuotation(dt.Rows[0]);

                dt = Sql_Quotation.SelectQuotALL(dt.Rows[0]);
                strJson = _common.MakeJson("Y", "Success", dt);
                return Json(strJson);
            }
            catch (Exception e)
            {
                strJson = e.Message;
                return Json(strJson);
            }
        }

        [HttpPost]
        public ActionResult fnSaveQuotationAll(JsonData value)
        {
            try
            {
                string mngt_no = "QUOT" + System.DateTime.Now.ToString("yyyymmDDHHmmssfff");
                string vJsonData = value.vJsonData.ToString();
                int tot_amt = 0;
                DataTable dt = new DataTable();
                dt = JsonConvert.DeserializeObject<DataTable>(vJsonData);

                for (int i = 0; i < dt.Rows.Count; i++) {

                    //dt = Sql_Quotation.SelectEasyList_Qyuery(dt.Rows[0]);

                    if (dt.Rows[i]["REQ_STATUS"].ToString() == "CONF") {
                        rtnStatus = Sql_Quotation.SaveQuotationConf(dt.Rows[i] , mngt_no);
                    }
                    else if (dt.Rows[i]["REQ_STATUS"].ToString() == "ROOM")
                    {
                        rtnStatus = Sql_Quotation.SaveQuotationRoom(dt.Rows[i], mngt_no);
                    }
                    else if (dt.Rows[i]["REQ_STATUS"].ToString() == "MEAL")
                    {
                        rtnStatus = Sql_Quotation.SaveQuotationMeal(dt.Rows[i], mngt_no);
                    }
                    else if (dt.Rows[i]["REQ_STATUS"].ToString() == "SVC")
                    {
                        rtnStatus = Sql_Quotation.SaveQuotationSvc(dt.Rows[i], mngt_no);
                    }

                    tot_amt = tot_amt + Convert.ToInt32(dt.Rows[i]["PRC"]);
                }
                rtnStatus = Sql_Quotation.SaveQuotationHeader(dt.Rows[0], mngt_no , tot_amt);

                dt = Sql_Quotation.SelectQuotALL(dt.Rows[0]);
                strJson = _common.MakeJson("Y", "Success", dt);
                return Json(strJson);
            }
            catch (Exception e)
            {
                strJson = e.Message;
                return Json(strJson);
            }
        }

        [HttpPost]
        public ActionResult fnToastMgt(JsonData value)
        {
            try
            {
                DataTable dt = new DataTable();
                dt = Sql_Quotation.SelectToastMessage();

                strJson = _common.MakeJson("Y", "Success" , dt);
                return Json(strJson);
            }
            catch (Exception e)
            {
                strJson = e.Message;
                return Json(strJson);
            }
        }


        [HttpPost]
        public ActionResult fnSaveItem(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();

                DataTable dt = new DataTable();
                dt = JsonConvert.DeserializeObject<DataTable>(vJsonData);

                rtnStatus = Sql_Quotation.UpdateQuotationItem(dt.Rows[0]);

                strJson = _common.MakeJson("Y", "Success");
                return Json(strJson);
            }
            catch (Exception e)
            {
                strJson = e.Message;
                return Json(strJson);
            }
        }

        [HttpPost]
        public ActionResult fnConfirmQuotation(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();

                DataTable dt = new DataTable();
                dt = JsonConvert.DeserializeObject<DataTable>(vJsonData);

                rtnStatus = Sql_Quotation.InsertConfirmQuotation(dt.Rows[0]);

                strJson = _common.MakeJson("Y", "Success");
                return Json(strJson);
            }
            catch (Exception e)
            {
                strJson = e.Message;
                return Json(strJson);
            }
        }


        #region Ekkim COde

        /// <summary>
        /// 견적조회에서 등록 시 초기화 헤더테이블만 데이터 조회
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult fnGetNewQuotMst(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();
                DataTable dt = new DataTable();
                dt = JsonConvert.DeserializeObject<DataTable>(vJsonData);
                ds = Sql_Quotation.SelectQuotMstNew(dt.Rows[0]);

                strJson = JsonConvert.SerializeObject(ds, Formatting.Indented);
                return Json(strJson);
            }
            catch (Exception e)
            {
                strJson = e.Message;
                return Json(strJson);
            }
        }


        /// <summary>
        /// 간편등록시 헤더 정보 요청 자료에 insert 
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult fnSaveQuotationList(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();
                DataTable dt = new DataTable();
                ds = JsonConvert.DeserializeObject<DataSet>(vJsonData);
                //dt = JsonConvert.DeserializeObject<DataTable>(vJsonData);
                dt = ds.Tables["MAIN"];
                
                for(int i = 0; i < dt.Rows.Count; i ++)
                {
                    rtnStatus = Sql_Quotation.SaveMngQuotList_Query(dt.Rows[0]);
                }


                dt = Sql_Quotation.SelectEasyList_Qyuery(dt.Rows[0]);
                dt.TableName = "MAIN";
                strJson = _common.MakeJson("Y", "Success", dt);
                return Json(strJson);

            }
            catch (Exception e)
            {
                strJson = e.Message;
                return Json(strJson);
            }
        }


        [HttpPost]
        public ActionResult fnGetAllList(JsonData value)
        {
            try {
                string vJsonData = value.vJsonData.ToString();
                DataTable dt = new DataTable();
                dt = JsonConvert.DeserializeObject<DataTable>(vJsonData);
                dt = Sql_Quotation.SelectThisQoutListAll_Query(dt.Rows[0]);
                strJson = _common.MakeJson("Y", "Success", dt);
                return Json(strJson);

            }
            catch (Exception e) {
                strJson = e.Message;
                return Json(strJson);
            }

        }


        #endregion 

        //비교견적
        [HttpPost]
        public ActionResult fnGetQuotMst(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();
                DataTable dt = new DataTable();
                dt = JsonConvert.DeserializeObject<DataTable>(vJsonData);
                ds = Sql_Quotation.SelectQuotMst(dt.Rows[0]);

                strJson = JsonConvert.SerializeObject(ds, Formatting.Indented);
                return Json(strJson);
            }
            catch (Exception e)
            {
                strJson = e.Message;
                return Json(strJson);
            }
        }

        [HttpPost]
        public ActionResult fnGetQuotAllDetail(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();
                DataTable dt = new DataTable();
                dt = JsonConvert.DeserializeObject<DataTable>(vJsonData);
                
                dt = Sql_Quotation.SelectQuotAllDetail(dt.Rows[0]);

                strJson = _common.MakeJson("Y", "Success" , dt);
                return Json(strJson);
            }
            catch (Exception e)
            {
                strJson = e.Message;
                return Json(strJson);
            }
        }

        public ActionResult fnGetOnlineQuotMst(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();
                DataTable dt = new DataTable();
                dt = JsonConvert.DeserializeObject<DataTable>(vJsonData);
                ds = Sql_Quotation.SelectOnlineQuotMst(dt.Rows[0]);

                strJson = JsonConvert.SerializeObject(ds, Formatting.Indented);
                return Json(strJson);
            }
            catch (Exception e)
            {
                strJson = e.Message;
                return Json(strJson);
            }
        }

        // <summary>
        // 메일 전송 기능
        // </summary>
        // <returns></returns>
        public ActionResult fnSendEmail(JsonData value)
        {
            string strResult;
            DataTable dt = new DataTable();
            DataSet ds = new DataSet();

            try
            {
                string vJsonData = value.vJsonData.ToString();

                DataTable rtnDt = new DataTable();
                rtnDt = JsonConvert.DeserializeObject<DataTable>(vJsonData);
                for (int i = 0; i < rtnDt.Rows.Count; i++)
                {
                    if (rtnDt.Rows[i]["TYPE"].ToString() == "QUOT")
                    {
                        dt = Sql_Quotation.SelectQuotList(rtnDt.Rows[i]);
                    }
                    else {
                        dt = Sql_Quotation.SelectBkgList(rtnDt.Rows[i]);
                    }
                    if (dt.Rows[0]["REQ_EMAIL"].ToString() != "")
                    {
                        System.IO.FileInfo fi;
                        //첨부파일 로직                
                        fi = new System.IO.FileInfo(Server.MapPath(dt.Rows[0]["FILE_PATH"].ToString()) + "/" + dt.Rows[0]["FILE_NM"].ToString());

                        
                            #region
                            System.Net.Mail.SmtpClient client = new System.Net.Mail.SmtpClient("smtp.gmail.com", 587)
                            //System.Net.Mail.SmtpClient client = new System.Net.Mail.SmtpClient("mail.yjit.co.kr", 587)
                            {
                                UseDefaultCredentials = false, // 시스템에 설정된 인증 정보를 사용하지 않는다. 
                                EnableSsl = true,  // SSL을 사용한다. 
                                DeliveryMethod = SmtpDeliveryMethod.Network, // 이걸 하지 않으면 Gmail에 인증을 받지 못한다. 
                                Credentials = new System.Net.NetworkCredential("metakit0601@gmail.com", "yekg mxed gmuf lwxh"),
                                //Credentials = new System.Net.NetworkCredential("mailmaster@yjit.co.kr", "Yjit0921)#$%"),
                                Timeout = 100000
                            };

                            //MailAddress from = new MailAddress("help@yjit.co.kr");
                            MailAddress from = new MailAddress("metakit0601@gmail.com");
                            //MailAddress to = new MailAddress("ebkim@yjit.co.kr");
                            MailAddress to = new MailAddress(dt.Rows[0]["REQ_EMAIL"].ToString());

                            MailMessage message = new MailMessage(from, to);
                            message.Subject = "[연수다] 요청하신 " + dt.Rows[0]["TITLE"].ToString()  + "서 입니다.";
                            message.SubjectEncoding = System.Text.Encoding.UTF8;
                            if (rtnDt.Rows[i]["TYPE"].ToString() == "QUOT")
                            {
                                message.Body = MakeEmailForm(dt);
                            }
                            else
                            {
                                message.Body = MakeEmailFormBkg(dt.Rows[0]);
                            }
                            //message.Body = "";
                            message.IsBodyHtml = true;
                            message.BodyEncoding = System.Text.Encoding.UTF8;
                            if (fi.Exists)
                            {
                                message.Attachments.Add(new Attachment(new FileStream(Server.MapPath(dt.Rows[0]["FILE_PATH"].ToString()) + "/" + dt.Rows[0]["FILE_NM"].ToString(), FileMode.Open, FileAccess.Read), dt.Rows[0]["FILE_NM"].ToString()));
                            }

                            //서버 인증서의 유효성 검사하는 부분을 무조건 true 
                            System.Net.ServicePointManager.ServerCertificateValidationCallback += (s, cert, chain, sslPolicyErrors) => true;
                            client.Send(message);
                            message.Dispose();
                            #endregion

                            //이메일 성공시 Update
                            //SetEmailLog("Y", "성공");
                            if (rtnDt.Rows[i]["TYPE"].ToString() == "QUOT")
                            {
                                rtnStatus = Sql_Quotation.UpdateEmailSend(dt.Rows[0]);
                            }
                            else
                            {
                                rtnStatus = Sql_Quotation.UpdateBkgEmailSend(dt.Rows[0]);
                            }
                        
                    }
                }

                if (rtnDt.Rows[0]["TYPE"].ToString() == "QUOT")
                {
                    if (!rtnDt.Columns.Contains("REQGIST")) { // 등록 리스트 조회
                        dt = Sql_Quotation.SelectQuotALL(rtnDt.Rows[0]);
                        strJson = _common.MakeJson("Y", "Success", dt);

                    }
                    else
                    { //견적 조회
                        if (rtnDt.Rows[0]["REQGIST"].ToString() == "Y") // 등록됐으면
                        {
                            ds = Sql_Quotation.SelectOnLineALL(rtnDt.Rows[0]); // mng_ 테이블 검색
                        }
                        else
                        {
                            ds = Sql_Quotation.SelectOnlineQuotMst(rtnDt.Rows[0]); // req 테이블 검색
                        }
                        
                        strJson = JsonConvert.SerializeObject(ds);

                    }
                    
                }
                else {
                    dt = Sql_Booking.fnSearchBkg_Query(rtnDt.Rows[0]);
                    strJson = _common.MakeJson("Y", "Success", dt);

                }

                return Json(strJson);
            }
            catch (Exception e)
            {
                //이메일 실패시 Update
                //SetEmailLog("N", e.Message);

                strJson = _common.MakeJson("N", e.Message , dt);
                return Json(strJson);
            }
        }
        Sql_Estimate SE = new Sql_Estimate();
        public string MakeEmailForm(DataTable dt)
        {

            string strHTML = "";
            strHTML += "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"https://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">";
            strHTML += "<html xmlns=\"http://www.w3.org/1999/xhtml\">";
            strHTML += "<head>";
            strHTML += "<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\" />";
            strHTML += "    <!--[if !mso]><!-->";
            strHTML += "        <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\" />";
            strHTML += "    <!--<![endif]-->";
            strHTML += "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">";
            strHTML += "    <title></title>";
            strHTML += "</head>";
            strHTML += "<body style=\"margin: 0; padding: 0;\">";
            strHTML += "   ";
            strHTML += "   <div style=\"max-width: 700px;margin: 0 auto;width: 100%;\" align=\"center\">";
            strHTML += "      <table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" width=\"100%\" align=\"center\" style=\"margin: 0 auto;\">";
            strHTML += "         <tr>";
            strHTML += "            <td valign=\"middle\" style=\"padding:0 13px;background-color: ##004e97;color: #ffffff;font-size: 20px;height:70px;letter-spacing:-1px;font-family:'Noto Sans KR', 'Noto Sans', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;\">";
            //strHTML += "                    <div style='max-width: 610px;margin: 0 auto'> 안녕하세요.연수다 입니다.</div>";
            strHTML += "            </td>";
            strHTML += "         </tr>";
            strHTML += "         <tr>";
            strHTML += "            <td valign=\"top\" align=\"center\" style=\"padding:30px 0 30px;background-color: #22b7b0;font-size: 20px;letter-spacing:-1px;font-family:'Noto Sans KR', 'Noto Sans', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;font-weight: 300;\">";
            strHTML += "               <span style=\"font-weight: 600;color: #ffffff;\">[연수다] 요청하신 " + dt.Rows[0]["TITLE"].ToString() +"서 입니다. ";
            strHTML += "            </td>";
            strHTML += "         </tr>";

            strHTML += "         <tr>";
            strHTML += "            <td valign=\"top\">";
            strHTML += "               <div style=\"margin: 0 auto\">";
            strHTML += "                  <table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" width=\"100%\" style=\"border-top: 2px solid #222222;width: 100%;\">";
            if(dt.Rows[0]["AREA"].ToString() != "") { 
            strHTML += "                <tr>";
            strHTML += "                        <td valign=\"middle\" align=\"center\" width=\"28%\" style=\"width:28%;padding:0;height:43px;font-size: 14px;color: #333333;background-color: #f8f8f8;border-bottom: 1px solid #eaeaea;font-family:'Noto Sans KR', 'Noto Sans', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;font-weight: 600;\">";
            strHTML += "                              <strong>지역</strong>";
            strHTML += "                        </td>  ";
            strHTML += "                        <td valign=\"middle\" align=\"left\" style=\"padding:0 0 0 20px;height:43px;font-size: 14px;color: #888888;border-bottom: 1px solid #eaeaea;font-family:'Noto Sans KR', 'Noto Sans', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;font-weight: 300;\">";
            strHTML += "                           <Pre>" + dt.Rows[0]["AREA"].ToString() + "</Pre> ";
            strHTML += "                        </td> ";
            strHTML += "               </tr>";
            }
            if (dt.Rows[0]["STRT_YMD"].ToString() != "" &&  dt.Rows[0]["END_YMD"].ToString() != "") { 
            strHTML += "                <tr>";
            strHTML += "                        <td valign=\"middle\" align=\"center\" width=\"28%\" style=\"width:28%;padding:0;height:43px;font-size: 14px;color: #333333;background-color: #f8f8f8;border-bottom: 1px solid #eaeaea;font-family:'Noto Sans KR', 'Noto Sans', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;font-weight: 600;\">";
            strHTML += "                              <strong>견적날짜</strong>";
            strHTML += "                        </td>  ";
            strHTML += "                        <td valign=\"middle\" align=\"left\" style=\"padding:0 0 0 20px;height:43px;font-size: 14px;color: #888888;border-bottom: 1px solid #eaeaea;font-family:'Noto Sans KR', 'Noto Sans', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;font-weight: 300;\">";
            strHTML += "                           <Pre>" + dt.Rows[0]["STRT_YMD"].ToString() + " - " + dt.Rows[0]["END_YMD"].ToString() + "</Pre> ";
            strHTML += "                        </td> ";
            strHTML += "               </tr>";
            }
            strHTML += "                <tr>";
            strHTML += "                        <td valign=\"middle\" align=\"center\" width=\"28%\" style=\"width:28%;padding:0;height:43px;font-size: 14px;color: #333333;background-color: #f8f8f8;border-bottom: 1px solid #eaeaea;font-family:'Noto Sans KR', 'Noto Sans', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;font-weight: 600;\">";
            strHTML += "                              <strong>인원</strong>";
            strHTML += "                        </td>  ";
            strHTML += "                        <td valign=\"middle\" align=\"left\" style=\"padding:0 0 0 20px;height:43px;font-size: 14px;color: #888888;border-bottom: 1px solid #eaeaea;font-family:'Noto Sans KR', 'Noto Sans', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;font-weight: 300;\">";
            strHTML += "                           <Pre>" + formatAmount(dt.Rows[0]["HEAD_CNT"].ToString()) + " 명</Pre> ";
            strHTML += "                        </td> ";
            strHTML += "               </tr>";
            strHTML += "                <tr>";
            strHTML += "                        <td valign=\"middle\" align=\"center\" width=\"28%\" style=\"width:28%;padding:0;height:43px;font-size: 14px;color: #333333;background-color: #f8f8f8;border-bottom: 1px solid #eaeaea;font-family:'Noto Sans KR', 'Noto Sans', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;font-weight: 600;\">";
            strHTML += "                              <strong>견적 요청일</strong>";
            strHTML += "                        </td>  ";
            strHTML += "                        <td valign=\"middle\" align=\"left\" style=\"padding:0 0 0 20px;height:43px;font-size: 14px;color: #888888;border-bottom: 1px solid #eaeaea;font-family:'Noto Sans KR', 'Noto Sans', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;font-weight: 300;\">";
            strHTML += "                           <Pre>" + dt.Rows[0]["INS_DT"].ToString() + "</Pre> ";
            strHTML += "                        </td> ";
            strHTML += "               </tr>";
            strHTML += "                <tr>";
            strHTML += "                        <td valign=\"middle\" align=\"center\" width=\"28%\" style=\"width:28%;padding:0;height:43px;font-size: 14px;color: #333333;background-color: #f8f8f8;border-bottom: 1px solid #eaeaea;font-family:'Noto Sans KR', 'Noto Sans', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;font-weight: 600;\">";
            strHTML += "                              <strong>견적 만료일</strong>";
            strHTML += "                        </td>  ";
            strHTML += "                        <td valign=\"middle\" align=\"left\" style=\"padding:0 0 0 20px;height:43px;font-size: 14px;color: #888888;border-bottom: 1px solid #eaeaea;font-family:'Noto Sans KR', 'Noto Sans', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;font-weight: 300;\">";
            strHTML += "                           <Pre>" + dt.Rows[0]["ADD_DT"].ToString() + "</Pre> ";
            strHTML += "                        </td> ";
            strHTML += "               </tr>";
            if (dt.Rows[0]["TOT_AMT"].ToString() != "")
            {
                strHTML += "                <tr>";
                strHTML += "                        <td valign=\"middle\" align=\"center\" width=\"28%\" style=\"width:28%;padding:0;height:43px;font-size: 14px;color: #333333;background-color: #f8f8f8;border-bottom: 1px solid #eaeaea;font-family:'Noto Sans KR', 'Noto Sans', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;font-weight: 600;\">";
                strHTML += "                              <strong>총 금액</strong>";
                strHTML += "                        </td>  ";
                strHTML += "                        <td valign=\"middle\" align=\"left\" style=\"padding:0 0 0 20px;height:43px;font-size: 14px;color: #888888;border-bottom: 1px solid #eaeaea;font-family:'Noto Sans KR', 'Noto Sans', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;font-weight: 300;\">";
                strHTML += "                           <Pre>" + formatAmount(dt.Rows[0]["TOT_AMT"].ToString()) + "원</Pre> ";
                strHTML += "                        </td> ";
                strHTML += "               </tr>";
            }

            //if (!(dt.Rows[0]["USER_TYPE"].ToString() == "A" && dt.Rows[0]["QUOT_TYPE"].ToString() == "A")) {
            //    DataTable rtnConf = _DataHelper.ExecuteDataTable(SE.ComPareQuotConf_Query(dt.Rows[0]), CommandType.Text);
            //    if (rtnConf.Rows.Count > 0) {

            //        strHTML += "                <tr>";
            //        strHTML += "                        <td valign=\"middle\" align=\"center\" width=\"28%\" style=\"width:28%;padding:0;height:43px;font-size: 14px;color: #333333;background-color: #f8f8f8;border-bottom: 1px solid #eaeaea;font-family:'Noto Sans KR', 'Noto Sans', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;font-weight: 600;\">";
            //        strHTML += "                              <strong>" + rtnConf.Rows[0]["CONF_TYPE"].ToString() + "</strong>";
            //        strHTML += "                        </td>  ";
            //        strHTML += "                        <td valign=\"middle\" align=\"left\" style=\"padding:0 0 0 20px;height:43px;font-size: 14px;color: #888888;border-bottom: 1px solid #eaeaea;font-family:'Noto Sans KR', 'Noto Sans', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;font-weight: 300;\">";
            //        strHTML += "                           <Pre>" + formatAmount(rtnConf.Rows[0]["PRC"].ToString()) + "</Pre> ";
            //        strHTML += "                        </td> ";
            //        strHTML += "               </tr>";
            //    }

            //    DataTable rtnRoom = _DataHelper.ExecuteDataTable(SE.ComPareQuotRoom_Query(dt.Rows[0]), CommandType.Text);
            //    if (rtnRoom.Rows.Count > 0)
            //    {

            //        strHTML += "                <tr>";
            //        strHTML += "                        <td valign=\"middle\" align=\"center\" width=\"28%\" style=\"width:28%;padding:0;height:43px;font-size: 14px;color: #333333;background-color: #f8f8f8;border-bottom: 1px solid #eaeaea;font-family:'Noto Sans KR', 'Noto Sans', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;font-weight: 600;\">";
            //        strHTML += "                              <strong>" + rtnRoom.Rows[0]["ROOM_NM"].ToString();
            //        if (rtnRoom.Rows[0]["ROOM_NM"].ToString() != "")
            //        {
            //            strHTML += " " + rtnRoom.Rows[0]["ROOM_NM"].ToString() + "개";
            //        }
            //        strHTML += "</strong>";
            //        strHTML += "                        </td>  ";
            //        strHTML += "                        <td valign=\"middle\" align=\"left\" style=\"padding:0 0 0 20px;height:43px;font-size: 14px;color: #888888;border-bottom: 1px solid #eaeaea;font-family:'Noto Sans KR', 'Noto Sans', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;font-weight: 300;\">";
            //        strHTML += "                           <Pre>" + formatAmount(rtnRoom.Rows[0]["PRC"].ToString()) + "</Pre> ";
            //        strHTML += "                        </td> ";
            //        strHTML += "               </tr>";
            //    }

            //    DataTable rtnMeal = _DataHelper.ExecuteDataTable(SE.ComPareQuotMeal_Query(dt.Rows[0]), CommandType.Text);
            //    if (rtnMeal.Rows.Count > 0)
            //    {

            //        strHTML += "                <tr>";
            //        strHTML += "                        <td valign=\"middle\" align=\"center\" width=\"28%\" style=\"width:28%;padding:0;height:43px;font-size: 14px;color: #333333;background-color: #f8f8f8;border-bottom: 1px solid #eaeaea;font-family:'Noto Sans KR', 'Noto Sans', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;font-weight: 600;\">";
            //        strHTML += "                              <strong>" + rtnMeal.Rows[0]["MEAL_NM"].ToString() + "</strong>";
            //        strHTML += "                        </td>  ";
            //        strHTML += "                        <td valign=\"middle\" align=\"left\" style=\"padding:0 0 0 20px;height:43px;font-size: 14px;color: #888888;border-bottom: 1px solid #eaeaea;font-family:'Noto Sans KR', 'Noto Sans', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;font-weight: 300;\">";
            //        strHTML += "                           <Pre>" + formatAmount(rtnMeal.Rows[0]["PRC"].ToString()) + "</Pre> ";
            //        strHTML += "                        </td> ";
            //        strHTML += "               </tr>";
            //    }

            //    DataTable rtnSvc = _DataHelper.ExecuteDataTable(SE.ComPareQuotSvc_Query(dt.Rows[0]), CommandType.Text);
            //    if (rtnSvc.Rows.Count > 0)
            //    {

            //        strHTML += "                <tr>";
            //        strHTML += "                        <td valign=\"middle\" align=\"center\" width=\"28%\" style=\"width:28%;padding:0;height:43px;font-size: 14px;color: #333333;background-color: #f8f8f8;border-bottom: 1px solid #eaeaea;font-family:'Noto Sans KR', 'Noto Sans', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;font-weight: 600;\">";
            //        strHTML += "                              <strong>" + rtnSvc.Rows[0]["SVC_NM"].ToString() + "</strong>";
            //        strHTML += "                        </td>  ";
            //        strHTML += "                        <td valign=\"middle\" align=\"left\" style=\"padding:0 0 0 20px;height:43px;font-size: 14px;color: #888888;border-bottom: 1px solid #eaeaea;font-family:'Noto Sans KR', 'Noto Sans', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;font-weight: 300;\">";
            //        strHTML += "                           <Pre>" + formatAmount(rtnSvc.Rows[0]["PRC"].ToString()) + "</Pre> ";
            //        strHTML += "                        </td> ";
            //        strHTML += "               </tr>";
            //    }
            //}
            strHTML += "                   </table> ";
            strHTML += "                 </div> ";
            strHTML += "             </td>";
            strHTML += "         </tr>";
            if (dt.Rows[0]["QUOT_TYPE"].ToString() != "A" || dt.Rows[0]["USER_TYPE"].ToString() == "A")
            {
                strHTML += "         <tr>";
                strHTML += "	<td valign=\"middle\" align=\"center\" style=\"padding: 40px 0 88px\"> ";
                strHTML += "	<div style=\"display:inline-block;width:200px;max-width:100%;vertical-align:top\">  ";
                strHTML += "						  <table style=\"table-layout:fixed;width:200px;\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\">    ";
                strHTML += "						  <tbody> ";
                strHTML += "	<tr> ";
                strHTML += "	   <td> ";
                strHTML += "			 <table style=\"table-layout:fixed;width:100%;background:#22b7b0\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"> ";
                strHTML += "				 <tbody> ";
                strHTML += "					<tr> ";
                strHTML += "					   <td height=\"56\" style=\"text-align:center;\"> ";
                strHTML += "							 <a href=" + System.Configuration.ConfigurationManager.AppSettings["Url"] + "/Quotation/CallMailPage?param=" + encryptAES256(dt.Rows[0]["REQ_EMAIL"].ToString() + "|" + dt.Rows[0]["PSWD"].ToString() + "|" + dt.Rows[0]["REQ_NO"].ToString() + "|" + "QUOT") + " style=\"text-decoration:none !important; font-size:18px;color:#fff;text-decoration:none;font-family:'Noto Sans KR', 'Noto Sans', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;font-weight: 600;text-decoration: none;\" rel=\"noreferrer noopener\" target=\"_blank\">자세히 보기</a> ";
                strHTML += "						  </td> ";
                strHTML += "					  </tr> ";
                strHTML += "				  </tbody> ";
                strHTML += "			  </table> ";
                strHTML += "		  </td> ";
                strHTML += "	  </tr>                        ";
                strHTML += "	  </tbody>                ";
                strHTML += "	  </table>             ";
                strHTML += "	  </div>                    ";
                strHTML += "	  </td>";
                strHTML += "         </tr>";
            }
            strHTML += "         <tr>";
            strHTML += "            <td valign=\"middle\" align=\"center\" style=\"padding:0 13px;background-color: #f2f2f2;height: 89px;\">";
            strHTML += "               <div style=\"max-width: 610px;margin: 0 auto;\">";
            strHTML += "                  <p style=\"font-size: 13px;color: #999999;font-family:'Noto Sans KR', 'Noto Sans', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;font-weight: 300;margin: 6px 0 0;\">본 메일은 발신 전용이므로 회신할 수 없습니다.</p>";
            strHTML += "               </div>";
            strHTML += "            </td>";
            strHTML += "         </tr>   ";
            strHTML += "      </table>";
            strHTML += "   </div>";
            strHTML += "</body>";
            strHTML += "</html>";
            return strHTML;
        }


        public string MakeEmailFormBkg(DataRow dr)
        {

            string strHTML = "";
            strHTML += "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"https://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">";
            strHTML += "<html xmlns=\"http://www.w3.org/1999/xhtml\">";
            strHTML += "<head>";
            strHTML += "<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\" />";
            strHTML += "    <!--[if !mso]><!-->";
            strHTML += "        <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\" />";
            strHTML += "    <!--<![endif]-->";
            strHTML += "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">";
            strHTML += "    <title></title>";
            strHTML += "</head>";
            strHTML += "<body style=\"margin: 0; padding: 0;\">";
            strHTML += "   ";
            strHTML += "   <div style=\"max-width: 700px;margin: 0 auto;width: 100%;\" align=\"center\">";
            strHTML += "      <table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" width=\"100%\" align=\"center\" style=\"margin: 0 auto;\">";
            strHTML += "         <tr>";
            strHTML += "            <td valign=\"middle\" style=\"padding:0 13px;background-color: ##004e97;color: #ffffff;font-size: 20px;height:70px;letter-spacing:-1px;font-family:'Noto Sans KR', 'Noto Sans', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;\">";
            //strHTML += "                    <div style='max-width: 610px;margin: 0 auto'> 안녕하세요.연수다 입니다.</div>";
            strHTML += "            </td>";
            strHTML += "         </tr>";
            strHTML += "         <tr>";
            strHTML += "            <td valign=\"top\" align=\"center\" style=\"padding:30px 0 30px;background-color: #22b7b0;font-size: 20px;letter-spacing:-1px;font-family:'Noto Sans KR', 'Noto Sans', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;font-weight: 300;\">";
            strHTML += "               <span style=\"font-weight: 600;color: #ffffff;\">[연수다] 요청하신 " + dr["TITLE"].ToString() + "서 입니다. ";
            strHTML += "            </td>";
            strHTML += "         </tr>";

            strHTML += "         <tr>";
            strHTML += "            <td valign=\"top\">";
            strHTML += "               <div style=\"margin: 0 auto\">";
            strHTML += "                  <table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" width=\"100%\" style=\"border-top: 2px solid #222222;width: 100%;\">";
            strHTML += "                <tr>";
            strHTML += "                        <td valign=\"middle\" align=\"center\" width=\"28%\" style=\"width:28%;padding:0;height:43px;font-size: 14px;color: #333333;background-color: #f8f8f8;border-bottom: 1px solid #eaeaea;font-family:'Noto Sans KR', 'Noto Sans', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;font-weight: 600;\">";
            strHTML += "                              <strong>지역</strong>";
            strHTML += "                        </td>  ";
            strHTML += "                        <td valign=\"middle\" align=\"left\" style=\"padding:0 0 0 20px;height:43px;font-size: 14px;color: #888888;border-bottom: 1px solid #eaeaea;font-family:'Noto Sans KR', 'Noto Sans', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;font-weight: 300;\">";
            strHTML += "                           <Pre>" + dr["AREA"].ToString() + "</Pre> ";
            strHTML += "                        </td> ";
            strHTML += "               </tr>";
            strHTML += "                <tr>";
            strHTML += "                        <td valign=\"middle\" align=\"center\" width=\"28%\" style=\"width:28%;padding:0;height:43px;font-size: 14px;color: #333333;background-color: #f8f8f8;border-bottom: 1px solid #eaeaea;font-family:'Noto Sans KR', 'Noto Sans', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;font-weight: 600;\">";
            strHTML += "                              <strong>예약날짜</strong>";
            strHTML += "                        </td>  ";
            strHTML += "                        <td valign=\"middle\" align=\"left\" style=\"padding:0 0 0 20px;height:43px;font-size: 14px;color: #888888;border-bottom: 1px solid #eaeaea;font-family:'Noto Sans KR', 'Noto Sans', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;font-weight: 300;\">";
            strHTML += "                           <Pre>" + dr["STRT_YMD"].ToString() + " - " + dr["END_YMD"].ToString() + "</Pre> ";
            strHTML += "                        </td> ";
            strHTML += "               </tr>";
            strHTML += "                <tr>";
            strHTML += "                        <td valign=\"middle\" align=\"center\" width=\"28%\" style=\"width:28%;padding:0;height:43px;font-size: 14px;color: #333333;background-color: #f8f8f8;border-bottom: 1px solid #eaeaea;font-family:'Noto Sans KR', 'Noto Sans', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;font-weight: 600;\">";
            strHTML += "                              <strong>인원</strong>";
            strHTML += "                        </td>  ";
            strHTML += "                        <td valign=\"middle\" align=\"left\" style=\"padding:0 0 0 20px;height:43px;font-size: 14px;color: #888888;border-bottom: 1px solid #eaeaea;font-family:'Noto Sans KR', 'Noto Sans', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;font-weight: 300;\">";
            strHTML += "                           <Pre>" + formatAmount(dr["HEAD_CNT"].ToString()) + " 명</Pre> ";
            strHTML += "                        </td> ";
            strHTML += "               </tr>";
            strHTML += "                <tr>";
            strHTML += "                        <td valign=\"middle\" align=\"center\" width=\"28%\" style=\"width:28%;padding:0;height:43px;font-size: 14px;color: #333333;background-color: #f8f8f8;border-bottom: 1px solid #eaeaea;font-family:'Noto Sans KR', 'Noto Sans', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;font-weight: 600;\">";
            strHTML += "                              <strong>예약일</strong>";
            strHTML += "                        </td>  ";
            strHTML += "                        <td valign=\"middle\" align=\"left\" style=\"padding:0 0 0 20px;height:43px;font-size: 14px;color: #888888;border-bottom: 1px solid #eaeaea;font-family:'Noto Sans KR', 'Noto Sans', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;font-weight: 300;\">";
            strHTML += "                           <Pre>" + dr["INS_DT"].ToString() + "</Pre> ";
            strHTML += "                        </td> ";
            strHTML += "               </tr>";
            strHTML += "                <tr>";
            strHTML += "                        <td valign=\"middle\" align=\"center\" width=\"28%\" style=\"width:28%;padding:0;height:43px;font-size: 14px;color: #333333;background-color: #f8f8f8;border-bottom: 1px solid #eaeaea;font-family:'Noto Sans KR', 'Noto Sans', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;font-weight: 600;\">";
            strHTML += "                              <strong>총 금액</strong>";
            strHTML += "                        </td>  ";
            strHTML += "                        <td valign=\"middle\" align=\"left\" style=\"padding:0 0 0 20px;height:43px;font-size: 14px;color: #888888;border-bottom: 1px solid #eaeaea;font-family:'Noto Sans KR', 'Noto Sans', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;font-weight: 300;\">";
            strHTML += "                           <Pre>" + formatAmount(dr["TOT_AMT"].ToString()) + "원</Pre> ";
            strHTML += "                        </td> ";
            strHTML += "               </tr>";
            strHTML += "                   </table> ";
            strHTML += "                 </div> ";
            strHTML += "             </td>";
            strHTML += "         </tr>";

            strHTML += "	<td valign=\"middle\" align=\"center\" style=\"padding: 40px 0 88px\"> ";
            strHTML += "	<div style=\"display:inline-block;width:200px;max-width:100%;vertical-align:top\">  ";
            strHTML += "						  <table style=\"table-layout:fixed;width:200px;\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\">    ";
            strHTML += "						  <tbody> ";
            strHTML += "	<tr> ";
            strHTML += "	   <td> ";
            strHTML += "			 <table style=\"table-layout:fixed;width:100%;background:#22b7b0\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"> ";
            strHTML += "				 <tbody> ";
            strHTML += "					<tr> ";
            strHTML += "					   <td height=\"56\" style=\"text-align:center;\"> ";
            strHTML += "							 <a href=" + System.Configuration.ConfigurationManager.AppSettings["Url"] + "/Quotation/CallMailPage?param=" + encryptAES256(dr["REQ_EMAIL"].ToString() + "|" + dr["PSWD"].ToString() + "|" + dr["BKG_NO"].ToString() + "|" + "BKG") + " style=\"text-decoration:none !important; font-size:18px;color:#fff;text-decoration:none;font-family:'Noto Sans KR', 'Noto Sans', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;font-weight: 600;text-decoration: none;\" rel=\"noreferrer noopener\" target=\"_blank\">자세히 보기</a> ";
            strHTML += "						  </td> ";
            strHTML += "					  </tr> ";
            strHTML += "				  </tbody> ";
            strHTML += "			  </table> ";
            strHTML += "		  </td> ";
            strHTML += "	  </tr>                        ";
            strHTML += "	  </tbody>                ";
            strHTML += "	  </table>             ";
            strHTML += "	  </div>                    ";
            strHTML += "	  </td>";
            strHTML += "         <tr>";
            strHTML += "            <td valign=\"middle\" align=\"center\" style=\"padding:0 13px;background-color: #f2f2f2;height: 89px;\">";
            strHTML += "               <div style=\"max-width: 610px;margin: 0 auto;\">";
            strHTML += "                  <p style=\"font-size: 13px;color: #999999;font-family:'Noto Sans KR', 'Noto Sans', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;font-weight: 300;margin: 6px 0 0;\">본 메일은 발신 전용이므로 회신할 수 없습니다.</p>";
            strHTML += "               </div>";
            strHTML += "            </td>";
            strHTML += "         </tr>   ";
            strHTML += "      </table>";
            strHTML += "   </div>";
            strHTML += "</body>";
            strHTML += "</html>";
            return strHTML;
        }
        [HttpPost]
        public ActionResult fnSaveConfDtl(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();

                DataTable dt = new DataTable();
                dt = JsonConvert.DeserializeObject<DataTable>(vJsonData);
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    if (dt.Rows[i]["INSFLAG"].ToString() == "I")
                    {
                        rtnStatus = Sql_AdminItem.InsertConfDtl(dt.Rows[i]);
                    }
                    else if (dt.Rows[i]["INSFLAG"].ToString() == "U")
                    {
                        rtnStatus = Sql_AdminItem.UpdateConfDtl(dt.Rows[i]);
                    }
                    else if (dt.Rows[i]["INSFLAG"].ToString() == "D")
                    {
                        rtnStatus = Sql_AdminItem.DeleteConfDtl(dt.Rows[i]);
                    }


                    if (!rtnStatus) break;
                }

                dt = Sql_AdminItem.SelectConfDetail(dt.Rows[0]);
                strJson = _common.MakeJson("Y", "Success", dt);
                return Json(strJson);
            }
            catch (Exception e)
            {
                strJson = e.Message;
                return Json(strJson);
            }
        }

        public string formatAmount(string prc) {
            string formattedNumber = string.Format("{0:N0}", int.Parse(prc));

            return formattedNumber;
        }

        [HttpPost]
        public ActionResult fnSaveRoomDtl(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();

                DataTable dt = new DataTable();
                dt = JsonConvert.DeserializeObject<DataTable>(vJsonData);
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    if (dt.Rows[i]["INSFLAG"].ToString() == "I")
                    {
                        rtnStatus = Sql_AdminItem.InsertRoomDtl(dt.Rows[i]);
                    }
                    else if (dt.Rows[i]["INSFLAG"].ToString() == "U")
                    {
                        rtnStatus = Sql_AdminItem.UpdateRoomDtl(dt.Rows[i]);
                    }
                    else if (dt.Rows[i]["INSFLAG"].ToString() == "D")
                    {
                        rtnStatus = Sql_AdminItem.DeleteRoomDtl(dt.Rows[i]);
                    }


                    if (!rtnStatus) break;
                }

                dt = Sql_AdminItem.SelectRoomDetail(dt.Rows[0]);
                strJson = _common.MakeJson("Y", "Success", dt);
                return Json(strJson);
            }
            catch (Exception e)
            {
                strJson = e.Message;
                return Json(strJson);
            }
        }

        [HttpPost]
        public ActionResult fnSaveMealDtl(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();

                DataTable dt = new DataTable();
                dt = JsonConvert.DeserializeObject<DataTable>(vJsonData);
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    if (dt.Rows[i]["INSFLAG"].ToString() == "I")
                    {
                        rtnStatus = Sql_AdminItem.InsertMealDtl(dt.Rows[i]);
                    }
                    else if (dt.Rows[i]["INSFLAG"].ToString() == "U")
                    {
                        rtnStatus = Sql_AdminItem.UpdateMealDtl(dt.Rows[i]);
                    }
                    else if (dt.Rows[i]["INSFLAG"].ToString() == "D")
                    {
                        rtnStatus = Sql_AdminItem.DeleteMealDtl(dt.Rows[i]);
                    }
                    if (!rtnStatus) break;
                }

                dt = Sql_AdminItem.SelectMealDetail(dt.Rows[0]);
                strJson = _common.MakeJson("Y", "Success", dt);
                return Json(strJson);
            }
            catch (Exception e)
            {
                strJson = e.Message;
                return Json(strJson);
            }
        }


        [HttpPost]
        public ActionResult fnSaveSvcDtl(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();

                DataTable dt = new DataTable();
                dt = JsonConvert.DeserializeObject<DataTable>(vJsonData);
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    if (dt.Rows[i]["INSFLAG"].ToString() == "I")
                    {
                        rtnStatus = Sql_AdminItem.InsertSvcDtl(dt.Rows[i]);
                    }
                    else if (dt.Rows[i]["INSFLAG"].ToString() == "U")
                    {
                        rtnStatus = Sql_AdminItem.UpdateSvcDtl(dt.Rows[i]);
                    }
                    else if (dt.Rows[i]["INSFLAG"].ToString() == "D")
                    {
                        rtnStatus = Sql_AdminItem.DeleteSvcDtl(dt.Rows[i]);
                    }
                    if (!rtnStatus) break;
                }

                dt = Sql_AdminItem.SelectSVCDetail(dt.Rows[0]);
                strJson = _common.MakeJson("Y", "Success", dt);
                return Json(strJson);
            }
            catch (Exception e)
            {
                strJson = e.Message;
                return Json(strJson);
            }
        }



        public ActionResult MoveToREQ_MNG(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();

                DataTable dt = new DataTable();
                dt = JsonConvert.DeserializeObject<DataTable>(vJsonData); // 요청 번호  , 신규 견적번호

                rtnStatus = Sql_Quotation.MakeNewMst(dt.Rows[0]);

                strJson = _common.MakeJson("Y", "Success");
                return Json(strJson);


            }
            catch(Exception e)
            {
                strJson = e.Message;
                return Json(strJson);
            }
        }


        /// <summary>
        /// 디테일 조회
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult fnGetQuotDtl(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();
                DataSet ds = new DataSet();
                DataTable dt = new DataTable();
                DataTable rtnDt = JsonConvert.DeserializeObject<DataTable>(vJsonData);

                //세미나 정보
                dt = Sql_Quotation.SelectQtuotConfDtl(rtnDt.Rows[0]);
                dt.TableName = "CONF";
                ds.Tables.Add(dt);

                //숙박 정보
                dt = Sql_Quotation.SelectQtuotRoomDtl(rtnDt.Rows[0]);
                dt.TableName = "ROOM";
                ds.Tables.Add(dt);

                //식사 정보
                dt = Sql_Quotation.SelectQtuotMealDtl(rtnDt.Rows[0]);
                dt.TableName = "MEAL";
                ds.Tables.Add(dt);

                //기타 정보
                dt = Sql_Quotation.SelectQtuotSvcDtl(rtnDt.Rows[0]);
                dt.TableName = "SVC";
                ds.Tables.Add(dt);


                dt = new DataTable();
                dt.Columns.Add("trxCode");
                dt.Columns.Add("trxMsg");
                DataRow row1 = dt.NewRow();
                row1["trxCode"] = "Y";
                row1["trxMsg"] = "Success";
                dt.Rows.Add(row1);
                dt.TableName = "Result";
                ds.Tables.Add(dt);
                strJson = JsonConvert.SerializeObject(ds);


                return Json(strJson);

            }
            catch(Exception e)
            {
                strJson = e.Message;
                return Json(strJson);

            }


        }




        #region 디테일 정보 업데이트
        [HttpPost]
        public ActionResult fnUpdateConfDetail(JsonData value)
        {
            string vJsonData = value.vJsonData.ToString();
            DataTable dt = new DataTable();
            dt = JsonConvert.DeserializeObject<DataTable>(vJsonData);

            try
            {
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    if (dt.Rows[i]["INSFLAG"].ToString() == "I")
                    {
                        rtnStatus = Sql_Quotation.InsertConfDtl(dt.Rows[i]);
                    }
                    else if (dt.Rows[i]["INSFLAG"].ToString() == "U")
                    {

                        rtnStatus = Sql_Quotation.UpdateConfDtl(dt.Rows[i]);

                    }
                    else if (dt.Rows[i]["INSFLAG"].ToString() == "D")
                    {
                        rtnStatus = Sql_Quotation.DeleteConfDtl(dt.Rows[i]);
                    }
                }

                dt = Sql_Quotation.SelectQtuotConfDtl(dt.Rows[0]);
                strJson = _common.MakeJson("Y", "Success", dt);
                return Json(strJson);
            }
            catch(Exception e)
            {
                strJson = e.Message;
                return Json(strJson);
            }

        }


        [HttpPost]
        public ActionResult fnUpdateRoomDetail(JsonData value)
        {
            string vJsonData = value.vJsonData.ToString();
            DataTable dt = new DataTable();
            dt = JsonConvert.DeserializeObject<DataTable>(vJsonData);

            try
            {
                for(int i = 0; i < dt.Rows.Count; i++)
                {
                    if(dt.Rows[i]["INSFLAG"].ToString() == "I")
                    {
                        rtnStatus = Sql_Quotation.InsertRoomDtl(dt.Rows[i]);
                    }
                    else if (dt.Rows[i]["INSFLAG"].ToString() == "U")
                    {
                        rtnStatus = Sql_Quotation.UpdateRoomDtl(dt.Rows[i]);

                    }
                    else if (dt.Rows[i]["INSFLAG"].ToString() == "D")
                    {
                        rtnStatus = Sql_Quotation.DeleteRoomDtl(dt.Rows[i]);

                    }
                }

                dt = Sql_Quotation.SelectQtuotRoomDtl(dt.Rows[0]);
                strJson = _common.MakeJson("Y", "Success", dt);
                return Json(strJson);
            }
            catch (Exception e)
            {
                strJson = e.Message;
                return Json(strJson);
            }
        }


        [HttpPost]
        public ActionResult fnUpdateMealDetail(JsonData value)
        {
            string vJsonData = value.vJsonData.ToString();
            DataTable dt = new DataTable();
            dt = JsonConvert.DeserializeObject<DataTable>(vJsonData);

            try
            {
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    if (dt.Rows[i]["INSFLAG"].ToString() == "I")
                    {
                        rtnStatus = Sql_Quotation.InsertMealDtl(dt.Rows[i]);
                    }
                    else if (dt.Rows[i]["INSFLAG"].ToString() == "U")
                    {
                        rtnStatus = Sql_Quotation.UpdateMealDtl(dt.Rows[i]);

                    }
                    else if (dt.Rows[i]["INSFLAG"].ToString() == "D")
                    {
                        rtnStatus = Sql_Quotation.DeleteMealDtl(dt.Rows[i]);

                    }
                }

                dt = Sql_Quotation.SelectQtuotMealDtl(dt.Rows[0]);
                strJson = _common.MakeJson("Y", "Success", dt);
                return Json(strJson);
            }
            catch (Exception e)
            {
                strJson = e.Message;
                return Json(strJson);
            }
        }



        [HttpPost]
        public ActionResult fnUpdateSvcDetail(JsonData value)
        {
            string vJsonData = value.vJsonData.ToString();
            DataTable dt = new DataTable();
            dt = JsonConvert.DeserializeObject<DataTable>(vJsonData);

            try
            {
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    if (dt.Rows[i]["INSFLAG"].ToString() == "I")
                    {
                        rtnStatus = Sql_Quotation.InsertSvcDtl(dt.Rows[i]);
                    }
                    else if (dt.Rows[i]["INSFLAG"].ToString() == "U")
                    {
                        rtnStatus = Sql_Quotation.UpdateSvcDtl(dt.Rows[i]);
                    }
                    else if (dt.Rows[i]["INSFLAG"].ToString() == "D")
                    {
                        rtnStatus = Sql_Quotation.DeleteSvcDtl(dt.Rows[i]);
                    }
                }
                dt = Sql_Quotation.SelectQtuotSvcDtl(dt.Rows[0]);

                strJson = _common.MakeJson("Y", "Success", dt);
                return Json(strJson);
            }
            catch (Exception e)
            {
                strJson = e.Message;
                return Json(strJson);
            }
        }


        /// <summary>
        /// 상품 상세 정보 전체 조회 쿼리
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult fnGetQuotationAll(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();
                DataSet ds = new DataSet();
                DataTable dt = new DataTable();
                DataTable rtnDt = JsonConvert.DeserializeObject<DataTable>(vJsonData);

                //세미나 정보
                dt = Sql_Quotation.SelectConfDetail(rtnDt.Rows[0]);
                dt.TableName = "CONF";
                ds.Tables.Add(dt);

                //숙박 정보
                dt = Sql_Quotation.SelectRoomDetail(rtnDt.Rows[0]);
                dt.TableName = "ROOM";
                ds.Tables.Add(dt);

                //식사 정보
                dt = Sql_Quotation.SelectMealDetail(rtnDt.Rows[0]);
                dt.TableName = "MEAL";
                ds.Tables.Add(dt);

                //기타 정보
                dt = Sql_Quotation.SelectSVCDetail(rtnDt.Rows[0]);
                dt.TableName = "SVC";
                ds.Tables.Add(dt);

                dt = new DataTable();
                dt.Columns.Add("trxCode");
                dt.Columns.Add("trxMsg");
                DataRow row1 = dt.NewRow();
                row1["trxCode"] = "Y";
                row1["trxMsg"] = "Success";
                dt.Rows.Add(row1);
                dt.TableName = "Result";
                ds.Tables.Add(dt);
                strJson = JsonConvert.SerializeObject(ds);


                return Json(strJson);

            }
            catch (Exception e)
            {
                strJson = e.Message;
                return Json(strJson);
            }
        }
        #endregion



        #region Online_QUOT


        /// <summary>
        /// 온라인 견적 최초 저장
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult fnSaveOnLineQUOT(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();
                DataSet ds = new DataSet();
                DataTable dt = new DataTable();
                DataTable rtnDt = new DataTable();
                DataSet rtnDs = new DataSet();

                ds = JsonConvert.DeserializeObject<DataSet>(vJsonData);

                rtnDt = ds.Tables["MAIN"];

                //헤더 저장
                for (int i = 0; i < rtnDt.Rows.Count; i++)
                {
                    rtnStatus = Sql_Quotation.SaveMngQuotList_Query(rtnDt.Rows[0]);
                }


                if (ds.Tables.Contains("CONF"))
                {
                    dt = ds.Tables["CONF"];
                    for (int i = 0; i < dt.Rows.Count; i++)
                    {
                        rtnStatus = Sql_Quotation.SaveMngCONF_Query(dt.Rows[i]);
                    }

                }


                if (ds.Tables.Contains("ROOM"))
                {
                    dt = ds.Tables["ROOM"];
                    for (int i = 0; i < dt.Rows.Count; i++)
                    {
                        rtnStatus = Sql_Quotation.SaveMngROOM_Query(dt.Rows[i]);
                    }
                }

                if (ds.Tables.Contains("MEAL"))
                {
                    dt = ds.Tables["MEAL"];
                    for (int i = 0; i < dt.Rows.Count; i++)
                    {
                        rtnStatus = Sql_Quotation.SaveMngMEAL_Query(dt.Rows[i]);
                    }
                }

                if (ds.Tables.Contains("SVC"))
                {
                    dt = ds.Tables["SVC"];
                    for (int i = 0; i < dt.Rows.Count; i++)
                    {
                        rtnStatus = Sql_Quotation.SaveMngSVC_Query(dt.Rows[i]);
                    }
                }

                //전체 조회
                ds = Sql_Quotation.SelectOnLineALL(rtnDt.Rows[0]);



                strJson = JsonConvert.SerializeObject(ds);

                return Json(strJson);
            }
            catch(Exception e)
            {
                strJson = e.Message;
                return Json(strJson);
            }
        }
        #endregion



        #region 견적등록 리뉴얼

        /// <summary>
        /// 헤더 저장 버튼
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public ActionResult QuotHeeaderSave(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();
                DataTable dt = new DataTable();
                DataTable dtl_DT = new DataTable();
                DataSet ds = new DataSet();
                DataTable rtnDt = new DataTable();

                ds = JsonConvert.DeserializeObject<DataSet>(vJsonData);

                dt = ds.Tables["MAIN"];
                rtnDt = ds.Tables["PAGE_TYPE"];

                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    rtnStatus = Sql_Quotation.InsertNewMngtQuot(dt.Rows[i]);


                    #region 신규 등록일 때만 디테일 저장
                    if (dt.Rows[i]["INSFLAG"].ToString() == "I" || dt.Rows[i]["INSFLAG"].ToString() == "M") 
                    {
                        string quot_no = dt.Rows[i]["QUOT_NO"].ToString();
                        string req_no = dt.Rows[i]["REQ_NO"].ToString();

                        ds = Sql_Quotation.Select_ReqList_Query(dt.Rows[i]);

                        

                        if(ds.Tables.Contains("CONFERENCE") && ds.Tables["CONFERENCE"].Rows.Count > 0)
                        {
                            dtl_DT = ds.Tables["CONFERENCE"];
                            for (int j = 0; j < dtl_DT.Rows.Count; j++)
                            {
                                rtnStatus = Sql_Quotation.InsertConfDtlFirst(dtl_DT.Rows[j], quot_no);
                            }
                        }

                        if (ds.Tables.Contains("ROOM") && ds.Tables["ROOM"].Rows.Count > 0)
                        {
                            dtl_DT = ds.Tables["ROOM"];
                            for (int j = 0; j < dtl_DT.Rows.Count; j++)
                            {
                                rtnStatus = Sql_Quotation.InsertRoomDtlFirst(dtl_DT.Rows[j], quot_no);
                            }
                        }

                        if (ds.Tables.Contains("MEAL") && ds.Tables["MEAL"].Rows.Count > 0)
                        {
                            dtl_DT = ds.Tables["MEAL"];
                            for (int j = 0; j < dtl_DT.Rows.Count; j++)
                            {
                                rtnStatus = Sql_Quotation.InsertMealDtlFirst(dtl_DT.Rows[j], quot_no);
                            }
                        }
                        if (ds.Tables.Contains("SERVICE") && ds.Tables["SERVICE"].Rows.Count > 0)
                        {
                            dtl_DT = ds.Tables["SERVICE"];
                            for (int j = 0; j < dtl_DT.Rows.Count; j++)
                            {
                                rtnStatus = Sql_Quotation.InsertSvcDtlFirst(dtl_DT.Rows[j], quot_no);
                            }
                        }
                    }
                    #endregion

                }
                
                ds = Sql_Quotation.SelectMngQuotList_Query(rtnDt.Rows[0]);


                strJson = JsonConvert.SerializeObject(ds);

                return Json(strJson);
            }
            catch (Exception e)
            {
                strJson = e.Message;
                return Json(strJson);
            }
        }




        /// <summary>
        /// 최초 저장
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public ActionResult QuotFirstSave(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();
                DataSet ds = new DataSet(); 
                DataTable dt = new DataTable();
                DataTable rtnDt = new DataTable();
                DataSet rtnDs = new DataSet();

                ds = JsonConvert.DeserializeObject<DataSet>(vJsonData);

                rtnDt = ds.Tables["MAIN"];

                //헤더 저장
                for (int i = 0; i < rtnDt.Rows.Count; i++)
                {
                    rtnStatus = Sql_Quotation.SaveMngQuotList_Query(rtnDt.Rows[0]);
                }

                #region 디테일 저장
                if (ds.Tables.Contains("CONF"))
                {
                    dt = ds.Tables["CONF"];
                    for (int i = 0; i < dt.Rows.Count; i++)
                    {
                        rtnStatus = Sql_Quotation.SaveMngCONF_Query(dt.Rows[i]);
                    }

                }

                

                if (ds.Tables.Contains("ROOM"))
                {
                    dt = ds.Tables["ROOM"];
                    for (int i = 0; i < dt.Rows.Count; i++)
                    {
                        rtnStatus = Sql_Quotation.SaveMngROOM_Query(dt.Rows[i]);
                    }
                }

                if (ds.Tables.Contains("MEAL"))
                {
                    dt = ds.Tables["MEAL"];
                    for (int i = 0; i < dt.Rows.Count; i++)
                    {
                        rtnStatus = Sql_Quotation.SaveMngMEAL_Query(dt.Rows[i]);
                    }
                }

                if (ds.Tables.Contains("SVC"))
                {
                    dt = ds.Tables["SVC"];
                    for (int i = 0; i < dt.Rows.Count; i++)
                    {
                        rtnStatus = Sql_Quotation.SaveMngSVC_Query(dt.Rows[i]);
                    }
                }
                #endregion 디테일 저장


                //전체 조회
                
                if(ds.Tables["PAGE_TYPE"].Rows[0]["PAGE"].ToString() != "MANAGE")
                {
                    ds = Sql_Quotation.SelectOnLineALL(rtnDt.Rows[0]);
                    strJson = JsonConvert.SerializeObject(ds);
                }
                else
                {
                    dt = Sql_Quotation.SelectQuotManageDetail(rtnDt.Rows[0]);
                    dt.TableName = "MAIN";
                    strJson = _common.MakeJson("Y", "Success", dt);
                }

                return Json(strJson);
            }
            catch (Exception e)
            {
                strJson = e.Message;
                return Json(strJson);
            }
        }


        public ActionResult MNGITEMUpdate(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();
                DataSet ds = new DataSet();
                DataTable dt = new DataTable();
                DataTable rtnDt = new DataTable();
                DataSet rtnDs = new DataSet();

                ds = JsonConvert.DeserializeObject<DataSet>(vJsonData);

                rtnDt = ds.Tables["MAIN"];

                //헤더 저장
                for (int i = 0; i < rtnDt.Rows.Count; i++)
                {
                    rtnStatus = Sql_Quotation.SaveMngQuotList_Query(rtnDt.Rows[0]);
                }

                #region 디테일 삭제
                if (ds.Tables.Contains("CONF"))
                {
                    dt = ds.Tables["CONF"];
                    for (int i = 0; i < dt.Rows.Count; i++)
                    {
                        rtnStatus = Sql_Quotation.DeleteConfDtl(dt.Rows[i]);
                    }

                }



                if (ds.Tables.Contains("ROOM"))
                {
                    dt = ds.Tables["ROOM"];
                    for (int i = 0; i < dt.Rows.Count; i++)
                    {
                        rtnStatus = Sql_Quotation.DeleteRoomDtl(dt.Rows[i]);
                    }
                }

                if (ds.Tables.Contains("MEAL"))
                {
                    dt = ds.Tables["MEAL"];
                    for (int i = 0; i < dt.Rows.Count; i++)
                    {
                        rtnStatus = Sql_Quotation.DeleteMealDtl(dt.Rows[i]);
                    }
                }

                if (ds.Tables.Contains("SVC"))
                {
                    dt = ds.Tables["SVC"];
                    for (int i = 0; i < dt.Rows.Count; i++)
                    {
                        rtnStatus = Sql_Quotation.DeleteSvcDtl(dt.Rows[i]);
                    }
                }
                #endregion 디테일 저장


                //전체 조회
                ds = Sql_Quotation.SelectOnLineALL(rtnDt.Rows[0]);



                strJson = JsonConvert.SerializeObject(ds);

                return Json(strJson);
            }
            catch (Exception e)
            {
                strJson = e.Message;
                return Json(strJson);
            }
        }


        /// <summary>
        /// 파일 업데이트
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public ActionResult MNGFileUpdate(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();

                DataTable dt = new DataTable();
                dt = JsonConvert.DeserializeObject<DataTable>(vJsonData);

                
                rtnStatus = Sql_Quotation.SaveMngQuotList_Query(dt.Rows[0]);
                

                dt = Sql_Quotation.SelectQuotALL(dt.Rows[0]);
                strJson = _common.MakeJson("Y", "Success", dt);
                return Json(strJson);
            }
            catch (Exception e)
            {
                strJson = e.Message;
                return Json(strJson);
            }
        }


        /// <summary>
        /// 헤더만 업데이트
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public ActionResult QuotUpdateHeader(JsonData value)
        {
            string vJsonData = value.vJsonData.ToString();
            DataSet ds = new DataSet();
            DataTable dt = new DataTable();
            DataTable rtnDt = new DataTable();
            DataSet rtnDs = new DataSet();

            ds = JsonConvert.DeserializeObject<DataSet>(vJsonData);

            rtnDt = ds.Tables["MAIN"];

            for (int i = 0; i < rtnDt.Rows.Count; i++)
            {
                rtnStatus = Sql_Quotation.SaveMngQuotList_Query(rtnDt.Rows[0]);
            }


            dt = ds.Tables["PAGE_TYPE"];

            if(dt.Rows[0]["PAGE"].ToString() != "MANAGE")
            {
                ds = Sql_Quotation.SelectOnLineALL(rtnDt.Rows[0]);
                strJson = JsonConvert.SerializeObject(ds);
            }
            else
            {
                dt = Sql_Quotation.SelectQuotManageDetail(rtnDt.Rows[0]);
                dt.TableName = "MAIN";
                strJson = _common.MakeJson("Y", "Success", dt);
            }

            

            

            return Json(strJson);
        }



        /// <summary>
        /// 견적등록 메일 발송
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public ActionResult fnQRegistSendEmail(JsonData value)
        {
            string strResult;
            DataTable dt = new DataTable();
            DataSet ds = new DataSet();

            try
            {
                string vJsonData = value.vJsonData.ToString();

                DataTable rtnDt = new DataTable();
                rtnDt = JsonConvert.DeserializeObject<DataTable>(vJsonData);
                for (int i = 0; i < rtnDt.Rows.Count; i++)
                {
                    if (rtnDt.Rows[i]["TYPE"].ToString() == "QUOT")
                    {
                        dt = Sql_Quotation.SelectQuotList(rtnDt.Rows[i]);
                    }

                    if (dt.Rows[0]["REQ_EMAIL"].ToString() != "")
                    {
                        System.IO.FileInfo fi;
                        //첨부파일 로직                
                        fi = new System.IO.FileInfo(Server.MapPath(dt.Rows[0]["FILE_PATH"].ToString()) + "/" + dt.Rows[0]["FILE_NM"].ToString());


                        #region
                        System.Net.Mail.SmtpClient client = new System.Net.Mail.SmtpClient("smtp.gmail.com", 587)
                        //System.Net.Mail.SmtpClient client = new System.Net.Mail.SmtpClient("mail.yjit.co.kr", 587)
                        {
                            UseDefaultCredentials = true, // 시스템에 설정된 인증 정보를 사용하지 않는다. 
                            EnableSsl = true,  // SSL을 사용한다. 
                            DeliveryMethod = SmtpDeliveryMethod.Network, // 이걸 하지 않으면 Gmail에 인증을 받지 못한다. 
                            Credentials = new System.Net.NetworkCredential("metakit0601@gmail.com", "yekg mxed gmuf lwxh"),
                            //Credentials = new System.Net.NetworkCredential("mailmaster@yjit.co.kr", "Yjit0921)#$%"),
                            Timeout = 100000
                        };

                        //MailAddress from = new MailAddress("help@yjit.co.kr");
                        MailAddress from = new MailAddress("metakit0601@gmail.com");
                        //MailAddress to = new MailAddress("ebkim@yjit.co.kr");
                        MailAddress to = new MailAddress(dt.Rows[0]["REQ_EMAIL"].ToString());

                        MailMessage message = new MailMessage(from, to);
                        message.Subject = "[연수다] 요청하신 " + dt.Rows[0]["TITLE"].ToString() + "서 입니다.";
                        message.SubjectEncoding = System.Text.Encoding.UTF8;
                        if (rtnDt.Rows[i]["TYPE"].ToString() == "QUOT")
                        {
                            message.Body = MakeEmailForm(dt);
                        }
                        else
                        {
                            message.Body = MakeEmailFormBkg(dt.Rows[0]);
                        }
                        //message.Body = "";
                        message.IsBodyHtml = true;
                        message.BodyEncoding = System.Text.Encoding.UTF8;
                        if (fi.Exists)
                        {
                            message.Attachments.Add(new Attachment(new FileStream(Server.MapPath(dt.Rows[0]["FILE_PATH"].ToString()) + "/" + dt.Rows[0]["FILE_NM"].ToString(), FileMode.Open, FileAccess.Read), dt.Rows[0]["FILE_NM"].ToString()));
                        }

                        //서버 인증서의 유효성 검사하는 부분을 무조건 true 
                        System.Net.ServicePointManager.ServerCertificateValidationCallback += (s, cert, chain, sslPolicyErrors) => true;
                        client.Send(message);
                        message.Dispose();
                        #endregion 메일 발송로직

                        //이메일 성공시 Update
                        //SetEmailLog("Y", "성공");
                        if (rtnDt.Rows[i]["TYPE"].ToString() == "QUOT")
                        {
                            rtnStatus = Sql_Quotation.UpdateEmailSend(rtnDt.Rows[0]);
                        }

                    }
                }


                //업데이트 후 조회
                if (rtnDt.Rows[0]["TYPE"].ToString() == "QUOT")
                {

                    //if (!rtnDt.Columns.Contains("PAGE_TYPE"))
                    //{ // 견적 리스트 조회
                    //    dt = Sql_Quotation.SelectQuotALL(rtnDt.Rows[0]);
                    //    strJson = _common.MakeJson("Y", "Success", dt);

                    //}

                    //else
                    //{
                    //    //관리에서 왔을 때
                    //    if(rtnDt.Rows[0]["PAGE_TYPE"].ToString() == "MANAGE")
                    //    {

                    //        dt = Sql_Quotation.SelectQuotManageDetail(rtnDt.Rows[0]);
                    //        dt.TableName = "MAIN";
                    //        strJson = _common.MakeJson("Y", "Success", dt);
                    //    }
                    //    // 상품 견적일 때
                    //    else if(rtnDt.Rows[0]["PAGE_TYPE"].ToString() == "ONLINE_QUOT" || rtnDt.Rows[0]["PAGE_TYPE"].ToString() == "EASY_QUOT")
                    //    {
                    //        ds = Sql_Quotation.SelectOnLineALL(rtnDt.Rows[0]);
                    //        strJson = JsonConvert.SerializeObject(ds);
                    //    }
                    //}

                    ds = Sql_Quotation.SelectMngQuotList_Query(rtnDt.Rows[0]);
                    strJson = JsonConvert.SerializeObject(ds);
                }

                return Json(strJson);
            }
            catch (Exception e)
            {
                //이메일 실패시 Update
                //SetEmailLog("N", e.Message);

                strJson = _common.MakeJson("N", e.Message, dt);
                return Json(strJson);
            }
        }

        #region Ek 신규 견적등록 로직

        public ActionResult fnSearchReqData(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();
                DataTable dt = new DataTable();
                dt = JsonConvert.DeserializeObject<DataTable>(vJsonData);
                ds = Sql_Quotation.Select_ReqList_Query(dt.Rows[0]);

                strJson = JsonConvert.SerializeObject(ds, Formatting.Indented);

                return Json(strJson);
            }
            catch(Exception e)
            {
                strJson = e.Message;
                return Json(strJson);
            }
        }


        public ActionResult fnSearchMngtQuotLSIT(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();
                DataTable dt = new DataTable();
                dt = JsonConvert.DeserializeObject<DataTable>(vJsonData);
             
                ds = Sql_Quotation.SelectMngQuotList_Query(dt.Rows[0]);

                strJson = JsonConvert.SerializeObject(ds, Formatting.Indented);
                return Json(strJson);
            }
            catch (Exception e)
            {
                strJson = e.Message;
                return Json(strJson);
            }
        }


        public ActionResult fnChangeITEM(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();
                DataSet ds = new DataSet();
                DataTable dt = new DataTable();
                DataTable rtnDt = new DataTable();
                DataTable rtnDt1 = new DataTable();
                DataSet rtnDs = new DataSet();

                ds = JsonConvert.DeserializeObject<DataSet>(vJsonData);

                rtnDt = ds.Tables["MAIN"];
                rtnDt1 = ds.Tables["PAGE_TYPE"];
                string mngt_no = "";
                //헤더 저장
                for (int i = 0; i < rtnDt.Rows.Count; i++)
                {
                    rtnStatus = Sql_Quotation.SaveMngQuotList_Query(rtnDt.Rows[0]);
                    mngt_no = rtnDt.Rows[0]["QUOT_NO"].ToString();
                }

                #region 디테일 삭제
                
                        rtnStatus = Sql_Quotation.DeleteConfDtlALL(mngt_no);
                
                        rtnStatus = Sql_Quotation.DeleteRoomDtlALL(mngt_no);
  
                        rtnStatus = Sql_Quotation.DeleteMealDtlALL(mngt_no);

                        rtnStatus = Sql_Quotation.DeleteSvcDtlALL(mngt_no);
                    

                #endregion 디테일 삭제


                //전체 조회
                ds = Sql_Quotation.SelectMngQuotList_Query(rtnDt1.Rows[0]);



                strJson = JsonConvert.SerializeObject(ds);

                return Json(strJson);
            }
            catch (Exception e)
            {
                strJson = e.Message;
                return Json(strJson);
            }
        }


        public ActionResult fnUpadteQuotFile(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();
                DataSet ds = new DataSet();
                DataTable dt = new DataTable();
                DataTable rtnDt = new DataTable();
                DataTable rtnDt1 = new DataTable();
                DataSet rtnDs = new DataSet();

                ds = JsonConvert.DeserializeObject<DataSet>(vJsonData);

                rtnDt = ds.Tables["MAIN"];
                rtnDt1 = ds.Tables["PAGE_TYPE"];
                

                for (int i = 0; i < rtnDt.Rows.Count; i++)
                {
                    rtnStatus = Sql_Quotation.SaveMngQuotList_Query(rtnDt.Rows[i]);
                }

                ds = Sql_Quotation.SelectMngQuotList_Query(rtnDt1.Rows[0]);

                strJson = JsonConvert.SerializeObject(ds);

                return Json(strJson);
            }
            catch(Exception e)
            {
                strJson = e.Message;
                return Json(strJson);
            }
        }


        #endregion


        public class paramData
        {
            public string LOCATION { get; set; }
            public string CONTROLLER { get; set; }
            public string MNGT_NO { get; set; }
        }


        [HttpPost]
        public string CallPage(paramData paramData)
        {
            string rtnPage = "";
            string view = paramData.LOCATION;
            string controller = paramData.CONTROLLER;
            string MNGT_NO = paramData.MNGT_NO;

            try
            {
                if (paramData != null)
                {
                    if (MNGT_NO != null)
                    {
                        TempData["QUOT_NO"] = MNGT_NO;
                    }

                    rtnPage = "/" + controller + "/" + view;
                }
                return rtnPage;
            }
            catch (Exception ex)
            {
                return "";
            }
        }


        #endregion



        #region 암호화 공통
        private static readonly string KEY = "yjit2020prime135792468101234567891024681013579";
        private static readonly string KEY_128 = KEY.Substring(0, 128 / 8);
        private static readonly string KEY_256 = KEY.Substring(0, 256 / 8);
        /// <summary>
        /// AES 256 암호화, CBC, PKCS7, 예외시 null
        /// </summary>
        /// <param name="rtnStr"></param>
        /// <returns></returns>
        public string encryptAES256(string rtnStr)
        {
            try
            {
                byte[] rtnStrBytes = Encoding.UTF8.GetBytes(rtnStr);
                RijndaelManaged rm = new RijndaelManaged();
                rm.Mode = CipherMode.CBC;
                rm.Padding = PaddingMode.PKCS7;
                rm.KeySize = 256;

                MemoryStream ms = new MemoryStream();
                ICryptoTransform encryptor = rm.CreateEncryptor(Encoding.UTF8.GetBytes(KEY_256), Encoding.UTF8.GetBytes(KEY_128));
                CryptoStream cryptoStream = new CryptoStream(ms, encryptor, CryptoStreamMode.Write);
                cryptoStream.Write(rtnStrBytes, 0, rtnStrBytes.Length);
                cryptoStream.FlushFinalBlock();

                byte[] encryptBytes = ms.ToArray();
                string encryptString = Convert.ToBase64String(encryptBytes);

                cryptoStream.Close();
                ms.Close();

                return encryptString;

            }
            catch (Exception)
            {
                return null;
            }
        }

        /// <summary>
        /// AES 256 복호화, CBC, PKCS7, 예외시 null
        /// </summary>
        /// <param name="encrypt">string</param>
        /// <returns></returns>
        public string decryptAES256(string encrypt)
        {
            try
            {
                byte[] encryptBytes = Convert.FromBase64String(encrypt);
                RijndaelManaged rm = new RijndaelManaged();
                rm.Mode = CipherMode.CBC;
                rm.Padding = PaddingMode.PKCS7;
                rm.KeySize = 256;




                MemoryStream ms = new MemoryStream(encryptBytes);
                ICryptoTransform decryptor = rm.CreateDecryptor(Encoding.UTF8.GetBytes(KEY_256), Encoding.UTF8.GetBytes(KEY_128));
                CryptoStream cryptoStream = new CryptoStream(ms, decryptor, CryptoStreamMode.Read);

                byte[] rtnStrBytes = new byte[encryptBytes.Length];
                int rtnStrCount = cryptoStream.Read(rtnStrBytes, 0, rtnStrBytes.Length);
                string rtnStr = Encoding.UTF8.GetString(rtnStrBytes, 0, rtnStrCount);
                cryptoStream.Close();
                ms.Close();

                return rtnStr;

            }
            catch (Exception e)
            {
                return null;
            }
        }

        public ActionResult CallMailPage()
        {
            #region // Param 정의 내용
            /*
             * Param 구조
             * domain : domain
             * key : UserID
             * no : Primary Key
             * type : 업무구분
             *
             * MSG01 USR 회원가입
                MSG01 BKG 부킹
                MSG01 QUO 견적
                MSG01 HBL 비엘
                MSG01 INV 청구서
                MSG01 TRC 화물추적
             */
            #endregion
            string jSonParam = "";
            string jSonParam2 = "";
            string strDomain = ""; //업체 도메인
            string strKey = ""; //사용자 아이디
            string strAuthKey = ""; //사용자 인증키
            string strType = ""; // 업무구분
            string strFlag = ""; // 해운/항공
            string strRef1 = "";
            string strRef2 = "";
            string strRef3 = "";
            string strRef4 = "";
            string strRef5 = "";
            DataTable LoginDt = new DataTable();

            try
            {
                string param = Request["param"];
                string param2 = Request["params"];
               jSonParam =  decryptAES256(param.Replace(" ", "+"));
                string[] data = jSonParam.Split('|');
                if (data.Length > 0)
                {

                    DataTable dt = _DataHelper.ExecuteDataTable(Sql_Cust.GetMailLogin(data[0], data[1]), CommandType.Text);
                    if (dt.Rows.Count > 0)
                    {

                        Session["MNGT_NO"] = dt.Rows[0]["MNGT_NO"].ToString().Trim();
                        Session["EMAIL"] = dt.Rows[0]["EMAIL"].ToString().Trim();
                        Session["GRP_CD"] = dt.Rows[0]["GRP_CD"].ToString().Trim();
                        Session["CUST_NAME"] = dt.Rows[0]["CUST_NAME"].ToString().Trim();
                        Session["TELNO"] = dt.Rows[0]["TELNO"].ToString().Trim();
                        Session["COMPANY"] = dt.Rows[0]["COMPANY"].ToString().Trim();
                        Session["DEPARTURE"] = dt.Rows[0]["DEPARTURE"].ToString().Trim();
                        Session["USER_TYPE"] = dt.Rows[0]["USER_TYPE"].ToString().Trim();
                        Session["APV_YN"] = dt.Rows[0]["APV_YN"].ToString().Trim();

                        strRef1 = data[2];
                        strType = data[3];
                    }
                    else
                    {
                        //결과값이 없다!
                        return RedirectToAction("Index", "");
                    }

                    string view = "";
                    string controller = "";
                    if (dt.Rows.Count > 0) //로그인이 성공했다면
                    {
                        switch (strType)
                        {
                            case "QUOT": //부킹
                                view = "Index";
                                controller = "Estimate";
                                break;
                            case "BKG": //BL
                                view = "Index";
                                controller = "Reservation";
                                break;
                        }

                        TempData["REF1"] = strRef1;

                        return RedirectToAction(view, controller);
                    }
                    else
                    {
                        return RedirectToAction("index", "");
                    }
                }
                else
                {
                    //예외상황은 무조건 로그인 화면으로 이동
                    return RedirectToAction("index", "");
                }
            }
            catch (Exception e)
            {
                //예외상황은 무조건 로그인 화면으로 이동
                return RedirectToAction("index", "");
            }
        }
        #endregion 암호화 공통
    }
}



