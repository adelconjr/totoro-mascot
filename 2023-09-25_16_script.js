const CONFIGS = {
    MORNING: "MORNING",
    AFTERNOON_1: "AFTERNOON_1",
    AFTERNOON_2: "AFTERNOON_2",
    NIGHT: "NIGHT",
}

var bg = document.querySelector('img.bg'),
    leftEye = document.getElementById('left-eye'),
    rightEye = document.getElementById('right-eye'),
    eye1 = document.getElementById('eye1'),
    eye2 = document.getElementById('eye2'),
    area = document.getElementById('bg'),
    indexTxt = 0
    showStars = false,
    allDialogs = []
    timeoutDialog = null,
    dialogs = []
    hour = 0,
    currentConfig = "";

const statusbar = {
    friendship: 0,
    lastConfigInteraction: ""
}

var canvas1 = {
        width: leftEye.offsetWidth,
        height: leftEye.offsetHeight,
        top: leftEye.offsetTop,
        left: leftEye.offsetLeft
    },
    canvas2 = {
        width: rightEye.offsetWidth,
        height: rightEye.offsetHeight,
        top: rightEye.offsetTop,
        left: rightEye.offsetLeft
    };

canvas1.center = [canvas1.left + canvas1.width / 2, canvas1.top + canvas1.height / 2];
canvas1.radius = canvas1.width / 2;

canvas2.center = [canvas2.left + canvas2.width / 2, canvas2.top + canvas2.height / 2];
canvas2.radius = canvas2.width / 2;

function loading(op) {
    var elem = document.getElementById('loading');

    if(op) {
        elem.style.display = 'block'
    }
    else {
        elem.style.display = 'none'
    }
}

function limit(x, y, canvas) {
    var dist = distance([x, y], [canvas.center[0] - 5, canvas.center[1] - 5]);

    if (dist <= canvas.radius) {
        return {x: x, y: y};
    } 
    else {
        x = x - canvas.center[0] - 5;
        y = y - canvas.center[1] - 5;
        var radians = Math.atan2(y, x);
        return {
            x: Math.cos(radians) * (canvas.radius - 5) + (canvas.center[0] - 5),
            y: Math.sin(radians) * (canvas.radius - 5) + (canvas.center[1] - 5)
        }
    }
}

