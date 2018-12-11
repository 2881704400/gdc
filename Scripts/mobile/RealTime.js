function RealTime() {
    if ($("#conf_tree").find("li").length == 0) {
        treeConfList();
    }
    // 主页面下拉刷新
    var ptrContent = $$('#rt_content_ref');
    ptrContent.on("refresh", function (e) {
        setTimeout(function () {
            treeConfList();
            // 加载完毕需要重置
            myApp.pullToRefreshDone(ptrContent);
        }, 2000);
    });

    toolbarActive('RealTimeTool');
}

var confNumArry = null;
//树状列表数据
var datastr = new Array();
function treeConfList() {
    $("#conf_tree").html("");
    var equipNostr = "";//所有设备号
    var _url = "/GWServices.asmx/GetEquipTreeLists";
    datastr = new Array();
    function _successf(data) {
        $(data).children("ArrayOfString").find("string").each(function (i) {
            datastr[i] = $(this).text();
        });
        try {
            var datastrB = datastr[1].split('|');
            for (var i = 0; i < datastrB.length; i++) {
                var dataB = datastrB[i].split(',');
                var newRow = "";
                if (dataB[2] == "true") {
                    newRow += "<li class=\"accordion-item\"><a href=\"#\" onclick='onTreePar(this)' class=\"item-link item-content\">";
                    newRow += "<div class=\"item-media\"><i class=\"iconfont icon-xiayiye rt_listIcon\"></i><img id=\"imgConf_" + dataB[2] + "\" src=\"/Image/alarm/CommunicationOK.png\"></div>";
                    newRow += "<div class=\"item-inner\"><div class=\"item-title\">" + dataB[1] + "</div></div></a>";
                    newRow += "<div class=\"accordion-item-content rt_tree_1\"><div class=\"list-block\"><ul id='" + dataB[0] + "'></ul></div></div>";
                    newRow += "</li>";
                }
                else {
                    equipNostr += dataB[2] + ",";
                    newRow += "<li titles=\"" + dataB[1] + "\" id='rt_list_" + dataB[2] + "'><a href=\"plug/RealTimeTable.html?" + dataB[2] + "\" class=\"item-link item-content\">";
                    newRow += "<div class=\"item-media\"><img id=\"imgConf_" + dataB[2] + "\" src=\"/Image/alarm/CommunicationOK.png\"></div>";
                    newRow += "<div class=\"item-inner\"><div class=\"item-title\">" + dataB[1] + "</div></div>";
                    newRow += "</a></li>";
                }
                $("#conf_tree").append(newRow);
            }

            var datastrC = datastr[2].split('|');
            for (var i = 0; i < datastrC.length; i++) {
                var dataC = datastrC[i].split(',');
                var newRow = "";
                if (dataC[2] == "true") {
                    newRow += "<li class=\"accordion-item\"><a href=\"#\" onclick='onTreePar(this)' class=\"item-link item-content\">";
                    newRow += "<div class=\"item-media\"><i class=\"iconfont icon-xiayiye rt_listIcon\"></i><img id=\"imgConf_" + dataC[2] + "\" src=\"/Image/alarm/CommunicationOK.png\"></div>";
                    newRow += "<div class=\"item-inner\"><div class=\"item-title\">" + dataC[1] + "</div></div></a>";
                    newRow += "<div class=\"accordion-item-content rt_tree_2\"><div class=\"list-block\"><ul id='" + dataC[0] + "'></ul></div></div>";
                    newRow += "</li>";
                }
                else {
                    equipNostr += dataC[2] + ",";
                    newRow += "<li titles=\"" + dataC[1] + "\" id='rt_list_" + dataC[2] + "'><a href=\"plug/RealTimeTable.html?" + dataC[2] + "\" class=\"item-link item-content\">";
                    newRow += "<div class=\"item-media\"><img id=\"imgConf_" + dataC[2] + "\" src=\"/Image/alarm/CommunicationOK.png\"></div>";
                    newRow += "<div class=\"item-inner\"><div class=\"item-title\">" + dataC[1] + "</div></div>";
                    newRow += "</a></li>";
                }
                var dataCids = dataC[0].split('_');
                $("#" + dataCids[0] + "_" + dataCids[1]).append(newRow);
            }

            if (datastr[3] != null) {
                var datastrD = datastr[3].split('|');
                for (var i = 0; i < datastrD.length; i++) {
                    var dataD = datastrD[i].split(',');
                    var newRow = "";
                    if (dataD[2] == "true") {
                        newRow += "<li class=\"accordion-item\"><a href=\"#\" onclick='onTreePar(this)' class=\"item-link item-content\">";
                        newRow += "<div class=\"item-media\"><i class=\"iconfont icon-xiayiye rt_listIcon\"></i><img id=\"imgConf_" + dataD[2] + "\" src=\"/Image/alarm/CommunicationOK.png\"></div>";
                        newRow += "<div class=\"item-inner\"><div class=\"item-title\">" + dataD[1] + "</div></div></a>";
                        newRow += "<div class=\"accordion-item-content rt_tree_3\"><div class=\"list-block\"><ul id='" + dataD[0] + "'></ul></div></div>";
                        newRow += "</li>";
                    }
                    else {
                        equipNostr += dataD[2] + ",";
                        newRow += "<li titles=\"" + dataD[1] + "\" id='rt_list_" + dataD[2] + "'><a href=\"plug/RealTimeTable.html?" + dataD[2] + "\" class=\"item-link item-content\">";
                        newRow += "<div class=\"item-media\"><img id=\"imgConf_" + dataD[2] + "\" src=\"/Image/alarm/CommunicationOK.png\"></div>";
                        newRow += "<div class=\"item-inner\"><div class=\"item-title\">" + dataD[1] + "</div></div>";
                        newRow += "</a></li>";
                    }
                    var dataDids = dataD[0].split('_');
                    $("#" + dataDids[0] + "_" + dataDids[1] + "_" + dataDids[2]).append(newRow);
                }
            }

            //treeRefresh();
            setTimeout(treeRefresh, 1000);           
            equipNostr = equipNostr.substring(0, equipNostr.length - 1);
            confNumArry = null;
            confNumArry = equipNostr.split(',');
        }
        catch (ex) { }
    }
    JQajaxo("post", _url, false, "", _successf);
}

