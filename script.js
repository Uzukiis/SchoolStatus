const HOUR = 3600;
const MINUTE = 60;
const Dzwonki_lista = [8*HOUR, 8*HOUR + 45*MINUTE, 8*HOUR+50*MINUTE, 9*HOUR + 35*MINUTE,
                    9*HOUR + 40*MINUTE, 10*HOUR + 25*MINUTE, 10*HOUR + 45*MINUTE,
                    11*HOUR + 30*MINUTE, 11*HOUR + 40*MINUTE, 12*HOUR + 25*MINUTE,
                    12*HOUR + 35*MINUTE, 13*HOUR + 20*MINUTE, 13*HOUR + 30*MINUTE,
                    14*HOUR + 15*MINUTE, 14*HOUR + 20*MINUTE, 15*HOUR + 5*MINUTE, 15*HOUR + 10*MINUTE, 15*HOUR + 55*MINUTE] 
function check_the_bell(){
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const czassek = hours * HOUR + minutes * MINUTE + seconds;
    for (let i = 0; i < Dzwonki_lista.length; i++) { 
    if (czassek < Dzwonki_lista[i]) {
        let do_dzwonka_minuty = Math.floor((Dzwonki_lista[i]-czassek)/60);
        let do_dzwonka_sekundy = 60 - seconds;
        switch (do_dzwonka_sekundy){
            case 9: do_dzwonka_sekundy = "09"; break;
            case 8: do_dzwonka_sekundy = "08"; break;
            case 7: do_dzwonka_sekundy = "07"; break;
            case 6: do_dzwonka_sekundy = "06"; break;
            case 5: do_dzwonka_sekundy = "05"; break;
            case 4: do_dzwonka_sekundy = "04"; break;
            case 3: do_dzwonka_sekundy = "03"; break;
            case 2: do_dzwonka_sekundy = "02"; break;
            case 1: do_dzwonka_sekundy = "01"; break;
            case 60: do_dzwonka_sekundy = "00"; break;
        }
            
        document.getElementById("dzwonek_tekst").innerHTML = "Dzwonek będzie za: " + do_dzwonka_minuty+":" + do_dzwonka_sekundy;
        break;
}}
};
setInterval(check_the_bell, 1000);
