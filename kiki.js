const random = (ar) => {
    var current_index = ar.length,
        random_index = 0;

    while(current_index > 0) {
        random_index = Math.floor(Math.random() * current_index);
        current_index--;

        [ar[current_index], ar[random_index]] = [ar[random_index], ar[current_index]];
    }

    return ar;
}

function showHalloweenAward(src, badge_id, score) {
    const img = document.createElement('img');
    img.classList.add('halloween-award');
    img.src = src;

    img.addEventListener('click', function() {
        img.remove();
        addBadge(badge_id);
        addFriendship(score);
    });

    document.body.appendChild(img);
}


function showBadge5 () {
    showHalloweenAward("images/badges/halloween-bala7totoros.png", 5, 5);

}

function showBadge6 () {
    showHalloweenAward("images/badges/halloween-totorogurte.png", 6, 5);
}

function showBadge7 () {
    showHalloweenAward("images/badges/halloween-valda.png", 7, 20);
}

function showBadge8 () {
    showHalloweenAward("images/badges/halloween-luacheia.png", 8, 5);
}

function showBadge9 () {
    showHalloweenAward("images/badges/halloween-luacheia-morango.png", 9, 10);
}

function showBadge10 () {
    showHalloweenAward("images/badges/halloween-luacheia-laranja.png", 10, 15);
}

window.addEventListener('DOMContentLoaded', () => {
    var intervalKiki = null;
    const kiki = document.getElementById('kiki');
    const kikiDialog = document.getElementById('kiki-dialog');
    const probabilidade = [0, 5, 5, 6, 6,  7, 7, 8, 8, 9, 9, 10, 10, 10, 0];

    const showKiki = () => {
        intervalKiki = setInterval(() => {
            const left = kiki.offsetLeft;
            const width = kiki.offsetWidth;
    
            if(left < -width) {
                kiki.style.opacity = 0;
                kiki.style.left = `${window.innerWidth + 100}px`;

                kikiDialog.classList.remove('show');
                kikiDialog.style.left = `${window.innerWidth + 100}px`;

                
                clearInterval(intervalKiki);
                setTimeout(() => {
                    showKiki();
                }, 20000);
            }
            else {
                kiki.style.opacity = 1;
                kiki.style.left = `${left - 20}px`;

                kikiDialog.style.left = `${left + 20 }px`;
            }
        }, 1500);
    }

    showKiki();

    kiki.addEventListener('click', () => {
        const shuffleProbs = random(probabilidade);
        const randomIndex = Math.floor(Math.random() * shuffleProbs.length);

        const randomItem = shuffleProbs[randomIndex];

        var kikiDialogTimeout = null;
        
        clearTimeout(kikiDialogTimeout);

        switch(randomItem) {
            case 0: 
                const randomSubtract = Math.floor(Math.random() * 50);
                subtractFriendship(randomSubtract);
                const kikiDialog = document.getElementById('kiki-dialog');
                kikiDialog.classList.add('show');


                kikiDialogTimeout = setTimeout(() => {
                    kikiDialog.classList.remove('show');
                }, 3000);

                break;
            case 5:
                showBadge5();
                break;

            case 6:
                showBadge6();
                break;

            case 7:
                showBadge7();
                break;

            case 8:
                showBadge8();
                break;

            case 9:
                showBadge9();
                break;

            case 9:
                showBadge10();
                break;
        }
    });
});