const CONFIGS = {
    MORNING: "MORNING",
    AFTERNOON_1: "AFTERNOON_1",
    AFTERNOON_2: "AFTERNOON_2",
    NIGHT: "NIGHT",
}

const globalConfigs = {
    rain: false,
    version: "0.1"
};

var bg = document.querySelector('img.bg'),
    leftEye = document.getElementById('left-eye'),
    rightEye = document.getElementById('right-eye'),
    eye1 = document.getElementById('eye1'),
    eye2 = document.getElementById('eye2'),
    area = document.getElementById('bg'),
    moon = document.getElementById('moon'),
    indexTxt = 0
    showStars = false,
    allDialogs = []
    timeoutDialog = null,
    dialogs = []
    hour = 0,
    currentConfig = "",
    happyImage = "images/new/2023-09-2023_totoro1-2.png",
    defaultImage = "images/new/2023-09-2023_totoro1.png",
    rainHappyImage = "images/new/totoro_chuva_sorriso1.png",
    rainDefaultImage = "images/new/totoro_chuva1.png",
    firstImage = defaultImage,
    secondImage = globalConfigs.rain ? rainHappyImage : happyImage,
    heartsInterval = null,
    roseTimeout = null,
    monsterTimeout = null,
    rainInterval = null,
    isRain = false,
    heartsShowing = false,
    currentDialogConfig = {
        period: [0, 24],
        config: "MORNING",
        week: "ANY",
        flower: false,
        dialogs: []
    };

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

function showFirstImage() {
    bg.src = firstImage;
}

function showSecondImage() {
    bg.src = secondImage;
}

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
        rose = document.getElementById('sakura');

    clearTimeout(roseTimeout);

    rose.classList.add('show');

    setTimeout(() => {   
        interval = setInterval(() => {
            if(rose.offsetTop == 470) {
                rose.style.top = `${460}px`;
            }
            else {
                rose.style.top = `${470}px`;
            }
        }, 1000);

    }, 1000);

    rose.addEventListener('click', () => {
        rose.classList.remove('show');

        var now = new Date();
        
        if(localStorage.getItem('ROSE') == null) {
            var badges = localStorage.getItem('BADGES');

            if(badges == null) {
                localStorage.setItem('BADGES', "[2]");
            }
            else {
                var attBadges = JSON.parse(badges);
                attBadges.push(2);
                localStorage.setItem('BADGES', JSON.stringify(attBadges));
            }

            localStorage.setItem('ROSE', now.getDate());
            showRoseIcon(true);
            addFriendship(50);
        }
    });

    roseTimeout = setTimeout(() => {
        clearInterval(interval);
        rose.style.top = `${400}px`;
        rose.classList.remove('show');
    }, 20000);
}

