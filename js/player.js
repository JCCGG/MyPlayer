/**
 *  author:jcc
 *  
 *  
 * 
 */





$(document).ready(function () {
    var myAudio = $("#myAudio")[0];
    var timeStamp = new Date().getTime();
    var musicInfos = new Array()//所有音乐信息
    var totalTime;//总时间
    var currenttime;//当前时间
    var play_index = 0;

    

    // 自己的api
    $.ajax({
        type: "get",
        url: "",
        data: { "time": timeStamp },
        dataType: "json",

        success: function (response) {
            $.each(response, function (i, e) {
                console.log(e);
                var infoItem = {};
                infoItem["index"] = i + 1;
                infoItem["url"] = ;//音乐url
                infoItem["name"] = ;//音乐名
                infoItem["author"] = ;//歌手
                musicInfos.push(infoItem);
                 
                
            });
            setDurationUrl();
            show_music_list();

        }
    });


    // 设置当前播放的歌
    function setDurationUrl() {
        myAudio.src = musicInfos[play_index].url;
    }


    // 控制前后一首
    function setDurationMusic(flags) {
        if (flags == 1 && play_index < musicInfos.length - 1) {
            // 下一首
            play_index += 1;
        } else if (flags == 0 && play_index >= 0) {
            // 上一首
            play_index -= 1;
        } else {
            play_index = 0;
        }
        setDurationUrl();
      
    }


    // 显示歌单
    function show_music_list() {
        var $c = $(".list_container");
        for (let i in musicInfos) {
            // 遍历显示全部音乐信息
            var child_item = '<div class="music_item"><span>' + musicInfos[i].index + '</span><span>' + musicInfos[i].name + '</span><span>' + musicInfos[i].author + '</span></div>';
            $c.append(child_item);
        }

    }




    // 点击播放指定歌曲
    $(".list_container").on('click', '.music_item', function (e) {
        var $index = e.currentTarget.children[0].innerText;//第几个元素
        // console.log($index);
        play_index = $index - 1;
        setDurationUrl();
        myAudio.play();
    });


    // 播放暂停切换
    $(".player-Btn").click(function (e) {

        if (myAudio.paused) {
            myAudio.play();
        } else {
            myAudio.pause();
        }

    });

    // 弹出弹入歌单

    function music_list_in() {
        $(".list_container").animate({
            'width': '0px',
            'opacity':'0'
        }, 'fast');
    }
    // 弹出歌单
    function music_list_out() {
        $(".list_container").animate({
            'width': '400px',
            'opacity':'1'
        }, 'fast');
    }

    $(".show_list").click(function () {
        $(".list_container").animate({
            'height': 'toggle'
        }, 'fast');
    });

    // 弹入弹出播放器
    var isPopIn = false;
    $("#pop-btn").click(function (e) {

        if (isPopIn == false) {
            // 弹入  
            music_list_in();
            $(this).html("&#xe743;");
            isPopIn = true;
        } else if (isPopIn == true) {
            //弹出
            music_list_out();
            $(this).html("&#xe744;");
            isPopIn = false;
        }


        // 切换控制
        $(".player-body").animate({
            'width': 'toggle',
            'opacity': 'toggle'
        }, 'fast');

    });



    //获取时分秒
    function getFormatTime(times) {
        var hour = Math.floor(times / 60 / 60);
        var minute = Math.floor(times / 60 % 60);
        var second = Math.floor(times % 60);

        hour = hour < 10 ? '0' + hour : hour;
        minute = minute < 10 ? '0' + minute : minute;
        second = second < 10 ? '0' + second : second;

        var timeList = new Array();
        timeList[0] = hour;
        timeList[1] = minute;
        timeList[2] = second;
        return timeList;
    }

    // 下一首

    $(".next").click(function () {
        setDurationMusic(1);
        myAudio.play();
    });
    // 上一首
    $(".back").click(function () {
        setDurationMusic(0);
        myAudio.play();
    });


    // 音量
    $(".vol-icon").click(function (e) {
        if (myAudio.muted == false) {
            // 切换静音
            myAudio.muted = true;
            $(".vol-icon>style").remove();
            $(".vol-icon").append("<style>.vol-icon::before{display:none}</style>")
            $(".vol-icon").append("<style>.vol-icon::after{display:block}</style>")
           
        } else if (myAudio.muted == true) {
            myAudio.muted = false;
            $(".vol-icon>style").remove();
            $(".vol-icon").append("<style>.vol-icon::before{display:block}</style>")
            $(".vol-icon").append("<style>.vol-icon::after{display:none}</style>")
        }

    });

    $(".vol-bar").click(function (e) {
        var volOffsetY = e.offsetY;
        var totalHeight = $(".vol-bar").height();
        var updateVol = volOffsetY / totalHeight;

        myAudio.volume = updateVol;

    });





    // 跳播
    $(".time-bar").click(function (e) {
        var offsetx = e.offsetX;
        var totalWidth = $(this).width();
        var updateWidth = offsetx * 100 / totalWidth;
        var updateTime = offsetx * totalTime / totalWidth;
        myAudio.currentTime = updateTime;

        // $(".time-bar-current").css("width", updateWidth+"%");

        console.log(updateTime);
    });



    //    触发事件
    //播放
    myAudio.onplay = function () {

        $(".player-Btn>style").remove();
        $(".player-Btn").append("<style>.player-Btn::before{display:none}</style>");
        $(".player-Btn").append("<style>.player-Btn::after{display:block}</style>");
    };
    // 暂停
    myAudio.onpause = function () {
        $(".player-Btn>style").remove();
        $(".player-Btn").append("<style>.player-Btn::after{display:none}</style>");
        $(".player-Btn").append("<style>.player-Btn::before{display:block}</style>");
    };

    // 自动播放下一首
    myAudio.onended = function () {
        setDurationMusic(1);//下一首
        myAudio.play();
    }



    // 加载完成
    myAudio.onloadedmetadata = function () {
        // 音频控制按钮显示
        if (myAudio.muted == false) {
            // 不静音时
            $(".vol-icon>style").remove();
            $(".vol-icon").append("<style>.vol-icon::before{display:block}</style>")
            $(".vol-icon").append("<style>.vol-icon::after{display:none}</style>")
        } else if (myAudio.muted == true) {
            $(".vol-icon>style").remove();
            $(".vol-icon").append("<style>.vol-icon::before{display:none}</style>")
            $(".vol-icon").append("<style>.vol-icon::after{display:block}</style>")
        }

        //显示歌手歌名
        $("#music-name").text(musicInfos[play_index].name);
        $("#music-auchor").text(musicInfos[play_index].author);

        // 音频控制条显示
        myAudio.volume = 0.3;
        $(".vol-current").height(myAudio.volume * 100 + "%");
        // 显示时间
        totalTime = myAudio.duration;
        var totalTimeList = getFormatTime(totalTime);
        $(".time-text>span:nth-of-type(2)").text(totalTimeList[1] + ":" + totalTimeList[2]);

        // 加载完播放
        // myAudio.play();
    };


    // 更新
    myAudio.ontimeupdate = function () {
        currenttime = myAudio.currentTime;
        // console.log(currenttime);

        var currentTimeList = getFormatTime(currenttime);
        $(".time-text>span:nth-of-type(1)").text(currentTimeList[1] + ":" + currentTimeList[2]);
        var timeWidth = currenttime * 100 / totalTime + "%";
        $(".time-bar-current").css("width", timeWidth);
    };



    // 音量事件
    // 进入离开按钮
    $(".vol-icon").mouseover(function () {
        $(".vol-bar").css("display", "block");
    });
    $(".vol-icon").mouseleave(function () {
        $(".vol-bar").css("display", "none");
    });
    // 进入离开音量条
    $(".vol-bar").mouseover(function () {
        $(this).css("display", "block");
    });
    $(".vol-bar").mouseleave(function () {
        $(this).css("display", "none");
    });



    myAudio.onvolumechange = function () {
        $(".vol-current").height(myAudio.volume * 100 + "%");
    };







});