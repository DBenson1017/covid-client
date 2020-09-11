document.addEventListener('DOMContentLoaded', function(e){
    loadLandingPageData()
    stateLoader()  //build state list 
    // userList()
    hideStateSelector()
    hideReportSelector()
    hideLoginContainer()
    hideNewReport()
    //displayUserpage()
})
//#################### constants ##################################
const stateList = []
let currentId = 1

// listener on state drop down
document.addEventListener('submit', function(e){
    console.log(e.target)
    e.preventDefault()
    if(e.target.id === 'state-selector'){
        let form = document.querySelector('#state-selector')
        populateReportData(form[0].value)
        console.log('1')
    } else if (e.target.id==='report-selector'){
        console.log('build report clicked')
        hideReportSelector()
        hideNewReport()
        renderReportSelection()
        // saveReport()
    }
})
/* Handling the click to login */
document.addEventListener('click', function(e){
    console.log(e.target)
    if (e.target.id === "loginButton") {
        e.preventDefault()
        userList()
    } else if (e.target.id === 'register-button') {
        e.preventDefault()
        let userInput = document.getElementById('username').value;
        let passInput = document.getElementById('password').value;
        createUser(userInput, passInput)
    } else if(e.target.id === 'my-reports'){
        e.preventDefault()
        hideStateSelector()
        hideNewReport()
        showReports()
    }
})

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
//########################################################

//############# state-based data selector ###################
function populateReportData(state){
    fetch(`https://api.covidtracking.com/v1/states/${state}/current.json`)
    .then(function(response){
        return response.json()
    })
    .then(function(data){
        console.log('2')
        displayData(data)
    })
}
function displayData(hash){
    console.log('3')
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
        console.log(`4`)
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
        if(element.value){
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
        data[key]=value}
        else if (element.value=== null){
            window.alert(`This state doens't have a value for ${element.name}`)
        }
    } 
    saveReport(data)
} 

//#################### POST Report to API #################
function saveReport(choices){
    let data = choices
    // let key = 'user_id'
    data['user_id']=currentId
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
            //render report from promise return 
        })
} 
//#############################################

//############### SHOW (GET) REPORTS ###############
function showReports(currentId){
    fetch('http://localhost:3000/reports')
    .then(function(response){
        return response.json()
    })
    .then(function(reports){
        console.log(reports)
        parseReports(reports)
    })
}

function parseReports(unParsed){
    // console.log('2')
    unParsed.forEach(sortReports)
}

function sortReports(unsorted){
    console.log(unsorted)
    if(unsorted.user_id === currentId){
        renderReports(unsorted)
    }
}

function renderReports(report){
    console.log(report)
    let reportContainer=document.querySelector('#report-container')
    let reportTable = document.createElement('table')
    reportTable.setAttribute('class', 'table')
    reportTable.innerHTML=
        `<tr>
            <th>Field</th>
            <th>Value</th>
        </tr>`
    for(const key in report){
        if(report[key] != null){
            let row= document.createElement('tr')
            let field = document.createElement('td')
            field.innerText = `${key}`
            let value = document.createElement('td')
            value.innerText=report[key]
            row.append(field)
            row.append(value)
            reportTable.append(row)
            reportContainer.append(reportTable)
        } else {
            // console.log('skiped')
        }   
    }
}

//##############Login and User Functions########

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
     ///######## Comparing users for Login##########
const comparingUsers = (userlist) => {
    let userInput = document.getElementById('username').value;
    let passInput = document.getElementById('password').value;  
    for (user of userlist){
        if (user.username === userInput && user.password === passInput) {
            hideLoginContainer() 
            const stateSelector = document.getElementById("state-selector")
            stateSelector.hidden = false
            hideReportSelector()
            currentId = user.id 
            console.log(currentId)
            }      
        else{
//    window.alert('Incorrect name and password, please register')
        }        
    }
}

///####### Display User Page ##########///
        const displayUserpage = () => {
            let userPage = document.createElement('div');
            userPage.id = "user-page"
            userPage.innerHTML = `
            <form id='user-form'>
            <br><h1>Account Details</h1><br><br>
           
            <fieldset id="fieldset">
            <div id="form-fields">
            <div><label>Name*</label><input type="text" name="name"</div>
            <div><label>Username*</label><input type="text" name="uname"></div>
            <div><label>Email*</label><input type="text" name="name"></div>
            <div><label>Password*</label><input type="password" name="pword"></div>
            <div>
              <label>State*</label>  
              <select>
                <option value=""></option>
                <option value="AK">AK</option>
                <option value="AL">AL</option>
                <option value="AZ">AZ</option>
                <option value="AR">AR</option>
                <option value="CA">CA</option>
                <option value="CO">CO</option>
                <option value="CT">CT</option>
                <option value="DE">DE</option>
                <option value="FL">FL</option>
                <option value="GA">GA</option>
                <option value="HI">HI</option>
                <option value="ID">ID</option>
                <option value="IL">IL</option>
                <option value="IN">IN</option>
                <option value="IA">IA</option>
                <option value="KS">KS</option>
                <option value="LY">LY</option>
                <option value="LA">LA</option>
                <option value="ME">ME</option>
                <option value="MD">MD</option>
                <option value="MA">MA</option>
                <option value="MI">MI</option>
                <option value="MN">MN</option>
                <option value="MS">MS</option>
                <option value="MO">MO</option>
                <option value="MT">MT</option>
                <option value="NE">NE</option>
                <option value="NV">NV</option>
                <option value="NH">NH</option>
                <option value="NJ">NJ</option>
                <option value="NM">NM</option>
                <option value="NY">NY</option>
                <option value="NC">NC</option>
                <option value="ND">ND</option>
                <option value="OH">OH</option>
                <option value="OK">OK</option>
                <option value="OR">OR</option>
                <option value="PA">PA</option>
                <option value="RI">RI</option>
                <option value="SC">SC</option>
                <option value="SD">SD</option>
                <option value="TN">TN</option>
                <option value="TX">TX</option>
                <option value="UT">UT</option>
                <option value="VT">VT</option>
                <option value="VA">VA</option>
                <option value="WA">WA</option>
                <option value="WV">WV</option>
                <option value="WI">WI</option>
                <option value="WY">WY</option>


              </select>
            </div>
            <input type="submit" name="update-button" id="update-button" value="Submit Profile">        
            </div>
            </fieldset>
            </form>
            `
            document.getElementById('body').append(userPage) 
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
        
        function buildStateList(stateData){
            stateList.push(stateData.state)
            let selection = document.createElement('option')
            selection.setAttribute('value',stateData.state)
            selection.innerText=stateData.state
            document.querySelector('#state-dropdown').append(selection)
        }
        //////// initial US landing page data //////////////
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
        
        ////Hide and Show Functions///
        
        const hideReportSelector  = () => {
            const reportSelector = document.getElementById("report-selector")
            if (reportSelector.hidden === false) { reportSelector.hidden = true }
            else if (reportSelector.hidden === true){
                reportSelector.hidden = false
            }
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
        const newReport = document.getElementById("report-table")
        if (newReport.hidden === false) { newReport.hidden = true}
        else if (newReport.hidden === true){
            newReport.hidden = false
        }
    }

    