//父节点单击
function onTreePar(dts) {
    if ($(dts).find("i").hasClass("icon-xiayiye")) {
        $(dts).find("i").removeClass("icon-xiayiye");
        $(dts).find("i").addClass("icon-triangle-bottom");
    }
    else {
        $(dts).find("i").removeClass("icon-triangle-bottom");
        $(dts).find("i").addClass("icon-xiayiye");
    }
}

//刷新设备列表报警状态
function treeRefresh() {
    for (var i = 0; i < confNumArry.length; i++) {
        m_IsAlarmTodata(confNumArry[i]);
    }
}

//父节点判断是否有子节点报警
function treeListParentNode() {
    $("#conf_tree").children("li").each(function () {
        $(this).children("div").find("ul").each(function () {//第一级
            var b = 0;
            $(this).children("li").each(function () {

                if ($(this).children("a").find("img").attr("value") == "false") {
                    b++;
                }

                $(this).children("div").find("ul").each(function () {//第二级
                    var c = 0;
                    $(this).children("li").each(function () {
                        if ($(this).children("a").find("img").attr("value") == "false") {
                            c++;
                            b++;
                        }
                    });
                    if (c > 0) {
                        $(this).parent().parent().parent().children("a").find("img").attr("src", "/Image/alarm/HaveAlarm.png");
                        $(this).parent().parent().parent().children("a").find("img").attr("value", "false");
                    }
                    else {
                        $(this).parent().parent().parent().children("a").find("img").attr("src", "/Image/alarm/CommunicationOK.png");
                        $(this).parent().parent().parent().children("a").find("img").attr("value", "true");
                    }
                })
            });
            if (b > 0) {
                $(this).parent().parent().parent().children("a").find("img").attr("src", "/Image/alarm/HaveAlarm.png");
                $(this).parent().parent().parent().children("a").find("img").attr("value", "false");
            }
            else {
                $(this).parent().parent().parent().children("a").find("img").attr("src", "/Image/alarm/CommunicationOK.png");
                $(this).parent().parent().parent().children("a").find("img").attr("value", "true");
            }
        });
    })
}
//获取是否有报警
function m_IsAlarmTodata(confarrys) {
    var rets = 0;
    var _url = "/GWServices.asmx/RealTimeData";
    var _dataYcp = "selectedEquipNo=" + confarrys + "&&tableName=mypxs";
    JQajaxo("post", _url, true, _dataYcp, _successf);
    function _successf(data) {
        var resultStr = $(data).children("string").text();
        rets = resultStr;
        var domimg = $("#imgConf_" + confarrys);
        domimg.attr("src", "/Image/alarm/" + resultStr + ".png");
        if (resultStr == "CommunicationOK") {
            domimg.attr("value", "true");
        }
        else {
            domimg.attr("value", "false");
        }
        if (confarrys == confNumArry[confNumArry.length - 1]) {
            treeListParentNode();//父节点报警状态
        }
    }
    return rets;
}

