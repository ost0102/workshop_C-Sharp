using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WORKSHOP.Models;
using WORKSHOP.Models.Query;
using Newtonsoft.Json;
using System.IO;
using System.Collections;
using System.Data;

namespace WORKSHOP.Controllers.Admin
{
    public class AdminNoticeController : Controller
    {
        //
        // GET: /AdminNotice/

        bool rtnStatus = false;
        string strJson = "";
        const string scriptTag = "<script type='text/javascript'>window.parent.CKEDITOR.tools.callFunction({0}, '{1}', '{2}')</script>";
        string _NoticeFilePath = "/data/notice/";
        string _EditorFilePath = "/data/editor/";
        public class JsonData
        {
            public string vJsonData { get; set; }
        }

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult NoticeDownload(string filename, string rFilename)
        {
            try
            {
                string FullFilePath = Server.MapPath(_NoticeFilePath) + rFilename;
                if (System.IO.File.Exists(FullFilePath))    //파일이 존재한다면
                {
                    byte[] fileBytes = System.IO.File.ReadAllBytes(FullFilePath);
                    return File(fileBytes, System.Net.Mime.MediaTypeNames.Application.Octet, filename);
                }
                else
                {
                    return Content("<script>alert('파일이 존재하지 않습니다'); history.back(-1);</script>");
                    //return new HttpStatusCodeResult(System.Net.HttpStatusCode.NotFound);
                }
            }
            catch
            {
                return Content("<script>alert('파일이 존재하지 않습니다');  history.back(-1);</script>");
                //return new HttpStatusCodeResult(System.Net.HttpStatusCode.Forbidden);
            }
        }

