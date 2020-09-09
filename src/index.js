document.addEventListener('DOMContentLoaded', function(e){
    loadLandingPageData()
    stateLoader()
    // stateData()
    // userList()
})

//#################### constants ##################################
const stateList = []


// listener on state drop down
document.addEventListener('submit', function(e){
    e.preventDefault()
    console.log(e.target)
    if(e.target.id === 'state-selector'){
        let form = document.querySelector('#state-selector')
        populateReportData(form[0].value)
    } else if (e.target.id==='report-selector'){
        console.log('build report clicked')
        renderReportSelection()
        saveReport()
    }
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

function makeStateDropDown(state){
    console.log(state)
    let list= document.querySelector('#state-drop-down')
    let newS = document.createElement('option')
    newS.setAttribute('value', state)
    newS.innerText=state.value
    list.append(newS)
}


//############# state-based data selector ###################
function populateReportData(state){
    fetch(`https://api.covidtracking.com/v1/states/${state}/current.json`)
        .then(function(response){
            return response.json()
        })
        .then(function(data){
            console.log(data)
            displayData(data)
        })
}


function displayData(hash){
    let fields = [
        'dataQualityGrade',
        'date',
        'death',
        'deathIncrease',
        'deathProbable',
        'hospitalizedCumulative',
        'hospitalizedCurrently',
        'inIcuCurrently',
        'onVentilatorCurrently',
        'negative', 
        'positive', 
        'positiveCasesViral',
        'recovered', 
        'totalTestResults', 
        'totalTestsAntiboby', 
        'positiveTestsAntibody'
    ]
     for (const key in hash){
    // console.log(`${key}:${hash[key]}`)
        if(fields.includes(`${key}`)){
            let reportSelector = document.querySelector('#report-selector')
            
            let box = document.createElement('input')
            box.type='checkbox'
            box.name =`${key}`
            box.value = hash[key]
            
            let lbl = document.createElement('label')
            lbl.for = box.name
            lbl.innerText =`${key}`

            let br = document.createElement('br')

            lbl.append(box)
            lbl.append(br)
            reportSelector.append(lbl)
        }
    }
}

function renderReportSelection(){
    //###### builds table structure
    let reportTable=document.querySelector('#report-table')

    // ##### populates table with selected values
    let selections = document.querySelectorAll('input:checked')
    console.dir(selections)
    for(element of selections){

    console.log(element.attributes[1].nodeValue)
    let newRow = document.createElement('tr')

    let newKey = document.createElement('td')
    newKey.innerText = element.attributes[1].nodeValue
    
    let newValue = document.createElement('td')
    newValue.innerText = element.attributes[2].nodeValue
    debugger
    
    newRow.append(newKey)
    newRow.append(newValue)
    reportTable.append(newRow)
    } // end of forEach 
} // end of render Report Selection 

//save report to rails API 
function saveReport(){
    //take selections to make data object 
    // make configOb with data object
    // pass into a post request fetch 

    let selections = document.querySelectorAll('input:checked')
    let data = {
        
    }
    for(element of selections){
        let key= `${element.attributes[1].nodeValue}`
        let value = parseInt(element.attributes[2].nodeValue, 10)
        
        console.log(key)
        console.log(value)
        data[key]=value

        console.log(data)

    }
} // end of saveReport 










//########### build state list #################
function stateLoader(){
    fetch('https://api.covidtracking.com/v1/states/current.json')
    .then(function(response){
        return response.json()
    })
    .then(function(data){
        separateStates(data)
    })
}

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


    // let fields = [
    //     'dataQualityGrade',
    //     date,
    //     death,
    //     deathIncrease,
    //     deathProbable,
    //     hospitalizedCumulative,
    //     hospitalizedCurrently,
    //     inIcuCurrently,
    //     onVentilatorCurrently,
    //     negative, 
    //     positive, 
    //     positiveCasesViral,
    //     recovered, 
    //     totalTestResults, 
    //     totalTestsAntiboby, 
    //     positiveTestsAntibody
    // ]