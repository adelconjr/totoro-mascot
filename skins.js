


function main() {
    const skinsSource = "images/new/";
    const iconsSource = "images/skins-icons/";
    const overlay  = document.getElementById('popup-skins-overlay');
    const popup_skins  = document.getElementById('popup-skins');
    const btnSkin = document.getElementById('btn-skins');
    const skin_key = 'SKIN_SELECTED';
    let skins = [];

    const skinSelected = localStorage.getItem(skin_key);
    
    btnSkin.addEventListener('click', () => {
        overlay.classList.add('show');
    }); 

    overlay.addEventListener('click', (e) => {
        if(e.target.id === "popup-skins-overlay") {
            overlay.classList.remove('show');
        }
    });


    const loadSkins = () => {
        const now = new Date().getTime();

        axios.get(`skins.json?t=${now}`)
            .then(response => {
                skins = response.data;
                listSkins();
            });
    }

    const listSkins = () => {
        skins.map(skin => {
            
            const skinItem = document.createElement('div');
            const desc = document.createElement('p');
            desc.innerText = skin.name;
            
            const img = document.createElement('img');
            img.src = `${iconsSource}${skin.icon}`;

            skinItem.appendChild(img);
            skinItem.appendChild(desc);

            skinItem.classList.add('skin-item');

            if(skin.key == skinSelected) {
                skinItem.classList.add('selected');
                setSkinImages(`${skinsSource}${skin.defaultImage}`, `${skinsSource}${skin.happyImage}`);
            }

            popup_skins.appendChild(skinItem);

            skinItem.addEventListener('click', () => {
                const now = new Date().getTime();

                if(skin.id == 2) {
                    localStorage.setItem('RAIN', 'ON');
                }
                else {
                    localStorage.setItem('RAIN', 'OFF');
                }
                
                updateRain();
                localStorage.setItem(skin_key, skin.key);

                setSkinImages(`${skinsSource}${skin.defaultImage}`, `${skinsSource}${skin.happyImage}`);

                const selected = document.querySelector('.skin-item.selected');
                if(selected) {
                    selected.classList.remove('selected');
                }                

                skinItem.classList.add('selected');

                overlay.classList.remove('show');
            });
        });
    }



    loadSkins();
}


main();