        public ActionResult Write(string id)
        {
            DataTable dt = new DataTable();
            if (id == null) return View();
            dt = Sql_Notice.AdminNoticeView_Query(id);
            if (dt.Rows.Count > 0)
            {

                if (dt.Columns.Contains("FLAG"))
                {
                    ViewBag.FLAG = dt.Rows[0]["FLAG"].ToString();
                }

                if (dt.Columns.Contains("NOTICE_ID"))
                {
                    ViewBag.NOTICE_ID = dt.Rows[0]["NOTICE_ID"].ToString();
                }

                if (dt.Columns.Contains("TITLE"))
                {
                    ViewBag.TITLE2 = dt.Rows[0]["TITLE"].ToString();
                }


                if (dt.Columns.Contains("CNT"))
                {
                    ViewBag.CNT = dt.Rows[0]["CNT"].ToString();
                }

                if (dt.Columns.Contains("WRITER"))
                {
                    ViewBag.WRITER = dt.Rows[0]["WRITER"].ToString();
                }

                if (dt.Columns.Contains("USE_YN"))
                {
                    ViewBag.USE_YN = dt.Rows[0]["USE_YN"].ToString();
                }

                if (dt.Columns.Contains("NOTICE_YN"))
                {
                    ViewBag.NOTICE_YN = dt.Rows[0]["NOTICE_YN"].ToString();
                }

                if (dt.Columns.Contains("REGDT"))
                {
                    ViewBag.REGDT = dt.Rows[0]["REGDT"].ToString();
                }

                if (dt.Columns.Contains("EDITDT"))
                {
                    ViewBag.EDITDT = dt.Rows[0]["EDITDT"].ToString();
                }

                //if (dt.Columns.Contains("FILE"))
                //{
                //    ViewBag.FILE = dt.Rows[0]["FILE"].ToString();
                //}

                //if (dt.Columns.Contains("FILE_NAME"))
                //{
                //    ViewBag.FILE_NAME = dt.Rows[0]["FILE_NAME"].ToString();
                //}

                //if (dt.Columns.Contains("FILE1"))
                //{
                //    ViewBag.FILE1 = dt.Rows[0]["FILE1"].ToString();
                //}

                //if (dt.Columns.Contains("FILE1_NAME"))
                //{
                //    ViewBag.FILE1_NAME = dt.Rows[0]["FILE1_NAME"].ToString();
                //}

                //if (dt.Columns.Contains("FILE2"))
                //{
                //    ViewBag.FILE2 = dt.Rows[0]["FILE2"].ToString();
                //}

                //if (dt.Columns.Contains("FILE2_NAME"))
                //{
                //    ViewBag.FILE2_NAME = dt.Rows[0]["FILE2_NAME"].ToString();
                //}

                if (dt.Columns.Contains("CONTENT"))
                {
                    ViewBag.CONTENT = dt.Rows[0]["CONTENT"].ToString();
                }
            }
            return View();
        }
        //입력-수정 모두 처리        
        //[AcceptVerbs(HttpVerbs.Post), ValidateInput(false)]
        [HttpPost, ValidateInput(false)]
        public ActionResult NoticeModify()
        {
            try
            {
                Hashtable htParam = new Hashtable();
                if (Request.Form.Count > 0)
                {
                    if (Request.Form.AllKeys.Contains("notice_id")) htParam.Add("NOTICE_ID", Request.Form["notice_id"]);
                    if (Request.Form.AllKeys.Contains("user_id")) htParam.Add("USR_ID", Request.Form["user_id"]);
                    if (Request.Form.AllKeys.Contains("title")) htParam.Add("TITLE", Request.Form["title"]);
                    if (Request.Form.AllKeys.Contains("s_type")) htParam.Add("S_TYPE", Request.Form["s_type"]);
                    if (Request.Form.AllKeys.Contains("notice_yn")) htParam.Add("NOTICE_YN", Request.Form["notice_yn"]);
                    if (Request.Form.AllKeys.Contains("content")) htParam.Add("CONTENT", Request.Form["content"]);
                    if (Request.Form.AllKeys.Contains("use_yn")) htParam.Add("USE_YN", Request.Form["use_yn"]);
                    //if (Request.Form.AllKeys.Contains("file_del")) htParam.Add("FILE_DEL", Request.Form["file_del"]);
                    //if (Request.Form.AllKeys.Contains("file1_del")) htParam.Add("FILE1_DEL", Request.Form["file1_del"]);
                    //if (Request.Form.AllKeys.Contains("file2_del")) htParam.Add("FILE2_DEL", Request.Form["file2_del"]);

                    //htParam.Add("FILE", "");
                    //htParam.Add("FILE_NAME", "");
                    //htParam.Add("FILE1", "");
                    //htParam.Add("FILE1_NAME", "");
                    //htParam.Add("FILE2", "");
                    //htParam.Add("FILE2_NAME", "");

                    if (htParam.ContainsKey("NOTICE_ID"))
                    {
                        if (!string.IsNullOrEmpty(htParam["NOTICE_ID"].ToString())) //notice id가 있다! => update
                        {
                            #region //파일 삭제 로직
                            //if (htParam.ContainsKey("FILE_DEL")) //파일삭제가 체크 되어있고
                            //{
                            //    if (htParam["FILE_DEL"].ToString() == "y")  //삭제값이 y 이면
                            //    {
                            //        NoticeFileDel(htParam["NOTICE_ID"].ToString(), 1);
                            //        htParam["FILE"] = "";
                            //        htParam["FILE_NAME"] = "";
                            //    }
                            //}
                            //else
                            //{
                            //    htParam.Remove("FILE");
                            //}

                            //if (htParam.ContainsKey("FILE1_DEL")) //파일삭제가 체크 되어있고
                            //{
                            //    if (htParam["FILE1_DEL"].ToString() == "y")  //삭제값이 y 이면
                            //    {
                            //        NoticeFileDel(htParam["NOTICE_ID"].ToString(), 2);
                            //        htParam["FILE1"] = "";
                            //        htParam["FILE1_NAME"] = "";
                            //    }
                            //}
                            //else
                            //{
                            //    htParam.Remove("FILE1");
                            //}

                            //if (htParam.ContainsKey("FILE2_DEL")) //파일삭제가 체크 되어있고
                            //{
                            //    if (htParam["FILE2_DEL"].ToString() == "y")  //삭제값이 y 이면
                            //    {
                            //        NoticeFileDel(htParam["NOTICE_ID"].ToString(), 3);
                            //        htParam["FILE2"] = "";
                            //        htParam["FILE2_NAME"] = "";
                            //    }
                            //}
                            //else
                            //{
                            //    htParam.Remove("FILE2");
                            //}
                            #endregion
                        }
                    }

                    //파일객체가 있다면
                    //if (Request.Files.Count > 0)
                    //{
                    //    var file = Request.Files[0];
                    //    var filename = "";
                    //    var file1 = Request.Files[1];
                    //    var file1name = "";
                    //    var file2 = Request.Files[2];
                    //    var file2name = "";

                    //    if (file != null && file.ContentLength > 0)
                    //    {
                    //        filename = Path.GetFileName(file.FileName);
                    //        string file_name = DateTime.Now.ToString("yyyyMMddhhmmssfff") + "_" + GetRandomChar(20) + Path.GetExtension(file.FileName);

                    //        NoticeFileDel(htParam["NOTICE_ID"].ToString(), 1);
                    //        DirectoryInfo di = new DirectoryInfo(Server.MapPath(_NoticeFilePath)); //폴더 관련 객체
                    //        if (di.Exists != true)
                    //        {
                    //            di.Create();
                    //        }
                    //        var path = Path.Combine(Server.MapPath(_NoticeFilePath), file_name);
                    //        file.SaveAs(path);

                    //        htParam["FILE"] = file_name;
                    //        htParam["FILE_NAME"] = filename;
                    //    }

                    //    if (file1 != null && file1.ContentLength > 0)
                    //    {
                    //        file1name = Path.GetFileName(file1.FileName);
                    //        string file1_name = DateTime.Now.ToString("yyyyMMddhhmmssfff") + "_" + GetRandomChar(20) + Path.GetExtension(file1.FileName);

                    //        NoticeFileDel(htParam["NOTICE_ID"].ToString(), 2);
                    //        DirectoryInfo di = new DirectoryInfo(Server.MapPath(_NoticeFilePath)); //폴더 관련 객체
                    //        if (di.Exists != true)
                    //        {
                    //            di.Create();
                    //        }
                    //        var path = Path.Combine(Server.MapPath(_NoticeFilePath), file1_name);
                    //        file1.SaveAs(path);

                    //        htParam["FILE1"] = file1_name;
                    //        htParam["FILE1_NAME"] = file1name;
                    //    }

                    //    if (file2 != null && file2.ContentLength > 0)
                    //    {
                    //        file2name = Path.GetFileName(file2.FileName);
                    //        string file2_name = DateTime.Now.ToString("yyyyMMddhhmmssfff") + "_" + GetRandomChar(20) + Path.GetExtension(file2.FileName);

                    //        NoticeFileDel(htParam["NOTICE_ID"].ToString(), 3);
                    //        DirectoryInfo di = new DirectoryInfo(Server.MapPath(_NoticeFilePath)); //폴더 관련 객체
                    //        if (di.Exists != true)
                    //        {
                    //            di.Create();
                    //        }
                    //        var path = Path.Combine(Server.MapPath(_NoticeFilePath), file2_name);
                    //        file2.SaveAs(path);

                    //        htParam["FILE2"] = file2_name;
                    //        htParam["FILE2_NAME"] = file2name;
                    //    }
                    //}

                    string strResult = "";
                    int nResult = 0;
                    if (htParam.ContainsKey("NOTICE_ID"))
                    {
                        if (!string.IsNullOrEmpty(htParam["NOTICE_ID"].ToString())) //notice id가 있다! => update
                        {
                            rtnStatus = Sql_Notice.NoticeUpdate_Query(htParam);
                        }
                        else
                        {
                            //Insert
                            rtnStatus = Sql_Notice.NoticeInsert_Query(htParam);
                        }
                    }
                    else
                    {
                        //Insert
                        rtnStatus = Sql_Notice.NoticeInsert_Query(htParam);
                    }


                    //return Json(strResult);                    
                    return RedirectToAction("Index");
                }
                //return Content("<script>저장 할 수 없습니다.</script>");
                return RedirectToAction("Index");
            }
            catch (Exception e)
            {
                strJson = e.Message;
                return RedirectToAction("Index");
                //return Json(strJson);
            }
        }

