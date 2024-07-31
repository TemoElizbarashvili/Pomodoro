// Timer and state variables
let timerConfig = {
    minutes: 30,
    seconds: 0,
    study: {
        minutes: 30,
        seconds: 0
    },
    rest: {
        minutes: 5,
        seconds: 0
    },
    bigRest: {
        minutes: 15,
        seconds: 0
    }
};

let isStudying = true;
let restCount = 0;
let restInterval = 4;
let timer;
let autoStart = true;
let isPlaying = false;
let isMuted = false;
let totalTime = {
    studied: {
        hours: 0,
        minutes: 0,
        seconds: 0
    },
    rested: {
        hours: 0,
        minutes: 0,
        seconds: 0
    }
};

// DOM elements
const elements = {
    timerText: document.getElementById("timer_text"),
    stateText: document.getElementById("timer_state"),
    resetButton: document.getElementById("reset_button"),
    playButton: document.getElementById("play_button"),
    stopButton: document.getElementById("stop_button"),
    settingsButton: document.getElementById("settings_button"),
    popup: document.getElementById("popup"),
    popupCloseButton: document.getElementById("popup_close"),
    totalStudyTime: document.getElementById("study_time_text"),
    totalRestTime: document.getElementById("rest_time_text"),
    soundIcon: document.getElementById("sound"),
    soundIconMute: document.getElementById("sound_mute"),
    audio: document.getElementById('myAudio'),
    inputs: {
        studyTimeMinutes: document.getElementById("study_time_minutes"),
        studyTimeSeconds: document.getElementById("study_time_seconds"),
        restTimeMinutes: document.getElementById("rest_time_minutes"),
        restTimeSeconds: document.getElementById("rest_time_seconds"),
        bigRestTimeMinutes: document.getElementById("big_rest_time_minutes"),
        bigRestTimeSeconds: document.getElementById("big_rest_time_seconds"),
        timerAutoStartCheck: document.getElementById("timer_auto_start"),
        bigRestInterval: document.getElementById("big_rest_interval")
    }
};

function addEventListeners() {
    elements.soundIcon.addEventListener("click", toggleMute);
    elements.soundIconMute.addEventListener("click", toggleMute);
    elements.inputs.studyTimeMinutes.addEventListener("change", () => updateInputValues('studyTimeMinutes'));
    elements.inputs.studyTimeSeconds.addEventListener("change", () => updateInputValues('studyTimeSeconds'));
    elements.inputs.restTimeMinutes.addEventListener("change", () => updateInputValues('restTimeMinutes'));
    elements.inputs.restTimeSeconds.addEventListener("change", () => updateInputValues('restTimeSeconds'));
    elements.inputs.bigRestTimeMinutes.addEventListener("change", () => updateInputValues('bigRestTimeMinutes'));
    elements.inputs.bigRestTimeSeconds.addEventListener("change", () => updateInputValues('bigRestTimeSeconds'));
    elements.inputs.bigRestInterval.addEventListener("change", () => updateInputValues('bigRestInterval'))
    elements.inputs.timerAutoStartCheck.addEventListener("change", () => {
        autoStart = elements.inputs.timerAutoStartCheck.checked;
    });
    elements.settingsButton.addEventListener("click", () => togglePopup(true));
    elements.popupCloseButton.addEventListener("click", () => togglePopup(false));
    elements.playButton.addEventListener("click", startTimer);
    elements.stopButton.addEventListener("click", stopTimer);
    elements.resetButton.addEventListener("click", resetTimer);
}

function toggleMute() {
    isMuted = !isMuted;
    elements.soundIcon.style.display = isMuted ? 'none' : 'block';
    elements.soundIconMute.style.display = isMuted ? 'block' : 'none';
}

function togglePopup(show) {
    elements.popup.style.visibility = show ? "visible" : "hidden";
    elements.popup.style.scale = show ? 1 : 0.5;
    elements.popup.style.opacity = show ? 1 : 0;
}

function updateInputValues(field) {
    let inputElement = elements.inputs[field];
    if (inputElement.checkValidity()) {
        inputElement.style.color = '#b0b0b0';
        switch (field) {
            case "studyTimeMinutes":
                timerConfig.study.minutes = inputElement.value;
                if (isStudying) {
                    setCorrectTime();
                    updateTimeDisplay();
                }
                break;
            case "studyTimeSeconds":
                timerConfig.study.seconds = inputElement.value;
                if (isStudying) {
                    setCorrectTime();
                    updateTimeDisplay();
                }
                break;
            case "restTimeMinutes":
                timerConfig.rest.minutes = inputElement.value;
                if (!isStudying) {
                    setCorrectTime();
                    updateTimeDisplay();
                }
                break;
            case "restTimeSeconds":
                timerConfig.rest.seconds = inputElement.value;
                if (!isStudying) {
                    setCorrectTime();
                    updateTimeDisplay();
                }
                break;
            case "bigRestTimeMinutes":
                timerConfig.bigRest.minutes = inputElement.value;
                if (!isStudying && restCount % restInterval == 0) {
                    setCorrectTime();
                    updateTimeDisplay();
                }
                break;
            case "bigRestTimeSeconds":
                timerConfig.bigRest.seconds = inputElement.value;
                if (!isStudying && restCount % restInterval == 0) {
                    setCorrectTime();
                    updateTimeDisplay();
                }
                break;
            case "bigRestInterval":
                restInterval = inputElement.value;
                break;
        }

    } else {
        inputElement.style.color = 'red';
    }
}

