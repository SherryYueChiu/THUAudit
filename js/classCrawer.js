var classCnt = $(".button_hilite").length;
var json = "";

for (i = 0; i < classCnt; i++) {
    var ccode = "",
        cname = "",
        croom = [],
        ctime = [];

    ccode = $(".button_hilite").eq(i).html().trim(); //課碼

    //課名
    if ($("[data-title=課程名稱]").eq(i).html().indexOf("strike") == -1) {
        cname = $("[data-title=課程名稱]>a").eq(i).html().trim();
    } else {
        //已停開
        continue;
    }

    //時間地點
    let timerooms = $("[data-title=時間地點]").eq(i).html().trim().split(/\s+/);
    timerooms.forEach(timeroom => {
        if (timeroom.indexOf("星期") != -1) {
            // 過濾掉"星期"
            let str = timeroom.replace("星期", "");
            // 教室格式: [教室]
            let _croom = str.match(/\[(.+)\]/gi)?.[0];
            if (_croom) {
                croom.push(_croom.substring(1, _croom.length - 1));
                // 過濾掉教室
                str = str.replace(_croom, "");
            }
            // 時間格式: 星期/節,節...
            let _ctime = str.split(/[,\/]/);
            if (_ctime) {
                ctime.push(_ctime?.join('","'));
            }
        } else {
            //無公佈時間地點
        }
    });

    json += `{
          "code": "${ccode || ''}",
          "name": "${cname || ''}",
          "room": ["${croom.join("','") || ''}"],
          "time": ["${ctime.join("','") || ''}"]
  },`;
}
console.log(json);