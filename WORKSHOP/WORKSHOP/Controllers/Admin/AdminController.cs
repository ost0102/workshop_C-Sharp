using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Web.Mvc;
using WORKSHOP.Models;
using WORKSHOP.Models.Query;
using Newtonsoft.Json;
using System.IO;
using System.Collections;
using System.Net.Mail;


namespace WORKSHOP.Controllers.Admin
{
    public class AdminController : Controller
    {
        bool rtnStatus = false;
        string strJson = "";
        //
        // GET: /business/       
        public ActionResult Login()
        {
            if (Session["AD_EMAIL"] != null)
            {
                Response.Redirect("/Admin/CommonCode");
            }
            
            return View();
        }
        public ActionResult Customer()
        {
            return View();
        }

        public ActionResult CommonCode()
        {
            return View();
        }

        public ActionResult ItemRegist()
        {
            return View();
        }

     
        public ActionResult bkgList()
        {
            return View();
        }
        public ActionResult bkgModList()
        {
            return View();
        }
        public ActionResult bkgMgt()
        {
            return View();
        }
        public ActionResult bkgRegist()
        {
            return View();
        }

        public ActionResult ReviewMgt()
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

        public ActionResult infoPop()
        {
            return View();
        }

        public ActionResult Community()
        {
            return View();
        }
        public ActionResult CommunityRegist()
        {
            return View();
        }
        public class JsonData
        {
            public string vJsonData { get; set; }
        }


        public ActionResult Logout()
        {
            //Session.Clear();
            //Session.RemoveAll();
            //Response.Cache.SetExpires(DateTime.UtcNow.AddMinutes(-1));
            //Response.Cache.SetCacheability(HttpCacheability.NoCache);
            //Response.Cache.SetNoStore();

            Session["AD_MNGT_NO"] = null;
            Session["AD_EMAIL"] = null;
            Session["AD_GRP_CD"] = null;
            Session["AD_CUST_NAME"] = null;
            Session["AD_TELNO"] = null;
            Session["AD_COMPANY"] = null;
            Session["AD_DEPARTURE"] = null;
            Session["AD_USER_TYPE"] = null;
            Session["AD_APV_YN"] = null;

            return RedirectToAction("Login");
        }

        DataTable dt = new DataTable();
        DataTable Resultdt = new DataTable();
        string strResult = "";

        Sql_Cust SC = new Sql_Cust();

        [HttpPost]

        public string isCheckID(JsonData value)
        {
            try
            {
                strResult = value.vJsonData.ToString();

                dt = JsonConvert.DeserializeObject<DataTable>(strResult);

                Resultdt = _DataHelper.ExecuteDataTable(Sql_Cust.isCheckID_Query(dt.Rows[0]), CommandType.Text);
                if (Resultdt.Rows.Count > 0)
                {
                    strJson = _common.MakeJson("N", "SUCCESS");
                }
                else
                {
                    strJson = _common.MakeJson("Y", "SUCCESS");
                }
                return strJson;
            }
            catch (Exception e)
            {
                strJson = _common.MakeJson("E", e.Message);
                return strJson;
            }
        }

