document.addEventListener('DOMContentLoaded', function(e){
    loadLandingPageData()
    // stateData()
    // userList()
})

//#################### constants ##################################
const stateList = []

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


// const stateData = () => {
//     fetch('https://api.covidtracking.com/v1/states/current.json')
//         .then(function(response){
//             return response.json()
//         })
//         .then(function (data){
//             buildStateList(data)
//         })
// } // end of stateData

// function buildStateList(data){
//     console.log(data[0].state)
//     for(state of data){
//         stateList.push(state.state)
//         // console.log(stateList)
//     }
//     makeStateSelection()
// }//end of buildStateList



function makeStateDropDown(state){
    console.log(state)
    let list= document.querySelector('#state-drop-down')
    let newS = document.createElement('option')
    newS.setAttribute('value', state)
    newS.innerText=state.value
    list.append(newS)
    console.log(newS)
}




// function makeStateSelection(stateList){
//     stateList.forEach(makeStateDropDown)
// }

// const userList =() => {
//     fetch('http://localhost:3000/users')
//         .then(function(response){
//             return response.json()
//         })
//         .then(function(data){
//             console.log(data)
//         })
//     }

// ###################### 

//state API 
// listener on state drop down
document.addEventListener('submit', function(e){
    e.preventDefault()
    console.log(e.target)
    if(e.target.id === 'state-selector'){
        let form = document.querySelector('#state-selector')
        console.log(form[0].value)
        populateReportData(form[0].value)
    }
})
//state fetch based on drop down 
function populateReportData(state){
    fetch(`https://api.covidtracking.com/v1/states/${state}/current.json`)
        .then(function(response){
            return response.json()
        })
        .then(function(data){
            // console.log(data)
            destructureData(data)
        })
}


function destructureData(hash){
    
    let newData = {
        dataQualityGrade,
        date,
        death,
        deathIncrease,
        deathProbable,
        hospitalizedCumulative,
        hospitalizedCurrently,
        inIcuCurrently,
        onVentilatorCurrently,
        negative, 
        positive, 
        positiveCasesViral,
        recovered, 
        totalTestResults, 
        totalTestsAntiboby, 
        positiveTestsAntibody
    } = hash 
    console.log(hash)
    console.log(newData)
    


}

function renderReportSelector(){
    let form = document.querySelector('#report-selector')





}










fetch('https://api.covidtracking.com/v1/states/oh/current.json')
    .then(function(response){
        return response.json()
    })
    .then(function(data){
        console.log(data)
    })

//########### build state list #################
    fetch('https://api.covidtracking.com/v1/states/current.json')
    .then(function(response){
        return response.json()
    })
    .then(function(data){
        separateStates(data)
    })

    function separateStates(array){
        array.forEach(buildStateList)
    }

    function buildStateList(stateData){
        stateList.push(stateData.state)
        let selection = document.createElement('option')
        selection.setAttribute('value',stateData.state)
        selection.innerText=stateData.state
        document.querySelector('#state-dropdown').append(selection)
    }
    //#########################