const weatherIcon = document.createElement('div');
weatherIcon.id = "weather-icon";
let isOpen = false;

document.querySelector('body').appendChild(weatherIcon);

chrome.runtime.onMessage.addListener((msg, sender, response) => {
  const { weatherData } = msg;
  const weather = JSON.parse(weatherData);
  renderWeather(weather);
})

weatherIcon.addEventListener('click', () => {
  const addressElement = document.querySelector('#weather-container');
  if (isOpen) {
    addressElement.style.visibility = 'hidden';
    isOpen = false;
    return;
  }
  sendAddress();
})

const renderWeather = (data) => {
  const { humidity, temp, weather, wind_speed } = data.current;
  const { description, main } = weather[0];
  const weatherContainer = document.createElement('div');
  weatherContainer.id = "weather-container";
  weatherContainer.innerHTML = `<h3>${main} - ${description}</h3>
  <ul><li>temperature: ${temp}</li>
  <li>humidity: ${humidity}</li>
  <li>wind speed: ${wind_speed}</li></ul>
  `;
  document.querySelector('body').appendChild(weatherContainer);
  isOpen = true
}

const sendAddress = () => {
  const addressElement = document.querySelector('.property-info-address');
  if (addressElement) {
    const address = addressElement.innerHTML;
    chrome.runtime.sendMessage({ address });
  }
}