        [HttpPost]
        public string UploadHandler()
        {
            try
            {
                HttpFileCollectionBase files = Request.Files;
                if (files[0].FileName != "")
                {
                    string savePath = "/Files/Admin";
                    string folder1 = DateTime.Now.ToString("yyyyMMdd");
                    string path = Server.MapPath(savePath) + "\\" + folder1;
                    string zipPath = path;

                    //현재 날짜 파일 생성
                    DirectoryInfo di = new DirectoryInfo(path); //폴더 관련 객체
                    if (di.Exists != true)
                    {
                        di.Create();
                    }

                    // 파일 넣을 경로 생성
                    string strDateTimeDi = DateTime.Now.ToString("yyyyMMddHHmmssFFF");
                    di.Refresh();

                    path += "/" + strDateTimeDi;

                    di = new DirectoryInfo(path);
                    if (di.Exists != true)
                    {
                        di.Create();
                    }
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


                    savePath += "/" + folder1 + "/" + strDateTimeDi;

                    System.IO.FileInfo fi;
                    string strDateTime = ""; //년월일시분초밀리초 시간은 계속 변해서 변수 사용.

                    for (int i = 0; i < files.Count; i++)
                    {
                        try
                        {
                            HttpPostedFileBase file = files[i];
                            strDateTime = DateTime.Now.ToString("yyyyMMddHHmmssFFF") + "." + file.FileName.Substring(file.FileName.LastIndexOf(".") + 1, file.FileName.Length - (file.FileName.LastIndexOf(".") + 1));

                            fi = new System.IO.FileInfo(path + "/" + strDateTime);

                            //파일 이름이 벌써 있는 경우 채번을 다시 시도. (무한루프)
                            while (true)
                            {
                                if (fi.Exists)
                                {
                                    strDateTime = DateTime.Now.ToString("yyyyMMddHHmmssFFF") + "." + file.FileName.Substring(file.FileName.LastIndexOf(".") + 1, file.FileName.Length - (file.FileName.LastIndexOf(".") + 1));  //파일이 있을 경우 다시 채번.
                                    fi = new System.IO.FileInfo(path + "/" + strDateTime);
                                }
                                else
                                {
                                    break;
                                }
                            }

                            if (fi.Exists != true)
                            {
                                //파일만 저장
                                file.SaveAs(path + "/" + file.FileName);
                            }

                            strJson = _common.MakeJson("Y", savePath);
                        }
                        catch (Exception ex)
                        {
                           
                            strJson = _common.MakeJson("E", ex.Message);
                            return strJson;
                            //return Json(strJson);
                        }
                    }
                    /////////////////////////////
                    ///
                }
                return strJson;
            }
            catch (Exception e)
            {
                strJson = _common.MakeJson("E", e.Message);
                return strJson;
            }
        }

        [HttpPost]
        public ActionResult fnGetCustInfo(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();

                DataTable dt = new DataTable();
                dt = JsonConvert.DeserializeObject<DataTable>(vJsonData);

                dt =  Sql_Cust.SelectCustInfo(dt.Rows[0]);
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
        public string fnGetConfDetail(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();

                DataTable dt = new DataTable();
                dt = JsonConvert.DeserializeObject<DataTable>(vJsonData);
                dt = Sql_Cust.SelectConfDetail(dt.Rows[0]);

                return JsonConvert.SerializeObject(dt, Formatting.Indented);

                //return Json(strJson);
            }
            catch (Exception e)
            {
                strJson = e.Message;
                return strJson;
            }
        }


        [HttpPost]
        public string fnGetRoomDetail(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();

                DataTable dt = new DataTable();
                dt = JsonConvert.DeserializeObject<DataTable>(vJsonData);
                dt = Sql_Cust.SelectRoomDetail(dt.Rows[0]);

                return JsonConvert.SerializeObject(dt, Formatting.Indented);

                //return Json(strJson);
            }
            catch (Exception e)
            {
                strJson = e.Message;
                return strJson;
            }
        }


