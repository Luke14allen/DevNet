/*getNames() only works if run in a server*/
getNames();
let names = [];/*an array to hold the names*/
/*var names = ["John Smith", "Emma Johnson", "Michael Brown", "Sophia Davis", "William Wilson", "Olivia Martinez", "James Taylor", "Ava Anderson", "Benjamin Thomas", "Mia Jackson", "Charlotte White", "Daniel Harris", "Emily Clark", "Alexander Lewis", "Sofia Lee", "Matthew Walker", "Amelia Hall", "Joseph Allen", "Evelyn Young", "David King", "Harper Scott", "Christopher Green", "Abigail Baker", "Andrew Nelson", "Elizabeth Carter", "Ryan Mitchell", "Scarlett Perez", "Nicholas Roberts", "Grace Turner", "Samuel Phillips", "Chloe Campbell", "Jonathan Parker", "Zoey Evans", "Christopher Edwards", "Penelope Collins", "Tyler Stewart", "Audrey Sanchez", "Brandon Morris", "Claire Rogers", "Nathan Reed", "Skylar Cook", "Isaac Morgan", "Paisley Bell", "Luke Murphy", "Hannah Bailey", "Owen Rivera", "Nora Cooper", "Gabriel Richardson", "Lily Cox", "Caleb Howard", "Layla Ward", "Julian Torres", "Zoe Peterson", "Connor Gray", "Madelyn Ramirez", "Lincoln James", "Aubrey Watson", "Cameron Brooks", "Autumn Kelly", "Landon Sanders", "Bella Price", "Jeremiah Bennett", "Savannah Wood", "Easton Barnes", "Arianna Ross", "Robert Henderson", "Valentina Coleman", "Axel Jenkins", "Willow Perry", "Grayson Powell", "Ruby Long", "Leo Butler", "Ivy Simmons", "Hudson Foster", "Emilia Washington", "Ezra Gonzales", "Stella Bryant", "Luca Alexander", "Nova Russell", "Kai Griffin", "Delilah Diaz", "Silas Hayes", "Gianna Myers", "Levi Ford", "Isabelle Hamilton", "Asher Graham", "Naomi Sullivan", "Elias Wallace", "Athena Woods", "Harrison West", "Eden Cole", "Nolan Hawkins", "Zuri Snyder", "Felix Cunningham", "Tommy Mcroskey", "Atlas Reeves", "Mila Burns", "Atticus Gordon", "Elliana Watkins", "River Nichols", "Aurora Olson"]
*/
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
        
        if (name){/*checks if there is a name*/
          names.push(name); /*adds the name into the array*/
        }
      })
    })
}

/*calls the auto complete function with the input from the text box and the names array*/
autocomplete(document.getElementById("name"), names);