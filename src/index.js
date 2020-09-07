document.addEventListener('DOMContentLoaded', function(e){
    loadLandingPageData()
    stateData()
    userList()
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
    // console.log(data[0])
    let totalCases = data[0].positive
    let totalDeath = data[0].death
    let totalHospitalized = data[0].hospitalized
    let totalRecovered = data[0].recovered
    let currentlyHospitalized = data[0].hospitalizedCurrently

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

const stateData = () => {
    fetch('https://api.covidtracking.com/v1/states/current.json')
        .then(function(response){
            return response.json()
        })
        .then(function (data){
            buildStateList(data)
        })
} // end of stateData

function buildStateList(data){
    console.log(data[0].state)
    for(state of data){
        stateList.push(state.state)
        // console.log(stateList)
    }
    makeStateSelection()
}//end of buildStateList

const stateList = []

function makeStateDropDown(state){
    console.log(state)
    let list= document.querySelector('#state-drop-down')
    let newS = document.createElement('option')
    newS.setAttribute('value', state)
    newS.innerText=state.value
    list.append(newS)
    console.log(newS)
}




function makeStateSelection(stateList){
    stateList.forEach(makeStateDropDown)
}

const userList =() => {
    fetch('http://localhost:3000/users')
        .then(function(response){
            return response.json()
        })
        .then(function(data){
            console.log(data)
        })
    }

