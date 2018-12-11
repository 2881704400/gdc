var cinemaCode, hallCode;//影院编码,影厅编码
var equip_no;
window.onload = function () {
    $(".gdcSetting ul").html("");
    $(".gdcSetting ul").append("<li style='margin-bottom:26px;'>影厅环境：<span style='visibility:hidden;'>空空</span></li>");
    var newRow = "温度：<span class='scanning3'>25℃</span><span style='visibility:hidden;'>空</span>";
    $(".gdcSettingInfor").html("优");
    $(".gdcSettingInfor").removeClass("scanning2");
    newRow += "湿度：<span class='scanning3'>68％</span>";
    $(".gdcSetting ul").append("<li>" + newRow + "</li>");

    NowDataTime();
    var search = new Array(window.location.search.split('?')[1], window.location.hash.split('#')[1]);
    codes(parseInt(search[0]), parseInt(search[1]));
    $("body").bind("dblclick", fullScreen);
    SetUps();
}

function SetUps() {
    if (setUp[0].Show == 1) {
        var times = setUp[0].Time * 1000;
        $("#gdcSeats").hide();
        setInterval(function () {
            if ($("#gdcPosters").css("display") == "none") {
                $("#gdcSeats").fadeOut(1000, function () {
                    $("#gdcPosters").fadeIn();
                });
            }
            else {
                $("#gdcPosters").fadeOut(1000, function () {
                    $("#gdcSeats").fadeIn();
                });
            }
        }, times);
        
    }
    else {
        if (setUp[1].Show == 1) {
        }
        else {
            $("#gdcPosters").css("height", "960px");
            $("#gdcSeats").hide();
        }
    }
}

window.onhashchange = function () {
    location.reload();
}

var cinemaCodes = new Array();
var hallCodes = new Array();
function codes(dt1, dt2) {
    var sign = $.md5("I4Ty7okNuBfG4URlC0000I4Ty7okNuBfG4URl");
    $.ajax({
        type: "post",
        dataType: 'JSONP',
        url: "http://omnijoi.cn:6608/api/ticket/v1/queryCinemas.json?channelCode=C0000&sign=" + sign,
        success: function (dt) {
            if (dt.code == "001") {
                var cinemas = dt.cinemas;
                cinemaCodes = new Array();
                for (var i = 0; i < cinemas.length; i++) {
                    cinemaCodes[i] = new Array(cinemas[i].code, cinemas[i].name);
                }
                cinemaCode = cinemaCodes[dt1 - 1][0];

                var sign2 = $.md5("I4Ty7okNuBfG4URlC0000" + cinemaCode + "I4Ty7okNuBfG4URl");
                $.ajax({
                    type: "post",
                    dataType: 'JSONP',
                    url: "http://omnijoi.cn:6608/api/ticket/v1/queryHalls.json?channelCode=C0000&cinemaCode=" + cinemaCode + "&sign=" + sign2,
                    success: function (dt) {
                        if (dt.code == "001") {
                            var halls = dt.halls;
                            hallCodes = new Array();
                            for (var i = 0; i < halls.length; i++) {
                                hallCodes[i] = new Array(halls[i].code, halls[i].name);
                            }
                            hallCode = hallCodes[dt2 - 1][0];
                            InitEnsure();
                            initQueryHalls(cinemaCode);
                            queryShowSeats2();
                            initQuerShows(cinemaCode);
                        }
                        else {
                            console.log(dt.code);
                        }
                    },
                    error: function () {
                        console.log("服务器错误");
                    }
                });
            }
            else {
                console.log(dt.code);
            }
        },
        error: function () {
            console.log("服务器错误");
        }
    });
}

