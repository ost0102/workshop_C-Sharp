using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Net.Mail;
using System.Web;
using System.Web.Mvc;
using WORKSHOP.Models;
using WORKSHOP.Models.Query;

namespace WORKSHOP.Controllers
{
    public class FindController : Controller
    {
        DataTable dt = new DataTable();
        DataTable Resultdt = new DataTable();

        Sql_Cust SC = new Sql_Cust();

        string strJson = "";
        string strResult = "";

        public ActionResult Index()
        {
            return View();
        }

        public class JsonData
        {
            public string vJsonData { get; set; }
        }

        [HttpPost]
        public string FindID(JsonData value)
        {
            string DB_con = _DataHelper.ConnectionString;

            strResult = value.vJsonData.ToString();
            dt = JsonConvert.DeserializeObject<DataTable>(strResult);

            try
            {
                Resultdt = _DataHelper.ExecuteDataTable(SC.FindID_Query(dt.Rows[0]), CommandType.Text);
                Resultdt.TableName = "Table";

                if (Resultdt.Rows.Count > 0)
                {
                    strJson = _common.MakeJson("Y", "", Resultdt);
                }
                else
                {
                    strJson = _common.MakeJson("N", "정보가 존재하지 않습니다.", Resultdt);
                }
                return strJson;
            }
            catch (Exception e)
            {
                strJson = _common.MakeJson("E", e.Message, Resultdt);
                return strJson;
            }
        }
        [HttpPost]
        public string GetNewPW(JsonData value)
        {
            string DB_con = _DataHelper.ConnectionString;

            strResult = value.vJsonData.ToString();
            dt = JsonConvert.DeserializeObject<DataTable>(strResult);

            try
            {
                Resultdt = _DataHelper.ExecuteDataTable(SC.FindPW_Query(dt.Rows[0]), CommandType.Text);
                Resultdt.TableName = "NewPSWD";

                if (Resultdt.Rows.Count == 0)
                {
                    strJson = _common.MakeJson("N", "임시 비밀번호가 틀립니다.", Resultdt);
                }
                else
                {
                    //성공
                    string strRandom = _common.fnGetRandomString(8);

                    string hiddenPwd = strRandom.Substring(0, strRandom.Length / 5);
                    for (int i = 0; i < strRandom.Length - strRandom.Length / 5; i++)
                    {
                        hiddenPwd += "*";
                    }

                    _DataHelper.ExecuteNonQuery(SC.SetNewPW_Query(dt.Rows[0], strRandom, hiddenPwd), CommandType.Text);

                    Resultdt.Columns.Add("PSWD");
                    Resultdt.Rows[0]["PSWD"] = strRandom;

                    strJson = _common.MakeJson("Y", "Success", Resultdt);
                }
                return strJson;
            }
            catch (Exception e)
            {
                strJson = _common.MakeJson("E", e.Message);
                return strJson;
            }
        }
        //SMTP 꼭!!!!!실존하는 이메일이여야 전송이 가능함 webconfig수정필수
        [HttpPost]
        public String SendEmail(JsonData value)
        {
            try
            {
                //Web.config Appkey
                var appKey = ConfigurationManager.AppSettings["Email"];

                DataTable dt = JsonConvert.DeserializeObject<DataTable>(value.vJsonData.ToString());
                strResult = value.vJsonData.ToString();

                MailMessage mailMessage = new MailMessage();
                //보내는주소 이메일, 발송자이름, UTF-8
                mailMessage.From = new MailAddress(appKey, "", System.Text.Encoding.UTF8);
                //받는 이메일주소
                mailMessage.To.Add(dt.Rows[0]["TO"].ToString());
                //제목
                mailMessage.Subject = "[연수다]" + dt.Rows[0]["SUBJECT"].ToString();
                mailMessage.SubjectEncoding = System.Text.Encoding.UTF8;
                //내용
                //mailMessage.Body = dt.Rows[0]["TITLE"].ToString() + "\n" + "\n" + dt.Rows[0]["CONTENT"].ToString() + " : "+ dt.Rows[0]["SAMPLE_PW"].ToString();
                mailMessage.Body = MakeEmailFormBkg(dt);
                mailMessage.IsBodyHtml = true;
                mailMessage.BodyEncoding = System.Text.Encoding.UTF8;

                // SMTP 서버 주소
                //SmtpClient SmtpServer = new SmtpClient("mail.yjit.co.kr");
                SmtpClient SmtpServer = new SmtpClient("smtp.gmail.com");
                // SMTP 포트
                SmtpServer.Port = 587;
                // SSL 사용 여부
                SmtpServer.EnableSsl = true;
                SmtpServer.UseDefaultCredentials = false;
                SmtpServer.DeliveryMethod = System.Net.Mail.SmtpDeliveryMethod.Network;
                //SmtpServer.Credentials = new System.Net.NetworkCredential("mailmaster@yjit.co.kr", "Yjit0921)#$%");
                SmtpServer.Credentials = new System.Net.NetworkCredential("metakit0601@gmail.com", "yekg mxed gmuf lwxh");

                SmtpServer.Send(mailMessage);
                mailMessage.Dispose();

                strJson = _common.MakeJson("Y", "이메일 전송 성공");

                return strJson;
            }
            catch (Exception e)
            {
                strJson = _common.MakeJson("E", e.Message);
                return strJson;
            }
        }

        public string MakeEmailFormBkg(DataTable dt)
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
            strHTML += "               <span style=\"font-weight: 600;color: #ffffff;\">[연수다] 비밀번호 초기화 메일 입니다. ";
            strHTML += "            </td>";
            strHTML += "         </tr>";
            strHTML += "         <tr>";
            strHTML += "            <td valign=\"top\">";
            strHTML += "               <div style=\"margin: 0 auto\">";
            strHTML += "                  <table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" width=\"100%\" style=\"border-top: 2px solid #222222;width: 100%;\">";
            strHTML += "                     <tr>";
            strHTML += "                        <td valign=\"middle\" align=\"center\" width=\"28%\" style=\"width:28%;padding:0;height:43px;font-size: 14px;color: #333333;background-color: #f8f8f8;border-bottom: 1px solid #eaeaea;font-family:'Noto Sans KR', 'Noto Sans', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;font-weight: 600;\">";
            strHTML += "                              <strong>임시 비밀번호</strong>";
            strHTML += "                        </td>  ";
            strHTML += "                        <td valign=\"middle\" align=\"left\" style=\"padding:0 120 0 20px;height:43px;font-size: 14px;color: #888888;border-bottom: 1px solid #eaeaea;font-family:'Noto Sans KR', 'Noto Sans', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;font-weight: 300;\">";
            strHTML += "                           <Pre style=\"margin-bottom: 0; margin-left: 20px;\">" + dt.Rows[0]["SAMPLE_PW"].ToString() + "</Pre> ";
            strHTML += "                        </td> ";
            strHTML += "                    </tr>";
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
    }
}