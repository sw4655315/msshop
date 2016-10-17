/*需要配合iscorll*/
/*部分代码,以及全部的样式 由datepicker改制而成*/
/*插件仅供交流学习使用,如果侵犯到您的权益,请联系
QQ:337212522 , 将立即删除
* 滑动选取地区
* V0.1
*/
(function ($) {
    $.fn.areapicker = function (options, Yes_callback, Cancel_callback) {

        options.pcas = CreatePcas();
        $(this).areapickerHelp(options, Yes_callback, Cancel_callback);

        function CreatePcas() {
            var ProvinceID = GetRandID("areapicker_province");
            var CityID = GetRandID("areapicker_city");
            var AreaID = GetRandID("areapicker_area");

            var select = '';
            select = select + '<div style="display: none">';
            select = select + ' <select id="' + ProvinceID + '"></select>';
            select = select + ' <select id="' + CityID + '"></select>';
            select = select + ' <select id="' + AreaID + '"></select>';
            select = select + '</div>';

            var PluginHtml = '<div id="datePlugin"></div>';
            $('body').append(select + PluginHtml);

            if (options.areaArr) {
                var pcas = new PCAS(ProvinceID + ",", CityID + ",", AreaID + ",");

                var Value0 = options.areaArr[0];
                var Value1 = options.areaArr[1];
                var Value2 = options.areaArr[2];

                pcas.SetValue(Value0, Value1, Value2);
                $(pcas.l0).attr("Value0", Value0).attr("CancelValue0", Value0);
                $(pcas.l1).attr("Value1", Value1).attr("CancelValue1", Value1);
                $(pcas.l2).attr("Value2", Value2).attr("CancelValue2", Value2);
                return pcas;
            }
            else {
                var pcas = new PCAS(ProvinceID + ",", CityID + ",", AreaID + ",");
                return pcas;
            }
        }

        function GetRandID(id) {
            var successed = false;
            while (true) {
                var Num = "";
                for (var i = 0; i < 6; i++) {
                    Num += Math.floor(Math.random() * 10);
                }
                if ($("#" + id + Num).length == 0) {
                    return "#" + id + Num;
                }
                else {
                    continue;
                }
            }
        }
    }
})(jQuery);


/* 
 * 地区滑动核心库
 */
(function ($) {
    $.fn.areapickerHelp = function (options, Ycallback, Ncallback) {
        //插件默认选项
        var that = $(this);
        var docType = $(this).is('input');
        var indexY = 1, indexM = 1, indexD = 1;
        var initY = 0;
        var initM = 0;
        var initD = 0;
        var ProvinceScroll = null, CityScroll = null, AreaScroll = null;
        $.fn.areapickerHelp.defaultOptions = {
            currentarea: true,                   //打开日期是否定位到当前日期
            mode: null,                       //操作模式（滑动模式）
            event: "click",                    //打开日期插件默认方式为点击后后弹出日期 
            show: true,
            pcas: null                       //必须设置

        }
        //用户选项覆盖插件默认选项   
        var opts = $.extend(true, {}, $.fn.areapickerHelp.defaultOptions, options);
        if (!opts.show) {
            that.unbind('click');
        }
        else {
            //绑定事件（默认事件为获取焦点）
            that.bind(opts.event, function () {
                createUL();      //动态生成控件显示的日期
                init_iScrll();   //初始化iscrll
                extendOptions(); //显示控件
                that.blur();

                refreshDate();
                bindButton();
            })
        };
        function refreshDate() {
            ProvinceScroll.refresh();
            CityScroll.refresh();
            AreaScroll.refresh();

            resetInitDete();
            ProvinceScroll.scrollTo(0, initY, 100, true);
            CityScroll.scrollTo(0, initM, 100, true);
            AreaScroll.scrollTo(0, initD, 100, true);
            /*初始化完成 卸载已经选择*/
        }

        function resetIndex() {
            indexY = 1;
            indexM = 1;
            indexD = 1;
        }
        function resetInitDete() {
            if (opts.currentarea == false) {
                return false;
            }
            else {
                var Values = docType ? that.val() : that.text();
                if (Values === "") {
                    return false;
                }
                else {
                    initY = parseInt($('option:selected', $(opts.pcas.l0)).index()) * 40;
                    initM = parseInt($('option:selected', $(opts.pcas.l1)).index()) * 40;
                    initD = parseInt($('option:selected', $(opts.pcas.l2)).index()) * 40;
                }
            }
        }
        function bindButton() {
            resetIndex();
            $("#dateconfirm").unbind('click').click(function () {
                var Value0 = $("#yearwrapper ul li:eq(" + Math.round(indexY) + ")").html();
                var Value1 = $("#monthwrapper ul li:eq(" + Math.round(indexM) + ")").html();
                var Value2 = $("#daywrapper ul li:eq(" + Math.round(indexD) + ")").html();

                $(opts.pcas.l0).attr("Value0", Value0);
                $(opts.pcas.l1).attr("Value1", Value1);
                $(opts.pcas.l2).attr("Value2", Value2);

                $(opts.pcas.l0).attr("CancelValue0", Value0);
                $(opts.pcas.l1).attr("CancelValue1", Value1);
                $(opts.pcas.l2).attr("CancelValue2", Value2);

                $(opts.pcas.l0).val(Value0);
                $(opts.pcas.l1).val(Value1);
                $(opts.pcas.l2).val(Value2);

                if (Ycallback) {
                    var areaArr = new Array();
                    areaArr[0] = Value0;
                    areaArr[1] = Value1;
                    areaArr[2] = Value2;
                    Ycallback(areaArr);
                } else {
                    var datestr = Value0 + "-" + Value1 + "-" + Value2;
                    if (docType) {
                        that.val(datestr);
                    } else {
                        that.html(datestr);
                    }
                }
                $("#datePage").hide();
                $("#dateshadow").hide();

            });
            $("#datecancle").click(function () {
                $("#datePage").hide();
                $("#dateshadow").hide();
                if ($(opts.pcas.l0).attr("CancelValue0")) {
                    $(opts.pcas.l0).attr("Value0", $(opts.pcas.l0).attr("CancelValue0"));
                }
                if ($(opts.pcas.l1).attr("CancelValue1")) {
                    $(opts.pcas.l1).attr("Value1", $(opts.pcas.l1).attr("CancelValue1"));
                }
                if ($(opts.pcas.l2).attr("CancelValue2")) {
                    $(opts.pcas.l2).attr("Value2", $(opts.pcas.l2).attr("CancelValue2"));

                    var Value0 = $(opts.pcas.l0).attr("Value0");
                    var Value1 = $(opts.pcas.l1).attr("Value1");
                    var Value2 = $(opts.pcas.l2).attr("Value2");
                    opts.pcas.SetValue(Value0, Value1, Value2);
                }

                if (Ncallback) {

                    var Value0 = $(opts.pcas.l0).attr("Value0");
                    var Value1 = $(opts.pcas.l1).attr("Value1");
                    var Value2 = $(opts.pcas.l2).attr("Value2");
                    var areaArr = new Array();
                    areaArr[0] = Value0 ? Value0 : "";
                    areaArr[1] = Value1 ? Value1 : "";
                    areaArr[2] = Value2 ? Value2 : "";
                    Ncallback(areaArr);
                }
            });
        }
        function extendOptions() {
            $("#datePage").show();
            $("#dateshadow").show();
        }
        //日期滑动
        function init_iScrll() {
            ProvinceScroll = new iScroll("yearwrapper", {
                snap: "li", vScrollbar: false,
                onScrollEnd: function () {
                    indexY = (this.y / 40) * (-1) + 1;//当前日期索引

                    if (!$(opts.pcas.l0).attr("Value0")) {  //非初始化
                        var Value0 = $(opts.pcas.l0).find('option').eq(indexY - 1).text(); //当前选中的值
                        opts.pcas.SetValue(Value0);
                    }
                    else {
                        //初始化已完成  卸载 attr
                        $(opts.pcas.l0).removeAttr("Value0");
                    }
                    $("#monthwrapper ul").html(createMONTH_UL());
                    CityScroll.refresh();

                    $("#daywrapper ul").html(createDAY_UL());
                    AreaScroll.refresh();
                }
            });
            CityScroll = new iScroll("monthwrapper", {
                snap: "li", vScrollbar: false,
                onScrollEnd: function () {
                    indexM = (this.y / 40) * (-1) + 1;
                    if (!$(opts.pcas.l1).attr("Value1")) {  //非初始化
                        var Value0 = $(opts.pcas.l0).val();
                        var Value1 = $(opts.pcas.l1).find('option').eq(indexM - 1).text();
                        opts.pcas.SetValue(Value0, Value1);
                    }
                    else {
                        //初始化已完成  卸载 attr
                        $(opts.pcas.l1).removeAttr("Value1");
                    }

                    $("#daywrapper ul").html(createDAY_UL());
                    AreaScroll.refresh();
                }
            });
            AreaScroll = new iScroll("daywrapper", {
                snap: "li", vScrollbar: false,
                onScrollEnd: function () {
                    indexD = (this.y / 40) * (-1) + 1;
                    if (!$(opts.pcas.l2).attr("Value2")) {  //非初始化
                        /*地区*/
                        var Value0 = $(opts.pcas.l0).val();
                        var Value1 = $(opts.pcas.l1).val();
                        var Value2 = $(opts.pcas.l2).find('option').eq(indexD - 1).text();
                        opts.pcas.SetValue(Value0, Value1, Value2);
                    }
                    else {
                        //初始化已完成  卸载 attr
                        $(opts.pcas.l2).removeAttr("Value2");
                    }

                    /*地区*/
                    AreaScroll.refresh();
                }
            });
        }


        function createUL() {
            CreateDateUI();
            $("#yearwrapper ul").html(createYEAR_UL());
            // $("#monthwrapper ul").html(createMONTH_UL());
            //  $("#daywrapper ul").html(createDAY_UL());
        }
        function CreateDateUI() {
            var str = '' +
                '<div id="dateshadow"></div>' +
                '<div id="datePage" class="page">' +
                    '<section>' +
                        '<div id="datetitle"><h1>请选择地区</h1></div>' +
                        '<div id="datemark"><a id="markyear"></a><a id="markmonth"></a><a id="markday"></a></div>' +
                        '<div id="datescroll">' +
                            '<div id="yearwrapper">' +
                                '<ul></ul>' +
                            '</div>' +
                            '<div id="monthwrapper">' +
                                '<ul></ul>' +
                            '</div>' +
                            '<div id="daywrapper">' +
                                '<ul></ul>' +
                            '</div>' +
                        '</div>' +
                    '</section>' +
                    '<footer id="dateFooter">' +
                        '<div id="setcancle">' +
                            '<ul>' +
                                '<li id="dateconfirm">确定</li>' +
                                '<li id="datecancle">取消</li>' +
                            '</ul>' +
                        '</div>' +
                    '</footer>' +
                '</div>'
            $("#datePlugin").html(str);
        }
        function addTimeStyle() {
            $("#datePage").css("height", "380px");
            $("#datePage").css("top", "60px");
            $("#yearwrapper").css("position", "absolute");
            $("#yearwrapper").css("bottom", "200px");
            $("#monthwrapper").css("position", "absolute");
            $("#monthwrapper").css("bottom", "200px");
            $("#daywrapper").css("position", "absolute");
            $("#daywrapper").css("bottom", "200px");
        }
        //创建 --省-- 列表
        function createYEAR_UL() {
            var str = "<li>&nbsp;</li>";
            for (var i = 0; i <= opts.pcas.l0.length; i++) {
                str += '<li>' + $(opts.pcas.l0[i]).text() + '</li>'
            }
            return str + "<li>&nbsp;</li>";;
        }
        //创建 --市-- 列表
        function createMONTH_UL() {
            var str = "<li>&nbsp;</li>";
            for (var i = 0; i <= opts.pcas.l1.length; i++) {
                str += '<li>' + $(opts.pcas.l1[i]).text() + '</li>'
            }
            return str + "<li>&nbsp;</li>";;
        }
        //创建 --区-- 列表
        function createDAY_UL() {
            $("#daywrapper ul").html("");
            var str = "<li>&nbsp;</li>";
            for (var i = 0; i <= opts.pcas.l2.length; i++) {
                str += '<li>' + $(opts.pcas.l2[i]).text() + '</li>'
            }
            return str + "<li>&nbsp;</li>";;
        }
    }
})(jQuery);


