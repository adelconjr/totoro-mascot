window.addEventListener('DOMContentLoaded', () => {
    const kiki = document.getElementById('kiki');

    setInterval(() => {
        const left = kiki.offsetLeft;
        const width = kiki.offsetWidth;
        console.log(left);

        if(left < -width) {
            kiki.style.opacity = 0;
            kiki.style.left = `${window.innerWidth + 100}px`;
        }
        else {
            kiki.style.opacity = 1;
            kiki.style.left = `${left - 20}px`;
        }
    }, 1000);
});