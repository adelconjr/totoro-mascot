function addBadge(src) {
    var containerBadges = document.getElementById('badges');

    var img = document.createElement('img');
    img.classList.add('badge');
    img.src = src;

    containerBadges.appendChild(img);    
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
                    console.log(userBadges);
                    var findIndex = userBadges.indexOf(badge.id);
                    if(findIndex > -1) {
                        addBadge(badge.image);
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