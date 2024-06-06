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
            
        document.getElementById("dzwonek_tekst").innerHTML = `Dzwonek będzie za: <span class="red_text">${do_dzwonka_minuty}:${do_dzwonka_sekundy}</span>`;
        break;
}}
};
setInterval(check_the_bell, 1000);




async function checkWeather() {
    const apikey = "26d41148a03f9ef6edb92c4787bcbe7b";
    const apiurl = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=Swinoujscie&appid=${apikey}`;
    const response = await fetch(apiurl);
    const data = await response.json();
    console.log(data, "data");
  
    document.getElementById("temperatura_text").innerHTML = `Temperatura:<br><span class="red_text">${Math.round(data.main.temp)} &#8451</span>`;
    document.getElementById("wilgotnosc_text").innerHTML = `Wilgotność: <span class="red_text">${data.main.humidity}%</span>`;
    document.getElementById("wiatr_text").innerHTML = `Wiatr:<br><span class="red_text">${data.wind.speed} km/h</span>`;
  
    let newweathercondition = data.weather[0].id;
    check_condition(newweathercondition);
  }
  
  function check_condition(condition) {
    console.log(condition);
    let imgSrc;
    switch (true) {
      case condition >= 200 && condition <= 232:
        imgSrc = "./images/storm.png";
        break;
      case condition >= 300 && condition <= 321 ||condition >= 701 && condition <= 781 || condition >= 802 && condition <= 804:
        imgSrc = "./images/cloud.png";
        break;
      case condition >= 500 && condition <= 531:
        imgSrc = "./images/rainy-day.png";
        break;
      case condition >= 600 && condition <= 622:
        imgSrc = "./images/snow.png";
        break;
      case condition == 800:
        imgSrc = "./images/sun.png";
        break;
      case condition == 801:
        imgSrc = "http://openweathermap.org/img/wn/02d@2x.png";
        break;
      default:
        console.error("Can't find condition");
        return;
    }
  
    document.getElementById("cloud_img").src = imgSrc;
    console.log("Image should change to:", imgSrc);
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    checkWeather();
    setInterval(checkWeather, 600000);
  });
  

//Skrypt na alerty

const delayLoop = (fn, delay) => {
    return (x, i) => {
      setTimeout(() => {
        fn(x);
      }, i * delay);
    }
  };
const selectedLocations = ["1001", "1007"]; // Świnoujście i Kamień Pomorski

        fetch('https://meteo.imgw.pl/api/meteo/messages/v1/osmet/latest/osmet-teryt')
            .then(response => response.json())
            .then(jsonData => {
                
                selectedLocations.forEach(location => {
                    if (jsonData.teryt[location]) {
                        jsonData.teryt[location].forEach(warningId => {
                            const warning = jsonData.warnings[warningId];
                            if (warning) {
                                document.getElementById('alert_content').innerHTML += `
                                        <h2 class="red_text">${warning.PhenomenonName} (Poziom: ${warning.Level})</h2>
                                        <p class="red_text">${warning.Content}</p>
                                        <p class="red_text">Ważne od: ${warning.ValidFrom} do: ${warning.ValidTo}</p>
                                        <p class="red_text">Prawdopodobieństwo: ${warning.Probability}%</p>
                                        <p class="red_text">${warning.Comments} ${location}</p>
                                `;
                            }
                        });
                    } else {
                          document.getElementById('alert_content').innerHTML = `<span class="green_text zwykly_text">Brak ostrzeżeń :)</span>`;                      
                    }
                });
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                document.getElementById('warnings').innerText = 'Błąd podczas pobierania danych.';
            });



//Skrypt na autobusy