function showMonster() {
    var interval  = null, 
        monster = document.getElementById('monster');

    clearTimeout(monsterTimeout);

    monster.classList.add('show');

    monster.addEventListener('click', () => {
        console.log('teste');
        monster.classList.remove('show');

        var now = new Date();
        
        if(localStorage.getItem('MONSTER') == null) {
            var badges = localStorage.getItem('BADGES');

            if(badges == null) {
                localStorage.setItem('BADGES', "[3]");
            }
            else {
                var attBadges = JSON.parse(badges);
                attBadges.push(3);
                localStorage.setItem('BADGES', JSON.stringify(attBadges));
            }

            localStorage.setItem('MONSTER', now.getDate());
            addFriendship(20);
        }
    });

    monsterTimeout = setTimeout(() => {
        clearInterval(interval);
        monster.classList.remove('show');
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
    var ramdomTop = Math.floor(Math.random() * window.innerHeight + 250);
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

    p.innerHTML = txt;

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
    showMoon();

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

function changeMetaColor(color) {
    document.querySelector('meta[name="theme-color"]').setAttribute("content", color);
}

const time = () => {
    var date = new Date();
    hour = date.getHours();

    var xhr = new XMLHttpRequest();

    xhr.open("GET", `dialogs.json?timestamp=${date.getTime()}`, true);

    showRoseIcon(false);

    if (localStorage.getItem('ROSE')) {
        var lastRose = Number(localStorage.getItem('ROSE'));
        var diffRose = Math.abs(lastRose - (new Date()).getDate());
        
        if (diffRose > 0) {
            localStorage.removeItem('ROSE');
        }
        else {
            showRoseIcon(true);
        }
    }

    if (localStorage.getItem('MONSTER')) {
        var lastRose = Number(localStorage.getItem('MONSTER'));
        var diffRose = Math.abs(lastRose - (new Date()).getDate());
        
        if (diffRose > 0) {
            localStorage.removeItem('MONSTER');
        }
    }

    xhr.onreadystatechange = function() {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            loading(false);
            allDialogs = JSON.parse(this.responseText);

            allDialogs.forEach((dialog) => {
                if(hour >= dialog.period[0] && hour < dialog.period[1]) {
                    removeClasses();
                    currentDialogConfig = dialog;
                    currentConfig = dialog.config;
                    dialogs = dialog.dialogs;
                    hideMoon();

                    switch(dialog.config) {
                        default:
                        case CONFIGS.MORNING: 
                            hideStars();
                            document.body.classList.add('day');
                            changeMetaColor("#87CEFA");
                            break;

                        case CONFIGS.AFTERNOON_1: 
                            hideStars();
                            document.body.classList.add('afternoon1');
                            changeMetaColor("#4ad1ff");
                            break;

                        case CONFIGS.AFTERNOON_2: 
                            hideStars();
                            showStars = false;
                            document.body.classList.add('afternoon2');
                            changeMetaColor("#7aa2cb");
                            break;

                        case CONFIGS.NIGHT: 
                            document.body.classList.add('night');
                            changeMetaColor("#191970");
                            night();
                            break;
                    }                    
                }
            
            });

            updateRain();
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

    firstImage = globalConfigs.rain ? rainDefaultImage : defaultImage ;

    if(statusbar.friendship < 40) {
        color = "#FF0000";
        fStatus.innerText = "☹️";

        heartsShowing = false;
        clearInterval(heartsInterval);
    }
    else if(statusbar.friendship >= 40 && statusbar.friendship < 70) {
        color = "#FFA500";
        fStatus.innerText = "🙂";

        heartsShowing = false;
        clearInterval(heartsInterval);
    }
    else if(statusbar.friendship >= 60) {
        color = "#32CD32";
        fStatus.innerText = "🥰";

        firstImage = globalConfigs.rain ? rainHappyImage : happyImage;
        hearts();
    }

    showFirstImage();
    el.style.background = `linear-gradient(to right, ${color} ${statusbar.friendship}%, transparent 5%)`;
}

function subtractFriendship(value) {
    var newValue = statusbar.friendship - value;

    if(newValue < 5) {
        statusbar.friendship = 5;
    }
    else {
        statusbar.friendship = newValue;
    }

    score(value, false);

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

function score(score, plus = true) {
    const el = plus 
        ? document.getElementById('more-score') 
        : document.getElementById('less-score');

    el.innerText = plus ? `+${score}` : `-${score}`;
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
        console.log(localStorage.getItem('LAST_SEEN'));

        var diffMinutes = Math.floor(Math.abs(lastSeen.getTime() - now.getTime()) / 60000);        
        var diffHours = Math.floor(Math.abs((lastSeen.getTime() - now.getTime()) / 3600000));
        var diffDays = diffHours / 24;

        if(diffMinutes < 15) {
            return;
        }
        
        if(diffHours >= 24) {
            subtractFriendship(diffDays * 10);
        }
        else {
            if(diffHours >= 4) {
                var subtractPoints = Math.floor(diffHours / 4);
                subtractFriendship(subtractPoints * 2);
            }
            else {
                addFriendship(5);
                
            }       
        }        
    }

    localStorage.setItem('LAST_SEEN', new Date());
}

function showRoseIcon(op) {
    var icon = document.getElementById('img-collected');

    if(op) {
        icon.classList.add('show');
    }
    else {
        icon.classList.remove('show');
    }
}

function quest() {
    if(localStorage.getItem('QUEST-COMPLETED') && localStorage.getItem('REWARDED')) {
        document.getElementById('quest').classList.remove('show');
        document.getElementById('quest2').classList.remove('show');
        document.getElementById('popup-new-badge').classList.remove('show');
        return;
    }

    var btnNo = document.getElementById('bt-no');
    var btnYes = document.getElementById('bt-yes');
    var initialScale = 1;

    localStorage.setItem('QUEST-DAY', 4);

    if(localStorage.getItem('QUEST-STARTED')) {
        document.getElementById('quest').classList.remove('show');
        document.getElementById('quest2').classList.add('show');
    }

    btnNo.addEventListener('click', function() {
        btnNo.classList.add('hide');
        subtractFriendship(1);

        initialScale = initialScale - 0.1;
        btnNo.style.transform = `scale(${initialScale})`;

        setTimeout(() => {
            btnNo.classList.remove('hide');
        }, 5000);
    }); 

    btnYes.addEventListener('click', function() {
        document.getElementById('quest').classList.remove('show');
        document.getElementById('quest2').classList.add('show');

        localStorage.setItem('QUEST-STARTED', 1);
        localStorage.setItem('QUEST-ACCEPTED_IN', (new Date()));
        addFriendship(10);
    });

    var interv = setInterval(() => {
        var now = new Date();
        var diff = now.getDate() - parseInt(localStorage.getItem('QUEST-DAY'));

        if(diff == 0) {
            var restantHours = 24 - now.getHours();
            var restantMinutes = 59 - now.getMinutes();
            var restantSeconds = 59 - now.getSeconds();

            document.getElementById('quest-hours').innerHTML = restantHours.toString().padStart(2, '0');
            document.getElementById('quest-minutes').innerHTML = restantMinutes.toString().padStart(2, '0');
            document.getElementById('quest-seconds').innerHTML = restantSeconds.toString().padStart(2, '0');

        }
        else {
            document.getElementById('quest').classList.remove('show');
            document.getElementById('quest2').classList.remove('show');
            document.getElementById('popup-new-badge').classList.add('show');

            localStorage.setItem('QUEST-COMPLETED', 1);
            clearInterval(interv);
        }
    }, 1000);


    document.getElementById('btn-reward').addEventListener('click', function() {
        addFriendship(100);
        localStorage.setItem('BADGES', "[1]");
        localStorage.setItem('REWARDED', 1);

        document.getElementById('quest').classList.remove('show');
        document.getElementById('quest2').classList.remove('show');
        document.getElementById('popup-new-badge').classList.remove('show');

    });

}

function main() {
    var h = new Hammer(area);

    h.get('pan').set({ direction: Hammer.DIRECTION_ALL });

    h.on('panmove', (e) => {
        hideBaloon();

        bg.src = globalConfigs.rain ? rainDefaultImage : defaultImage;
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
        showSecondImage();
        var countdownDialog = 2000;

        if(dialogs.length > 0) {
            showBaloon(dialogs[indexTxt]);

            console.log(dialogs[indexTxt]);

            if(dialogs[indexTxt].length > 20) {
                countdownDialog = 3000;
            }

            if(currentDialogConfig.flower && indexTxt == dialogs.length - 1) {
                showRose();
            }

            if(hour >= 6 && hour < 16 && indexTxt == dialogs.length - 1) {
                showMonster();
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
            showFirstImage();
            hideBaloon();
        }, countdownDialog);

        eye1.style.left = '125px';
        eye1.style.top = '362px';

        eye2.style.left = '215px';
        eye2.style.top = '362px';
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

    updateRain();

    time();
    loading(true);
    gameStatus();

    window.addEventListener('focus', function() {
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

function createHeart() {
    var heart = document.createElement('span');
    heart.innerHTML = "💖";
    heart.classList.add('heart');

    var randomLeft = Math.floor(Math.random() * 300);

    heart.style.left = `${randomLeft}px`;
    console.log(heart);
    document.body.appendChild(heart);
}

function hearts() {

    if(!heartsShowing) {
        heartsShowing = true;
        clearInterval(heartsInterval);

        const showHearts = () => {
            setTimeout(createHeart, 2000);
            setTimeout(createHeart, 4000);
            setTimeout(createHeart, 6000);
            setTimeout(createHeart, 8000);
        }

        createHeart();
        showHearts();
        heartsInterval = setInterval(showHearts, 15000);
    }
}

function showMoon() {
    moon.classList.add('show');

    var hours = (new Date()).getHours();

    if(hours >= 0 && hours < 3) {
        moon.classList.add('middle');
    }
    else if(hours >= 3 && hours < 5) {
        moon.classList.add('right');
    }
    else if(hours >= 18 && hours < 22) {
        moon.classList.add('left');
    }
    else if(hours == 22 || hours == 23) {
        moon.classList.add('middle');
    }
}

function hideMoon () {
    moon.classList.remove('show');

    if(!showStars) {
        document.getElementById('starsSky').innerHTML = "";
    }    
}

function hideStars () {
    showStars = false;
    document.getElementById('starsSky').innerHTML = "";
}

function makeRain() {
    var el = document.createElement('span');
    el.classList.add('rain');
    el.style.left = `${Math.floor(Math.random() * window.innerWidth)}px`;

    document.body.appendChild(el);

    setTimeout(() => {
        document.body.removeChild(el);
    }, 5000);
}

function playRain() {
    rainInterval = setInterval(makeRain, 50);

    document.querySelector('.rain-cloud-1').classList.add('show');
    document.querySelector('.rain-cloud-2').classList.add('show');
}

function updateVersion() {
    var version = localStorage.getItem('VERSION');

    if(version == null) {
        localStorage.setItem('VERSION', globalConfigs.version);
    }
    else {
        if(version != globalConfigs.version) {
            localStorage.setItem('VERSION', globalConfigs.version);
            location.reload();
        }
    }
}

function updateRain() {
    var date = new Date();
    var xhr = new XMLHttpRequest();

    xhr.open("GET", `configs.json?timestamp=${date.getTime()}`, true);

    xhr.onreadystatechange = function() {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            var configs = JSON.parse(this.responseText);

            globalConfigs.rain = configs.rain;
            globalConfigs.version = configs.version;
            updateVersion();

            firstImage = globalConfigs.rain ? rainDefaultImage : defaultImage;
            secondImage = globalConfigs.rain ? rainHappyImage : happyImage;

            if(globalConfigs.rain) {
                if(!isRain) {
                    isRain = true;
                    playRain();
                }

                document.body.classList.add('is-rain');
            }
            else {
                isRain = false;
                clearInterval(rainInterval);
                document.querySelector('.rain-cloud-1').classList.remove('show');
                document.querySelector('.rain-cloud-2').classList.remove('show');
                document.body.classList.remove('is-rain');
            }

            loadStatus();
        }
    }

    xhr.send();

    
}

main();
