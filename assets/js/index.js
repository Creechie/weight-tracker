$(function () {
    initialise();

    $('#new-entry').click(function (err) {
        err.preventDefault();
        $(".modal").fadeIn("fast");
    });
    $('.modal-submit').click(function (err) {
        err.preventDefault();
        if (submit())
            $('.modal').fadeOut("fast");
    });
    $('.modal-cancel').click(function (err) {
        err.preventDefault();
        $(".modal").fadeOut("fast");
    });

    $('#test-new-row').click(function (err) {
        err.preventDefault();
        newRow();
    });

    $('#test-load').click(function (err) {
        err.preventDefault();
        loadDiary("Charlie Creech");
    });
});

function initialise() {
    setUser("Charlie Creech"); // To be replaced with a login page
    calculateProgress("Charlie Creech");
    setCurrentWeight("Charlie Creech");
}

function loadDiary(user) {
    var url = '/search/' + user + '/';
    $.getJSON(url, function (res) {
        var diary = res.diary;
        var weight, calories;
        var cellHTML;
        var cellCount = 0;
        for (let i = 0; i < res.diary.length / 7; i++) {
            newRow();
            for (var weekDay = 0; weekDay < 7; weekDay++) {
                if (cellCount < res.diary.length) {
                    weight = res.diary[cellCount].weight;
                    calories = res.diary[cellCount].calories;

                    cellHTML = '<ul>';
                    cellHTML += '   <li class="data-weight">' + weight + '</li>';
                    cellHTML += '   <li class="data-cal">' + calories + '</li>';
                    cellHTML += '</ul>';

                    $('#tdee-table tr:last-child td:eq(' + (weekDay + 2) + ')').html(cellHTML);

                    cellCount++;
                }
            }

        }
    });
}

function newRow() {
    var table = document.getElementById('tdee-table');
    var newRow = table.insertRow(-1);
    var rowCount = table.rows.length;

    var rowHTML =
        '<td class="table-week"></td>' +
        '<td class="table-stats">' +
        '   <ul>' +
        '       <li>Weight</li>' +
        '       <li>Cal.</li>' +
        '   </ul>' +
        '</td>';

    // Empty cells for Mon - Sun
    for (var weekDay = 0; weekDay < 7; weekDay++) {
        rowHTML += '<td class="table-data"></td>'
    }

    newRow = $('#tdee-table tr:last');
    newRow.html(rowHTML);
    $('#tdee-table tr:last-child td:eq(0)').html(weekStart());

}

// Starting weight - current weight
function calculateProgress(user) {
    var startWeight;
    var currentWeight;

    // Get user's diary
    var url = '/search/' + user + '/';
    $.getJSON(url, function (res) {
        var diary = res.diary;

        // Get starting weight
        for (let i = 0; i < diary.length; i++) {
            if (diary[i].weight) {
                currentWeight = diary[i].weight;
            }
        }
        // Get current weight
        for (let i = diary.length - 1; i > 0; i--) {
            if (diary[i].weight) {
                startWeight = diary[i].weight;
            }
        }

        var diff = round1DP(Math.abs(startWeight - currentWeight));
        $('.user-progress').text(diff);

        // Calculate remaining weight until goal
        var goal = res.goal;
        var remaining = round1DP(currentWeight - goal);
        $('.user-remaining').text(remaining);

    });
}

function setCurrentWeight(user) {
    var url = '/' + user + '/diary';
    $.getJSON(url, function (res) {
        // response = user's diary
        // loop through diary until a weight value is found
        for (let i = res.length - 1; i > 0; i--)
            if (res[i].weight) {
                var currentWeight = round1DP(res[i].weight);
                $('.current-weight').text(currentWeight);
                return;
            }
        console.log('No weight found for \'' + user + '\'');
    });
}

function setUser(name) {
    var url = '/search/' + name;
    var req = $.getJSON(url, function (res) {
        // Get user's details from response
        var age = res.age;
        var height = res.height;
        var name = res.user;
        var sex = res.sex;

        $(".user-age").text(age);
        $(".user-height").text(height);
        $(".user-name").text(name);
        $(".user-sex").text(sex);
    });

}

function submit() {
    var username = $(".user-name").text();
    var weight = $(":input#weight").val();
    var kcal = $(":input#calories").val();
    var date = today();

    if (username && weight && kcal && date) {
        saveJSON(username, date, weight, kcal);
        initialise();
        return true;
    } else {
        showError("submit");
        return false;
    }
}

function saveJSON(user, date, weight, kcal) {
    var url = '/' + user + '/add/' + date + '/' + weight + '/' + kcal;
    $.getJSON(url);
}

function showError(err) {
    if (err == "submit") alert("Please enter a value for weight and calories");
}

function today() {
    var today = new Date();

    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0
    var yyyy = today.getFullYear();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    today = dd + '-' + mm + '-' + yyyy;
    return today;
}

function weekStart() {
    var date = new Date;

    var dd = date.getDate() - date.getDay() + 1;
    var mmm = date.getMonth();
    var yy = date.getFullYear();

    if (dd < 10) dd = '0' + dd;
    mmm = getShortMonth(mmm);
    yy = yy.toString().slice(-2);

    date = dd + '-' + mmm + '-' + yy;
    return date;
}

function getShortMonth(month) {
    switch (month) {
        case 0:
            return "Jan"
        case 1:
            return "Feb"
        case 2:
            return "Mar"
        case 3:
            return "Apr"
        case 4:
            return "May"
        case 5:
            return "Jun"
        case 6:
            return "Jul"
        case 7:
            return "Aug"
        case 8:
            return "Sep"
        case 9:
            return "Oct"
        case 10:
            return "Nov"
        case 11:
            return "Dec"
        default:
            return "???"
    }
}

function round1DP(x) {
    return Number.parseFloat(x).toFixed(1);
}