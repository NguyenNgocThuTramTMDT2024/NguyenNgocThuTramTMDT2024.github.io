
function getCurrentDateTime() {
const now = new Date();
const date = now.toLocaleDateString();
const time = now.toLocaleTimeString();
document.getElementById('submitTime').innerText = date +
" " + time;
}
// Khi trang tải hoàn tất, lấy ngày giờ hiện tại
window.onload = function() {
getCurrentDateTime();
};

// Hàm lấy thông tin từ form
function getUserInfo() {

    const subject = $("#userSubject").val();
    const teacher = $("#userName").val();
    const student = $("#nameStudent").val();

    if (subject.trim() === "" || teacher.trim() === "" || student.trim() === "") {
        alert("Vui long nhap day du thong tin.");
        return null;
    }

    return {
        subject: subject,
        teacher: teacher,
        student: student
    };
}

// Hàm lấy điểm các tiêu chí
function getCriteriaScores() {

    const scores = {};
    let sum = 0;
    const totalCriteria = 11;
    let completed = true;

    for (let i = 1; i <= totalCriteria; i++) {

        const selectedIndex = $('input[name="' + i + '"]:checked').parent().index();

        if (selectedIndex === -1) {
            completed = false;
        } else {
            scores["Tiêu chí " + i] = selectedIndex;
            sum += selectedIndex;
        }
    }

    return {
        scores: scores,
        sum: sum,
        completed: completed,
        total: totalCriteria
    };
}

// Hàm tính điểm trung bình
function calculateAverage(criteriaData) {

    if (!criteriaData.completed) {
        return "Chưa hoàn thành đánh giá";
    }

    const avg = (criteriaData.sum / criteriaData.total).toFixed(2);
    return avg;
}

// Hàm tạo JSON khảo sát
function createSurveyJSON(userInfo, scores, averageText) {

    const surveyData = {
        courseName: userInfo.subject,
        teacherName: userInfo.teacher,
        studentName: userInfo.student,
        submitTime: $("#submitTime").text(),
        criteria: scores,
        averageScore: averageText
    };

    return JSON.stringify(surveyData, null, 4);
}

// Hàm hiển thị JSON
function displayJSON(jsonText) {

    if ($("#jsonResult").length === 0) {
        $("body").append("<pre id='jsonResult'></pre>");
    }

    $("#jsonResult").text(jsonText);
}

// Hàm lưu khảo sát
function saveSurveyInfo() {

    const userInfo = getUserInfo();
    if (userInfo === null) return;

    const criteriaData = getCriteriaScores();

    const averageText = calculateAverage(criteriaData);

    $("h3").text("Trung bình điểm của giảng viên: " + averageText);

    const jsonText = createSurveyJSON(
        userInfo,
        criteriaData.scores,
        averageText
    );

    displayJSON(jsonText);
}

// Gắn sự kiện khi trang load
$(document).ready(function () {

    getCurrentDateTime();

    $("#saveBotton").on("click", saveSurveyInfo);

});