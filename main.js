let names = [];/*an array to hold the names*/

let agents = [];

/*this reads the csv and gets the names of the agents and puts it into a list used by the other functions*/
function getNames(){
  /*reads the csv*/
  fetch('realtors.csv')
    /*takes in response and turns it into a string*/
    .then(response => response.text())
    /*csvText is a string created from the function above*/
    .then(csvText =>{
      const rows =csvText.split('\n');/*splits the csv by rows*/
      

      rows.forEach((row,index) => {
        if (index == 0) return; /*skips the first row*/
        const columns = row.split(','); /*splits the row into columns*/
        const name = columns[0];
        const phone = columns[1];
        const spec = columns[2];
        const exper = columns[3];
        
        if (name){/*checks if there is a name*/
          names.push(name); /*adds the name into the array*/
          agents.push({
            name,
            phone,
            spec,
            exper,
          })/* adds agent info into the array */
        }
      })
    })
}

/*calls the auto complete function with the input from the text box and the names array*/
autocomplete(document.getElementById("name"), names);

//pdf generator
async function generatePDF(event){
  event.preventDefault(); // prevents the website from refreshing

  const searchvalue = document.getElementById('name').value.trim().toLowerCase(); // gets the information from the search bar

  const matchedAgent = agents.filter(agent => agent.name.toLowerCase().includes(searchvalue)); //finds the agent from the array

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();// creating pdf

  doc.setFontSize(16);
  doc.text('Agent Information', 10, 10);// title of pdf
  doc.setFontSize(12);

  //inputs the agent's information into pdf
  matchedAgent.forEach((agent,index) => {
    const yOffset = 30 + (index * 40);

    doc.text(`Name: ${agent.name}`, 10, yOffset);
    doc.text(`Phone: ${agent.phone}`, 10, yOffset + 10);
    doc.text(`Specialization: ${agent.spec}`, 10, yOffset + 20);
    doc.text(`Experience: ${agent.exper}`, 10, yOffset + 30);
  })
  //sets the pdf's name to "agentname"_info
  doc.save(`${matchedAgent[0].name}_info.pdf`);//downloads pdf
}

//initializes names from csv
getNames();

function autocomplete(inp, arr){
  /*inp is the text field element and arr is the possible names*/
  var currentFocus;
  /*when someone writes in the text field it executes a function*/
  inp.addEventListener("input", function(e){
    var b, c, i, val = this.value;
    /*closes already opened lists*/
    closeAllLists();
    if (!val){return false;}
    currentFocus = -1;
    /*creates a DIV element that contains the names*/
    b = document.createElement("DIV");
    b.setAttribute("id", this.id +"autocomplete-list");
    b.setAttribute("class", "autocomplete-items");
    this.parentNode.appendChild(b);
    /*this checks every name and if it matches the input the letters will be bolded and names show up*/
    for(i = 0; i < arr.length; i++){
      if(arr[i].substr(0,val.length).toUpperCase() == val.toUpperCase()){
        c = document.createElement("DIV");
        c.innerHTML = "<strong>" + arr[i]. substr(0,val.length) + "</strong>";
        c.innerHTML += arr[i].substr(val.length);
        c.innerHTML += "<input type='hidden' value ='" + arr[i] + "'>";
        /*when name is clicked it puts the full name into the text box then closes the list*/
        c.addEventListener("click", function(e){
          inp.value = this.getElementsByTagName("input")[0].value;
          closeAllLists();
        })
        b.appendChild(c);
      }
    }
  })
/*makes an item "active"*/
function addActive(x){
  if (!x) return false;
  removeACtive(x);
  if (currentFocus >= x.length()) currentFocus = 0;
  if (currentFocus < 0) currentFocus = (x.length -1);
}
/*removes "active" items*/
function removeActive(x){
  for (var i=0; i < x.length; i++) {
    x[i].classList.remove("autocomplete-active');")
  }
}
/*closes the list when called*/
function closeAllLists(elmnt){
  var x = document.getElementsByClassName("autocomplete-items");
  for (var i = 0; i < x.length; i++){
    if (elmnt != x[i] && elmnt != inp){
      x[i].parentNode.removeChild(x[i])
    }
  }
}
/*when ever someone clicks it closes the list*/
document.addEventListener("click", function (e){
  closeAllLists(e.target);
})
}
