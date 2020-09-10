document.addEventListener('DOMContentLoaded', function(e){
    loadLandingPageData()
    stateLoader()
    // stateData()
    // userList()
    hideStateSelector()
    hideReportSelector()
    // hideLoginContainer()
    hideNewReport()
})
//#################### constants ##################################
const stateList = []
let currentId = 1

// initial US landing page data //

function loadLandingPageData(){
    fetch('https://api.covidtracking.com/v1/us/current.json')
        .then(function(response){
            return response.json()
        })
        .then(function(data){
            renderLPD(data)
        })
} 

function renderLPD(data){
   
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
    let data ={}
    for(element of selections){
    let newRow = document.createElement('tr')
    let newKey = document.createElement('td')
    newKey.innerText = element.attributes[1].nodeValue
    let newValue = document.createElement('td')
    newValue.innerText = element.attributes[2].nodeValue
    newRow.append(newKey)
    newRow.append(newValue)
    reportTable.append(newRow)

   

    let key= element.name
    let value = element.value
    data[key]=value
    } // end of forEach 
    // console.log(data) 
    saveReport(data)
} // end of render Report Selection 

//save report to rails API 
function saveReport(choices){
    //take selections to make data object 
    // make configOb with data object
    // pass into a post request fetch 
    let data = choices
    let key = 'user_id'
    data[key]=current_id
    console.log(data)
    let options = {
        method: 'POST',
        headers:{
            'content-type': 'application/json',
            'accept': 'application/json'
        },
        body: JSON.stringify(data)
    }
    fetch('http://localhost:3000/reports', options)
        .then(function(response){
            return response.json()
        })
        .then(function(update){
            console.log(update)
        })
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

    const comparingUsers = (userlist) => {
        let userInput = document.getElementById('username').value;
        let passInput = document.getElementById('password').value;
                
        for (user of userlist){
            if (user.username === userInput && user.password === passInput) {
                hideLoginContainer() 
                const stateSelector = document.getElementById("state-selector")
                stateSelector.hidden = false
                currentId = user.id 
                console.log(currentId)
            }      
            else{
            //    window.alert('Incorrect name and password, please register')
             }        
            }
     }
// creating a user//

        const createUser = (uname, pword) => {
            let data = {username: uname, password: pword}
            let options = {
                method: "POST",
                
                headers: {
                    "content-type": "application/json",
                    "accept": "application/json"
                },
                
                body: JSON.stringify(data)
            }
            fetch('http://localhost:3000/users', options)
            .then(function(response){
                return response.json()
            })
            .then(function(data){
                console.log(data)
                hideLoginContainer()
                hideStateSelector()
                currentId = data.id 
            })
        }
    

    /* Assigning Username and password fields to Variable*/
            
    const userList = () => {
        fetch('http://localhost:3000/users')
            .then(function(response){
                return response.json()
            })
            .then(function(data){
                comparingUsers(data)
            })
        }

    /* Handling the click to login */
    document.addEventListener('click', function(e){
        e.preventDefault()
       if (e.target.id === "loginButton") {
        //    console.log(e.target)
         userList()
       } else if (e.target.id === 'register-button') {
        let userInput = document.getElementById('username').value;
        let passInput = document.getElementById('password').value;

        createUser(userInput, passInput)
       }
    })


       function buildStateList(stateData){
        stateList.push(stateData.state)
        let selection = document.createElement('option')
        selection.setAttribute('value',stateData.state)
        selection.innerText=stateData.state
        document.querySelector('#state-dropdown').append(selection)
    }
   
    ////Hide and Show Functions///

    const hideReportSelector  = () => {
        const reportSelector = document.getElementById("report-selector")
    if (reportSelector.hidden === false) { reportSelector.hidden = true }
    }

    const hideStateSelector  = () => {
        const stateSelector = document.getElementById("state-selector")
    if (stateSelector.hidden === false) { stateSelector.hidden = true }
    }

    const hideLoginContainer  = () => {
        const loginContainer = document.getElementById("loginContainer")
    if (loginContainer.hidden === false) { loginContainer.hidden = true }
    }

    const hideNewReport = () => {
        const newReport = document.getElementById("report-display")
    if (newReport.hidden === false) { newReport.hidden = true}
    }