/*地区静态数据*/
eval(function (PCASClass) { var d = PCASClass, p = d[0], k = d[1], c = k.length, a = 62, e = function (c) { return (c < a ? '' : e(parseInt(c / a))) + ((c = c % a) > 35 ? String.fromCharCode(c + 29) : c.toString(36)) }; if (!''.replace(/^/, String)) { while (c--) d[e(c)] = k[c] || e(c); k = [function (e) { return d[e] }]; e = function () { return '\\w+' }; c = 1 }; while (c--) if (k[c]) p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c]); return p }(['8 10(){B h=[],b=A.5,i,w=0,v,u=10,g=1P,p=8(s){B n,O,i,s=s||0,k,z,F="u.c,u.P[g[\'Y\']-1],u.I[g[\'Y\']-1][g[\'1O\']-1]".9(",");7(k=s;k<b;k++){6(w&&s==k){k++}7(i=0;i<b-1;i++){g["i"+i]=g["l"+i].1N;6(g["n"+i].5==0){g["i"+i]++}}g["l"+k].5=g["n"+k]?1:0;6(k>0&&g["l"+(k-1)].5==0||g["i"+(k-1)]==0&&g["n"+(k-1)].5>0){1M}z=1L(F[k]);7(i=0;i<z.5;i++){n=O=z[i];6(n==g["n"+k]){O=""}g["l"+k].K.J(H G(n,O));6(g["f"+k]==O){g["l"+k][g["n"+k]?(i+1):i].1K=1J}}}w=1};6(!u.S){(u.S=8(o,e,q){C.1I?o.1H("1G"+e,q):o.1F(e,q,1E)})(X.C,"1D",8(e){6((e||X.1C).1B==1A){1z("W "+u.e+"\\1y 1x 1w 1v 1u 1t(1s)\\1r "+u.d+"\\1q://1p.1o.1n/1m/W.1l\\1k 1j(1i) 1h@1g.1f")}});(8(){u.e="3.0.1e";B j,O,y,T,i,s,a,N,t,o=U.R(1d);6(u.r.1c(o)>0){j=u.r.D(/([a-u][0-V-Z][0-V-Z])/g,8($1){E U.R(1b($1,1a)+19)}),O=j.9(o+o),j=O[0],y=O[1].9("/"),T=O[2];u.d=O[3];7(i=0;i<T.5;i=i+2){j=j.D(M(T.Q(i,1),"g"),T.Q(i+1,1))}7(i=0;i<y.5;i=i+2){j=j.D(M(y[i],"g"),y[i+1])}}18{j=u.r.D(u.d=/\\d+\\d\\-?\\d+/g.L(u.r)||"","")}a=j.9("#");u.c=[],u.P=[],u.I=[];7(i=0;i<a.5;i++){u.I[i]=[];u.P[i]=[];N=a[i].9("$")[1].9("|");7(s=0;s<N.5;s++){t=N[s].9(",");u.P[i][s]=t[0];u.I[i][s]=t.17(1)}u.c[i]=a[i].9("$")[0]}16 u.r})()}7(i=0;i<b;i++){h[i]=["l"+i,"f"+i,"n"+i,"m"+i,"x"+i];v=/([^=,]*)\\=?([^,]*),?(.*)/.L(A[i].15());g[h[i][4]]=0;g[h[i][0]]=C.14(v[1])||C.13(v[1])[0];g[h[i][1]]=g[h[i][3]]=v[2];g[h[i][2]]=v[3];g[h[i][0]].5=0;6(g[h[i][2]]){g[h[i][0]].K.J(H G(g[h[i][2]],""))}6(i<b-1){u.S(g["l"+i],"12",(8(i){E 8(){p(i)}})(i))}}(g.11=8(){7(B i=0;i<b;i++){g["f"+i]=A[i]?A[i]:g["m"+i]}w=0;p()})()}', '|||||length|if|for|function|split||||||||||||||||||Data|||||||||arguments|var|document|replace|return||Option|new||add|options|exec|RegExp||||substr|fromCharCode|||String|9A|PCASClass|window|i0||PCAS|SetValue|change|getElementsByName|getElementById|toString|delete|slice|else|9700|32|parseInt|indexOf|26|140215|com|21cn|zhadan007|333|Cui|nYongxiang|html|script|net|popub|www|nhttp|nDataVersion|JS|Selector|Area|City|Province|Of|nClass|alert|113|keyCode|event|keydown|false|addEventListener|on|attachEvent|all|true|selected|eval|continue|selectedIndex|i1|this'.split('|')]))

