let timerMinutes = 30;
let timerSeconds = 0;
let studyTimeMinutes = 0;
let studyTimeSeconds = 4;
let restTimeMinutes = 0;
let restTimeSeconds = 10;
let bigRestTimeMinutes = 15;
let bigRestTimeSeconds = 0;
let isStudying = true;
let restCount = 0;
let timer;
let autoStart = false;
let isPlaying = false;
let totalStudiedHours= 0;
let totalStudiedMinutes = 0;
let totalStudiedSeconds = 0;
let totalRestedHours = 0;
let totalRestedMinutes = 0;
let totalRestedSeconds = 0;


let timerTextElement = document.getElementById("timer_text");
let stateText = document.getElementById("timer_state")
let resetButton = document.getElementById("reset_button");
let playButton = document.getElementById("play_button");
let stopButton = document.getElementById("stop_button");
let settingsButton = document.getElementById("settings_button");
let popup = document.getElementById("popup");
let popupCloseButton = document.getElementById("popup_close");
let totalStudyTimeElement = document.getElementById("study_time_text");
let totalRestTimeElement = document.getElementById("rest_time_text");

settingsButton.addEventListener("click", () => {
    popup.style.visibility = "visible";
    popup.style.scale = 1;
    popup.style.opacity = 1;
})

popupCloseButton.addEventListener("click", () => {
    popup.style.visibility = "hidden";
    popup.style.opacity = 0;
    popup.style.scale = .5;

})

playButton.addEventListener("click", () => {
    console.log("clicked play!");
    startTimer();
});

stopButton.addEventListener("click", () => {
    console.log("clicked stop!");

    stopTimer();
})

resetButton.addEventListener("click", () => {
    console.log("clicked reset!");

    resetTimer();
})

function updateState() {
    stateText.innerText = isStudying ? "Studying" : "Resting";
}

function updateTimeDisplay() {
    setTimer(timerMinutes, timerSeconds);
}

function updateInfoDisplay() {
    let hoursDisplay = totalRestedHours < 10 ? '0' + totalRestedHours : totalRestedHours;
    let minutesDisplay = totalRestedMinutes < 10 ? '0' + totalRestedMinutes : totalRestedMinutes;
    let secondsDisplay = totalRestedSeconds < 10 ? '0' + totalRestedSeconds : totalRestedSeconds;
    totalRestTimeElement.innerText = `${hoursDisplay}:${minutesDisplay}:${secondsDisplay}`;
    hoursDisplay = totalRestedHours < 10 ? '0' + totalRestedHours : totalRestedHours;
    minutesDisplay = totalStudiedMinutes < 10 ? '0' + totalStudiedMinutes : totalStudiedMinutes;
    secondsDisplay = totalStudiedSeconds < 10 ? '0' + totalStudiedSeconds : totalStudiedSeconds;
    totalStudyTimeElement.textContent = `${hoursDisplay}:${minutesDisplay}:${secondsDisplay}`;

}

function setTimer(minutes, seconds) {
    let minutesDisplay = minutes < 10 ? '0' + minutes : minutes;
    let secondsDisplay = seconds < 10 ? '0' + seconds : seconds;
    timerTextElement.textContent = `${minutesDisplay}:${secondsDisplay}`;
}

function startTimer() {
    isPlaying = true;
    changeButtons();
    timer = setInterval(function() {
        if (timerSeconds === 0) {
            if (timerMinutes === 0) {
                clearInterval(timer);
                isStudying = !isStudying;
                alert('Time is up!');
                if (!isStudying) {
                    restCount++;
                }
                setCorrectTime();
                updateTimeDisplay();
                updateState();
                if (autoStart) {
                    startTimer();
                    isPlaying = true;
                }
                isPlaying = false;
                changeButtons();
            } else {
                timerMinutes--;
                timerSeconds = 59;
                if (isStudying) {
                    if (totalStudiedMinutes = 59){
                        totalStudiedHours++;
                        totalRestedMinutes = 0;
                        totalRestedSeconds = 0;
                    }
                    else {
                        totalStudiedMinutes++;
                        totalStudiedSeconds = 0;
                    }
                }
                else {
                    totalRestedMinutes++;
                    totalRestedSeconds = 0;
                }
            }
        } else {
            timerSeconds--;
            if (isStudying) {
                totalStudiedSeconds++;
            }
            else {
                totalRestedSeconds++;
            }
        }
        updateTimeDisplay();
        updateInfoDisplay();
    }, 1000);  
}

function stopTimer() {
    clearInterval(timer);
    isPlaying = false;
    changeButtons();
}

function resetTimer() {
    clearInterval(timer);
    setCorrectTime();
    updateTimeDisplay();
    if (autoStart) {
        startTimer();
    }
    else
    {
        isPlaying = false;
        changeButtons();
    }
}

function setCorrectTime() {
    if (!isStudying && restCount == 3) {
        timerMinutes = bigRestTimeMinutes;
        timerSeconds = bigRestTimeSeconds;
        restCount = 0;
    }
    else if (!isStudying) {
        timerMinutes = restTimeMinutes;
        timerSeconds = restTimeSeconds;
    } else {
        timerMinutes = studyTimeMinutes;
        timerSeconds = studyTimeSeconds;
    }
}

function changeButtons() {
    if(isPlaying) {
        playButton.style.display = "none";
        stopButton.style.display = "block";

    }
    else {
        stopButton.style.display = "none";
        playButton.style.display = "block";

    }
}

setCorrectTime();
updateTimeDisplay();
updateInfoDisplay();
updateState();
changeButtons();
//startTimer();