var QueryHalls = new Array();
function initQueryHalls(dt) {
    var sign = $.md5("I4Ty7okNuBfG4URlC0000" + dt + "I4Ty7okNuBfG4URl");
    $.ajax({
        type: "get",
        dataType: 'jsonp',
        url: "http://omnijoi.cn:6608/api/ticket/v1/queryHalls.json?channelCode=C0000&cinemaCode=" + dt + "&sign=" + sign,
        success: function (dt) {
            if (dt.code == "001") {
                var halls = dt.halls;
                QueryHalls = new Array();
                for (var i = 0; i < halls.length; i++) {
                    if (halls[i].code == hallCode) {
                        $(".gdcNumber").html("总共 " + halls[i].seatCount + " 座位");
                        var titles = "<div>" + halls[i].name.split(' ')[0] + "</div>";
                        if (halls[i].name.split(' ')[1]) {
                            titles += "<div style='font-size:42px;letter-spacing:4px;'>" + halls[i].name.split(' ')[1] + "</div>";
                        }
                        //titles += "<div style='font-size:42px;letter-spacing:4px;'>1米3以下儿童观影3D需购票</div>";
                        $(".gdcTop_left").html(titles);
                        querySeats();
                    }
                }
            }
            else {
                console.log(dt.code);
            }
        },
        error: function () {
            console.log("服务器错误");
        }
    });
}
var dtShow, showTimeToNow_setInterval, queryShowSeats_setInterval;
function initQuerShows(dt) {
    var sign = $.md5("I4Ty7okNuBfG4URlC0000" + dt + "I4Ty7okNuBfG4URl");
    $.ajax({
        type: "get",
        //dataType: 'json',
        //url: "res/data/queryShows.json",
        dataType: 'jsonp',
        url: "http://omnijoi.cn:6608/api/ticket/v1/queryShows.json?channelCode=C0000&cinemaCode=" + dt + "&sign=" + sign,
        success: function (dt) {
            if (dt.code == "001") {
                var dtShows = dt.shows;
                dtShow = new Array();
                var dtShowaa = new Array();
                if (dtShows.length != 0) {
                    for (var i = 0, j = 0; i < dtShows.length; i++) {
                        if (dtShows[i].hallCode == hallCode) {
                            dtShowaa[j] = dtShows[i];
                            j++;
                        }
                    }
                    dtShowaa.sort(getSortFun('asc', 'showTime'));
                    var dtShowaas = new Array();
                    //console.log(thisSeats)
                    for (var i = 0, j = 0; i < dtShowaa.length; i++) {
                        var now = new Date();
                        var st = dateTimes(dtShowaa[i].showTime);
                        var nt = NowDataTime3(st, now).split(',');
                        var nts = parseInt(nt[0]) * 24 * 60 + parseInt(nt[1]) * 60 + parseInt(nt[2]);
                        if (nts < parseInt(dtShowaa[i].duration)) {
                            dtShowaas[j] = dtShowaa[i];
                            j++;
                        }
                        try {
                            if (dtShowaa[i].channelShowCode == thisSeats.children("ChannelShowCode").text()) {
                                dtShow = null;
                                dtShow = dtShowaa[i];
                            }
                        }
                        catch (ex) {
				dtShow = null;
                        }
                    }
                    console.log(dtShowaas[0])
                    if (dtShow == null) {
                        dtShow = dtShowaas[0];
                    }
                    if (dtShow != null) {
                        queryFilmJSON(dtShow.filmCode);
                        console.log(dtShow)
                        showTimeToNow();
                        showTimeToNow_setInterval = setInterval(showTimeToNow, 60000);
                    }
                }
            }
            else {
                console.log(dt.code);
            }
        },
        error: function () {
            console.log("服务器错误");
        }
    });
}
function queryFilmJSON(dt) {
    var sign = $.md5("I4Ty7okNuBfG4URlC0000" + dt + "I4Ty7okNuBfG4URl");
    $.ajax({
        type: "get",
        dataType: 'jsonp',
        url: "http://omnijoi.cn:6608/api/ticket/v1/queryFilm.json?channelCode=C0000&filmCode=" + dt + "&sign=" + sign,
        success: function (dt) {
            if (dt.code == "001") {
                var film = dt.film;
                $(".gdcName").html(film.name);
                $(".gdcType").html(film.type);
                $(".gdcPoster img").attr("src", film.poster);
            }
            else {
                console.log(dt.code);
            }
        },
        error: function () {
            console.log("服务器错误");
        }
    });
}
function showTimeToNow() {
    queryShowSeats2();
    var now = new Date();
	var st = dateTimes(dtShow.showTime);
    if (now > st) {
        //之前的日期
        var nt = NowDataTime3(st, now).split(',');
        var nts = parseInt(nt[0]) * 24 * 60 + parseInt(nt[1]) * 60 + parseInt(nt[2]);
        if (nts >= parseInt(dtShow.duration)) {
            clearInterval(showTimeToNow_setInterval);
            
            $(".gdcSeatsList").find("div").find("i").removeClass("icon-zuowei1");
            $(".gdcSeatsList").find("div").find("i").addClass("icon-zuowei");

            setTimeout(function () {
                initQuerShows(cinemaCode);
            }, 5000);
            $(".gdcPlayInfor_1").html("");
            $(".gdcPoster p").html("已结束");
            $(".gdcPlayInfor_2").html("已结束");
            $(".progressBarPlay_2").attr("style", "width:100%");
            queryFilmJSON(dtShow.filmCode);
        }
        else {
            var percent = parseInt((nts / parseInt(dtShow.duration)) * 100);
            $(".gdcPlayInfor_1").html("当前进度：" + percent + "%");
            $(".progressBarPlay_2").attr("style", "width:" + percent + "%");
            $(".gdcPlayInfor_2").html("已播放：" + nts + " 分钟");
            $(".gdcPoster p").html("正在播放");
        }
    } else if (now < st) {
        //之后的日期
        var nt = NowDataTime3(now, st).split(',');
        var nts = "";
        if (parseInt(nt[0]) != 0) {
            nts += nt[0] + " 天 ";
        }
        if (parseInt(nt[1]) != 0) {
            nts += nt[1] + " 小时 ";
        }
        if (parseInt(nt[2]) != 0) {
            nts += nt[2] + " 分钟";
        }
        if (nts == "") {
            nts += "少于1分钟";
        }
        $(".gdcPoster p").html("尚未开始");
        $(".gdcPlayInfor_2").html("尚未开始（距离开播时间还有：" + nts + "）");
        $(".progressBarPlay_2").attr("style", "width:0%");
    } else {
        //一样的日期
    }
}
function getSortFun(order, sortBy) {
    var ordAlpah = (order == 'asc') ? '>' : '<';
    var sortFun = new Function('a', 'b', 'return a.' + sortBy + ordAlpah + 'b.' + sortBy + '?1:-1');
    return sortFun;
}