PCAS.Data = "a68$qDIy{{g9PyK1yMg4B@hUSyZcQGhLRyf2R@aysKMa35y5y0yeGSgFGypIJzqDI~dF2O~e8Ie529#cQ5hQ1$qDIy2yyye8Syym5UgK1ya2PyVyhQ1yqECy6PydDPcCNyi84zqDI~~sBL~nNR9#uMie50wHygK1ygK1y]ya5Hs35kGRyoNH]ya5Hs35~hBVX~gIQ[oJ8bPC~iKHdGR~bqLD~i0DhOP~pRQk53~fVSgCT~~aQVhHB~pSH~qDNs72wnUTwg37wgwu4RlxbPCwq0Byq0By_aUIye8SyKyKhU2yg8LcSVjQKyi82~i82~ga69~qET~jD5jQC~qKHQwqETxl02k53<wcyaSFyf2GyVi7T.5u7A~f5M~bBU^qMBqOKwqMB@a1N1ycP90ydOCdOCkGRyqMBqOK~DiAF~f1C~bH9~hT5~kMT~mM1m~Fe4G~qMD~u1ThOP~n~sT2s4I~tBB~g8EbK4~6xqLU1wgK1ygK1yqLU1~D[aT1a1K~gFBm~odI3~a8N~2~g37~e04u4R~~ndDJ~m~d0T~P~D~dE7wjxaFPXw}}}i7T[Pn7D~hTQ3~s1O~eDC3~X0~bPC~b~dEL[hTQB~g9NN~~g1F~g8E~oHT~sKM~bBMqVA~s70~hURwXwdwbkLDe5Jxe9SiRwgK1ygK1ydDVQya17n6Dc89ydDVQ~e9S~e6JaFP~hMPB~dHMa35~nPM~p~eGS~a13aS4~eGSgC1~hURu4R~pS0[dP3kQO^f4R=wbF8gK1ybF8i82yu4Cf37nI1qkGRyf4R=~0o~l~i82~oQ~Ki7T.dEPi7T.c8GcAMi7TnLL_?hM3w]yqFCyhM3~V~aR5~0~k7C~mKV~k6A~bIGgK1~jAA~dBRgBDc7Q.hN6cQGwa8Na1Kwrt51ws0Gxe76cB6wh9Tynyc8M~FP~sTL~[fT3~bCUc7Q.sAKwa15xoJT3wgIV{gDVeAM~6qLD~6eAM~sSI~~fR1[g4B~s1O[aSSwi0D#ucQ6pwdHBe5JyqFAhOPygBBn6DdM9ydHInB5cC6ya13gFB;yg37ByPeDC~g8E~d10iO2~_a60xbH8w{kGRyqN6ynBVyb~cQ5s~niKH~iKHa1K~hRDB~e02O~bH8^lw{kGRyqN6yX~k6U^HhMNw{qN6yHhMN~oR0cDV~dKBjRL~sKM~u7A[cOIaSF~Hq~6m~hKT~hKTB~iBQxg37w{hKT3~[L%~hOP~bxg9Gwg9G{tKTys2G~e5G~bGFjD5~eGSa6T^g37&wgT2h9TygT2kQQ~e02gAV~2sKM~g1G~dGR~cQ6pIJ~kQT~qK1~iKHM~a77a9DxqFCwk7C8yDj9J~a13nBV~s0NbTO~l2J~m7N~m7N~cDVg8E~cPB~s32~n6A[FhRAwhQ1xeGNweGNe5OyXoR0~a5G1~a7V~m2TdNL~6~sBLg~kRQhJS~a5GdG4~dLUdLM~g8E~aFP=~aJBaSF~pxDhKQwdI3Nyg8EhKV~mGO[oR0hKQ~hQ6hPQ~_~hOP~hSA~Y~m~~s6C~F2~nME~hKQ~aEBCws99xbHHgKTwkUNMyfT33~a60[0~D~gGF;~MgSO~dLM~fUL~&~a60R~dBPa35whKQ#aT1nLL_ bAM$bKO2hS5Iw{c7QhHDyjD5lypRNmBHyc9Ru7KIe02vf3K!f3K~2;gIO~P3~6%^b91cQGwyg12Na7DyV@Mf7CyeOqOUbBMkGRya3Ppyc9Ru7KIbGFvc8M~fmBHn8Ug1AmJGbH4fVJ|Wwb6Vi4QyyWfzpS0dOCwm5U@aQVdDP@gCQ@EtKTkVDhKTv4;e02v4;bGFv;~!a6S!mSQvmETj3NIvbSSbT3hKTv[fRIhJ5fVJ|aqEPwkVDhKTykVDhKTe02mGO&vkVDhKTe02mGObHAve8StKT~e5FaA2vcR4g8Ovf3AtKTIvs99;qO9b7ExqOUcPM:wmNOyf7IvaV2gIOvqOUf3K!b39vqOUf3K!vgC9rQ2vWdDTva96>s99hPNfVJ|bKOaA2pPPw7yf3ApR5pGMyEnBVvnE7b5NfjO2ffTT'vqOUaA2g21 vqOUi25!'vs344o3Av4o3Ae02v4o3AbGFvi7ThQESwj3L!Mwf3AGdKBwsLP_m6FwgILx4eC2hVIwDya5Gp~kOGR~W7Ib39vW7I&vW7IbHAvgC9rQ2bHAfVJ|WGdFRtws72ybBFpR0~Q=~bR2N~02~aV5[dFRkbGFmGOb39vdFRkbGFmGO&vdFRkbGFmGObHAvc7NqjD7vKsx0k7R,WGhS5IwEwkVDhKTbGFmGOb39vkVDhKTbGFmGO&vf3ApR5Ivl4Tl^rPT;qO9b7Ek7R,a58qFQhS5IwrPT;hS5IwE4c1Avn7BAIe02vn7BAIbGFvWjFSl32hKTvWjFSl32hKTvcQ6a72dGMvrSIrvhBVrSIevhBVnNPvcPMaA2^E7bT0k7R,E7bT0e02vE7bT0bGFvsLPhRAm6FfVJ#qEPuhL4w2yhL4yyk53cVDyrMTyn7BidKByLyhL4ya5AhQ6yqEP&~e6J~hNHe5F~hHDxqFQw&@dLJyjRyjPKa5HqyfV1sKMRy>yH~jO2f2Re5Jwg4AGe5Jwe50xsD9wrMTyrMTyl77@bAV@1~dM7dM5i7T.xf5MsKMwf5MyhQEyg9Nn6DysKM{f5MsKM~dEQi7T.Ppi7T?gA8Jw@J8yg1A@n68ygA8Ji7T.gJFa6Ti7T?a2LwaQVdDPyfAB0yfABydEPjQKi7T.cwb00xrQ2w_cJGyaV8ycQ62yu7D~a35~aV8wsxnI1Rwl7Lb39y}tL1tKOc94ymGTqELyk7IwMgK1xs1OwyqMDycQ6yPZym72ys1OnLL_.eCC6^qEPwecJGyfT3c9VydDBa9Rye9FHdM9ycQ6qyqEP~iKBcJGxk7KrQ2wbF81qy0o1yhQO~k7K^rMTdM9wrOIyPyrMTdM9~K~5c8Q~pGVaSHwe8Spxg9PwbF8cJGy{g9P~e8M~bSSbT3hKTe02mGOnLL_.kS4waV8BxnK7n62<wqFQ@cykS4ym81&~e8M5~0#Y;uHg21waSFydEP{g9Pya58qJFym8Rc89ybF8yaTO~a3P1wgT2gHDw=eNSxY;w5qLDyiC9yn2LnI1yKi7TyFY~o7RwgK2jQKwn1EGwkNCMxc7NwrMTyrMTygM4gHD~a96ai7T.aS8a2NdM9wbF8qEPxqEPBw@yK~qEP^aQw5ya58qJFyaQ~qD5~gGF~gL1Rws72xewhRDyByf5MgCQ~sBIdD3~Heg9PtLO.DxgCQpwyb39qO9`:nLL_.HdM9~a4Q~f4IaBLxewhQAyspR5~agT2~hQAwxe8IqELg9PtLO+e8IYwc8Qa88wfS2QwjGEg21wa5Hw2whK6P~c8Q9#u7Duki84wqJFSydLJyqJFcPIyf2RygCQysTLcB6ybKOGyE{aDPG~fULhBV~dEQ~4eC2~gA4G~a~e8IdGR~bF8wdHMeFJwa5Ge2KxuBCuBCkwjye8M]yrMTrP7yg0Ug0UJydF87cGMykMQq@gL1S:ffTTy~aDP~hOCgC1~jPK~dF8oNH~!~!~f7Ol~pEJxu1Twu1TaTSyeJE@i8GqJFygM4gHDyqyu6N@u1T~o3A;wdF2xu40dLJwbHDye01aTOy@0y@0@nHP~m81i84^bF8u29wdHI@dM9yc7NfUL1ydDP@s72pQ0~bF7pH6~dDPP~sSI^e52wnI4c8Qyb00ypE5mNTq0Bym5UdLJybH8ymL3~mL3B~;jQK~gBOaABInLL_?a96g21wa96g21ydLGybF7cSPy;ymFSdO2yVymDAJy>dKBya5GnI1yWCyhK0g0Mye22dM9yWa96dM9ym5Ug1Rya16jPKdM9yc15nC7~rMTb5NxaCFgA4:wbHDyb39qFNysNAyqN6ygK2~gK2%~hK0p~f5MqFO~bH8wdF8rQ2xa0V1w0ygIV@n90qyb6VT^j3Ta2Lwyg1Ayj2DhHDyy~;R~m81n68w;wwl32gODxu7Dwj2DqD5yd85~qH6!~dBLbIG~wa5GqFQhJSxm81Qw;yg9NcRA~G~VaT4~e52~g1A3~m81gOD~fwmL3waA2x0dM9cACybKOjDN~cJG~i9S9#a16$qDIyrhS2yeDChJ3yHysBLyg4As2Sys0Kyo4LRygC4hS2ys0HoJ8ydDP@c15XyhS2y>@gCQyVhS2ycR5pQ0zqDI~dP3g1A9#n7Bua68wjD06yl02i0Aye8MqMMyu9FgSOyhS2RygHIs9Qys84n6D1yyaS9bH4yi633ybi0FzfVSrPTwdP3yHycJKyrPT@eNS@i848ys2GwdDO0xeDCwu9FgSOyOypQQhK6yl@rNO@K~hLN~kBU~hKUwqMFxe2KwcQ5yrLRgSOyf1McL1cICyy6qFNyi63w>cBNxn7Bwo3Aa1KybIG&yk8K{cVDn7BybIGye2KiTRwe9Sicwg12wcQ6a7FxawdP3%ycs0Kyay~cSU~bIBwcSUk57wZxqFQOcwqFQOyhS2yypRVgT2~~iJ8O~iJ8^i0AwPyi0Ayi0As2GyPhS2yhTR3~hQ6hOP~k8Dk9L~>8^k7Cwa698yk7CNybN93~i84~s1O~dH0~e8M8~1wKxf48wnLyqLJyNydDPe5G~a86eCTwbqMAxswa68RyhU2ya2LeDEya2Lwf48&wbG1dELxhOCwLybcycVOcICy0QwsBIwhOC0xdERqETwdER{dERpK7yhM9~hNJ~hNJhQ69#hRLugC9wa16{a17{e4Eyf8DcL1y8yi84ynI3@aBLgC9ygJCe5C~i0F~e8M=wdF8wDxhNUwg7Lyyya7DysyqPQypJT~~aBLcVMweR4JwcR5Qxi25wu4R{i4QyjOByhPQcQG~Fc15~~n79~fT3f1C~hOCsKM~jJQwgPxc150w8ykUShQEyc15bT0~k7C~w8wgJCmx8wbIG0yhRGy=P~H0~Y^m790wpT6{gGBgK1ya16o3Qy5~pGKg64wdR6x>]wd4M{>y6a35~hS2~kNC~GJwa35WwwFe6JxoJUwgGB{oJUye2K~e8SQ~i2K~xn1RwXyg4As2SydMD~dR6hNJ^1wgPEyrdM5yq0BgK1yjD5jEB~a15Z~cQ51~a7LdJ1~i25dM9wDxa2P3wnEENyVjQC~m9LO~qIU5~gCQ~O2~e52aQV~g4BjSE.l#eEPubH4mM1wjKIye5Cyo8S@b91yHK~mM1~mM1~e5C~dVU8xn5O8wrRO8ye97yu1Sya15@n5O8~m2T5~L~fVSa2M^o58cFSwq8yo58@kULa9Myi0Aa16yeGSqFO~a5G~c8Ms^i0AwayjQCie6HypHUis72yaS7aS8@iBKs72yb001^CsD9wn6D@s84@bBMg9NyeBFhSU~bI7~2^i0AwgBOs72yk8K@iN4@iF5J^rNOLwrNOdDK@j8Aq@qN6yrNOL^e52wqFAyoUUydDOkUSyeGS~gDQ~iBO~cQ68~dERgCQ~g9N~dMF~gJCxrwdKBJyr@eEPyhBL~a9D~u7R~kQTZ^i6TwjH1jH6ypIBygC1~aS4gPE~XqFO~b00~cQ5Hwg1AaR5xs1OwsL9ysL9ysL9lyDl~cQ62~s1O~sL9a16~jR8sTIxdERwcF3gK1ykGS~nI3~iKHjM3~hNJ^aS9w>yoNHydGR~s99qMD~n1E[>dG4~s99^a6FwpIB{hTT~nLL[TqDN^hJSwpQHhJSyn0F~M1~V^dDVwdDVyqNAJ~n=~hOQ~m85J~fV8=~d#kTBe8MukTBwu9FgSOy1ya7F@CdIQyg37ys0PaEB~qFQ~`B~s0PP~FhOC~iC9~kTBPwHgxbE2ZweHPg1AyhM3y8Sys72mDAybH8ymFGznD2jQCwbDUyhUHynBG{kUSdKRya7Li2K^a15g1AwgL1b1Jya15aQVyg1AJ~PhQT~Q~jQC~dI0J~j~dH2g~hOC~e8M~FxlwtM0{KhOPyhPNylcyeNS~J~Fg21~=Q~>Z~Mj8Awg37wxiAFwn5J{fT3yOs90~iAFhS2~pFB~HhOC~~sBI~2~]~xwe8IysKM5~hS2[aR5hOP~gCQJ~fQR2~qMH6w6cQJwe8MjOBwe8MxdM5w`yHhIS~FX~a16gC9~6~qFQ[iAFx=wnR5{s9QhS2~_jQC~dJB~dGR~bK4~gFKnBV~kTBwkTBu9A#u5w8y8yVOpIDyi4QSyV8y5~e8M~a35~qFNpQ0^g4B=sw5yjFS@hSAgKT~gxnH9mwByi3KynEEn6D~a16gHJ~n62J^a3Pwe5C@hRGya3P~6~aGA3~FaGA~=~g1Rq~N5~8R~eC9hOP~jJQ5waSDVxaBLwi1P3yb12dDO^u4CiC9wg948yaBL~pQHJxpRVwl7SpPTye6JypRV~aFTK~aBL~a16j6L~dP3a35~qFO~~X~aS4~N~a5AN~0d~a9M5~dGNW~M[jJQ>xYwYyVpyY~Y3~dNT~e4E~FK~hOC2~qIU%~a13~kTB~F~a5HaT4xdDOg21woKTycR5~a13qCP~a16b~dDOK~sBI~rNOu9F~Kwh1RgHDwbxf5MwD%y[u7A%~K~dP3a6T~g~dDOr~>J~pR0J~m~n5^a16sSIwaFTya16sSI~nK~jD5~rN1~h26dOC~e97~aBLe4E~qQD~a13e4G~d4MB~=0#uhRAwbD2a17y&ygVCnC7ycQ5gK1ybD2{HPys2G~hRA~bR2~l7Sa1KxV<wyyr<ydOU@gBAhM3yymOIwbCFcM4we62wnEDxhV0bBMwhV0%ye9Se5JybBM@DhV0ybK4gBDygJF1~bV~hKUB^gDVe50w&ynTN{dN0{1aQRe50ya69yi7HxnI1wnI1yRycE2T~ThQ1~nsSI^iNR1wn5PmBKykTB@j3RynED@H<~RwnEDwnEDwnO8nEDwf7NqFOwgHIs9QwxiB9cB6wiB9{dFEa69ycB6qycRAfT3yDg9C~5g~VwpGKwdGRaR5wa1KwbdF2w5qLDxhRAwa8N{aRIyeEA~tKO1~>m~c15kS1~hKIa16~hNJ3~gKT~g8Es1OwqMLxhOCwhOC@dMDdMFy~~hOCwmM1xd0TwjEBmFSyfT3k4NwnBVf1Cwa4Fxg01iS3wcydLM@a5GnEE~nDE^nEDn5OwnED{rLUzDhKUwG@`e50yyhKU~qOB[hKU3~n79~pQL~qLD~nDE~nLLs2G~DhM9^=w={L~hQ1~e52O~DqLD~uBC~p~cPBhQ1~6[gLwkULxmJ6w5e5OypIJ~nDK~n98~E~aTS~bbPC~DPxi84wi84{eNShHD~aFT~fVSgNV~hMQQ~bBM0~qML^nFBhOPwj3Ta2Lyg8L~bBH~f1C6~e04qVA~qNF[qP0[Xs4I~g1A9#uqNDw&pya58a0VylDTc7Qy>3ya16oJJyeNShRAy&j3R~e05a35wnC1wdF2wqNDwk4NdGTxe8SdGTwa69ysKMc7Qyu9FgSOykULjD71y>g1AygBQ~apEK~dH5hHB~e8SdGT~GmGV^hPNwmGT{e01yiH9c7QyhU3yYTyhPNydBRhQ1~~gIQ%~dS5~hJP~dDO~hPN~a96%~aIVe14xsKIw]ybC7yMyi3NydDPK~bGI~tKT~qNB~n1QrLUwhJPxwfT3dOCyaSFyhEJNyy~hK0s2G~i7D~aT1r~;xu40cMTwu40@{hV3i84yhRM~hV3^mwm5UfVJybC7i84yb00lyj43qVAym~nEJc15~p~e8IhQ1~dGTa1K~HcDV~bC7qD5wqD59xiQ2aBOwoVVfQQy&l7LyCgBDyyaGA6~bBMj2D~6s3R~i25~hKTwdBRxiGAw]yPK~g~n8V~1b39~iGA^pEK5wtBBNypEK5~qPUL~oR0[kULwHnJNxiABwBhJ3yqOQ{bG8Lyn1Q~DsL9^a15ZdNTw8i84yi1DhJS~s3H~bBUhHB~a35CwiKHdDPxwdDN{bC3ybG8~fUL[dNT~s~aT1m~hV1%~kQQfVJ~bPC~qVA~gJCgFB~qLFxbR2a1KwgKTc89ykBUyhHDgAV~kBU~L~gFK[o3Q[cPBqLD~FxaFTwhR5ygK1y`~aR5~~bR2[c8McV7~iBU%~i0Ai84~eKB^bK4Rw%hJ3yf4IhLR~]~bR23~hL4a1K~qOK[i0A~cQ6e6J~u4RqLD~sKLxt4NCe5Jwt4R{~a16nPT~n12~hBV~kKA~hN8~hJP~qIU~nPT^k8Tk8GqDI9m63oJ8fQRbAMb1E,hRAB#8u6hJ5wdMKyhJ5ykJMRyhJ5y65yV@hQ6@8yhJ5ynPTjQKycPByrs2UyhQEzrMwrMcycJQ@a17s32yrMT@~aUIxbATcICwn91lE9ye9Si4QyqO3~qO3~l8L~l8LJ~f2R~a2LRxdDO5wLya99idLJyiMLaTNyj93a69ycQJLyqFO~0~l09eBE~Hc9Ri.a5GdOCc9Ri.dDONweBFwgDPxoR0woR0{h16{oR0yiAF~pIJ[aFPe6J~mGTRwgDVwdDOxqOUwgKTq8y]dELyqOUznB2ZwdDPyfD3b0Sya68~jhP7~rLRkS1xdBPePRwdBPydBP5~eLR~OgM2~e5Gws32whJ5%xnB2wj}nB2yaS8~k7DT~L~MsTIwhQ68wgCQi77xraT4wryc7UsNA~m5U~`jQC~n8D~hRS3~nSEg21~rgL1~u6Nw6l4GxbMKwbMKyc15tKO~a[dP3~a~pS0cMTxs5Bwg8QNys5B~n3xeK5fUPc9RiU+eK5fUPwT%we8McV7~4~dDVeK5~bMKK~gC1b00~u40dOC^k8Tk8GqDI9m63oJ8fQRbAMb1E,a7LgIVwiBOwcQ5ZwkRQaTOgEI;bAM#8uHjwn5LnN5ycQ5eEVydMFu5Fye8SkTBys84n6Dyg9N{Hj~m~hRBxgI6hQEwnCJcJKyn62hVQyMdOCycQ5aQVygI6hQE~fQK~nAIL~iLAL~qUGLxi3KiC9ws848ydMFcJKyi3KiC9~i3KmwsGIxoJTwjFSg3Iys6TdOCyMu9FynMKi3KydMFyoJT~oJT~oJT~oJT~kQT~mHEwe2KxqMHwbF8PykS1ycJGyqMH~qMH~qMH~oc7Q~hPQR~m81~~hC1U.6aT4xdMFwdMFgSOyOJybHN@dMF~]dEL~i3Ks2G~~hK4`wDi3Kxe2K=w6Lyu9A{m~hJ5dGR~iE3~DiE3~gIVB~MZ~hQ1xe9SijR8wFXy6LByeR4T~gJDgP9^k76wpR0ypS7@~gIV~Q~hL1xqOGw8yn7Ba7LygIU~dDOl7S~F0~c15kUQ~D6~hJP[gIU~a6T~pR00xFws8ILyaUJ3i85ykQT~~bF8j38~qJF~F~qFO~nNP~jQC~]jKI?eGSQwu40{&fUL~hL1L~qECJ~i52hS2~a9MbH8~u6NU.g2VaDJ.n6JaDJ.sBIUaDJ.aqJFaDJ.hQ6xd10e5Hwd10g1RybF8dOC~Q~aUJ3whTRBxi3Kc9RiU+YsTIwhOKJ~b00b0C~n6DcDV~aFPsBI~_a14~FsKM~9#nunwnBGi4QypT6kUSyjFSycQ5yeOyrcFGyjS6kUMyn6DNyjynHPdLJycLQwa7AQxsGIaSFw6yhR4yg8EycV70~a6TQ~mETB~a4FBjKI.K~g5ws70xi0DcAFw`8ykTBjQCy@dDPydLJyk7CjQCzjFSwsTLhQEyfTJZy>i4QzhJHcQGw8y>yiFSyiCAyiCAyiD0yiEF^aBNwkT1{ysKM=ya153ybg1AzZwnO8yya9My1we8Swu40weK5xi3NwpS0cBAys9Q@cBTcQGyu6Nl7SyqIUJ~eDCs0N~e75ws8JwbIG%xn8UbH9wn8Uyn8UcyjQHe~bwQwaFTdDOxmL3e52wl8Byu9A8yn~eGSs72~dGTe8S~=e52~boSTwc7Na9MxeNSweNS{eNSybBM`~eNS~Z^gL1wgL1ygL19ycFG~KsKM~a5G]~qFO~nR5dM9~0xhJHdIQw{K~s32~s32KxBwB{lQ7>~%~qFQ~2~B^w{~~g21xPqFOwP{PyaBNaT4~~qFQcOAjKI.qFQjKI.n8D=wqFQxnDQx&xiCAwi3KgK1yiCAysSI^fG9wgTH{fG9yfG9~eNSgC1~g4AxOhSAwO{0~qMT~O~`X#ncOA'bAM$w0yVkUSyymcJKyn4Be52yqLHy6u1V~o~C~a16;~dEQ~h26^gGFw&ytKOdOCygGFygGFygGF~gGF[u4RdG4~oD9~oD93U.a15aDJ?gIU;wkUSdOCybFSeC5ypJT@a0Vg1Rys6T@DgIUyg9G~iKH%~aS4~0~FkTB~iJ8~mNObH0.pR0B~g~nBGhS2~eK9jKI?gM3wa13kUSyHhQEycA5yn79gM3~o00~nLL~dLDJxw{rOIyrMTcybH4hS2^s2EcwcRys2E{a16eHP~0xrM2wrM2yrM2yiKH~hS2^pQHcwcycyoSVcJKy~gIUxjD5;wjD5ykTBm8HydEL~s32%~bBMe~0a1M~hQTxk4Qn4EwbGFyjQC~jQC~gDO~=aFP~sBI~qLVcBT~aV8O~ga1M~jQC;~;~o;bH0?pQMwaS7hC1yg29~rLR~dF8%jKI?hJSw>ya2L~cQ5dO4~b00~G~`a87aC8.jEBhFN.4CjKI.NjKI.QjKI.dDOxgC1dEQw0dEQyeGN[pJT~6dDV~>kUSjKI.bH4xdP3e02wyf4Im81~g1A~~~cQ5lB5~b09kS1#uRwkUSn8Dy]yjIO@mDAGza15/wqDIza15jwqDIzk8Tk8GqDI9m63oJ8fQRbAMb1E,a5Gf93wjIOwaP7wfT35wa13wfULwX~dKB5~iD0qF4~Db~eju7A.5u7A.gu7A.L3u7A.aFPa69u7AU.jIO&u7AU'9#qV9e52$qDIya13yhU6Lyi1P&yi1TRyyjcC6cBPya3PcBTydMKykLMylU2ypUFyi1Py4yu7GyHdGRyhQ1ybH4%yF%y%zqDI~iCO~rNOgKT~nBV5~jM3~gKT~R~KN~cE7~6o~eFS~e8S~O~cR5n4U~e07~e07J~MgGDc9Ri.kUSc9RiU.qR5c9RiU.eC93Uc9Ri'9#c7N%uf1CNwrQ2yVmD6y>j3Ny6aEByf1C]ylt4RyVeyNyi25y>cGU~bF8hQT~qO7~qLD~nME~hQ1~NcICweC9wqLNdOVwdP3xn06pPTwn06hQTa5HypPTa5HyyhMRi85ynBV~dF8sKM^fOSgDPn6Dwyya6T2ylKFg1F~k7CqEL^hOKwym6FJyCiC9yhOK~bH4~bFLF~_nQM^=wfV8y&~`~nhJ5wa6SqLTwm8Hl8Lxm8HwhU6{i2Ka7Lya151~k7Ca69~~gLFiCO~%mD8.6~hMLxnaQVwTyg29Qyg9PcQ5yg0Mn79~V%~b3Ds0T~n79J^qIUwn2L@dJ1ynO8J~dH0hQ6~n8D^aT1w&y0yd0TqFO~pR0&~o5^gw&yji4Qya5GagK1y>Ryj59a2M~a5HkHG~cQL~hLC%~dO4qELh.CqELh.dO4k95xaR1wsKMe52ybcC6yc15LyqO4~nI1~nO8~a86s33~aR1~s12&xk95wcBTya6TdGR~eC9~hQ6s71~a2LgOD~VkRQ^dDOdEQwmFSdJByJydDOdEQ~~H~b~jFL~lBSqFQ~0fT3~dJB^nwnyb39rP7ydMFhJS~6mNO~qMN3~]nO1xfwa%yf%ydDVhJ5~e8S~l8L~i1S~a13Bxs71ws84{bH9@nC1m7B~hJ5B~MgN5~cQ5aS4~n62~dDP0^4&w4yeK5ya~~5^pR0ws6TydMF~gn0F~lCSxEcBPnVBmD8+hKI%~jH2~n8U~gCQiBK~a3PdG4hLR~>%~dHB>~u7D3~Ce6J~cO0cJK~EcBP~n81k7I~m5Up^jPKdBOnVB+e6JX~hOKX~a2L4~a3P~s71~qJFdBM~iL5s99~jPKdBO~~=gIO~ejD5~Mi1S~n4Ef~jH2cJK~4cJK~m[l2N[eDJnBV^aV5h+5wgA4SnVB.k7CB~=5~a9MjH2~a9M~~g4AgIO~tf7I~>~g29oV5~bTO=~aTH~pT6~jPKhPN~mDAcVD~s8JhNU9#pQHupQHwg1AyOdM5yn6DJyWeBFyeOyoUU8ye8S~eKBiOP~aGAfT3~PsxaS9k7K3wrLR@aS9gDPIy3[k7K^qKHa35wm5Un6DdLJyhJ3%yqKHa35~gJCgLF~m81~hBV~qJFk9Ra7TaC8U.b5T%a7TaC8U.b00aT4~i30iC9~aBLe52~a3S3~pS03wa6TeGSxsKMwkUSycBP~g4AX~staDPU.aSFdM9taDPU.lQ7OUtaDP?hFHn4Uwa0Vg1RaSFyfUL~u7G~>j~m73>~m6Fs79~d0Thc7QU.pS7l7S^rNOa6TwkM3ya13@R~jD5dJBaDJ.Ms1T~eHP~bCCc9RiU.=~hMRc9Ri.gCQgIVU?u7GtaDPU+0a35w0a6T~g4A~g4Go~pPQK~g9NpHR~aT8a64~^u7GUaDJ+b0BSwr~fUPkV5~a15l3J~sqFO~dLDe05~cQ5gGD~rQ2dJB~b3D~1~u7A~gTH~a7A~s8J~u6N~a2LdG4^u7GtaDPU+Nb8SwkTBlwnBGhNU~pQHX~jOA~j88~cJK~`jQK~HsKM~S~eNS3~a15N3'9#Oug12g1Awa5G]yk7KydDKi1Ty@%ybJ4pPTyg37~dF8hHD~dDOn4B~M;h.dS5g1A~kT0b5PhU.dGNjQKc7Qh.xg8EsBIwu5Eu5RyC~s32n4B~e14dDJ~`~dF8B~a9MhOP~hMQk76~dDVd0TxjD5Jwm5UcJGy%~iD0~a~]~g1FZ~dO4h.haLV.aQVkAhaLV?aFPwoyfUPjQK~mSQaUE~L~5^g29awg29ytKTjQK~e03i~k7ChQ1~aSF~FbT0~m81~ss70~hn4B~d0TaFT~3dF8^a2Pw_{jD5m6F.FmNO~]cC6~nLJh?g4AhQDweHPn91yhQDkAh.cM4kA.g4Bh.g4BpIJaLVh.shL1hkA7kRO.kAh.dBRqFQaLV7kROaC0.iDOhM37kRO.k7RaC0?DhM3wDmFGyb00e52~O~F=~se6J~bF87kROaC0tg9JaLV.mIRCaLVaC0.hM3BaC0?gRMs70h+gRMs70wbF8gFB~j3RX~]~cVM~cVM~Fa6T~aQVpH7~6X~kT0K^m5UkAh+a26g03we8SqFOwnLLn06weA1b7EwdJBqELU.e8M3~MdJB~hOK~aQV~m5U~>UjKIaLV.m8Rg21~RjKI?fT3cOAU+fT3wkHM~jSG~u6NgHJcBT~CaSF~a1K~n~dF8^bF8j34m6FaLV+g4BhQ6wb7C~b7CmR6^jH2e+jH2wiAQiFQh.kS1O~dEQ%~eA1i1T~hU3h.dV9hc7Q.F~O~hQDB~b3D%~u40e52^=dDBaLVg4BsL3+jJQa2Pwn5EwgKT~k74~s33%^eHEaL4aOF+hOK3~kTBpPT~pPTj88eHE.GcC6eg4AlKF?qG6e52nVB+sTLgIOS7~=rM2~m8GaL4aOF'9#nVB bAM$7nI4waSFy;bK4~eBFs70~AgA4~g8E3~cH2=e52~fdBO~cM4l8Le01bBT^5NcACy5N~f~pPToV5~lKNWuBC~a0TV~dFRs71~aS7dER~e02pPT~n5Ee6J~hPNo~qELcBP^cACya2V~f3Ac76~pPTc1A~gJDg01~jIOm7F~g8EgCQ~fE6mDA~hPNf3A~b5SgG1~oq~rPLqLV~hS6bBTq^g01bSSb1LcACyg01bSSb1LwgA4;~dBO~Xg01~nI4qG2~7dBO~g0Ua6T~pHUaZ~eg9J~a6Tt~e6JC~Xm7F~a8E4~/~Yo~mIU7gA4~nI4c1A~dLJ4^qLVg8EcACyqLVg8E~c15u7A~hFGcSU~mIUnBV~cPM~jQFf3A~lPU~jG9f14~4V~AjDN~bF88^EScACyg4AG~gA9f~c4I~g01c9R~sC5Y~fQLb1L~fE6b80^;n5PCAS.Cy;n5P~e01tf~lKF;~cM4mQD~hNUdF2~dFRs51~g9J9#s3Huw{kLD;ynEE8yiJQgK1ygA6cQAys6TcJGys1An4ByDiCOyHynNPjQC~bK4n0F~f2J~bL^rNO%wjD7k76ybCC1ymGSydDObHN^dDPu1Twi29i84y>1ys34a7Fyb00mFG~dLC~f4IsNA~k95~s33~bAV~u5Ri2K~b00~cQ6e^bMKwl02NygC4Lyi29{a15p~hOQ~a4Q~kQOl~FdGR~eC8~H6~g08qLD~i0FQ~6b5R~0xi29wDi29y]~iCOaSF~nBG~bH4~iD0[nME[e3~dF8~sG5w]s2Gxe8IwdDPcJGye8IH~e8I%~qH~cJQ~eFJa2L~bIGpSJ~jPKl~dF8~hPN%~dDO%~r~rL^hJ5&whJ51yqND~c8M~hP7~m~b75~eAM~jS1~s4~jRLcBP~aBNcC6^gT2;wgT2ykRQgA4~e5OpIJ~h26~sBIqEL~XqEL~m81=~lKFmOU~aCF~bIGcHT~PhU3~qhQE^e6JwhJ5i84yhJ5s2G~Ml~s3H~lQ7~dLMk57~T~scC6~g08~e^bR2hPNwbR2yhPN~a2Lb00~bR2~~s~gFQ39#jPKmKVuGwaSFya0VSyc8Myym5U_yFk4N~k57G~gT2&^c15dO6aSFx>5w>%yF5^erOIwerOIy%ysBIqFO~a9M~g4BhOC^cQ53wl02yu62l0ByP3~l02~jPKpIJ~6~e9Si%c7Q?6d0TwaV5yhHDb80~_hS6~cQ5kRPnVB?e9SfDIwjPKymKVoNHc8M.hHDg~DhOP~b1~a2L^aV5wdP2dNEyhOQ%~iKH1~dP3aFT~]a69~e50hS6~sBL^qRElwmKVy>cJG~jNO~mKVnLL_.E!cJQknI4!.jD5ZwfS2iR8xe52wdOCye52[jEB~]hJS~bH43~hBV~~sp^XwXyai29~s33~i29B~DhQA~iAF~dMJ^s33w6Nyf1C~fT3~dDH5~e6J~2~kQO~eEP~a20eBF^DcPBc7Q+DcPBwDcPB~e6Jg~FsBI~n~2fQR~m.l0BMaFPmfLE7?jPKnVB+bH4aBOwDiC9~bBFA~n1Rg8E~qG9qO4~jDNg8E~kL8g8E~cPB9#Vuwy&yyyac7Qc9R.i3R&~i3RB^wgNy~hHD2c7Qc9R.a5Eb65c9R.Qoc7Q.eE6QfLE7?nVB+ZBc7Q.kQTqFQ~g3B~b1MdFR^rnVB+bH8a6T~dHIf3A~hOPe5F~nLL_?nVB+aSD2~bH8=~pQH=~0~pQH^gDOhPNnVB+jDNhKT~jG9jDN~jPK=~fg01~a31hMN~jDNcPM^jD5gHDnVB+jD5gHDwgAUcPM~l0CcPM~hMNcPM~c76pI2~g8Eu6NnED^nLL_nVB+gIOgA4w=a80kwWG~NG~cQ5dON9#cPBc7Q'bAM$rOI%w0e52ycPBy>b00yF~pQMG~iKH6xMc2Gw6RyeNSaTOy`^bIGeFSwTaym5UdGMcHTyk7ChJS~bH8eEV~VrNOdNTxc8MpwpyY~o=~hOQB~eC9^&bC7wjcBTcQGy&~p9#jT2m8GbIQ bAM$WtKTgA4uBCwcQ5@jaDP4!y}3kO4hLRycQGdKByfcAU{lKFyWtKTgA4uBC^!7jDNaDPwj88qy!7jDNaDPyekMDi85yWkUQzbHCtKTjS6cACybHCtKTjS6wqQBbT0~f3K!qH6^kdF2cACykdF2w4ScC0knI4! ~a96bIQ^5Yc7Q+5Yws1Oe6JwbKOc8QcMT~jDNm6F:~cR31~YgA4nI4~gA4cDEknI4! ^bBMcJG7nLL_ ,bBMgwE7RwlMQ~i25l^4sGFqO9gRQnLL_ ,e5Fb7EwqCA1~dH5j4T~n81mD8~a1GgA7~iP5mH2c7Q.2sBL~2kJH~bBM8^E!n7BcACyE!n7Bwi25dER~e5FqC2~js71~2~f7O[Wa6S~EjO2fFC~gGBcC6^!dBOb7En7BgGB!dBO ,Ec8Qa6SwE!s4I~EbH4cR3~WeKC^bSSa6ScACybSSa6SwjTBs30~jTBb7E~n8DYj~hOPg4A~nDAqC2~bGI[u62k7IfFC~dMFg4A8~aAPe14~4gRM~cJGa6Se5Fe4EcJGY! ^2jQCcACy2jQCw2jQC~cM4jD5~k6A~hPNhS2~lBIb7E~a5AjQC~hHDK^a96j4TknI4! ,a96wcRAdKBwa96~dFRtgG1rPTaAB ~s99[e05jRL~B~g29n7B~I!:~Ab7E!^cJGcACycJGwWn7BwsLPfRB~ji4Q~f3KS~oNHhHD~2t!pRNnLL_ ^Eb7EhOCcACyEb7EhOCwthQ1~dF8nSG~kTB~k4~V~YgA4a2V~MqwE7wc8QgA4n1E!wa5Gii1SwdKBwrMTZaSF#sTLcIb27oJ8fQRbAM$sTLc,sTLcIb27oJ8fQRbAM#iEFZIb27oJ8fQRbAM$iEFZ,iEFZIb27oJ8fQRbAM#1i4Qu1w&hBVybH8y&@gCQ@ya13]yaFTa35ycO7;yf5HyaT18ycyfT3zbs70w0yb39>yn65s71yk7CcFHyu9F@fVJhQ1yb39sya15hHDye02nI1ygRSgLFydHBczcGMowa6Tj2DyaFTa35y&hBVy&@gyg5Ig5Iya0VcIHz1&w&yyyyydKBydKBydKBz1w&yyyyyzl8LwyysTLzc15a35wyz~19(gCRgK1),dDOG9(dDOG),l8L9(l8L),gIVc899(gIVc89),UgHJ9(UgHJ),1&9(Kp),eCCQ9(eCCQ),f5H9(f5H),c15a359(cQ6aFP),O;9(fTJaS9),19(nI1),bs709(b00),dJB9(dJB),19(1),n6DnEE9(n6DnEE),iDA89(CaS8)#aSIdCV$/hQE,EdF8hJJ,4;,dBRb5S7d,a19a2L,fT3nED,m91jQK,cJQhS2q0B:,bCCe62,bCCe62A/,a96g9J,a967!,g01gA8,m62g02,g9PtLO,kVDd0TI,mGTf9P,Ca7VcQ7,u7A4d85,CgC1/,a81n4Eb1J,nLL_,AhN6,Eg8O,4cGM:cC2,4b7E:cC2,nGEeD7dEQ,jIE7aAB,b5ScBT,:SGbBT,bFLT/,hOCd,gG8cFGdG4,c9RmIFaSI,EmJGqR7,pT6,a3RZ,sG5d,&d,&dsTLc,&diEFZ,&d1i4Q|sBQhQE,EbF6T/,bO17,bD0SIS/,hNH`mE0u1R,b5SqLVTmE0<()(7:e1HC:),pPP,bBMnA4jO2m6F,tcGMm6FhNHlPU,toqG6,bSSu62o,b5SqLVTmE0<()(c9V!tKT:),aBNeDJoVE,&sBQ,a39eDJ,kVDfK5`,b1MgDO,YtfFC,cEVbF6,cEVcJQaF0hFG/,pS0qJFaVSaT1/,b5SnO8,aT4hFG/,b5Sm6F,aVSaT1/,sBQ,aVSaT1/hFGm79,kVDIqG6jO2,mMBA/,nEDlPUf3K,ThFGS/,ThFG/,Cfb5S:b5S,C7m8G,CS,hFNScJGA/,hFNShIU:,fK5hPNbO1,nE7gJDhFG!,Ag01,Ag01T/,jRLAg0M<,bBUg0Mf,cJQaT1b5S,cJQn18,cJQ7Tg0U,lPUCS,n7Ba2L,:d0TcO7G,cC2gJDA/,c9VpS0b7Ef8R,cPMbO1,l4TA:,We4Ef,f3Aa96,pRQhFG/,hQ14tsG2,m6FlKFhFG/,qG6f14b5S/,gJDm7L4,Cm62I<,c9VcPMmDA2g4A;hFG|hA3hQE,E4A/,qJF,cS1cACT,hFGTg0I,aFPb5ST/,fCJ!,a2Lu62,n68G,hNHd,=d,k8Gt`s2S(n8D),e18mR6,b94j3LT,aUC<,j2DG,ePBT,b1JfQBfS2cO7k4N,:hPNa9C!,bBUgOAcHT,CmIFa7I,fK5m6FbO1,nCJG,fA6d0T,hNUG,nJTnH0j3L,CaSIsKR,`CA/,:7cQ7,c9VCb5NpGM,jG9j3L,jJQaSK,jJQcO7,n8Dd,kVD`cAC/,:hPNfT3A/,gMHnKUaT4,hNU:A/2cJQbO1m8GqLV,aF0`:mJGqM2,/mDAA/aSD2d,eaF0`:aSD2d,gIOtKTY/aSD2d,knI4!:cC2aSD2d,YY:cC2aSD2d,WaSLb27!:cC2aSD2d,cJGY!:cC2aSD2d,c9Re5Fg8O:cC2aSD2d,W!G,l77s4IdDN,7mQDm8G/,j2DjA/,fK5cPMjO2,EcJQf7OjT2|mDAhQE,cA97<,fFCjNO24tf,EgILe8J,EtKT4<,EgOAgCQ,4kC,44cPM:,aABTaSL,k4QeRHmE0<,jENTm8G/,4,b5Sf8R,e8Sg8OmE0<,g4MT,bO1aA2hFG/,cPMlKFAb5SmJGqM2,bO1:fu7Ab5S,_4,cPMlKFAb5SaSD2d,bD0jNOcPM,nI4jO2cPM,hNHdJQcA9/qLV,gIO;m6Ff,bCDcACC7,cA9/qLV,cAC,hQ6N7:,j3La4Cb5S,CfFCA!(hNH),cM4bO1,nLLIcJQ7I<,nCJdJQk50b1J:mE0<,Ab5S7jNO,4f8RC,47cA9,kVKtKT,hNUcPMu7AbO1,c9Vk6AcEV<dF2!o<(hNH),c9V!S:f3Ke9J2Am8G:,c9VbBU/,kTB!GmE0<,m8Ga68mE0<(n8D),c9VfT3gOAI<(n8D),m8Ga68mE0<(mDA),n7BS,Il77Af2cPM4bO1,W7cA9,mDAd,cVGaT1jJQ7,gIOLG<,I!:2b0BkVD:mE0<,jNOcPM`g4A|hP7hQE,iEFT/,kVD!mE0<,fTChRA,hNHdJQhNUSA/、cJGe18fFC,jO2b66Ec8Q,aSF<,cGMS4:,CS/m6FmE0<,&qHG<,jJLtKT,bMBScPMA/mE0<,G,4t/aVSaT1/,nI4fK5/,nI4fK5/,f2S`ZmE0<,hK0b5S,dGLpFQ<,d0T!<,kVDkVD:<,cPBd0TcQJ,pGMkTB!<,e1Hb6F,m6PcEV<,c8QjO2bBU,f3K!tKT,dF2!`A/,Cm79mE0<,jO2S:b5SdF8cO7qLVmE0<@/dKDbAM,/\\+/fVBn06hMNdVQ,/\\./fVBn06hMNbER,/\\?/fVBn06hMNbER|/'/fVBn06hMN/ /n06hMN/\\[/cFAbER,/\\^/bER|/~/bER,/{/cFAbAM,/}/e0UbAM,/z/bAM|/y/bAM,/x/e0U|/w/e0U,/v/fVJ,/u/k8T$s2FdD5hJRbBJdVQdKDa1OoSRe4FdCThMFfUCdHGhSJfVBuDLb9JcFAe0UcQ3!aR7%dVP&a29/a5M0aSG1bGC2bL83hIG4e0G5g186hC27f758i3I9bER:fUB;gDJ<dLN=eEJ>qVDAdIOBi5CCt48Da2GEs2RFhIKGaSCHrSRIj4LJi66Ka2CLs4HMkGFNqOPOa5DPi11Qb9IRbFVSqV8Tb25Un7JVsBEWa38XdDMYbH5Zs04]bBA_bG0`mBJaqHMbt7Kci2Bdc8Pek4PfqEQga3CheBPidEIjhLLkbN4lhN5ma3Tne4Ros52pbDRqdBCru70srR3te0V01-20131231";