function updateTimeDisplay() {
    setTimerDisplay(timerConfig.minutes, timerConfig.seconds);
}

function updateInfoDisplay() {
    elements.totalRestTime.innerText = formatTime(totalTime.rested.hours, totalTime.rested.minutes, totalTime.rested.seconds);
    elements.totalStudyTime.textContent = formatTime(totalTime.studied.hours, totalTime.studied.minutes, totalTime.studied.seconds);
}

function setTimerDisplay(minutes, seconds) {
    elements.timerText.textContent = formatTime(null, minutes, seconds);
}

function formatTime(hours, minutes, seconds) {
    if (hours === null) {
        return `${pad(minutes)}:${pad(seconds)}`;
    }
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

function pad(value) {
    return value < 10 ? '0' + value : value;
}

function updateState() {
    elements.stateText.innerText = isStudying ? "Studying" : "Resting";
}

function alarmAudio() {
    alarm = setInterval(() => {
        if (!isMuted) {
            if (timerConfig.seconds === 0 && timerConfig.minutes === 0) {
                elements.audio.play();
            } else {
                elements.audio.pause();
            }
        }
    }, 1000);
}

function startTimer() {
    isPlaying = true;
    changeButtons();
    timer = setInterval(function() {
        if (timerConfig.seconds <= 0) {
            if (timerConfig.minutes <= 0) {
                clearInterval(timer);
                setTimeout(() => {
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
                    } else {
                        isPlaying = false;
                    }
                    changeButtons();
                }, isMuted == true ? 0 : 2000);
            } else {
                timerConfig.minutes--;
                timerConfig.seconds = 59;
                if (isStudying) {
                    if (totalTime.studied.seconds == 59) {
                        if (totalTime.studied.minutes == 59) {
                            totalTime.studied.hours++;
                            totalTime.studied.minutes = 0;
                            totalTime.studied.seconds = 0;
                        } else {
                            totalTime.studied.minutes++;
                            totalTime.studied.seconds = 0;
                        }
                    }
                    totalTime.studied.seconds++;
                } else {
                    if (totalTime.rested.seconds == 59) {
                        if (totalTime.rested.minutes == 59) {
                            totalTime.rested.hours++;
                            totalTime.rested.minutes = 0;
                            totalTime.rested.seconds = 0;
                        } else {
                            totalTime.rested.minutes++;
                            totalTime.rested.seconds = 0;
                        }

                    } else {
                        totalTime.rested.seconds++;
                    }
                }
            }
        } else {
            timerConfig.seconds--;
            if (isStudying) {
                if (totalTime.studied.seconds == 59) {
                    if (totalTime.studied.minutes == 59) {
                        totalTime.studied.hours++;
                        totalTime.studied.minutes = 0;
                        totalTime.studied.seconds = 0;
                    } else {
                        totalTime.studied.minutes++;
                        totalTime.studied.seconds = 0;
                    }
                } else {
                    totalTime.studied.seconds++;
                }
            } else {
                if (totalTime.rested.seconds == 59) {
                    if (totalTime.rested.minutes == 59) {
                        totalTime.rested.hours++;
                        totalTime.rested.minutes = 0;
                        totalTime.rested.seconds = 0;
                    } else {
                        totalTime.rested.minutes++;
                        totalTime.rested.seconds = 0;
                    }

                } else {
                    totalTime.rested.seconds++;
                }
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
    } else {
        isPlaying = false;
        changeButtons();
    }
}

function setCorrectTime() {
    if (!isStudying && restCount % restInterval == 0) {
        timerConfig.minutes = timerConfig.bigRest.minutes;
        timerConfig.seconds = timerConfig.bigRest.seconds;
    } else if (!isStudying) {
        timerConfig.minutes = timerConfig.rest.minutes;
        timerConfig.seconds = timerConfig.rest.seconds;
    } else {
        timerConfig.minutes = timerConfig.study.minutes;
        timerConfig.seconds = timerConfig.study.seconds;
    }
}

function changeButtons() {
    elements.playButton.style.display = isPlaying ? "none" : "block";
    elements.stopButton.style.display = isPlaying ? "block" : "none";
}

function setInputValues() {
    elements.inputs.bigRestTimeSeconds.value = timerConfig.bigRest.seconds;
    elements.inputs.bigRestTimeMinutes.value = timerConfig.bigRest.minutes;
    elements.inputs.restTimeSeconds.value = timerConfig.rest.seconds;
    elements.inputs.restTimeMinutes.value = timerConfig.rest.minutes;
    elements.inputs.studyTimeSeconds.value = timerConfig.study.seconds;
    elements.inputs.studyTimeMinutes.value = timerConfig.study.minutes;
    elements.inputs.bigRestInterval.value = restInterval;
}

function initialize() {
    elements.soundIconMute.style.display = 'none';
    setCorrectTime();
    updateTimeDisplay();
    updateInfoDisplay();
    updateState();
    changeButtons();
    setInputValues();
    alarmAudio();
    addEventListeners();
}

initialize();