        [HttpPost]
        public string fnGetMealDetail(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();

                DataTable dt = new DataTable();
                dt = JsonConvert.DeserializeObject<DataTable>(vJsonData);
                dt = Sql_Cust.SelectMealDetail(dt.Rows[0]);

                return JsonConvert.SerializeObject(dt, Formatting.Indented);

                //return Json(strJson);
            }
            catch (Exception e)
            {
                strJson = e.Message;
                return strJson;
            }
        }

        [HttpPost]
        public string fnGetSvcDetail(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();

                DataTable dt = new DataTable();
                dt = JsonConvert.DeserializeObject<DataTable>(vJsonData);
                dt = Sql_Cust.SelectSvcDetail(dt.Rows[0]);

                return JsonConvert.SerializeObject(dt, Formatting.Indented);

                //return Json(strJson);
            }
            catch (Exception e)
            {
                strJson = e.Message;
                return strJson;
            }
        }



        [HttpPost]
        public ActionResult fnGetGrpInfo(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();

                DataTable dt = new DataTable();
                dt = JsonConvert.DeserializeObject<DataTable>(vJsonData);
                dt = Sql_Cust.SelectGrpInfo(dt.Rows[0]);
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
        public ActionResult fnGetItemInfo(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();

                DataTable dt = new DataTable();
                dt = JsonConvert.DeserializeObject<DataTable>(vJsonData);
                dt = Sql_Cust.SelectItemInfo(dt.Rows[0]);
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
        public ActionResult fnItemInfoData(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();

                DataTable dt = new DataTable();
                dt = JsonConvert.DeserializeObject<DataTable>(vJsonData);
                dt = Sql_Cust.SelectItemOneInfo(dt.Rows[0]);
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
        public ActionResult fnGetGrpComm(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();

                DataTable dt = new DataTable();
                dt = JsonConvert.DeserializeObject<DataTable>(vJsonData);

                dt = Sql_Common.SelectGrpCommonHeader(dt.Rows[0]);
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
        public ActionResult fnSaveCustomer(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();

                DataTable dt = new DataTable();
                dt = JsonConvert.DeserializeObject<DataTable>(vJsonData);
                if (dt.Rows.Count > 0)
                {
                    for (int i = 0; i < dt.Rows.Count; i++)
                    {
                        if (dt.Rows[i]["INSFLAG"].ToString() == "I")
                        {
                            DataTable rtnDt = Sql_Common.checkID(dt.Rows[i]);
                            if (rtnDt.Rows.Count > 0)
                            {
                                rtnDt = Sql_Cust.SelectCustInfo(dt.Rows[i]);
                                strJson = _common.MakeJson("E", "Success", rtnDt);
                                return Json(strJson);
                            }
                            else
                            {
                                rtnStatus = Sql_Cust.insertCustomerInfo(dt.Rows[i]);
                                if (dt.Rows[i]["APV_YN"].ToString() == "Y" && dt.Rows[i]["EMAIL_YN"].ToString() == "N")
                                {
                                    fnSendEmail(dt.Rows[i]);
                                }
                            }
                        }
                        else if (dt.Rows[i]["INSFLAG"].ToString() == "U")
                        {
                            rtnStatus = Sql_Cust.UpdateCustomerInfo(dt.Rows[i]);
                            if (dt.Rows[i]["APV_YN"].ToString() == "Y" && dt.Rows[i]["EMAIL_YN"].ToString() == "N")
                            {
                                fnSendEmail(dt.Rows[i]);
                            }
                        }
                        else if (dt.Rows[i]["INSFLAG"].ToString() == "D")
                        {
                            rtnStatus = Sql_Cust.DeleteCustomerInfo(dt.Rows[i]);
                        }
                        if (!rtnStatus) break;
                    }
                }
                dt = Sql_Cust.SelectCustInfo(dt.Rows[0]);
                strJson = _common.MakeJson("Y", "Success", dt);
                return Json(strJson);
            }
            catch (Exception e)
            {
                dt = Sql_Cust.SelectCustInfo(dt.Rows[0]);
                strJson = _common.MakeJson("N", "Success", dt);
                return Json(strJson);
            }
        }


        public ActionResult fnSendEmail(DataRow dr)
        {
            string strResult;
            DataTable dt = new DataTable();
            DataSet ds = new DataSet();

            try
            {
               
                if (dr["EMAIL"].ToString() != "")
                {
                  
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

                    //    MailAddress from = new MailAddress("help@yjit.co.kr");
                    MailAddress from = new MailAddress("metakit0601@gmail.com");
                    //MailAddress to = new MailAddress("ebkim@yjit.co.kr");
                    MailAddress to = new MailAddress(dr["EMAIL"].ToString());

                        MailMessage message = new MailMessage(from, to);
                        message.Subject = "[연수다] 회원가입 승인 메일 입니다.";
                        message.SubjectEncoding = System.Text.Encoding.UTF8;
                        message.Body = MakeEmailForm(dr);
                        //message.Body = "";
                        message.IsBodyHtml = true;
                        message.BodyEncoding = System.Text.Encoding.UTF8;


                        //서버 인증서의 유효성 검사하는 부분을 무조건 true 
                        System.Net.ServicePointManager.ServerCertificateValidationCallback += (s, cert, chain, sslPolicyErrors) => true;
                        client.Send(message);
                        message.Dispose();
                        #endregion
                        bool rtnStatus = Sql_Cust.updateEmail(dr);

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

        public string MakeEmailForm(DataRow dr)
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
            strHTML += "                    <div style='max-width: 610px;margin: 0 auto'> 안녕하세요.연수다 입니다.</div>";
            strHTML += "            </td>";
            strHTML += "         </tr>";
            strHTML += "         <tr>";
            strHTML += "            <td valign=\"top\" align=\"center\" style=\"padding:30px 0 30px;background-color: #22b7b0;font-size: 20px;letter-spacing:-1px;font-family:'Noto Sans KR', 'Noto Sans', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;font-weight: 300;\">";
            strHTML += "               <span style=\"font-weight: 600;color: #ffffff;\">[연수다] 회원가입 승인 메일 입니다. ";
            strHTML += "            </td>";
            strHTML += "         </tr>";

            strHTML += "         <tr>";
            strHTML += "            <td valign=\"top\">";
            strHTML += "               <div style=\"margin: 0 auto\">";
            strHTML += "                  <table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" width=\"100%\" style=\"border-top: 2px solid #222222;width: 100%;\">";
            strHTML += "                <tr>";
            strHTML += "                        <td valign=\"middle\" align=\"center\" width=\"28%\" style=\"width:28%;padding:0;height:43px;font-size: 14px;color: #333333;background-color: #f8f8f8;border-bottom: 1px solid #eaeaea;font-family:'Noto Sans KR', 'Noto Sans', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;font-weight: 600;\">";
            strHTML += "                              <strong>아이디</strong>";
            strHTML += "                        </td>  ";
            strHTML += "                        <td valign=\"middle\" align=\"left\" style=\"padding:0 0 0 20px;height:43px;font-size: 14px;color: #888888;border-bottom: 1px solid #eaeaea;font-family:'Noto Sans KR', 'Noto Sans', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;font-weight: 300;\">";
            strHTML += "                           <Pre>" + dr["EMAIL"].ToString() + "</Pre> ";
            strHTML += "                        </td> ";
            strHTML += "               </tr>";
            strHTML += "                <tr>";
            strHTML += "                        <td valign=\"middle\" align=\"center\" width=\"28%\" style=\"width:28%;padding:0;height:43px;font-size: 14px;color: #333333;background-color: #f8f8f8;border-bottom: 1px solid #eaeaea;font-family:'Noto Sans KR', 'Noto Sans', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;font-weight: 600;\">";
            strHTML += "                              <strong>이름</strong>";
            strHTML += "                        </td>  ";
            strHTML += "                        <td valign=\"middle\" align=\"left\" style=\"padding:0 0 0 20px;height:43px;font-size: 14px;color: #888888;border-bottom: 1px solid #eaeaea;font-family:'Noto Sans KR', 'Noto Sans', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;font-weight: 300;\">";
            strHTML += "                           <Pre>" + dr["CUST_NAME"].ToString() + "</Pre> ";
            strHTML += "                        </td> ";
            strHTML += "               </tr>";
            strHTML += "                <tr>";
            strHTML += "                        <td valign=\"middle\" align=\"center\" width=\"28%\" style=\"width:28%;padding:0;height:43px;font-size: 14px;color: #333333;background-color: #f8f8f8;border-bottom: 1px solid #eaeaea;font-family:'Noto Sans KR', 'Noto Sans', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;font-weight: 600;\">";
            strHTML += "                              <strong>회사명</strong>";
            strHTML += "                        </td>  ";
            strHTML += "                        <td valign=\"middle\" align=\"left\" style=\"padding:0 0 0 20px;height:43px;font-size: 14px;color: #888888;border-bottom: 1px solid #eaeaea;font-family:'Noto Sans KR', 'Noto Sans', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;font-weight: 300;\">";
            strHTML += "                           <Pre>" + dr["COMPANY"].ToString() + "</Pre> ";
            strHTML += "                        </td> ";
            strHTML += "               </tr>";
            strHTML += "                <tr>";
            strHTML += "                        <td valign=\"middle\" align=\"center\" width=\"28%\" style=\"width:28%;padding:0;height:43px;font-size: 14px;color: #333333;background-color: #f8f8f8;border-bottom: 1px solid #eaeaea;font-family:'Noto Sans KR', 'Noto Sans', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;font-weight: 600;\">";
            strHTML += "                              <strong>소속부서</strong>";
            strHTML += "                        </td>  ";
            strHTML += "                        <td valign=\"middle\" align=\"left\" style=\"padding:0 0 0 20px;height:43px;font-size: 14px;color: #888888;border-bottom: 1px solid #eaeaea;font-family:'Noto Sans KR', 'Noto Sans', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;font-weight: 300;\">";
            strHTML += "                           <Pre>" + dr["DEPARTURE"].ToString() + "</Pre> ";
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
            strHTML += "							 <a href=" + System.Configuration.ConfigurationManager.AppSettings["Url"] + "/Login style=\"text-decoration:none !important; font-size:18px;color:#fff;text-decoration:none;font-family:'Noto Sans KR', 'Noto Sans', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;font-weight: 600;text-decoration: none;\" rel=\"noreferrer noopener\" target=\"_blank\">로그인 하기</a> ";
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
        public ActionResult fnSaveExcel(JsonData value)
        {
            try
            {
                var errorMsg = "";
                string vJsonData = value.vJsonData.ToString();

                DataTable dt = new DataTable();
                dt = JsonConvert.DeserializeObject<DataTable>(vJsonData);
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    if (dt.Rows[i][0].ToString() != "이메일")
                    {
                        DataTable rtnDt = _DataHelper.ExecuteDataTable(Sql_Cust.isCheckID_Query(dt.Rows[i]), CommandType.Text);
                        if (rtnDt.Rows.Count == 0)
                        {
                            rtnStatus = Sql_Cust.insertCustomerExcel(dt.Rows[i]);
                            if (!rtnStatus) break;
                        }
                        else
                        {
                            if (errorMsg == "")
                            {
                                errorMsg = "(" + i + ")";
                            }
                            else
                            {
                                errorMsg = errorMsg + " , (" + i + ")";

                            }
                        }
                    }
                }
                strJson = _common.MakeJson("Y", errorMsg, dt);
                return Json(strJson);
            }
            catch (Exception e)
            {
                strJson = e.Message;
                return Json(strJson);
            }
        }


        [HttpPost]
        public ActionResult fnSaveCommGrp(JsonData value)
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

                        DataTable rtnDt = Sql_Common.SelectGrpCommon(dt.Rows[0]);
                        if (rtnDt.Rows.Count > 0)
                        {
                            strJson = _common.MakeJson("N", "Fail", dt);

                        }
                        else
                        {
                            rtnStatus = Sql_Common.InsertCommGrp(dt.Rows[i]);
                        }
                    }
                    else if (dt.Rows[i]["INSFLAG"].ToString() == "U")
                    {
                        rtnStatus = Sql_Common.UpdateCommGrp(dt.Rows[i]);
                    }
                    else if (dt.Rows[i]["INSFLAG"].ToString() == "D")
                    {
                        rtnStatus = Sql_Common.DeleteCommGrp(dt.Rows[i]);
                    }
                    if (!rtnStatus) break;
                }

                dt = Sql_Common.SelectGrpCommonAll();
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
        public ActionResult fnSaveCommonDetail(JsonData value)
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
                        rtnStatus = Sql_Common.InsertCommDetail(dt.Rows[i]);
                    }
                    else if (dt.Rows[i]["INSFLAG"].ToString() == "U")
                    {
                        rtnStatus = Sql_Common.UpdateCommDetail(dt.Rows[i]);
                    }
                    else if (dt.Rows[i]["INSFLAG"].ToString() == "D")
                    {
                        rtnStatus = Sql_Common.DeleteCommDetail(dt.Rows[i]);
                    }
                    if (!rtnStatus) break;
                }

                dt = Sql_Common.SelectGrpCommonDetail(dt.Rows[0]);
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
        public ActionResult fnGetGrpCommDetail(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();
                DataTable rtnDt = JsonConvert.DeserializeObject<DataTable>(vJsonData);
                DataTable dt = Sql_Common.SelectGrpCommonDetail(rtnDt.Rows[0]);

                //strJson = JsonConvert.SerializeObject(dt, Formatting.Indented);

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
        public ActionResult fnGetGrpCommDetailTest(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();
                DataTable rtnDt = JsonConvert.DeserializeObject<DataTable>(vJsonData);
                DataTable dt = Sql_Common.SelectGrpCommonDetailTest(rtnDt.Rows[0]);

                strJson = JsonConvert.SerializeObject(dt, Formatting.Indented);

                //strJson = _common.MakeJson("Y", "Success", dt);
                return Json(strJson);

            }
            catch (Exception e)
            {
                strJson = e.Message;
                return Json(strJson);
            }
        }

        [HttpPost]
        public string fnLogin(JsonData value)
        {

            string vJsonData = value.vJsonData.ToString();

            DataTable rtnDt = JsonConvert.DeserializeObject<DataTable>(vJsonData);
            try
            {
                rtnDt = Sql_Common.SelectCustInfo(rtnDt.Rows[0]);
                rtnDt.TableName = "Table";
                if (rtnDt.Rows.Count == 0)
                {
                    strJson = _common.MakeJson("N", "로그인 실패" , rtnDt);
                }
                else
                {
                    strJson = _common.MakeJson("Y", "로그인 성공", rtnDt);
                }

                return strJson;
            }
            catch (Exception e)
            {
                strJson = _common.MakeJson("E", e.Message);
                return strJson;
            }
        }


        /// <summary>
        /// 로그인 후 데이터 세션 아이디 정보 저장
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult SaveLogin(JsonData value)
        {
            DataSet ds = JsonConvert.DeserializeObject<DataSet>(value.vJsonData);
            DataTable rst = ds.Tables["Result"];
            DataTable dt = ds.Tables["Table"];

            try
            {
                if (rst.Rows[0]["trxCode"].ToString() == "N") return Content("N");

                if (rst.Rows[0]["trxCode"].ToString() == "Y")
                {
                    Session["AD_MNGT_NO"] = dt.Rows[0]["MNGT_NO"].ToString().Trim();
                    Session["AD_EMAIL"] = dt.Rows[0]["EMAIL"].ToString().Trim();
                    Session["AD_GRP_CD"] = dt.Rows[0]["GRP_CD"].ToString().Trim();
                    Session["AD_CUST_NAME"] = dt.Rows[0]["CUST_NAME"].ToString().Trim();
                    Session["AD_TELNO"] = dt.Rows[0]["TELNO"].ToString().Trim();
                    Session["AD_COMPANY"] = dt.Rows[0]["COMPANY"].ToString().Trim();
                    Session["AD_DEPARTURE"] = dt.Rows[0]["DEPARTURE"].ToString().Trim();
                    Session["AD_USER_TYPE"] = dt.Rows[0]["USER_TYPE"].ToString().Trim();
                    Session["AD_APV_YN"] = dt.Rows[0]["APV_YN"].ToString().Trim();

                    return Content("Y");
                }

                return Content("N");
            }
            catch (Exception e)
            {
                return Content(e.Message);
            }
        }
    }
}
