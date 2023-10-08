function addBadge(badge, count = 0) {
    var containerBadges = document.getElementById('badges');
    var container = document.createElement('div');
    container.classList.add('badge-item');

    var img = document.createElement('img');
    img.classList.add('badge');
    img.src = badge.image;

    var pTitle = document.createElement('p');
    pTitle.innerText = badge.name;

    var pRarity = document.createElement('p');
    var rarity = "";
    for(let i = 0; i < badge.rarity; i++) {
        rarity += "&starf;";
    }

    pRarity.innerHTML = rarity;

    if(count > 0) {
        var spnCount = document.createElement('span');
        spnCount.classList.add('spn-badge-count');
        spnCount.innerHTML = `&times;${count}`;
        container.appendChild(spnCount);
    }

    container.appendChild(img);    
    container.appendChild(pTitle);
    container.appendChild(pRarity);

    container.addEventListener('click', () => {
        openPopup(true, badge);
    });

    containerBadges.appendChild(container);
}

function openPopup(open = false, badge = []) {
    var popup = document.getElementById('popup-overlay');

    if(open) {
        var rarity = "";
        document.querySelector('img.popup-badge-image').src = badge.image;
        document.querySelector('.popup-badge-name').innerHTML = badge.name;

        for(var i=0;i<badge.rarity;i++) {
            rarity += "&starf;";
        }

        document.querySelector('.popup-badge-rarity').innerHTML = rarity;
        popup.classList.add('show');
    }
    else {
        popup.classList.remove('show');
    }
}

window.addEventListener("DOMContentLoaded", function() {
    var containerBadges = document.getElementById('badges');

    var date = new Date();
    var xhr = new XMLHttpRequest();

    xhr.open("GET", `badges.json?timestamp=${date.getTime()}`, true);

    xhr.onreadystatechange = function() {
        console.log(this.status);
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            var badges = JSON.parse(this.responseText);

            if(localStorage.getItem('BADGES')) {
                var userBadges = JSON.parse(localStorage.getItem('BADGES'));
                

                badges.forEach(badge => {
                    var filter = userBadges.filter(id => badge.id == id);
                    console.log(filter);

                    if(filter.length > 0) {
                        var count = filter.length;

                        addBadge(badge, count);
                    }
                });

            }
            else {
                localStorage.setItem('BADGES', "[]");
            }
        }
    }

    xhr.send();

    document.getElementById('close-popup').addEventListener('click', () => {
        document.getElementById('popup-overlay').classList.remove('show');
    });
});