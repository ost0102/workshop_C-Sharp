using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WORKSHOP.Controllers
{
    public class pageController : Controller
    {
        //
        // GET: /page/
        /*
                        <li><a href="/page/terms.html"><span>이용약관</span></a></li>
						    <li><a href="/page/policy.html"><span>개인정보처리방침</span></a></li>
						    <li><a href="/company/map.html"><span>오시는길</span></a></li>
        */
        public ActionResult terms() //이용약관
        {
            return View();
        }
        public ActionResult policy()    //개인정보처리방침
        {
            return View();
        }        
    }
}
