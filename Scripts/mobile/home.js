var myApp = new Framework7({
    animateNavBackIcon: true,
});
var $$ = Framework7.$;

var mainView = myApp.addView('.view-main', {
    dynamicNavbar: true,
    swipeBackPage: false,
});

$$(document).on('ajaxStart', function (e) {
    myApp.showIndicator();
});
$$(document).on('ajaxComplete', function () {
    myApp.hideIndicator();
});

//微信分享id
var wxShareStr = "wx7a6d8624593a51e3";

initLoads();
function initLoads() {
    loadNameMobile();
    //$$(".toolbar-inner").on("click", "a", onToolbars);
    myApp.showIndicator();
}

function JQajaxo(_type, _url, _asycn, _data, _success) {
    $.ajax({
        type: _type,
        url: _url,
        timeout: 2000,
        async: _asycn,
        data: _data,
        success: _success
    });
}
function ajaxService(_type, _url, _asycn, _data, _success, _error) {
    $.ajax({
        type: _type,
        url: _url,
        timeout: 5000,
        async: _asycn,
        data: _data,
        success: _success,
        error: _error
    });
}
//连接服务器
function InitEnsure() {
    $.ajax({
        type: "post",
        url: "/GWServices.asmx/InitEnsureRunProxy",
        data: "wcfIP=" + window.localStorage.service_url + "&&pageUserNm=" + window.localStorage.terminal,
        success: function (dt) {
            var analyze = $(dt).children("string").text();
            if (analyze != "" || analyze != "false") {
                myApp.hideIndicator();
                $("#homeContents").show();
                console.log("连接成功！");
            }
        }
    });
}
//载入界面
function loadNameMobile() {
    if (location.search) {
        try {
            var urlSearch = location.search.split('?')[1];
            var urlSearchSplit = urlSearch.split('&');
            var terminalVar = urlSearchSplit[0].split('=')[1];
            var userNameVar = urlSearchSplit[1].split('=')[1];
            var service_urlVar = urlSearchSplit[2].split('=')[1];
            window.localStorage.terminal = terminalVar;
            window.localStorage.userName = decodeURIComponent(userNameVar);
            window.localStorage.service_url = service_urlVar;
        }
        catch (ex) {

        }
        //location.search = "";
    }
    if (window.localStorage.userName != "" && window.localStorage.userName != null) {
        $("#userName").html(window.localStorage.userName);
        InitEnsure();
        AppCacheClear();
    }
    else {
        if (window.localStorage.terminal) {
            var terminal = window.localStorage.terminal.split('.')[1];
            if (terminal == "App") {
                myJavaFun.OpenLocalUrl("login");
            }
            else {
                window.location.href = "/Views/login.html";
            }
        }
        else {
            window.location.href = "/Views/login.html";
        }
    }
}

//缓存事件
function AppCacheClear() {
    if (window.localStorage.terminal.split('.')[1] == "App") {
        $("#appCacheClearLi").show();
    }
}
function onAppCacheClear() {
    myApp.modal({
        title: "清空",
        text: '是否清空缓存，重新加载？',
        buttons: [
          {
              text: '取消'
          },
          {
              text: '确定',
              onClick: function () {
                  myJavaFun.AppCacheClear();
              }
          }
        ]
    });
}
function AppCacheClearCallback(dt) {
    if (dt == "true") {
        myApp.modal({
            title: "",
            text: '清空成功！',
            buttons: [
              {
                  text: '确定',
                  onClick: function () {
                      location.reload();
                  }
              }
            ]
        });
    }
    else {
        myApp.modal({
            title: "",
            text: '清空失败！',
            buttons: [
              {
                  text: '确定'
              }
            ]
        });
    }
}

//底部列表事件
function onToolbars() {
    $(".toolbar-inner").find("a").each(function () {
        if ($(this).hasClass("active")) {
            var cls = $(this).find("i").attr("cls");
            $(this).find("i").removeClass("icon-" + cls + "_a");
            $(this).find("i").addClass("icon-" + cls + "_b");
            $(this).removeClass("active");
        }
    });
    $(this).addClass("active");
    var cls = $(this).find("i").attr("cls");
    $(this).find("i").removeClass("icon-" + cls + "_b");
    $(this).find("i").addClass("icon-" + cls + "_a");
}

function toolbarActive(ids) {
    $(".toolbar-inner").find("a").each(function () {
        if ($(this).hasClass("active")) {
            var cls = $(this).find("i").attr("cls");
            $(this).find("i").removeClass("icon-" + cls + "_a");
            $(this).find("i").addClass("icon-" + cls + "_b");
            $(this).removeClass("active");
        }
    });
    if (ids != '') {
        $("#" + ids).addClass("active");
        var cls = $("#" + ids).find("i").attr("cls");
        $("#" + ids).find("i").removeClass("icon-" + cls + "_b");
        $("#" + ids).find("i").addClass("icon-" + cls + "_a");
    }
}

//注销事件
function onUserLogout() {
    myApp.modal({
        title: "注销",
        text: '确定要注销当前账户吗？',
        buttons: [
          {
              text: '取消'
          },
          {
              text: '确定',
              onClick: function () {
                  window.localStorage.userName = "";
                  window.localStorage.userPWD = "";
                  if (window.localStorage.terminal.split('.')[1] == "App") {
                      myJavaFun.OpenLocalUrl("login");
                  }
                  else {
                      window.location.href = "/Views/login.html";
                  }
              }
          }
        ]
    });
}
//关于事件
function onAbout() {
    myApp.modal({
        title: "关于",
        text: '当前Web版本：v1.0',
        buttons: [
          {
              text: '确定'
          }
        ]
    });
}