function distance(dot1, dot2) {
    var x1 = dot1[0],
        y1 = dot1[1],
        x2 = dot2[0],
        y2 = dot2[1];

    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

function showRose() {
    var interval  = null, 
        rose = document.getElementById('rose');

    rose.classList.add('show');

    interval = setInterval(() => {
        if(rose.offsetTop == 400) {
            rose.style.top = `${410}px`;
        }
        else {
            rose.style.top = `${400}px`;
        }
    }, 1000);

    rose.addEventListener('click', () => {
        rose.classList.remove('show');
        addFriendship(20);
    });

    setTimeout(() => {
        clearInterval(interval);
        rose.style.top = `${400}px`;
        rose.classList.remove('show');
    }, 20000);
}


function animate(sheet) {
    var size = window.innerWidth;
    var direction = 'left';
    var defaultTransform = 'rotateX(190deg) rotateZ(10deg)';

    sheet.style.transform = `rotate(-130deg) ${defaultTransform}`;

    var interval1 = setInterval(() => {
        if(sheet.offsetLeft < size) {
            var randomDistance = Math.floor(Math.random() * 40 + 10);

            sheet.style.left = sheet.offsetLeft + randomDistance + "px";                    
        }
        else {
            clearInterval(interval1);
            clearInterval(interval2);
            clearInterval(interval3);
            document.body.removeChild(sheet);
        }
    }, 500);

    var interval3 = setInterval(() => {
        var randomTop = Math.floor(Math.random() * 20);
        sheet.style.top = sheet.offsetTop + randomTop + "px";
    }, 5000);

    var interval2 = setInterval(() => {
        if(direction == 'left') {
            direction = 'right';
            sheet.style.transform = `rotate(-135deg) ${defaultTransform} translateY(-10px)`;
        }
        else {
            direction = 'left';
            sheet.style.transform = `rotate(-125deg) ${defaultTransform}`;
        }
    }, 1000);
}

function draw() {
    var sheet = document.createElement('img');
    sheet.classList.add('sheet');
    sheet.src = "images/folhas.png";
    var ramdomTop = Math.floor(Math.random() * window.innerHeight + 100);
    sheet.style.top = ramdomTop + "px";

    var randomTransition = Math.floor(Math.random() * 3 + 1);

    sheet.style.transition = `${randomTransition}s all linear`;

    document.body.appendChild(sheet);
    animate(sheet);
}

function cloudAnimation() {
    var cloud = document.getElementById('cloud'),
        randomTop = Math.floor(Math.random() * 200 + 20),
        interval = null;
    

    const first = () => {
        cloud.style.top = `${randomTop}px`;
        cloud.style.transition = '10s left linear';                
    }

    const animate = () => {
        cloud.style.left = `${cloud.offsetLeft + 50}px`;

        if(cloud.offsetLeft > window.innerWidth || cloud.offsetLeft > 500) {                    
            clearInterval(interval);

            cloud.style.transition = "none";
            cloud.style.left = '-240px';
            
            setTimeout(() => {
                first();
                interval =  setInterval(animate, 10000);
            }, 5000);
        }                
    }

    first();
    animate();
    interval =  setInterval(animate, 10000);
}

function showBaloon(txt) {
    var balloon = document.getElementById('baloon');
    var p = document.getElementById('txtBaloon');

    p.innerText = txt;

    balloon.style.display = 'block';
    p.style.display = 'block';
}

function hideBaloon() {
    var balloon = document.getElementById('baloon');
    var p = document.getElementById('txtBaloon');
    balloon.style.display = 'none';
    p.style.display = 'none';
}


function night() {
    if(!showStars) {
        showStars = true;
        var sky = document.getElementById('starsSky');

        for(var i=0;i< 100; i++) {
            var star = document.createElement('span');
            star.classList.add('star');
            var randomLeft = Math.floor(Math.random() * window.innerWidth);
            var randomTop = Math.floor(Math.random() * 600);

            star.style.left = `${randomLeft}px`;
            star.style.top = `${randomTop}px`;
            sky.appendChild(star);
        }
    }
}

const time = () => {
    var date = new Date();
    hour = date.getHours();

    var xhr = new XMLHttpRequest();

    xhr.open("GET", `dialogs.json?timestamp=${date.getTime()}`, true);

    xhr.onreadystatechange = function() {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            loading(false);
            allDialogs = JSON.parse(this.responseText);

            allDialogs.forEach((dialog) => {
                if(hour >= dialog.period[0] && hour < dialog.period[1]) {
                    removeClasses();
                    currentConfig = dialog.config;
                    dialogs = dialog.dialogs;

                    switch(dialog.config) {
                        default:
                        case CONFIGS.MORNING: 
                            document.body.classList.add('day');
                            break;

                        case CONFIGS.AFTERNOON_1: 
                            document.body.classList.add('afternoon1');
                            break;

                        case CONFIGS.AFTERNOON_2: 
                            document.body.classList.add('afternoon2');
                            break;

                        case CONFIGS.NIGHT: 
                            document.body.classList.add('night');
                            night();
                            break;
                    }                    
                }
            
            });
        }
    }

    xhr.send();            
}

function removeClasses() {
    document.body.classList.remove('day');
    document.body.classList.remove('afternoon1');
    document.body.classList.remove('afternoon2');
    document.body.classList.remove('night');
}

function loadStatus() {
    if(localStorage.getItem('FRIENDSHIP') != null) {
        statusbar.friendship = Number(localStorage.getItem('FRIENDSHIP'));
    }
    else {
        localStorage.setItem('FRIENDSHIP', "5");
        statusbar.friendship = 5;
    }

    updateFriendship();
}

function updateFriendship() {
    localStorage.setItem('FRIENDSHIP', statusbar.friendship);
    var el = document.getElementById('friendship');
    var fStatus = document.getElementById('friendship-status');

    if(statusbar.friendship < 40) {
        color = "#FF0000";
        fStatus.innerText = "☹️";
    }
    else if(statusbar.friendship >= 40 && statusbar.friendship < 70) {
        color = "#FFA500";
        fStatus.innerText = "🙂";
    }
    else if(statusbar.friendship >= 60) {
        color = "#32CD32";
        fStatus.innerText = "🥰";
    }

    el.style.background = `linear-gradient(to right, ${color} ${statusbar.friendship}%, transparent 5%)`;
}

function subtractFriendship(value) {
    console.log('subtract', value);
    var newValue = statusbar.friendship - value;

    if(newValue < 5) {
        statusbar.friendship = 5;
    }
    else {
        statusbar.friendship = newValue;
    }

    updateFriendship();
}

