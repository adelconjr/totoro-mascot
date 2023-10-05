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
        rarity += "&star;";
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

    
    containerBadges.appendChild(container);
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

});