//单击列表
$$(document).on("pageBeforeInit", ".page[data-page='RealTimeTable']", function (e) {
    var pages = e.detail.page.url.split('?')[1];
    onclick_tree(pages);
});
function onclick_tree(dt) {
    $("#tableYc tbody").html("");
    $("#tableYx tbody").html("");
    $("#tableSe tbody").html("");
    $("#popupTitle").html($("#rt_list_" + dt).attr("titles"));
    $("#popupTitle").attr("datas", dt);
    ontableAjax();

    var popuTable_ycp = $$('#tableYcDiv');
    myApp.initPullToRefresh(popuTable_ycp);
    popuTable_ycp.on("refresh", function (e) {
        $('#tableYcDiv').css("overflow", "initial");
        setTimeout(function () {
            ycyxRefresh();
            $('#tableYcDiv').css("overflow", "auto");
            myApp.pullToRefreshDone(popuTable_ycp);
        }, 2000);
    });

    var popuTable_yxp = $$('#tableYxDiv');
    myApp.initPullToRefresh(popuTable_yxp);
    popuTable_yxp.on("refresh", function (e) {
        $('#tableYxDiv').css("overflow", "initial");
        setTimeout(function () {
            ycyxRefresh();
            $('#tableYxDiv').css("overflow", "auto");
            myApp.pullToRefreshDone(popuTable_yxp);
        }, 2000);
    });
}

//曲线点
var curveDrop = -9;
//遥测表曲线值
var dataCurve = new Array();

function ontableAjax() {
    treeTodata(0);
    treeTodata(1);
    setTodata();
    //ycyxRefresh();
}