function addFriendship(value) {
    var newValue = statusbar.friendship + value;

    if(newValue < 100) {
        statusbar.friendship = newValue;
    }
    else {
        statusbar.friendship = 100;
    }

    score(value);

    updateFriendship();
}

function updateLastConfig(current_config) {
    localStorage.setItem('LAST_CONFIG_INTERACTION', current_config);
    statusbar.lastConfigInteraction = current_config;
}

function score(score) {
    const el = document.getElementById('more-score');

    el.innerText = `${score}+`;
    el.classList.add('show');

    setTimeout(() => {
        el.classList.remove('show');
    }, 2000);
}

function gameStatus() {
    loadStatus();

    var lastSeen = null;
    var now = new Date();

    if(localStorage.getItem('LAST_CONFIG_INTERACTION') != null) {
        statusbar.lastConfigInteraction = localStorage.getItem('LAST_CONFIG_INTERACTION');
    }
    
    if(localStorage.getItem('LAST_SEEN') != null) {
        lastSeen = new Date(localStorage.getItem('LAST_SEEN'));
        
        var diffDays = lastSeen.getDay() - now.getDay();
        console.log('diff days', diffDays);
        
        if(diffDays >= 1) {
            subtractFriendship(diffDays * 10);
            localStorage.setItem('LAST_SEEN', new Date());
        }
        else {

            var diff = Math.floor(Math.abs(lastSeen.getTime() - now.getTime()) / 60000);
            console.log('diff hours', diffDays);

            if(diff >= 15) {
                if(diff < 60) {
                    addFriendship(5);
                }
                else {
                    var diffHours = Math.floor(diff / 60);
    
                    if(diffHours >= 4) {
                        var subtractPoints = Math.floor(diffHours / 4);
                        subtractFriendship(subtractPoints * 2);
                    }
                }

                localStorage.setItem('LAST_SEEN', new Date());
            }            
        }        
    }
    else {
        localStorage.setItem('LAST_SEEN', new Date());
    }
}

function main() {
    var h = new Hammer(area);

    h.get('pan').set({ direction: Hammer.DIRECTION_ALL });

    h.on('panmove', (e) => {
        hideBaloon();

        bg.src = "images/2023-09-2023_totoro.png";
        var x = e.changedPointers[0].x;
        var y = e.changedPointers[0].y;
        
        var result1 = limit(x, y, canvas1);

        eye1.style.left = result1.x + 'px';
        eye1.style.top = result1.y + 'px';

        var result2 = limit(x, y, canvas2);

        eye2.style.left = result2.x + 'px';
        eye2.style.top = result2.y + 'px';
    });

    h.on('panend', (e) => {
        bg.src = "images/2023-09-2023_totoro2.png";
        var countdownDialog = 2000;

        if(dialogs.length > 0) {
            showBaloon(dialogs[indexTxt]);

            console.log(dialogs[indexTxt]);

            if(dialogs[indexTxt].length > 20) {
                countdownDialog = 3000;
            }

            if(hour >= 5 && hour < 12 && indexTxt == dialogs.length - 1) {
                showRose();
            }

            indexTxt++;

            if(indexTxt == dialogs.length) {
                indexTxt = 0;

                if(statusbar.lastConfigInteraction != currentConfig) {
                    addFriendship(10);
                    updateLastConfig(currentConfig);
                }                
            }
        }

        clearTimeout(timeoutDialog);

        timeoutDialog = setTimeout(() => {
            bg.src = "images/2023-09-2023_totoro.png";
            hideBaloon();
        }, countdownDialog);

        eye1.style.left = '125px';
        eye1.style.top = '262px';

        eye2.style.left = '215px';
        eye2.style.top = '262px';
    });

    cloudAnimation();

    draw();

    setTimeout(draw, 2000);
    setTimeout(draw, 4000);

    setInterval(draw, 5000);
    setInterval(draw, 10000);
    setInterval(draw, 12000);
    setInterval(draw, 14000);

    setInterval(time, 5000);

    document.body.classList.add('day');

    time();
    loading(true);
    gameStatus();

    window.addEventListener('focus', function() {
        console.log('focus');
        gameStatus();
    });

    if(localStorage.getItem('MSG') === null) {
        const banner = document.getElementById('msg');
        const closeButton = document.getElementById('close-banner');

        banner.classList.add('show');

        closeButton.addEventListener('click', function() {
            localStorage.setItem('MSG', 'LIDA');
            banner.classList.remove('show');
        });
    }
}

main();