var initCounts = 0;
//连接服务器
function InitEnsure() {
    $.ajax({
        type: "post",
        url: "/GWServices.asmx/InitEnsureRunProxy",
        data: "wcfIP=&&pageUserNm=admin",
        success: function (dt) {
            var analyze = $(dt).children("string").text();
            console.log(analyze);
            setTimeout(function () {
                if (analyze == "false") {
                    initCounts++;
                    $(".gdcSetting ul").html("");
                    $(".gdcSetting ul").append("<li style='margin-bottom:26px;'>影厅环境：<span style='visibility:hidden;'>空空</span></li>");
                    var newRow = "温度：<span class='scanning3'>25℃</span><span style='visibility:hidden;'>空</span>";
                    $(".gdcSettingInfor").html("优");
                    $(".gdcSettingInfor").removeClass("scanning2");
                    newRow += "湿度：<span class='scanning3'>68％</span>";
                    $(".gdcSetting ul").append("<li>" + newRow + "</li>");
                    InitEnsure();
                }
            }, 3000);
            if (analyze != "false" || initCounts == 3) {
                //queryShowSeats2();
                //initQuerShows(cinemaCode);
                ServiceToYDEquip();
            }
        }
    });
}

function ServiceToYDEquip() {
    $.ajax({
        type: "post",
        url: "/GWServices.asmx/GainAlarmTab",
        data: "tableName=GDC_YDEquip",
        success: function (data) {
            var resultJs = $(data).children("string").text();
            if (resultJs != "false") {
                jsonToYDEquip(resultJs);
            }
        }
    });
}
function jsonToYDEquip(data) {
    var usera = eval("(" + data + ")");
    for (var i = 0; i < usera.length; i++) {
        var userb = usera[i];
        var userc = new Array(userb.yy_no, userb.yt_no, userb.equip_no, userb.yc_no, userb.yc_no2);
        if (userc[0] == cinemaCode && userc[1] == hallCode) {
            equip_no = new Array(userc[2], userc[3], userc[4]);
            //equip_no = userc[2];
        }
    }
    ServiceToYDEquipYcp();
    setInterval(ServiceToYDEquipYcp, 3000);
}
function ServiceToYDEquipYcp() {
    queryShowSeats2();
    $.ajax({
        type: "post",
        url: "/GWServices.asmx/RealTimeData",
        data: "selectedEquipNo=" + equip_no[0] + "&&tableName=ycp",
        success: function (dt) {
            var data = $(dt).children("string").text();
            $(".gdcSetting ul").html("");
            $(".gdcSetting ul").append("<li style='margin-bottom:26px;'>影厅环境：<span style='visibility:hidden;'>空空</span></li>");
            if (data == "false") {
                $(".gdcSettingInfor").html("优");
                $(".gdcSettingInfor").addClass("scanning3");
                $(".gdcSettingInfor").removeClass("scanning2");

                var newRow = "温度：<span class='scanning3'>25℃</span><span style='visibility:hidden;'>空</span>湿度：<span class='scanning3'>68％</span>";
                $(".gdcSetting ul").append("<li>" + newRow + "</li>");
            }
            else {
                var usera = eval("(" + data + ")");
                var newRow = "";
                for (var i = 0; i < usera.length; i++) {
                    var userb = usera[i];
                    var userc = new Array(userb.m_IsAlarm, userb.m_AdviceMsg, userb.m_iYCNo, userb.m_YCNm, userb.m_YCValue, userb.m_Unit);
                    var cls = "scanning3";
                    
                    if (userb.m_iYCNo == equip_no[1]) {
                        if (userc[4] == "0" || userc[4] == "***") {
                            userc[4] = "25";
                        }
                        var values = parseFloat(userc[4]);
                        if (values >= 23 && values <= 28) {
                            $(".gdcSettingInfor").html("优");
                            $(".gdcSettingInfor").removeClass("scanning2");
                        }
                        else {
                            $(".gdcSettingInfor").html("良");
                            $(".gdcSettingInfor").addClass("scanning2");
                            cls = "scanning2";
                        }
                        newRow += "温度：<span class='" + cls + "'>" + userc[4] + userc[5] + "</span> ";
                    }
                    if (userb.m_iYCNo == equip_no[2]) {
                        if (userc[4] == "0" || userc[4] == "***") {
                            userc[4] = "68";
                        }
                        newRow += "湿度：<span class='" + cls + "'>" + userc[4] + userc[5] + "</span> ";
                    }
                    
                }
                if (newRow == "") {
                    newRow += "温度：<span class='scanning3'>25℃</span><span style='visibility:hidden;'>空</span>";
                    $(".gdcSettingInfor").html("优");
                    $(".gdcSettingInfor").removeClass("scanning2");
                    newRow += "湿度：<span class='scanning3'>68％</span>";
                }
                $(".gdcSetting ul").append("<li>" + newRow + "</li>");
            }
        }
    });
}

