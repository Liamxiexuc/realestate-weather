
const GEO_KEY = '';
const WEATHER_KEY = '';

function sendMessageToContentScript(message) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, message);
  });
}

const getGeocodingData = (address) => {
  const xhr = new XMLHttpRequest();
  return new Promise((resolve, reject) => {
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.response);
        } else {
          reject('error' + xhr.status);
        }
      }
    }
    xhr.open('GET', `http://api.positionstack.com/v1/forward?access_key=${GEO_KEY}&query=${address}`);
    xhr.send();
  })
}

const getWeather = (lat, lon) => {
  const xhr = new XMLHttpRequest();
  return new Promise((resolve, reject) => {
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.response);
        } else {
          reject('error' + xhr.status);
        }
      }
    }
    xhr.open('GET', `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&appid=${WEATHER_KEY}`);
    xhr.send();
  })
}

chrome.tabs.onActivated.addListener(tab => {
  chrome.tabs.get(tab.tabId, current_tab_info => {
    active_tab_id = tab.tabId;
  })
})


chrome.runtime.onMessage.addListener(async (request, sender, response) => {
  const { address } = request;
  const geocodingData = await getGeocodingData(address);
  const geocoding = JSON.parse(geocodingData).data[0];
  const { latitude, longitude } = geocoding;
  console.log(latitude)
  console.log(longitude)
  const weatherData = await getWeather(latitude, longitude);
  sendMessageToContentScript({ weatherData });
})

