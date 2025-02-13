const userTab=document.querySelector("[data-userWeather]")
const searchTab=document.querySelector("[data-searchWeather]")
const searchContainer=document.querySelector("[data-searchContainer]")
const weatherContainer=document.querySelector(".weather-container")
const grantAcessContainer=document.querySelector(".grantContainer")
const loadingScreenContainer=document.querySelector(".loadingContainer")
const userInfoWeather=document.querySelector(".user-info-weather")

const api_key="d1845658f92b31c64bd94f06f7188c9c";
let currentTab=userTab;
currentTab.classList.add("click-tab")
getFromSessionStorage();

function switchTab(newTab){
    if(newTab !=currentTab){
        currentTab.classList.remove("click-tab")
        currentTab=newTab;
        currentTab.classList.add("click-tab")
        if(!searchContainer.classList.contains("active")){
            
            userInfoWeather.classList.remove("active")
            grantAcessContainer.classList.remove("active")
            searchContainer.classList.add("active")
        }
        else{
            searchContainer.classList.remove("active")
            userInfoWeather.classList.remove("active")
            getFromSessionStorage();
        }     

    }
}
userTab.addEventListener("click", () => {
    //click on your tab
    switchTab(userTab)
})
searchTab.addEventListener("click", () => {
    //click on your tab
    switchTab(searchTab);
})

//check if lat and logn are present in session storage
function getFromSessionStorage(){
    const localCoordinate=sessionStorage.getItem("userCoordinates")
    if(!localCoordinate)
    {
        grantAcessContainer.classList.add("active")  
    }
    else{
        const coordinates=JSON.parse(localCoordinate);
        fetchUserWeatherInfo(coordinates)
    }
    
}
async function  fetchUserWeatherInfo(coordinates){
    const{latitude,lognitude}=coordinates;
    grantAcessContainer.classList.remove("active")  
    loadingScreenContainer.classList.add("active")

    //api call
    try{
          const response= await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${lognitude}&appid=${api_key}&units=metric`);
          const data= await response.json();
          loadingScreenContainer.classList.remove("active");
          userInfoWeather.classList.add("active");
          renderWeatherInfo(data);
    }
    catch(err){
        loadingScreenContainer.classList.remove("active");
    }
    
}
function renderWeatherInfo(weatherInfo){

   const cityName=document.querySelector("[data-cityName]")
   const countryIcon=document.querySelector("[data-country-icon]")
   const weatherDescription=document.querySelector("[data-weatherDescription]")
   const weatherIcon=document.querySelector("[data-cloud-image]")
   const temp=document.querySelector("[data-temp]")
   const windSpeed=document.querySelector("[data-windSpeed]")
   const humidity=document.querySelector("[data-humidity]")
   const cloudness=document.querySelector("[data-clouds]")
   // fetch info from weather info and put in UI
   cityName.innerText = weatherInfo?.name;
   countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
   
   weatherDescription.innerText = weatherInfo?.weather?.[0]?.description;
   weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
   temp.innerText = `${weatherInfo?.main?.temp} ℃`;
   windSpeed.innertext = `${weatherInfo?.wind?.speed} m/s`;
   humidity.innertext = `${weatherInfo?.main?.humidity}%`;
   cloudness.innerText = `${weatherInfo?.clouds?.all}%`;
}
function getLocation(){
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        //HW - show an alert for no gelolocation support available
    }
}
function showPosition(position){
    const userCoordinates = {
        latitude: position.coords.latitude,
        lognitude: position.coords.longitude,
    
    }

    sessionStorage.setItem("userCoordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}
  const grantAcessBtn=document.querySelector("[data-grantAcessBtn]")
  grantAcessBtn.addEventListener("click",getLocation)

  const searchInput=document.querySelector("[data-searchInput]")

  searchContainer.addEventListener("submit",(e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "")
        return;
    else 
    
    fetchSearchWeatherInfo(cityName);
})

async function  fetchSearchWeatherInfo(city) {
    loadingScreenContainer.classList.add("active")
    userInfoWeather.classList.remove("active")
    grantAcessContainer.classList.remove("active")
     

     try{
          const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}&units=metric`)
        const data= await response.json();
        loadingScreenContainer.classList.remove("active")
        userInfoWeather.classList.add("active")
        renderWeatherInfo(data)
     }
     catch(err){

     }

}

