
function Voice() {
    var heightWindow = $(".page-content").height() / 2 - 166 / 2;
    if (heightWindow > 20) {
        heightWindow -= 20;
    }
    $(".voiceDiv").css("margin-top", heightWindow + "px");
    document.getElementById("voiceBtn").addEventListener('touchstart', onTouchStart);
    document.getElementById("voiceBtn").addEventListener('touchend', onTouchEnd);
    $("#voiceBtn_xf").unbind();
    $("#voiceBtn_xf").bind('click', StartViceXF);
    toolbarActive('VoiceTool');
    if (!window.localStorage.voiceTB) {
        myApp.showTab('#bd_voice');
        tab_voices("bd");
    }
    else {
        myApp.showTab('#' + window.localStorage.voiceTB + '_voice');
    }

    if (!window.localStorage.XFOffline) {
        window.localStorage.XFOffline = 0;
    }
    if (window.localStorage.XFOffline == 0) {
        document.getElementById("xfoffline").checked = false;
    }
    else {
        document.getElementById("xfoffline").checked = true;
    }
}

function tab_voices(dt) {
    window.localStorage.voiceTB = dt;
}
//讯飞离线设置
function onXFOffline(dt) {
    if (document.getElementById("xfoffline").checked) {
        window.localStorage.XFOffline = 1;
    }
    else {
        window.localStorage.XFOffline = 0;
    }
}

var isVoices = false;

//按住开始说话
function onTouchStart() {
    $(this).addClass("voiceActive");
    $("#voiceMessage_bd").hide();
    $("#waveAnim_bd").show();
    //$(".voicetest").html("已按下");
    try {
        isVoices = true;
        myJavaFun.StartVice();
    } catch (ex) {
    }
}

//释放手指并识别语音
function onTouchEnd() {
    if (!isVoices) {
        return;
    }
    //$(".voicetest").html("已按松开");
    if ($(this).hasClass("voiceActive")) {
        $(this).removeClass("voiceActive");
        $("#voiceMessage_bd").show();
        $("#voiceMessage_bd").html("正在识别…");
        $("#waveAnim_bd").hide();
    }

    document.getElementById("voiceBtn").removeEventListener('touchstart', onTouchStart);
    document.getElementById("voiceBtn").removeEventListener('touchend', onTouchEnd);
    setTimeout(function () {
        try {
            myJavaFun.StopVice();
        } catch (ex) {
            isVoices = false;
            $("#voiceMessage_bd").html("无法使用此功能！");
            document.getElementById("voiceBtn").addEventListener('touchstart', onTouchStart);
            document.getElementById("voiceBtn").addEventListener('touchend', onTouchEnd);
            setTimeout(function () {
                if (isVoices == false) {
                    $("#voiceMessage_bd").html("按住说话");
                    document.getElementById("voiceBtn").addEventListener('touchstart', onTouchStart);
                    document.getElementById("voiceBtn").addEventListener('touchend', onTouchEnd);
                }
            }, 3000);
        }
    }, 50);
}

//接收回调数据并上传至服务器
function callbackVoiceBuffer(dt) {
    //document.getElementById("voiceBtn").removeEventListener('touchstart', onTouchStart);
    //document.getElementById("voiceBtn").removeEventListener('touchend', onTouchEnd);
    var _url = "/GWServices.asmx/ServiceSetVCtrol";
    var _data = "audioData=" + dt + "&&userName=" + window.localStorage.userName;
    ajaxService("post", _url, true, _data, _successf, _error);
    function _successf(data) {
        var rets = $(data).children("string").text();
        if (rets == "") {
            $("#voiceMessage_bd").html("未识别！");
        }
        else {
            $("#voiceMessage_bd").html(rets);
        }
        isVoices = false;
        document.getElementById("voiceBtn").addEventListener('touchstart', onTouchStart);
        document.getElementById("voiceBtn").addEventListener('touchend', onTouchEnd);
        setTimeout(function () {
            if (isVoices == false) {
                $("#voiceMessage_bd").html("按住说话");
            }
        }, 3000);
    }
    function _error(qXHR, textStatus, errorThrown) {
        $("#voiceMessage_bd").html("服务器出错！");
        isVoices = false;
        document.getElementById("voiceBtn").addEventListener('touchstart', onTouchStart);
        document.getElementById("voiceBtn").addEventListener('touchend', onTouchEnd);
        setTimeout(function () {
            if (isVoices == false) {
                $("#voiceMessage_bd").html("按住说话");
            }
        }, 3000);
    }
}

function callbackVoices(dt) {
    var dts = dt.split('~');
    if (dts[1] == "False") {
        $("#voiceMessage_bd").html("无法识别！");
    }
    else {
        $("#voiceMessage_bd").html(dts[0]);
    }
    setTimeout(function () { $("#voiceMessage_bd").html("按住说话"); }, 3000);
}

function StartViceXF() {
    try {
        $("#voiceBtn_xf").unbind();
        $("#voiceBtn_xf").addClass("disabled");
        $("#waveAnim_xf").show();
        $("#voiceMessage_xf1").hide();
        $("#voiceMessage_xf2").hide();
        myJavaFun.StartViceXF(parseInt(window.localStorage.XFOffline));
    }
    catch (ex) {
        $("#waveAnim_xf").hide();
        $("#voiceMessage_xf1").html("无法使用此功能！");
        $("#voiceBtn_xf").removeClass("disabled");
        $("#voiceMessage_xf1").show();
        $("#voiceMessage_xf2").html("");
        $("#voiceMessage_xf2").show();
    }
}
function callbackViceXFMessage(dt) {
    $("#voiceMessage_xf1").html(dt);
    $("#waveAnim_xf").hide();
    $("#voiceMessage_xf1").show();
    $("#voiceMessage_xf2").html("");
    $("#voiceMessage_xf2").show();
    $("#voiceBtn_xf").bind('click', StartViceXF);
    $("#voiceBtn_xf").removeClass("disabled");
    $("#voiceBtn_xf").html("点击说话");
}
function callbackViceXFMessage2(dt) {
    $("#voiceBtn_xf").html(dt);
}

function callbackViceXFData(dt) {
    var jsonStr = eval("(" + dt + ")");
    if (jsonStr.sn == "1") {
        var strXFData = "";
        var ws = jsonStr.ws;
        for (var i = 0; i < ws.length; i++) {
            strXFData += ws[i].cw[0].w;
        }
        $("#voiceMessage_xf1").html(strXFData);
        $("#waveAnim_xf").hide();
        $("#voiceMessage_xf1").show();
        $("#voiceMessage_xf2").show();
        $("#voiceBtn_xf").html("正在上传");
        var _url = "/GWServices.asmx/ServiceSetVCtrol1";
        var _data = "audioData=" + strXFData + "&&userName=" + window.localStorage.userName;
        ajaxService("post", _url, true, _data, _successf, _error);
        function _successf(data) {
            var rets = $(data).children("string").text();
            if (rets == "") {
                $("#voiceMessage_xf2").html("处理：未识别！");
            }
            else {
                $("#voiceMessage_xf2").html("处理：" + rets);
            }
            $("#voiceBtn_xf").bind('click', StartViceXF);
            $("#voiceBtn_xf").removeClass("disabled");
            $("#voiceBtn_xf").html("点击说话");
        }
        function _error(qXHR, textStatus, errorThrown) {
            $("#voiceMessage_xf2").html("服务器出错！");
            $("#voiceBtn_xf").bind('click', StartViceXF);
            $("#voiceBtn_xf").removeClass("disabled");
            $("#voiceBtn_xf").html("点击说话");
        }
    }
}