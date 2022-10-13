var dts = {
    options: {
        isWeekendActive: false,
        nonChoosableDays: null,//Date Array cinsinde özel olarak seçilmeyecek günler
        startDate: null,//Date cinsinde başlangıç günü
        endDate: null,//Date cinsinde bitiş günü
        openMonthsCount: null, //int aktiflik süresi
        nonChoosableHours: null,
        period: null,
        periodStartFreeTime: null,
        periodEndFreeTime: null,
        startClock: null,
        endClock: null
    },
    monthsDayCount: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    months: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"],    
    minuteToMiliSecond: 60000,
    now: {
        dayofWeek: null,
        nameOfDay: "",
        day: null,
        month: null,
        year: "",
        clock: ""
    },
    choosenDay: {
        year:null,
        month:null,
        day:null,
        clock:null,
    },
    daysArr: null,
    nonActiveDaysArr: null,
    timesArr: null,
    takenDates: null,
    isTimesChanged : false,

    init: function (options, e) {
        this.initalOptionBinding(options);

        this.arrangeNowObject(new Date($.now()).constructor());

        //#region DatePicker Codes
        this.createDaysArr(this.now.month, parseInt(this.now.year));

        this.daysArr.forEach(this.applyArrayToHtml);

        this.todayToHtml();

        $('#dts-datePicker-yearRightArrow').on('click', function (e) {
            var newYear = parseInt($('#dts-datePicker-yearContent').html()) + 1;
            var newMonth = dts.months.findIndex(u => u == $('#dts-datePicker-monthContent').html());

            dts.changeDaysArrAndHtmlProcess(newYear, newMonth);
        });
        $('#dts-datePicker-yearLeftArrow').on('click', function (e) {
            var newYear = parseInt($('#dts-datePicker-yearContent').html()) - 1;
            var newMonth = dts.months.findIndex(u => u == $('#dts-datePicker-monthContent').html());

            dts.changeDaysArrAndHtmlProcess(newYear, newMonth);
        });
        $('#dts-datePicker-monthRightArrow').on('click', function (e) {
            dts.nextMonthProcess();
        });
        $('#dts-datePicker-monthLeftArrow').on('click', function (e) {
            dts.previousMonthProcess();
        });

        $(document).on('click', '.choosable', function (e) {
            $('.choosen').each(function (e) {
                $(this).removeClass("choosen");
            });
            $(this).addClass("choosen");
        });

        $(document).on('click', '.nextMonth', dts.nextMonthProcess);
        $(document).on('click', '.previousMonth', dts.previousMonthProcess);

        $('#dts-datePicker-cancelButton').on('click', function (e) {
            $('#dts-datePicker').hide();
            $('#dts-buttons').show();
        });

        $('#dts-datePicker-saveButton').on('click', function (e) {
            var newYear = parseInt($('#dts-datePicker-yearContent').html());
            var newMonth = dts.months.findIndex(u => u == $('#dts-datePicker-monthContent').html());
            var newDay = $('.choosen').html();

            dts.dayToShowTimeHtml(newYear, newMonth, newDay);

            dts.choosenDay.year = newYear,
            dts.choosenDay.month = newMonth,
            dts.choosenDay.day = newDay,

            dts.takenDatesHtmlProcess();

            $('#dts-datePicker').hide();
            $('#dts-buttons').show();
        });
        //#endregion

        //#region TimePicker Codes
        this.createTimesArr();

        this.createTimesHtml();

        $('#dts-timePicker-cancelButton').on('click', function (e) {
            $('#dts-timePicker').hide();
            $('#dts-buttons').show();
        });

        $('#dts-timePicker-saveButton').on('click', function (e) {
            $('#dts-showTimeClock').html($('#dts-timePicker .choosen').html());

            // dts.dayToShowTimeHtml(newYear, newMonth, newDay);

            $('#dts-timePicker').hide();
            $('#dts-buttons').show();
        });
        //#endregion

        $('#dts-buttons-calender').on('click', function (e) {
            $('#dts-datePicker').show();
            $('#dts-buttons').hide();
        });

        $('#dts-buttons-clock').on('click', function (e) {
            $('#dts-timePicker').show();
            $('#dts-buttons').hide();
        });


    },

    initalOptionBinding: function (opt) {
        this.options.isWeekendActive = opt != null && opt?.isWeekendActive != null ? opt.isWeekendActive : false;
        this.options.nonChoosableDays = opt != null && opt?.nonChoosableDays != null ? opt.nonChoosableDays : null;
        this.options.startDate = opt != null && opt?.startDate != null ? opt.startDate : null;
        this.options.endDate = opt != null && opt?.endDate != null ? opt.endDate : null;
        this.options.openMonthsCount = opt != null && opt?.openMonthsCount != null ? opt.openMonthsCount : 3;

        this.options.nonChoosableHours = opt != null && opt?.nonChoosableHours != null ? opt.nonChoosableHours : null;
        this.options.period = opt != null && opt?.period != null ? opt.period : 60;
        this.options.periodStartFreeTime = opt != null && opt?.periodStartFreeTime != null ? opt.periodStartFreeTime : 0;
        this.options.periodEndFreeTime = opt != null && opt?.periodEndFreeTime != null ? opt.periodEndFreeTime : 0;
        this.options.startClock = opt != null && opt?.startClock != null ? opt.startClock : "08:00";
        this.options.endClock = opt != null && opt?.endClock != null ? opt.endClock : "17:00";
    },

    //#region DatePicker Functions
    arrangeNowObject: function (today) {
        var todayArr = today.split(" ");

        this.now.dayofWeek = this.findDayOfWeek(todayArr[0]);

        this.now.nameOfDay = todayArr[0];

        this.now.day = todayArr[2];

        switch (todayArr[1]) {
            case "Jan":
                this.now.month = 0;
                break;
            case "Feb":
                this.now.month = 1;
                break;
            case "Mar":
                this.now.month = 2;
                break;
            case "Apr":
                this.now.month = 3;
                break;
            case "May":
                this.now.month = 4;
                break;
            case "Jun":
                this.now.month = 5;
                break;
            case "Jul":
                this.now.month = 6;
                break;
            case "Aug":
                this.now.month = 7;
                break;
            case "Sep":
                this.now.month = 8;
                break;
            case "Oct":
                this.now.month = 9;
                break;
            case "Nov":
                this.now.month = 10;
                break;
            case "Dec":
                this.now.month = 11;
                break;
        };

        this.now.year = todayArr[3];

        this.now.clock = todayArr[4];
    },

    createDaysArr: function (month, year) {

        var inactive = dts.createNonActiveDaysArr(year, month);
        var inactiveDaysArr = dts.nonActiveDaysArr;

        var resultArr = [];
        var count = 0;
        var week = 0;
        var day = 0;

        if (month == 1 || month == 2) {
            dts.monthsDayCount[1] = dts.febCalculation(year);
        }

        var firstDayArr = new Date(year, month, 1).toString().split(" ");

        var firstDayIndex = this.findDayOfWeek(firstDayArr[0]);

        if (firstDayIndex > 0) {
            for (var i = 0; i < firstDayIndex; i++) {
                var element = {
                    currentWeek: week.toString(),
                    currentDay: (this.monthsDayCount[month - 1 > 0 ? month - 1 : 11] - firstDayIndex + i + 1).toString(),
                    currentDayofWeek: day.toString(),
                    isActive: false,
                    monthSituation: -1
                }
                resultArr.push(element);
                day++;
                count++;
            }
        }

        if (week != 5) {
            if (day == 7) {
                day = 0;
                week++;
            }
            for (var j = 0; j < this.monthsDayCount[month]; j++) {
                var element = {
                    currentWeek: week.toString(),
                    currentDay: (j + 1).toString(),
                    currentDayofWeek: day.toString(),
                    isActive: inactive == 0 ? false : inactiveDaysArr.includes(j + 1) ? false : true,
                    monthSituation: 0
                }
                resultArr.push(element);
                day++;
                count++;
                if (day == 7) {
                    day = 0;
                    week++;
                }
            }
            for (var k = 0; count < 42; k++) {
                var element = {
                    currentWeek: week.toString(),
                    currentDay: (k + 1).toString(),
                    currentDayofWeek: day.toString(),
                    isActive: false,
                    monthSituation: 1
                }
                resultArr.push(element);
                day++;
                count++;
                if (day == 7) {
                    day = 0;
                    week++;
                }
            }
        }

        this.daysArr = resultArr;
    },

    createNonActiveDaysArr: function (year, month) {
        var result = [];

        var boundStart = dts.now.day;

        var startDate = dts.options.startDate == null ? new Date($.now()) : new Date($.now()) < new Date(dts.options.startDate) ? new Date(dts.options.startDate) : new Date($.now());

        if (startDate != null) {
            var startDateDay = new Date(startDate).getDate();

            if (new Date(startDate) >= new Date(year, month + 1, 1)) {
                return 0;
            }

            if (new Date(startDate) < new Date(year, month, 1)) {
                boundStart = 1;
            }
            else {
                boundStart = startDateDay;
            }
        }
        for (var i = 1; i < boundStart; i++) {
            result.push(i);
        }

        var boundEnd = dts.monthsDayCount[month];

        var endDate = dts.options.endDate == null ? new Date().setMonth(new Date($.now()).getMonth() + dts.options.openMonthsCount) :
            new Date(dts.options.endDate) > new Date().setMonth(new Date($.now()).getMonth() + dts.options.openMonthsCount) ?
                new Date().setMonth(new Date($.now()).getMonth() + dts.options.openMonthsCount) : new Date(dts.options.endDate);

        if (endDate != null) {
            if (new Date(endDate).getFullYear() == year && new Date(endDate).getMonth() == month) {
                boundEnd = new Date(endDate).getDate();
            }
        }

        if (new Date(endDate) < new Date(year, month, 1)) {
            return 0;
        }


        if (boundEnd != dts.monthsDayCount[month]) {
            for (var k = boundEnd; k <= dts.monthsDayCount[month]; k++) {
                result.push(k);
            }
        }

        if (!dts.options.isWeekendActive) {
            for (var j = boundStart; j <= boundEnd; j++) {
                var dayName = new Date(year, month, j).toString().split(" ")[0]
                if (dayName == 'Sat' || dayName == 'Sun') {
                    result.push(j);
                }
            }
        }

        if (dts.options.nonChoosableDays != null) {
            dts.options.nonChoosableDays.forEach(function () {
                if (new Date(this).getMonth() == month && new Date(this).getFullYear() == year)
                    result.push(new Date(this).getDate());
            })
        }

        dts.nonActiveDaysArr = result;

        return 1;

    },

    applyArrayToHtml: function (object) {
        $('table #week' + object.currentWeek + 'day' + object.currentDayofWeek).html(object.currentDay);
        if (object.isActive)
            $('table #week' + object.currentWeek + 'day' + object.currentDayofWeek).addClass("choosable");
        else
            $('table #week' + object.currentWeek + 'day' + object.currentDayofWeek).removeClass("choosable");

        if (object.monthSituation == -1) {
            $('table #week' + object.currentWeek + 'day' + object.currentDayofWeek).addClass("previousMonth").removeClass("nextMonth");
        }
        else if (object.monthSituation == 1) {
            $('table #week' + object.currentWeek + 'day' + object.currentDayofWeek).addClass("nextMonth").removeClass("previousMonth");
        }
        else {
            $('table #week' + object.currentWeek + 'day' + object.currentDayofWeek).removeClass("previousMonth nextMonth");
        }
    },

    todayToHtml: function () {
        this.dayToDatePickerHtml(this.now.year, this.now.month);
        this.dayToShowTimeHtml(this.now.year, this.now.month, this.now.day, this.now.clock);
    },

    dayToDatePickerHtml: function (year, month) {
        $('#dts-datePicker-monthContent').html(this.months[month]);
        $('#dts-datePicker-yearContent').html(year);
    },

    dayToShowTimeHtml: function (year, month, day, clock) {
        $('#dts-showTimeClock').html(clock);
        $('#dts-showTimeToday').html(day);
        $('#dts-showTimeMonth').html(this.months[month]);
        $('#dts-showTimeYear').html(year);
    },

    nextMonthProcess: function () {
        var newYear = parseInt($('#dts-datePicker-yearContent').html());
        var newMonth = dts.months.findIndex(u => u == $('#dts-datePicker-monthContent').html()) + 1;

        if (newMonth == 12) {
            newMonth = 0;
            newYear = newYear + 1;
        }

        dts.changeDaysArrAndHtmlProcess(newYear, newMonth);
    },

    previousMonthProcess: function () {
        var newYear = parseInt($('#dts-datePicker-yearContent').html());
        var newMonth = dts.months.findIndex(u => u == $('#dts-datePicker-monthContent').html()) - 1;

        if (newMonth < 0) {
            newMonth = 11;
            newYear = newYear - 1;
        }

        dts.changeDaysArrAndHtmlProcess(newYear, newMonth);
    },

    changeDaysArrAndHtmlProcess: function (year, month) {
        dts.createDaysArr(month, year);

        $('.choosen').each(function (e) {
            $(this).removeClass("choosen");
        });

        dts.daysArr.forEach(dts.applyArrayToHtml);

        dts.dayToDatePickerHtml(year, month);
    },

    febCalculation: function (year) {
        return year % 4 == 0 ? 29 : 28
    },

    findDayOfWeek: function (day) {
        switch (day) {
            case 'Mon':
                return 0;
                break;
            case 'Tue':
                return 1;
                break;
            case 'Wed':
                return 2;
                break;
            case 'Thu':
                return 3;
                break;
            case 'Fri':
                return 4;
                break;
            case 'Sat':
                return 5;
                break;
            case 'Sun':
                return 6;
                break;
        };
    },
    //#endregion

    //#region TimePicker Functions
    createTimesArr: function () {
        var result = [];
        var endTime = dts.timeStringToMiliSecond(dts.options.endClock);
        var dateStartTime = dts.timeStringToMiliSecond(dts.options.startClock);
        var dateEndTime = dts.timeStringToMiliSecond(dts.options.startClock) + dts.options.period * dts.minuteToMiliSecond;

        for (var i = 0; ; i++) {
            if (i == 0) {
                dateStartTime += i * dts.options.period * dts.minuteToMiliSecond;
                dateEndTime += i * dts.options.period * dts.minuteToMiliSecond;
            }

            else {
                dateStartTime += (dts.options.period + dts.options.periodEndFreeTime + dts.options.periodStartFreeTime) * dts.minuteToMiliSecond;
                dateEndTime += (dts.options.period + dts.options.periodEndFreeTime + dts.options.periodStartFreeTime) * dts.minuteToMiliSecond;
            }

            if (dateEndTime > endTime) break;

            result.push(dts.miliSecondToTimeString(dateStartTime));
        }

        dts.timesArr = result;
    },

    timeStringToMiliSecond: function (timeStr) {
        var clock = parseInt(timeStr.split(":")[0]);
        var minute = parseInt(timeStr.split(":")[1]);

        minute = clock * 60 + minute;

        return minute * dts.minuteToMiliSecond;
    },

    miliSecondToTimeString: function (ms) {
        var min = ms / dts.minuteToMiliSecond;

        var hour = Math.floor(min / 60);

        min = min - hour * 60;

        var result = hour < 10 ? '0' + hour : hour;
        result += ':';
        result += min < 10 ? '0' + min : min;

        return result;
    },

    createTimesHtml: function () {
        dts.timesArr.forEach(dts.addTimePickerBoxToHtml);

        dts.takenDatesHtmlProcess();
    },

    addTimePickerBoxToHtml: function (str) {
        $('#dts-timePicker-boxes').append('<div class="dts-timePicker-box choosable" id="tpb' + str.split(":")[0] + '-' + str.split(":")[1] + '">' + str + '</div>');
    },

    takenDatesBind: function(takens) {
        dts.takenDates =takens;
    },

    takenDatesHtmlProcess: function(){
        if(dts.takenDates != null){
            if(dts.isTimesChanged){
                $('.dts-timePicker-box:not(.choosable)').each(function(){
                    $(this).addClass("choosable");
                })
    
                dts.isTimesChanged=false;
            }

            dts.takenDates.forEach(dts.takenDatesHtmlForeachProcess);
        }
            
    },

    takenDatesHtmlForeachProcess: function(item){
        var d = new Date(item);        

        if(d.getDate() != dts.choosenDay.day || d.getMonth() != dts.choosenDay.month || d.getFullYear() != dts.choosenDay.year){    
            dts.isTimesChanged=false;       
            return;
        }         

        $('#tpb' + new Date(d).toString().split(" ")[4].split(":")[0] + '-' + new Date(d).toString().split(" ")[4].split(":")[1]).removeClass("choosable");

        dts.isTimesChanged=true;
    },
    //#endregion
}