//获取遥测表、遥信表的数据
function treeTodata(datas) {
    var _url = "/GWServices.asmx/RealTimeData";
    if (datas == 0) {
        var _dataYcp = "selectedEquipNo=" + $("#popupTitle").attr("datas") + "&&tableName=ycp";
        JQajaxo("post", _url, false, _dataYcp, _successfYcp);
    }
    else {
        var _dataYxp = "selectedEquipNo=" + $("#popupTitle").attr("datas") + "&&tableName=yxp";
        JQajaxo("post", _url, false, _dataYxp, _successfYxp);
    }
    function _successfYcp(data) {
        var resultJs = $(data).children("string").text();
        if (resultJs != "false") {
            jsonTodata(resultJs, "ycp");
        }
    }

    function _successfYxp(data) {
        var resultJs = $(data).children("string").text();
        if (resultJs != "false") {
            jsonTodata(resultJs, "yxp");
        }
    }
}
//创建遥测表，遥信表
function jsonTodata(data, tableName) {
    var c_s = $("#imgConf_" + $("#popupTitle").attr("datas")).attr("src").split('/')[3].split('.')[0];
    var usera = eval("(" + data + ")");
    if (tableName == "ycp") {
        $("#tableYc tbody").html("");
        if (usera.length) {            
            $("#tableYcLi").attr("lengths", 1);
        }
        else {
            $("#tableYcLi").attr("lengths", 0);
        }
        for (var i = 0; i < usera.length; i++) {
            var userb = usera[i];
            var userc = new Array(userb.m_IsAlarm, userb.m_YCNm, userb.m_YCValue, userb.m_iYCNo, userb.m_AdviceMsg, userb.m_Unit);
            dataCurve[i] = new Array(userb.m_YCValue, userb.m_Unit);
            appendRowa(i);
        }
    }
    else {
        $("#tableYx tbody").html("");
        if (usera.length) {
            if ($("#tableYcLi").attr("lengths") == 0) {
                $("#tableYxLi").attr("lengths", 1);
                setTimeout(function () {
                    myApp.showTab('#tableYxDiv');
                }, 1300);
            }
            else {
                $("#tableYxLi").attr("lengths", 0);
            }
        }
        else {
            $("#tableYxLi").attr("lengths", 0);
        }
        for (var j = 0; j < usera.length; j++) {
            var userb = usera[j];
            var userc = new Array(userb.m_IsAlarm, userb.m_YXNm, userb.m_YXState, userb.m_iYXNo, userb.m_AdviceMsg);
            appendRowb(j);
        }
    }

    function appendRowa(data) {
        var newRow = $("<tr></tr>");
        var isAlarms = "";
        if (c_s == "CommunicationOK" || c_s == "HaveAlarm") {
            if (userc[0] == "False") {
                isAlarms = "<img src=\"/Image/alarm/CommunicationOK.png\">";
                newRow.append("<td id='m_alarmyc_" + i + "'>" + isAlarms + "</td>");
            }
            else {
                isAlarms = "<img src=\"/Image/alarm/HaveAlarm.png\">";
                newRow.append("<td id='m_alarmyc_" + i + "'>" + isAlarms + "</td>");
            }
        }
        else {
            isAlarms = "<img src=\"/Image/alarm/" + c_s + ".png\">";
            newRow.append("<td id='m_alarmyc_" + i + "'>" + isAlarms + "</td>");
        }

        newRow.append("<td>" + userc[1] + "</td>");
        newRow.append("<td id='valueycp_" + i + "'>" + userc[2] + userc[5] + "</td>");
        newRow.append("<td><a href='#' class='button' onclick=\"curveBox(" + i + ",'" + userc[1] + "',this)\"><i class='iconfont icon-quxiantu'></i></a></td>");
        $("#tableYc tbody:last").append(newRow);
    }

    function appendRowb(data) {
        var newRow = $("<tr></tr>");
        if (c_s == "CommunicationOK" || c_s == "HaveAlarm") {
            if (userc[0] == "False") {
                newRow.append("<td id='m_alarmyx_" + j + "'><img src=\"/Image/alarm/CommunicationOK.png\"></td>");
            }
            else {
                newRow.append("<td id='m_alarmyx_" + j + "'><img src=\"/Image/alarm/HaveAlarm.png\"></td>");
            }
        }
        else {
            newRow.append("<td id='m_alarmyx_" + i + "'><img src=\"/Image/alarm/" + c_s + ".png\"></td>");
        }

        newRow.append("<td>" + userc[1] + "</td>");
        newRow.append("<td id='valueyxp_" + j + "'>" + userc[2] + "</td>");
        $("#tableYx tbody:last").append(newRow);
    }
}
//刷新遥测表，遥信表数据
function ycyxRefresh() {
    var _url = "/GWServices.asmx/RealTimeData";
    var confNum = $("#popupTitle").attr("datas");
    if (confNum == null || confNum == undefined) {
        clearInterval(ycyxRefreshSet);
        return;
    }
    var c_s = $("#imgConf_" + confNum).attr("src").split('/')[3].split('.')[0];
    var _dataYcp = "selectedEquipNo=" + confNum + "&&tableName=ycp";
    JQajaxo("post", _url, false, _dataYcp, _successfYcp);
    var _dataYxp = "selectedEquipNo=" + confNum + "&&tableName=yxp";
    JQajaxo("post", _url, false, _dataYxp, _successfYxp);
    function _successfYcp(data) {
        var resultJs = $(data).children("string").text();
        if (resultJs != "false") {
            ycpToHtml(resultJs);
        }
    }
    function _successfYxp(data) {
        var resultJs = $(data).children("string").text();
        if (resultJs != "false") {
            yxpToHtml(resultJs);
        }
    }

    function ycpToHtml(data) {
        var usera = eval("(" + data + ")");
        for (var i = 0; i < usera.length; i++) {
            var userb = usera[i];
            var userc = new Array(userb.m_IsAlarm, userb.m_YCValue, userb.m_AdviceMsg, userb.m_YCNm, userb.m_Unit);
            dataCurve[i] = new Array(userb.m_YCValue, userb.m_Unit);
            if (c_s == "CommunicationOK" || c_s == "HaveAlarm") {
                if (userc[0] == "False") {
                    $("#m_alarmyc_" + i).html("<img src=\"/Image/alarm/CommunicationOK.png\">");
                }
                else {
                    $("#m_alarmyc_" + i).html("<img src=\"/Image/alarm/HaveAlarm.png\">");
                }
            }
            else {
                $("#m_alarmyc_" + i).html("<img src=\"/Image/alarm/" + c_s + ".png\">");
            }
            $("#valueycp_" + i).html(userc[1] + userc[4]);
        }
    }

    function yxpToHtml(data) {
        var usera = eval("(" + data + ")");
        for (var i = 0; i < usera.length; i++) {
            var userb = usera[i];
            var userc = new Array(userb.m_IsAlarm, userb.m_YXState, userb.m_AdviceMsg);
            if (c_s == "CommunicationOK" || c_s == "HaveAlarm") {
                if (userc[0] == "False") {
                    $("#m_alarmyx_" + i).html("<img src=\"/Image/alarm/CommunicationOK.png\">");
                }
                else {
                    $("#m_alarmyx_" + i).html("<img src=\"/Image/alarm/HaveAlarm.png\">");
                }
            }
            else {
                $("#m_alarmyx_" + i).html("<img src=\"/Image/alarm/" + c_s + ".png\">");
            }

            $("#valueyxp_" + i).html(userc[1]);
        }
    }
}

