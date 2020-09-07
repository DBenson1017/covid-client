document.addEventListener('DOMContentLoaded', function(e){
    loadLandingPageData()
})

// initial US landing page data

function loadLandingPageData(){
    fetch('https://api.covidtracking.com/v1/us/current.json')
        .then(function(response){
            return response.json()
        })
        .then(function(data){
            renderLPD(data)
        })
} // end loadLandingPageData

function renderLPD(data){
    console.log('entered renderLPD')
    console.log(data[0])
    let totalCases = data[0].positive
    let totalDeath = data[0].death
    let totalHospitalized = data[0].hospitalized
    let totalRecovered = data[0].recovered
    let currentlyHospitalized = data[0].hospitalizedCurrently
    
    console.log(totalCases)

    let totalC=document.querySelector('#total-cases')
    totalC.innerText = totalCases

    let totalD=document.querySelector('#total-death')
    totalD.innerText = totalDeath

    let totalH=document.querySelector('#total-hospitalized')
    totalH.innerText = totalHospitalized

    let totalR=document.querySelector('#total-recovered')
    totalR.innerText = totalRecovered

    let currentlyH=document.querySelector('#currently-hospitalized')
    currentlyH.innerText = currentlyHospitalized
  
    

}