//当前时间
function NowDataTime() {
    var myDate = new Date();
    var toLocaleStrings = myDate.toLocaleString().split(' ');
    $(".gdcTop_right").html(toLocaleStrings[0] + "<br/>" + toLocaleStrings[1]);
    setInterval(function () {
        var myDate = new Date();
        var toLocaleStringss = myDate.toLocaleString().split(' ');
        $(".gdcTop_right").html(toLocaleStringss[0] + "<br/>" + toLocaleStringss[1]);
    }, 1000);
}
//计算时间差
function NowDataTime3(data1, data2) {
    var s1 = data1.getTime(), s2 = data2.getTime();
    var total = (s2 - s1) / 1000;
    var day = parseInt(total / (24 * 60 * 60));//计算整数天数
    var afterDay = total - day * 24 * 60 * 60;//取得算出天数后剩余的秒数
    var hour = parseInt(afterDay / (60 * 60));//计算整数小时数
    var afterHour = total - day * 24 * 60 * 60 - hour * 60 * 60;//取得算出小时数后剩余的秒数
    var min = parseInt(afterHour / 60);//计算整数分
    var afterMin = total - day * 24 * 60 * 60 - hour * 60 * 60 - min * 60;//取得算出分后剩余的秒数
    return day + "," + hour + "," + min + "," + afterMin;
}
//时间格式化
function dateTimes(date) {
    var s = date;
    var ps = s.split(" ");
    var pd = ps[0].split("-");
    var pt = ps.length > 1 ? ps[1].split(":") : [0, 0, 0];
    var st = new Date(pd[0], pd[1] - 1, pd[2], pt[0], pt[1], pt[2]);
    return st;
}