        //데이터 삭제
        public void NoticeFileDel(string Notice_ID, int FileIndex)
        {
            try
            {
                DataTable dt = new DataTable();
                if (!string.IsNullOrEmpty(Notice_ID))
                {
                    dt = Sql_Notice.AdminNoticeView_Query(Notice_ID);

                    string strFile1 = "";
                    string strFile2 = "";
                    string strFile3 = "";
                    if (dt.Rows.Count > 0)
                    {
                        #region //File Delete

                        for (int i = 0; i < dt.Rows.Count; i++)
                        {
                            strFile1 = dt.Rows[i]["FILE"].ToString();
                            strFile2 = dt.Rows[i]["FILE1"].ToString();
                            strFile3 = dt.Rows[i]["FILE2"].ToString();

                            string FullFilePath1 = Server.MapPath(_NoticeFilePath) + strFile1;
                            string FullFilePath2 = Server.MapPath(_NoticeFilePath) + strFile2;
                            string FullFilePath3 = Server.MapPath(_NoticeFilePath) + strFile3;

                            switch (FileIndex)
                            {
                                case 0:
                                    if (System.IO.File.Exists(FullFilePath1))    //파일이 존재한다면
                                    {
                                        System.IO.FileInfo file = new System.IO.FileInfo(FullFilePath1);
                                        file.Delete();
                                    }
                                    if (System.IO.File.Exists(FullFilePath2))    //파일이 존재한다면
                                    {
                                        System.IO.FileInfo file = new System.IO.FileInfo(FullFilePath1);
                                        file.Delete();
                                    }
                                    if (System.IO.File.Exists(FullFilePath3))    //파일이 존재한다면
                                    {
                                        System.IO.FileInfo file = new System.IO.FileInfo(FullFilePath1);
                                        file.Delete();
                                    }
                                    break;
                                case 1:
                                    if (System.IO.File.Exists(FullFilePath1))    //파일이 존재한다면
                                    {
                                        System.IO.FileInfo file = new System.IO.FileInfo(FullFilePath1);
                                        file.Delete();
                                    }
                                    break;
                                case 2:
                                    if (System.IO.File.Exists(FullFilePath2))    //파일이 존재한다면
                                    {
                                        System.IO.FileInfo file = new System.IO.FileInfo(FullFilePath1);
                                        file.Delete();
                                    }
                                    break;
                                case 3:
                                    if (System.IO.File.Exists(FullFilePath3))    //파일이 존재한다면
                                    {
                                        System.IO.FileInfo file = new System.IO.FileInfo(FullFilePath1);
                                        file.Delete();
                                    }
                                    break;
                            }
                        }
                        #endregion

                        //string strJson = "";
                        //strJson = CA.Con_AdminNoticeDel(Notice_ID);
                    }
                }
            }
            catch (Exception e)
            {

            }
        }