function backss() {
    var mainView = myApp.addView('.view-main');
    var pages = new Array();
    $(".page").each(function (i) {
        pages[i] = $(this).attr("data-page");
    });
    if (pages.length == 2) {
        console.log(pages[0])
        //mainView.router.loadPage(pages[0] + ".html");
        mainView.router.back()
    }
}

/* 
 * formatMoney(s,type) 
 * 功能：金额按千位逗号分割 
 * 参数：s，需要格式化的金额数值. 
 * 参数：type,判断格式化后的金额是否需要小数位. 
 * 返回：返回格式化后的数值字符串. 
 */
function formatMoney(s, type) {
    if (/[^0-9\.]/.test(s))
        return "0";
    if (s == null || s == "")
        return "0";
    s = s.toString().replace(/^(\d*)$/, "$1.");
    s = (s + "00").replace(/(\d*\.\d\d)\d*/, "$1");
    s = s.replace(".", ",");
    var re = /(\d)(\d{3},)/;
    while (re.test(s))
        s = s.replace(re, "$1,$2");
    s = s.replace(/,(\d\d)$/, ".$1");
    if (type == 0) {// 不带小数位(默认是有小数位)  
        var a = s.split(".");
        if (a[1] == "00") {
            s = a[0];
        }
    }
    return s;
}

//首页
$$(document).on("pageBeforeInit", ".page[data-page='home']", function (e) {
    if ($(this).hasClass("page-on-left")) {
        var ids = $(this).next().attr("id");
        if (ids == 'home') {
            toolbarActive('homeTool');
        }
        else {
            initPageJS(ids, '');
        }
    }
    else {
        $("#homeContents").show();
        toolbarActive('homeTool');
    }
});
//设置
$$(document).on("pageBeforeInit", ".page[data-page='SetUp']", function (e) {
    if ($(this).hasClass("page-on-left")) {
        var ids = $(this).next().attr("id");
        if (ids == "home") {
            toolbarActive('homeTool');
        }
        else {
            initPageJS(ids, '');
        }
    }
    else {
        initPageJS('SetUp', '');
    }
});
//实时快照
$$(document).on("pageBeforeInit", ".page[data-page='message']", function (e) {
    if ($(this).hasClass("page-on-left")) {
        var ids = $(this).next().attr("id");
        if (ids == "home") {
            toolbarActive('homeTool');
        }
        else {
            initPageJS(ids, '');
        }
    }
    else {
        initPageJS('message', '');
    }
});
//实时数据
$$(document).on("pageBeforeInit", ".page[data-page='RealTime']", function (e) {
    if ($(this).hasClass("page-on-left")) {
        var ids = $(this).next().attr("id");
        if (ids == "home") {
            toolbarActive('homeTool');
        }
        else {
            initPageJS(ids, '');
        }
    }
    else {
        initPageJS('RealTime', '');
    }
});
//语音控制
$$(document).on("pageBeforeInit", ".page[data-page='Voice']", function (e) {
    if ($(this).hasClass("page-on-left")) {
        var ids = $(this).next().attr("id");
        if (ids == "home") {
            toolbarActive('homeTool');
        }
        else {
            initPageJS(ids, '');
        }
    }
    else {
        initPageJS('Voice', '');
    }
});
//扫一扫
$$(document).on("pageBeforeInit", ".page[data-page='RichScan']", function (e) {
    if ($(this).hasClass("page-on-left")) {
        var ids = $(this).next().attr("id");
        if (ids == "home") {
            toolbarActive('homeTool');
        }
        else {
            initPageJS(ids, '');
        }
    }
    else {
        initPageJS('RichScan', '');
    }
});

//执行子界面方法
function initPageJS(dt, ext) {//ext扩展界面地址
    if ($("#" + dt + "_id").length == 0) {
        var pagejs = document.createElement("script");
        pagejs.id = dt + "_id";
        if (ext == "") {
            pagejs.setAttribute("src", "/Scripts/mobile/" + dt + ".js");
        }
        else {
            pagejs.setAttribute("src", ext + dt + ".js");
        }
        document.body.appendChild(pagejs);
        pagejs.onload = function () {
            eval(dt + "()");
        }
    }
    else {
        eval(dt + "()");
    }
}

//div分享到微信
function divShareToWX(byID) {
    html2canvas(document.getElementById(byID), {
        onrendered: function (canvas) {
            var url = canvas.toDataURL("image/png").split(',')[1];
            myJavaFun.AppShare(url, wxShareStr);
        }
    });
}
//图表分享到微信
function chartShareToWX(myChart) {
    var url = myChart.getDataURL().split(',')[1];
    myJavaFun.AppShare(url, wxShareStr);
}

var classObj =
     {
         ToUnicode: function (str) {
             return escape(str).replace(/%/g, "\\").toLowerCase();
         },
         UnUnicode: function (str) {
             return unescape(str.replace(/\\/g, "%"));
         }
     }

//扫一扫返回结果
function onRichScanCallback(dt) {
    console.log(dt);
}