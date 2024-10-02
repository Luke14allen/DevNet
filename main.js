let names = [];/*an array to hold the names*/

let agents = [];// array to hold agent's information

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
//prevents autocomplete to run in list.html
if (!(window.location.pathname.includes('list.html'))){
  autocomplete(document.getElementById("name"), agents);
}

//pdf generator
function generatePDF(inp) {
  event.preventDefault(); // prevents the website from refreshing

  // Get the selected value from the input
  if(window.location.pathname.includes('index.html')){
  var selectedValue = document.getElementById('name').value; // Get the input value

  // Split the value to get name and specialization
  var values = selectedValue.split(',');
  var selectedName = values[0] ? values[0].trim() : null; // Get the name and trim
  var selectedSpec = values[1] ? values[1].trim() : null; // Get the specialization and trim
  }
  if(window.location.pathname.includes('list.html')){
    var selectedValue = inp;
    if(selectedValue.includes(',')){
      var values = selectedValue.split(",");
  var selectedName = values[0] ? values[0].trim() : null; // Get the name and trim
  var selectedSpec = values[1] ? values[1].trim() : null; // Get the specialization and trim
    }
    else{
      selectedName = selectedValue.trim();
    }
  }
  // Find the matched agent based on name and specialization
  const matchedAgent = agents.find(agent => 
    agent.name.toLowerCase() === selectedName.toLowerCase() &&
    agent.spec.toLowerCase() === selectedSpec.toLowerCase()
  );

  
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF(); // creating pdf

  doc.setFontSize(16);
  doc.text('Agent Information', 10, 10); // title of pdf
  doc.setFontSize(12);

  // Inputs the agent's information into pdf
  doc.text(`Name: ${matchedAgent.name}`, 10, 30);
  doc.text(`Phone: ${matchedAgent.phone}`, 10, 40);
  doc.text(`Specialization: ${matchedAgent.spec}`, 10, 50);
  doc.text(`Experience: ${matchedAgent.exper}`, 10, 60);

  // Sets the pdf's name to "agentname"_info
  doc.save(`${matchedAgent.name}_info.pdf`); // downloads pdf
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

    const nameCount = arr.reduce((acc, agent) => {
      const agentName = agent.name.toLowerCase();
      acc[agentName] = (acc[agentName]||0) +1;
      return acc;
    }, {});
    /*this checks every name and if it matches the input the letters will be bolded and names show up*/
    for (i = 0; i < arr.length; i++) {
      const agent = arr[i];

      if (agent.name) {  // Only proceed if the agent has a name
        const agentName = agent.name.toLowerCase();
        const nameMatch = agentName.substr(0, val.length) === val.toLowerCase(); 

        // If the input matches the agent's name (or partial name)
        if (nameMatch) {
          c = document.createElement("DIV");

          // Highlight the matched part
          c.innerHTML = "<strong>" + agent.name.substr(0, val.length) + "</strong>"; 
          c.innerHTML += agent.name.substr(val.length); 

          // If there are duplicates, also display specialization in the list
          if (nameCount[agent.name.toLowerCase()] > 1) {
            c.innerHTML += ` (${agent.spec})`;
          }

          // Add hidden input to store agent info
          c.innerHTML += "<input type='hidden' value='" + agent.name + "," + agent.spec + "'>";

          // When the user clicks an item, populate the input field
          c.addEventListener("click", function (e) {
            const selectedValue = this.getElementsByTagName("input")[0].value;
            inp.value = selectedValue;  // puts name (and if there is a specialization) back
            closeAllLists();
          });

          b.appendChild(c);
        }
      }
    }
  });
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

//function to create a table
function populateAgentTable() {
  const tableBody = document.getElementById('agentTable').getElementsByTagName('tbody')[0];

  //keeps track of name counts
  const nameCount = {};
  //loads each agent from csv and adds it to the table
  //each name is able to be clicked and once clicked it will download the agent's information
  agents.forEach(agent => {
    const agentName = agent.name.toLowerCase(); // Normalize name for counting
    // Count occurrences of each agent name
    nameCount[agentName] = (nameCount[agentName] || 0) + 1;

    const row = document.createElement('tr');
    const nameCell = document.createElement('td');

    // If the name count is more than 1, show specialization next to the name
    if (nameCount[agentName] > 1) {
      nameCell.innerHTML = `<a href="#" onclick="generatePDF('${agent.name},${agent.spec}')">${agent.name} (${agent.spec})</a>`;
    } else {
      nameCell.innerHTML = `<a href="#" onclick="generatePDF('${agent.name},${agent.spec}')">${agent.name}</a>`;
    }
      const phoneCell = document.createElement('td');
      phoneCell.textContent = agent.phone;
      
      const specializationCell = document.createElement('td');
      specializationCell.textContent = agent.spec;
      
      const experienceCell = document.createElement('td');
      experienceCell.textContent = agent.exper;

      row.appendChild(nameCell);
      row.appendChild(phoneCell);
      row.appendChild(specializationCell);
      row.appendChild(experienceCell);
      tableBody.appendChild(row);
  });
}
if(window.location.pathname.includes('list.html')){
window.onload = populateAgentTable;
}