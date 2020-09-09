document.addEventListener('DOMContentLoaded', function(e){
    loadLandingPageData()
    stateData()
   
    hideReportsPage()
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
    // console.log('entered renderLPD')
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
    // console.log(data[0].state)
    for(state of data){
        stateList.push(state.state)
        // console.log(stateList)
    }
    // makeStateSelection()
}
//end of buildStateList

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



// Creating drop Down List//
// function makeStateSelection(stateList){
//     stateList.forEach(makeStateDropDown)
// }

        // Creating a List of user//

 const userList = () => {
    fetch('http://localhost:3000/users')
        .then(function(response){
            return response.json()
        })
        .then(function(data){
            comparingUsers(data)
        })
    }

    const comparingUsers = (userlist) => {
        const userInput = document.getElementById('username').value;
        const passInput = document.getElementById('password').value;
        
        userlist.forEach(user => {
            if (user.username === userInput) {
                console.log("Username Correct")
                if (user.password === passInput) {
                    console.log('Password Correct')
                    return 
                    /* remove login container */
                    /* enable the my page container */
                }
            } 
            else {
                    // window.alert("Incorrect Name and Password, Register or try again.")
            }
            
            })
        }
  

    /* Hide or show the reportsPage */
    const hideReportsPage = () => {
        const reportspage = document.getElementById("reports-page")
    if (reportspage.hidden === false) { reportspage.hidden = true }
    }

    /* Assigning Username and password fields to Variable*/
    
        

    /* Handling the click to login */
    document.addEventListener('click', function(e){
       if (e.target.id === "loginButton") {
           e.preventDefault()
        //    console.log(e.target)
         userList()
       }
    })

    
  // Hiding the login page //
    // document.addEventListener('click', function(e){
    //     if (e.target.id === "navlist"){
    //         e.preventDefault;
    //         const login = document.getElementById("loginContainer")
    //         login.hidden = true
    //     }
    // }