//获取设置表数据
function setTodata() {
    var confNum = $("#popupTitle").attr("datas");
    $("#tableSe tbody").html("");
    var _url = "/GWServices.asmx/RealTimeData";
    var _dataSet = "selectedEquipNo=" + confNum + "&&tableName=Set";
    JQajaxo("post", _url, false, _dataSet, _successfSet);
    function _successfSet(data) {
        var resultJs = $(data).children("string").text();
        if (resultJs != "false" && resultJs != "") {
            jsonTobtn(resultJs, confNum);
        }
        else {
            $("#tableSeLi").attr("lengths", 0);
        }
    }
}

//创建设置表按钮
function jsonTobtn(data, confarr) {
    var usera = eval("(" + data + ")");
    $("#tableSeLi").attr("values", "1");
    if ($("#tableYcLi").attr("lengths") == 0 && $("#tableYxLi").attr("lengths") == 0) {
        if (usera.length) {
            setTimeout(function () {
                myApp.showTab('#tableSeDiv');
            }, 1300);
            $("#tableSeLi").attr("lengths", 1);
        }
    }
    else {
        $("#tableSeLi").attr("lengths", 0);
    }
    for (var i = 0; i < usera.length; i++) {
        var userb = usera[i];
        var userc = new Array(userb.set_nm, userb.main_instruction, userb.minor_instruction, userb.value);
        var userd = new Array(confarr, userc[1], userc[2], userc[3]);
        var newRow = "<tr><td><a href='#' class=\"button button-big\" onclick=\"onSetClickBtn(" + confarr + ",'" + userc[1] + "','" + userc[2] + "','" + userc[3] + "','" + userc[0] + "')\">" + userc[0] + "</a></td></tr>";
        $("#tableSe tbody:last").append(newRow);
    }
}

//设置命令
function onSetClickBtn(str_1, str_2, str_3, str_4, btnName) {
    if (str_4 == "") {
        myApp.modal({
            title: btnName,
            text: '设置值：<br><input type="text" class="modal-text-input" id="setValues">',
            buttons: [
              {
                  text: '取消'
              },
              {
                  text: '确定',
                  onClick: function () {
                      if ($("#setValues").val() != "") {
                          onSetCommand(str_1, str_2, str_3, $("#setValues").val(), btnName);
                      }
                  }
              }
            ]
        });
    }
    else {
        myApp.modal({
            title: btnName,
            text: '确定进行操作吗？',
            buttons: [
              {
                  text: '取消'
              },
              {
                  text: '确定',
                  onClick: function () {
                      onSetCommand(str_1, str_2, str_3, str_4, btnName);
                  }
              }
            ]
        });
    }
}