function GDCTest() {
    //渠道编号：C0000
    //密钥：I4Ty7okNuBfG4URl
    var sign = $.md5("I4Ty7okNuBfG4URlC0000" + cinemaCode + "I4Ty7okNuBfG4URl");

    $.ajax({
        type: "post",
        dataType: 'JSONP',
        url: "http://omnijoi.cn:6608/api/ticket/v1/queryShows.json?channelCode=C0000&cinemaCode=" + cinemaCode + "&sign=" + sign,
        success: function (dt) {
            if (dt.code == "001") {
                console.log("场次列表");
                var dtShows = dt.shows;
                var dtShowaa = new Array();
                if (dtShows.length != 0) {
                    for (var i = 0, j = 0; i < dtShows.length; i++) {
                        if (dtShows[i].hallCode == hallCode) {
                            dtShowaa[j] = dtShows[i];
                            j++;
                        }
                    }
                    dtShowaa.sort(getSortFun('asc', 'showTime'));
                    var dtShowaas = new Array();
                    for (var i = 0, j = 0; i < dtShowaa.length; i++) {
                        var now = new Date();
                        var st = dateTimes(dtShowaa[i].showTime);
                        var nt = NowDataTime3(st, now).split(',');
                        var nts = parseInt(nt[0]) * 24 * 60 + parseInt(nt[1]) * 60 + parseInt(nt[2]);
                        if (nts < parseInt(dtShowaa[i].duration)) {
                            dtShowaas[j] = dtShowaa[i];
                            j++;
                        }
                    }
                    console.log(dtShowaas);
                }
            }
            else {
                console.log(dt.code);
            }
        },
        error: function () {
            console.log("服务器错误");
        }
    });
}
Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};

function fullScreen() {
    if ($("body").hasClass("full-screen")) {
        var de = document;
        if (de.exitFullscreen) {
            de.exitFullscreen();
        } else if (de.mozCancelFullScreen) {
            de.mozCancelFullScreen();
        } else if (de.webkitCancelFullScreen) {
            de.webkitCancelFullScreen();
        }
        $("body").removeClass("full-screen");
        $(".fullScreen").show();
    }
    else {
        var de = document.documentElement;
        if (de.requestFullscreen) {
            de.requestFullscreen();
        } else if (de.mozRequestFullScreen) {
            de.mozRequestFullScreen();
        } else if (de.webkitRequestFullScreen) {
            de.webkitRequestFullScreen();
        } else if (de.msRequestFullscreen) {
            de.msRequestFullscreen();
        }
        $("body").addClass("full-screen");
        $(".fullScreen").hide();
    }
}

var thisSeats;
//影厅座位列表
function querySeats() {
    var sign = $.md5("I4Ty7okNuBfG4URlC0000" + cinemaCode + hallCode + "I4Ty7okNuBfG4URl");
    $.ajax({
        type: "post",
        dataType: 'JSONP',
        url: "http://omnijoi.cn:6608/api/ticket/v1/querySeats.json?channelCode=C0000&cinemaCode=" + cinemaCode + "&hallCode=" + hallCode + "&sign=" + sign,
        success: function (dt) {
            if (dt.code == "001") {
                $(".gdcSeatsList").html("");
                var dtSeats = dt.seats;
                var xcoordMax = 0;
                var ycoordMax = 0;
                for (var i = 0; i < dtSeats.length; i++) {
                    var status = "";
                    if (dtSeats[i].status == "1") {
                        status = "icon-zuowei";
                    }
                    else {
                        status = "icon-zuowei1";
                    }
                    if (xcoordMax < parseInt(dtSeats[i].xcoord)) {
                        xcoordMax = parseInt(dtSeats[i].xcoord);
                    }
                    if (ycoordMax < parseInt(dtSeats[i].ycoord)) {
                        ycoordMax = parseInt(dtSeats[i].ycoord);
                    }
                    var x = parseInt(dtSeats[i].xcoord - 1) * 24;
                    var y = parseInt(dtSeats[i].ycoord + 1) * 24;
                    var infor = dtSeats[i].rowNum + "行" + dtSeats[i].colNum + "列";
                    var xy = dtSeats[i].xcoord + " x," + dtSeats[i].ycoord + " y";
                    if (parseInt(dtSeats[i].colNum) != -1) {
                        var single = "<div class='gdcSeatsSingle' infor='" + infor + "' xy='" + xy + "' style='top:" + x + "px;left:" + y + "px;'><i class='iconfont " + status + "'></i></div>";
                        $(".gdcSeatsList").append(single);
                    }
                }
                for (var i = 1; i < xcoordMax + 1; i++) {
                    var x = (i - 1) * 24;
                    var numb = i;
                    if (numb < 10) {
                        numb = "0" + i;
                    }
                    var single = "<div class='gdcSeatsSingle' style='top:" + x + "px;left:0;'><span>" + numb + "<span></div>";
                    $(".gdcSeatsList").append(single);
                }
                if (xcoordMax > 13) {
                    var scale = (10 - (xcoordMax - 13)) / 10;
                    $(".gdcSeatsList").css("transform", "scale(" + scale + ")");
                }
                else {
                    var heights = xcoordMax * 24;
                    $(".gdcSeatsList").css("height", heights + "px");
                    var hgs = $(".gdcSeats").height() - heights;
                    $(".gdcSeats").css("height", heights + "px");
                    $("#gdcPosters").css("height", $("#gdcPosters").height() + hgs + "px");
                    if (setUp[0].Show == 1) {
                        $("#gdcPosters").css("height", "auto");
                        $("#gdcSeats").css("height", "960px");
                        var hg = (960 - heights) / 2;
                        $("#gdcSeats").css("padding-top", hg + "px");
                    }
                    else {
                        if (setUp[1].Show == 1) {
                        }
                        else {
                            $("#gdcPosters").css("height", "960px");
                            $("#gdcSeats").hide();
                        }
                    }
                }
                $(".gdcSeats").css("width", (ycoordMax + 2) * 24 + "px");
                //queryShowSeats2();
            }
            else {
                console.log(dt.code);
            }
        },
        error: function () {
            console.log("服务器错误");
        }
    });
}