let busPage=1;
async function fetchBusSchedule(url) {
  const proxyUrl = 'http://localhost:8080/'; 
  const response = await fetch(proxyUrl + url, {
      headers: {
          'Origin': 'null',
          'x-requested-with': 'XMLHttpRequest'
      }
  });

  if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

function processBusData(data) {
  return data.rows.map(bus => ({
      line: bus.line_name,
      direction: data.directions[bus.direction_id.toString()],
      platform: bus.platform === '201' ? 'Ludzi Morza - rondo' : 
                bus.platform === '66' ? 'Szkoła Morska' :
                bus.platform === '921' ? 'Fińska' : bus.platform,
      time: bus.is_estimated ? bus.time : bus.static_time
  }));
}

function parseTime(timeString) {
  if (timeString.includes('min')) {
      const minutes = parseInt(timeString.replace('< ', '').replace(' min', ''), 10);
      if (minutes == null){
        minutes = 0;
      }
      const now = new Date();
      return now.setMinutes(now.getMinutes() + minutes);
  } else {
      const [hours, minutes] = timeString.split(':').map(Number);
      return new Date().setHours(hours, minutes, 0, 0);
  }
}

function displayBusSchedule(allBuses) {
  
    

  // Sortowanie autobusów według czasu przyjazdu
  allBuses.sort((a, b) => {
    if (a.time == null){
        a.time==0;
    if (a.time == null){
        a.time==0;
    }
    }
      const timeA = parseTime(a.time);
      const timeB = parseTime(b.time);
      return timeA - timeB;

  });
  if (busPage == 1) {
  document.getElementById('linia_text1').innerHTML = `Linia ${allBuses[0].line}`;
  document.getElementById('harmonogram_text1').innerHTML = `Nastepny autobus odjedzie z <span class="bold_text">(${allBuses[0].platform})</span> za <span class="bold_text red_text">${allBuses[0].time}</span>
   <br>Kierunek: <span class="bold_text">${allBuses[0].direction}</span>`;
  document.getElementById('linia_text2').innerHTML = `Linia ${allBuses[1].line}`;
  document.getElementById('harmonogram_text2').innerHTML = `Nastepny autobus odjedzie z <span class="bold_text">(${allBuses[1].platform})</span> za <span class="bold_text red_text">${allBuses[1].time}</span>
   <br>Kierunek: <span class="bold_text">${allBuses[1].direction}</span>`;
  document.getElementById('linia_text3').innerHTML = `Linia ${allBuses[2].line}`;
  document.getElementById('harmonogram_text3').innerHTML = `Nastepny autobus odjedzie z <span class="bold_text">(${allBuses[2].platform})</span> za <span class="bold_text red_text">${allBuses[2].time}</span>
   <br>Kierunek: <span class="bold_text">${allBuses[2].direction}</span>`;
   console.log("wykryto strone 1");
   document.getElementById('strona').innerHTML = "1/2";
   busPage = 2;
  } 
  else if (busPage == 2) {
  document.getElementById('linia_text1').innerHTML = `Linia ${allBuses[3].line}`;
  document.getElementById('harmonogram_text1').innerHTML = `Nastepny autobus odjedzie z <span class="bold_text">(${allBuses[3].platform})</span> za <span class="bold_text red_text">${allBuses[3].time}</span>
   <br>Kierunek: <span class="bold_text">${allBuses[3].direction}</span>`;
  document.getElementById('linia_text2').innerHTML = `Linia ${allBuses[4].line}`;
  document.getElementById('harmonogram_text2').innerHTML = `Nastepny autobus odjedzie z <span class="bold_text">(${allBuses[4].platform})</span> za <span class="bold_text red_text">${allBuses[4].time}</span>
   <br>Kierunek: <span class="bold_text">${allBuses[4].direction}</span>`;
  document.getElementById('linia_text3').innerHTML = `Linia ${allBuses[2].line}`;
  document.getElementById('harmonogram_text3').innerHTML = `Nastepny autobus odjedzie z <span class="bold_text">(${allBuses[5].platform})</span> za <span class="bold_text red_text">${allBuses[5].time}</span>
   <br>Kierunek: <span class="bold_text">${allBuses[5].direction}</span>`;
   console.log("wykryto strone 2");
   document.getElementById('strona').innerHTML = "2/2";
   busPage = 1}
   
}

async function updateBusSchedule() {
  try {
      const data1 = await fetchBusSchedule('http://swinoujscie.kiedyprzyjedzie.pl/api/departures/1125035:1178829');
      const data2 = await fetchBusSchedule('http://swinoujscie.kiedyprzyjedzie.pl/api/departures/10253:22812');
      const data3 = await fetchBusSchedule('http://swinoujscie.kiedyprzyjedzie.pl/api/departures/1126129:1570841');

      const allBuses = [
          ...processBusData(data1),
          ...processBusData(data2),
          ...processBusData(data3)
      ];

      displayBusSchedule(allBuses);
  } catch (error) {
      console.error('Error fetching bus schedule:', error);
  }
}


document.addEventListener('DOMContentLoaded', () => {
  updateBusSchedule();
  setInterval(updateBusSchedule, 15000);
});