        /// <summary>
        /// 데이터 삭제
        /// </summary>
        /// <param name="Notice_ID"></param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult Notice_DelAjax(string Notice_ID)
        {
            string strJson = "";

            try
            {
                if (Notice_ID != null)
                {
                    rtnStatus = Sql_Notice.fnAdminNoticeDel_Query(Notice_ID);
                }
                var result = new { Success = "True", Message = "Complete" };
                return Json(result, JsonRequestBehavior.AllowGet);

            }
            catch (Exception e)
            {
                var result = new { Success = "False", Message = e.ToString() };
                return Json(result, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public ActionResult NoticeEditor()
        {
            //_EditorFilePath
            string ckEditor = System.Web.HttpContext.Current.Request["CKEditor"];
            string funcNum = System.Web.HttpContext.Current.Request["CKEditorFuncNum"];
            string langCode = System.Web.HttpContext.Current.Request["langCode"];

            try
            {
                int total = System.Web.HttpContext.Current.Request.Files.Count;
                if (total == 0) return Content(string.Format(scriptTag, funcNum, "", "no File"), "text/html");

                HttpPostedFile theFile = System.Web.HttpContext.Current.Request.Files[0];
                string strFilename = theFile.FileName;
                string sFileName = DateTime.Now.ToString("yyyyMMddhhmmssfff") + GetRandomChar(20) + Path.GetExtension(theFile.FileName);//Path.GetFileName(strFilename);
                DirectoryInfo di = new DirectoryInfo(Server.MapPath(_EditorFilePath)); //폴더 관련 객체
                if (di.Exists != true)
                {
                    di.Create();
                }
                string name = Path.Combine(Server.MapPath(_EditorFilePath), sFileName);
                theFile.SaveAs(name);
                string url = _EditorFilePath + sFileName.Replace("'", "\'");

                return Content(
                    string.Format(scriptTag, funcNum, HttpUtility.JavaScriptStringEncode(url ?? ""), ""),
                    "text/html"
                    );
            }
            catch (Exception ex)
            {
                return Content(
                    string.Format(scriptTag, funcNum, "", ex.ToString()),
                    "text/html"
                    );
            }

        }

        public static string GetRandomChar(int _totLen)
        {
            Random rand = new Random();
            string input = "abcdefghijklmnopqrstuvwxyz0123456789";
            var chars = Enumerable.Range(0, _totLen).Select(x => input[rand.Next(0, input.Length)]);
            return new string(chars.ToArray());
        }

        [HttpPost]
        public ActionResult fnGetNoticeList(JsonData value)
        {
            try
            {
                string vJsonData = value.vJsonData.ToString();

                DataTable dt = new DataTable();
                dt = JsonConvert.DeserializeObject<DataTable>(vJsonData);
                dt = Sql_Notice.fnAdminNotice_Query(dt.Rows[0]);
                strJson = _common.MakeJson("Y", "Success", dt);
                return Json(strJson);
            }
            catch (Exception e)
            {
                strJson = e.Message;
                return Json(strJson);
            }
        }
    }
}