//设置命令-确定
function onSetCommand(str_1, str_2, str_3, str_4, dt) {
    var vals = "";
    if (str_4 == "") {
        vals = $("#setValues").val();
    }
    else {
        vals = str_4;
    }
    var userName = window.localStorage.userName;
    if (userName == null || userName == "") {
        userName = window.sessionStorage.userName;
    }
    var _url = "/GWServices.asmx/SetUpdateS";
    var _dataSet = "set_nm=" + str_1 + "&&main_instruction=" + str_2 + "&&minor_instruction=" + str_3 + "&&values=" + vals + "&&usern=" + userName;
    JQajaxo("post", _url, false, _dataSet, _successfSet);
    function _successfSet(data) {
        var resultJs = $(data).children("string").text();
        if (resultJs != "false") {
            
        }
    }
}

//动态数据
var dynamicCurve;
//实时曲线
function curveBox(number, nameCurve, dts) {
    var curveHeight = 300;//曲线高度
    if ($(window).width() > 768) {
        curveHeight = 400;
    }

    $$.get("plug/popoverCurve.html", "", function (data) {
        var popoverHTML = data;
        myApp.popover(popoverHTML, dts);
        $("#poverCurveTitle").html(nameCurve);

        Highcharts.setOptions({
            global: {
                useUTC: false
            }
        });
        $('#highcharts').highcharts({
            chart: {
                type: 'spline',
                animation: Highcharts.svg, // don't animate in old IE
                marginRight: 10,
                height: curveHeight,
                events: {
                    load: function () {
                        clearInterval(dynamicCurve);
                        // set up the updating of the chart each second
                        var series = this.series[0];
                        var yVals = 0;
                        if (dataCurve[number][1] == '') {
                            yVals = 0;
                        }
                        else {
                            yVals = parseFloat(dataCurve[number][0]);
                        }
                        var x = (new Date()).getTime(), // current time
                           // y = parseInt(10 * Math.random());//Math.random()*10;
                            y = yVals;
                        series.addPoint([x, y], true, true);
                        dynamicCurve = setInterval(function () {
                            if ($("#poverCurveTitle").length < 1) {
                                clearInterval(dynamicCurve);
                                return;
                            }
                            ycyxRefresh();
                            //console.log(dataCurve[number])
                            var yVals = 0;
                            if (dataCurve[number][1] == '') {
                                yVals = 0;
                            }
                            else {
                                yVals = parseFloat(dataCurve[number][0]);
                            }
                            var x = (new Date()).getTime(), // current time
                               // y = parseInt(10 * Math.random());//Math.random()*10;
                                y = yVals;
                            series.addPoint([x, y], true, true);
                        }, 3000);
                    }
                },
                backgroundColor: 'none'
            },
            title:{
                text: ''
            },
            xAxis: {
                type: 'datetime',
                tickPixelInterval: 120,
                style: {
                    color: '#000'
                },
                labels: {
                    style: {
                        color: '#000'
                    }
                },
            },
            yAxis: {
                title: {
                    text: '',
                    style: {
                        color: '#000'
                    }
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }],
                labels: {
                    style: {
                        color: '#000'
                    }
                }
            },
            tooltip: {
                formatter: function () {
                    return '<b>' + this.series.name + '</b><br/>' +
                    Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                    Highcharts.numberFormat(this.y, 2);
                }
            },
            legend: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            series: [{
                name: '当前值：',
                data: (function () {
                    var data = [],
                        time = (new Date()).getTime(),
                        i;
                    for (i = curveDrop, j = 0; i <= 0; i++, j++) {
                        data.push({
                            x: time + i * 1000,
                            y: null
                            //y: parseInt(100 * Math.random())
                        });
                    }
                    return data;
                })()
            }]
        });
    });

    //var heightWindow = $(".fullScreenPopup").height() / 2 - curveHeight / 2;
    //$(".fullScreenCenter").css("top", heightWindow + "px");
    //if (heightWindow > 20) {
    //    heightWindow -= 20;
    //}
}