//场次座位列表(已售票)
function queryShowSeats2() {
    var myDate = new Date();
    var nowDateTime = myDate.getFullYear() + "-" + (myDate.getMonth() + 1) + "-" + myDate.getDate();//当前日期
    var nowDateTimes = nowDateTime + " " + myDate.getHours() + ":" + myDate.getMinutes() + ":" + myDate.getSeconds();//当前日期+时间

    //当前日期6小时之前
    var nowInterval = myDate.getTime() - 6 * 60 * 60 * 1000;
    var myNowInterval = new Date(nowInterval);
    var myNowIntervalDT = myNowInterval.getFullYear() + "-" + (myNowInterval.getMonth() + 1) + "-" + myNowInterval.getDate();
    var myNowIntervalDTS = myNowIntervalDT + " " + myNowInterval.getHours() + ":" + myNowInterval.getMinutes() + ":" + myNowInterval.getSeconds();
    $.ajax({
        type: "post",
        url: "/GWServices.asmx/GetDataTableFromSQLSer",
        data: "sql=select * from GW_CinemaSeat where CinemaCode='" + cinemaCode + "' and HallCode='" + hallCode + "' and ShowTime>=#" + myNowIntervalDTS + "# order by ShowTime",
        success: function (dt) {
            //console.log(dt);
            var shens = new Array();
            var k = 0;
            $(dt).children("DataTable").find("shen").each(function () {
                var ShowTime = $(this).children("ShowTime").text().replace("T", " ").split("+")[0];
                var NowDataTime3s = NowDataTime3(dateTimes(nowDateTimes), dateTimes(ShowTime)).split(',');
                var ndTimes = 0;
                if (parseInt(NowDataTime3s[0]) >= 0) {
                    var s = parseInt(NowDataTime3s[0]) * 24 * 60 + parseInt(NowDataTime3s[1]) * 60 + parseInt(NowDataTime3s[2]);
                    if (s > 0 && $(this).children("State").text() == "1") {

                        shens[k++] = $(this);
                    }
                    else {
                        var Duration = parseInt($(this).children("Duration").text()) + s;
                        if (Duration > 0 && $(this).children("State").text() == "1") {
                            shens[k++] = $(this);
                        }
                    }
                }
            });
            //queryFilmJSON(shens[0].children("State"));
            
            thisSeats = shens[0];
            //console.log(thisSeats)
            if (thisSeats == null) {
                return;
            }
            var texts = shens[0].children("Data").text();
            if (texts.indexOf('  }') > 0) {
                texts = texts.replace("  ", "[]");
            }
            else {
                if (texts.indexOf('[') < 0) {
                    texts = (texts.replace(" {", "[{")).replace(" }", "]}");
                }
            }
            var usera = eval("(" + texts + ")"); //console.log(texts)
            if (usera.code == "001") {
                var shensFirst = usera.seats;
                for (var i = 0; i < shensFirst.length; i++) {
                    var xcoord = shensFirst[i].xcoord;
                    var ycoord = shensFirst[i].ycoord;
                    $(".gdcSeatsList").find("div").each(function () {
                        var xys = $(this).attr("xy");
                        if (xys != null) {
                            var xy = xys.split(',');
                            var x = xy[0].split(' ')[0];
                            var y = xy[1].split(' ')[0];
                            if (xcoord == x && ycoord == y) {

                                $(this).find("i").removeClass("icon-zuowei");
                                $(this).find("i").addClass("icon-zuowei1");
                            }
                        }
                    });
                }
            }
        },
        error: function () {
            console.log("服务器错误");
        }
    });
}

