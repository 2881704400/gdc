var cinemaCode, hallCode;//影院编码,影厅编码
var equip_no;
window.onload = function () {
    NowDataTime();
    var search = window.location.search.split('?')[1].split('&');
    cinemaCode = search[0].split('=')[1];
    hallCode = search[1].split('=')[1];
    GDCTest();
    initQueryHalls(cinemaCode);
    initQuerShows(cinemaCode);
    InitEnsure();
    $("body").bind("dblclick", fullScreen);
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
                        $(".gdcTop_left").html(halls[i].name);
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
var dtShow, showTimeToNow_setInterval;
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
                if (dtShows.length != 0) {
                    for (var i = 0; i < dtShows.length; i++) {
                        if (dtShows[i].hallCode == hallCode && dtShows[i].status == "1") {
                            dtShow[i] = dtShows[i];
                        }
                    }
                    dtShow.sort(getSortFun('asc', 'showTime'));
                    console.log(dtShow)
                    for (var i = 0; i < dtShow.length; i++) {
                        var now = new Date();
                        var st = new Date(dtShow[0].showTime);

                    }
                    if (dtShow[0] != null) {
                        //$(".gdcTop_left").html(dtShow.hallName);
                        //$(".gdcName").html(dtShow.filmName);
                        queryFilmJSON(dtShow[0].filmCode);
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
    var now = new Date();
	
	var s = dtShow[0].showTime;
	var ps = s.split(" ");
	var pd = ps[0].split("-");
	var pt = ps.length>1 ? ps[1].split(":"): [0,0,0];
	var st = new Date(pd[0],pd[1]-1,pd[2],pt[0],pt[1],pt[2]);
    //var st = new Date(dtShow[0].showTime);
    if (now > st) {
        //之前的日期
        var nt = NowDataTime3(st, now).split(',');
        var nts = parseInt(nt[0]) * 24 * 60 + parseInt(nt[1]) * 60 + parseInt(nt[2]);
        if (nts >= parseInt(dtShow[0].duration)) {
            clearInterval(showTimeToNow_setInterval);
            
            setTimeout(function () {
                initQuerShows(cinemaCode);
            }, 5000);
            $(".gdcPlayInfor_1").html("");
            $(".gdcPoster p").html("已结束");
            $(".gdcPlayInfor_2").html("已结束");
            $(".progressBarPlay_2").attr("style", "width:100%");
            queryFilmJSON(dtShow[0].filmCode);
        }
        else {
            var percent = parseInt((nts / parseInt(dtShow[0].duration)) * 100);
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

//连接服务器
function InitEnsure() {
    $.ajax({
        type: "post",
        url: "/GWServices.asmx/InitEnsureRunProxy",
        data: "wcfIP=&&pageUserNm=admin",
        success: function (dt) {
            var analyze = $(dt).children("string").text();
            console.log(analyze);
            ServiceToYDEquip();
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
            jsonToYDEquip(resultJs);
        }
    });
}
function jsonToYDEquip(data) {
    var usera = eval("(" + data + ")");
    for (var i = 0; i < usera.length; i++) {
        var userb = usera[i];
        var userc = new Array(userb.yy_no, userb.yt_no, userb.equip_no);
        if (userc[0] == cinemaCode && userc[1] == hallCode) {
            equip_no = userc[2];
        }
    }
    ServiceToYDEquipYcp();
    setInterval(ServiceToYDEquipYcp, 3000);
}
function ServiceToYDEquipYcp() {
    $.ajax({
        type: "post",
        url: "/GWServices.asmx/RealTimeData",
        data: "selectedEquipNo=" + equip_no + "&&tableName=ycp",
        success: function (dt) {
            var data = $(dt).children("string").text();
            var usera = eval("(" + data + ")");
            $(".gdcSetting ul").html("");
            $(".gdcSetting ul").append("<li style='margin-bottom:20px'>影厅环境：&nbsp;&nbsp;&nbsp;</li>");
            var newRow = "";
            for (var i = 0; i < 2; i++) {
                var userb = usera[i];
                var userc = new Array(userb.m_IsAlarm, userb.m_AdviceMsg, userb.m_iYCNo, userb.m_YCNm, userb.m_YCValue, userb.m_Unit);
                var cls = "scanning3";
                if (i == 0) {
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
                }

                newRow += userc[3] + "：<span class='" + cls + "'>" + userc[4] + userc[5] + "</span> ";
            }
            $(".gdcSetting ul").append("<li>" + newRow + "</li>");
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

function GDCTest() {
    //渠道编号：C0000
    //密钥：I4Ty7okNuBfG4URl
    var sign = $.md5("I4Ty7okNuBfG4URlC0000I4Ty7okNuBfG4URl");
    $.ajax({
        type: "post",
        dataType: 'JSONP',
        url: "http://omnijoi.cn:6608/api/ticket/v1/queryCinemas.json?channelCode=C0000&sign=" + sign,
        success: function (dt) {
            if (dt.code == "001") {
                console.log("影院列表");
                console.log(dt);
            }
            else {
                console.log(dt.code);
            }
        },
        error: function () {
            console.log("服务器错误");
        }
    });

    var sign2 = $.md5("I4Ty7okNuBfG4URlC000045010521I4Ty7okNuBfG4URl");
    $.ajax({
        type: "post",
        dataType: 'JSONP',
        url: "http://omnijoi.cn:6608/api/ticket/v1/queryHalls.json?channelCode=C0000&cinemaCode=45010521&sign=" + sign2,
        success: function (dt) {
            if (dt.code == "001") {
                console.log("影厅列表");
                console.log(dt);
            }
            else {
                console.log(dt.code);
            }
        },
        error: function () {
            console.log("服务器错误");
        }
    });

    $.ajax({
        type: "post",
        dataType: 'JSONP',
        url: "http://omnijoi.cn:6608/api/ticket/v1/queryShows.json?channelCode=C0000&cinemaCode=45010521&sign=" + sign2,
        success: function (dt) {
            if (dt.code == "001") {
                console.log("场次列表");
                console.log(dt);
            }
            else {
                console.log(dt.code);
            }
        },
        error: function () {
            console.log("服务器错误");
        }
    });

    var sign3 = $.md5("I4Ty7okNuBfG4URlC000045010521I4Ty7okNuBfG4URl");
    $.ajax({
        type: "post",
        dataType: 'JSONP',
        url: "http://omnijoi.cn:6608/api/ticket/v1/queryFilms.json?channelCode=C0000&startDate=2016-08-20&sign=" + sign3,
        success: function (dt) {
            if (dt.code == "001") {
                console.log("影片列表");
                console.log(dt);
            }
            else {
                console.log(dt.code);
            }
        },
        error: function () {
            console.log("服务器错误");
        }
    });

    var sign4 = $.md5("I4Ty7okNuBfG4URlC0000075X00982016I4Ty7okNuBfG4URl");
    $.ajax({
        type: "post",
        dataType: 'JSONP',
        url: "http://omnijoi.cn:6608/api/ticket/v1/queryFilm.json?channelCode=C0000&filmCode=075X00982016&sign=" + sign4,
        success: function (dt) {
            if (dt.code == "001") {
                console.log("指定影片");
                console.log(dt);
            }
            else {
                console.log(dt.code);
            }
        },
        error: function () {
            console.log("服务器错误");
        }
    });

    var sign5 = $.md5("I4Ty7okNuBfG4URlC0000" + cinemaCode + hallCode + "I4Ty7okNuBfG4URl");
    $.ajax({
        type: "post",
        dataType: 'JSONP',
        url: "http://omnijoi.cn:6608/api/ticket/v1/querySeats.json?channelCode=C0000&cinemaCode=" + cinemaCode + "&hallCode=" + hallCode + "&sign=" + sign5,
        success: function (dt) {
            if (dt.code == "001") {
                console.log("座位列表");
                console.log(dt);
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