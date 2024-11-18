
/** @type {{code:string, name:string, room:string[], time:string[]}[]} */
var classPool;
var date = new Date();
var weekDayWord = ["天", "一", "二", "三", "四", "五", "六"];
var g_textPool = {
    greetingMsg: `<h3 class="color1">今天是星期{weekday} </h3><h5>來看看今天可以旁聽點什麼嘛？</h5>`

}
var g_schoolYear = 113;
var g_semester = 1;

/**
 * 顯示篩選後課程列表
 */
function showClass() {
    classPool.forEach(function (_class) {
        // 插入課程泡泡
        // 課名
        let html = `
<div class="tag bg-dark p-3 mt-3 mb-3 rounded-lg mx-auto shadow-lg w-75">
	<span>
        <h4 class="color4 classBlock">
            ${_class.name}
        </h4>
    </span>
    `;

        // 時間
        if (_class.time != "") {
            html += `
    <hr class="style-one">
	<span>
        <h5 class="color5">
            第${_class.time.join("、")}節
        </h5>
    </span>
	`;
        }

        // 教室
        _class.room.forEach(function (_room) {
            if (_room != "") {
                html += `
    <span class="badge bgColor2 rounded-lg pl-2 pr-2 pb-0" style="border-radius: 10px; color: #333;">
        <h6>
            ${_room}
        </h6>
    </span>
	`;
            }
        });

        // 課程代號
        html += `
    <h6 class="classCode">
        <a class="color2" href="https://course.thu.edu.tw/view/${g_schoolYear}/${g_semester}/${_class.code}" target="_blank">
            ${_class.code}
        </a>
    </h6>
</div>`;

        $("#classList").append(html);
    });
}

/**
 * 依星期和節數過濾掉課程
 * @param {number} day 
 * @param {number} time 
 */
function classFilter(day, time) {
    // 以搜尋指定的校區過濾課程
    classPool = classPool.filter(theClass => {
        let result = false;
        theClass?.room?.forEach(_room => {
            const offCampus = _room.search(/^(中研院|遠距課程|梅|寒)\d+$/) != -1;
            const atSecondCampus = _room.search(/^(FA|ICE|M|MU|PG|二校|職訓中心|馬馬教室)\d+$/) != -1;
            const atMainCampus = !atSecondCampus && !offCampus;
            // 第二校區上課
            if ($("#chooseAceptRegion").val() == "2" && atSecondCampus) {
                result = true;
            }
            // 第一校區上課
            else if ($("#chooseAceptRegion").val() == "1" && atMainCampus) {
                result = true;
            }
            // 搜尋不限校區
            else if ($("#chooseAceptRegion").val() == "0") {
                result = true;
            }
            // 該課程沒有明訂教室
            else if (_room == "") {
                result = true;
            }
        });
        return (theClass.time.indexOf(weekDayWord[day]) != -1) && result;
    });
    // console.log(classPool)

    // 以搜尋指定的星期和節數過濾課程
    classPool = classPool.filter(theClass => {
        if (!theClass.time) return true;
        let lBound = 0,
            rBound = theClass.time.length - 1;
        let foundDay = false;
        theClass.time.forEach((_time, i) => {
            if (!foundDay) {
                if (_time == weekDayWord[day]) {
                    lBound = i;
                    foundDay = true;
                }
            } else {
                if (_time.charCodeAt() > 1000)
                    rBound = i - 1;
            }
        });
        let ClassTimeOfToday = theClass.time.slice(lBound + 1, rBound + 1);
        theClass.time = ClassTimeOfToday;
        return ClassTimeOfToday.indexOf(time) != -1;
    });

    // 用課程名稱首字排序
    classPool = classPool.sort(function (a, b) {
        let result = false;
        let AMinusB = a.name.charCodeAt() - b.name.charCodeAt();
        // 中文字優先在前
        if (Math.abs(AMinusB) > 512)
            result |= AMinusB < 0 ? true : false; // 中文字對上英文字
        else
            result |= AMinusB > 0 ? true : false;
        return result ? 1 : -1;
    });

    showClass();
}

$(function () {
    // 送出選擇
    $("#page1Submit").click(function () {
        $("#page1").fadeOut(200);
        $("#page2").fadeIn(200);
        classFilter($("#chooseDay").val(), $("#chooseAceptTime").val());
    });

    function init() {
        classPool = rawData;
        // 顯示今天星期幾
        $("#greetingMsg").html(g_textPool.greetingMsg.replace("{weekday}", weekDayWord[date.getDay()]));
        $("#chooseDay").find(`option[value=${date.getDay()}]`).prop("selected", "selected");
    }

    init();
});

// register service worker
navigator.serviceWorker.register('service-worker.js', { scope: "." });