var queryShowSeatsJSON;
var queryShowSeatsJSONNext;
//场次座位列表
function queryShowSeats(dts) {
    var channelShowCode = dtShow[dts].channelShowCode;
    var sign = $.md5("I4Ty7okNuBfG4URlC0000" + channelShowCode + "I4Ty7okNuBfG4URl");
    $.ajax({
        type: "post",
        dataType: 'JSONP',
        url: "http://omnijoi.cn:6608/api/ticket/v1/queryShowSeats.json?channelCode=C0000&channelShowCode=" + channelShowCode + "&sign=" + sign,
        success: function (dt) {
            if (dt.code == "001") {
                console.log("场次座位列表");
                var dtSeats = dt.seats; 
                if (dts == 0) {
                    queryShowSeatsJSON = dtSeats;
                    querySeatsHTML();
                }
                else {
                    queryShowSeatsJSONNext = dtSeats;
                }
            }
            else {
                $(".gdcSeats").attr("queryShowSeatsNum", "1");
                //queryShowSeats(1);
                console.log(dt.code);
            }
            if (queryShowSeatsJSON != null) {
                //querySeatsHTML();
            }
        },
        error: function () {
            console.log("服务器错误");
        }
    });
}


function querySeatsHTML() {
    $(".gdcSeatsList").html("");
    var dtSeats;
    dtSeats = queryShowSeatsJSON;
    var xcoordMax = 0;
    var ycoordMax = 0;
    for (var i = 0; i < dtSeats.length; i++) {
        var status = "";
        if (dtSeats[i].status == "1") {
            status = "icon-zuowei";
        }
        else {
            status = "icon-zuowei1";
        }
        if (xcoordMax < parseInt(dtSeats[i].xcoord)) {
            xcoordMax = parseInt(dtSeats[i].xcoord);
        }
        if (ycoordMax < parseInt(dtSeats[i].ycoord)) {
            ycoordMax = parseInt(dtSeats[i].ycoord);
        }
        var x = (parseInt(dtSeats[i].xcoord) - 1) * 24;
        var y = parseInt(dtSeats[i].ycoord + 1) * 24;
        var infor = dtSeats[i].rowNum + "行" + dtSeats[i].colNum + "列";
        var xy = dtSeats[i].xcoord + " x," + dtSeats[i].ycoord + " y";
        if (parseInt(dtSeats[i].colNum) != -1) {
            var single = "<div class='gdcSeatsSingle' infor='" + infor + "' xy='" + xy + "' style='top:" + x + "px;left:" + y + "px;'><i class='iconfont " + status + "'></i></div>";
            $(".gdcSeatsList").append(single);
        }
    }
    for (var i = 1; i < xcoordMax + 1; i++) {
        var x = (i - 1) * 24;
        var numb=i;
        if (numb < 10) {
            numb = "0" + i;
        }
        var single = "<div class='gdcSeatsSingle' style='top:" + x + "px;left:0;'><span>" + numb + "<span></div>";
        $(".gdcSeatsList").append(single);
    }
    if (xcoordMax > 13) {
        var scale = (10 - (xcoordMax - 13)) / 10;
        $(".gdcSeats").css("transform", "scale(" + scale + ")");
    }
    else {
        var heights = xcoordMax * 24;
        $(".gdcSeatsList").css("height", heights + "px");
    }
    $(".gdcSeats").css("width", (ycoordMax + 2) * 24 + "px");
}
