/*

 ### Basic Reqs
- [ ] Where to store data? (localstorage)
- [ ] How to caputure data? (web form)
- [ ] How to modify data? (update action, delete action)
- [ ] How to view data? (style?)
- [ ] UI/UX considerations (how are we going to use this)

*/

//localStorage interaction function
//get item
var getItem = function(key) {
  return window.localStorage.getItem(key);
}

//create
var createItem = function(key, value) {
  return window.localStorage.setItem(key, value);
}

//update
var updateItem = function(key, value) {
  return window.localStorage.setItem(key, value);
}

//delete
var deleteItem = function(key) {
  return window.localStorage.removeItem(key);
}

//clear everything
var clearEverything = function() {
  return window.localStorage.clear();
}

var keyExists = function(key) {
  var currentValue = getItem(key);
  return currentValue !== null;
}

//add form field
var addInput = (event) => {
  event.preventDefault();
  console.log(event.target.classList[1]);
  if (event.target.classList[1] === 'add-ingredient'){
    $(`.ingredient:first`).clone(true).find(`:input`).val(``).end().appendTo($(`.ingredients-wrapper`));
  }
  if (event.target.id === `add-step`){
    $(`.step:first`).clone(true).find(`:input`).val(``).end().appendTo($(`.directions-wrapper`));
  }
  if (event.target.id === `add-use`){
    if ($(`.use`).length < 10){
      $(`.use:first`).clone(true).find(`:input`).val(``).end().appendTo($(`.uses-wrapper`));
    }
    
  }
  if (event.target.id === `add-type`){
    if ($(`.type`).length < 3){
      $(`.type:first`).clone(true).find(`:input`).val(``).end().appendTo($(`.type-wrapper`));
    }
  }
}

//remove form field
var removeInput = (event) => {
  event.preventDefault();
  if (event.target.classList[1] === 'remove-ingredient'){
    if ($(`.ingredient`).length > 1){
      $(`.ingredient:last`).remove();
    }    
  }
  if (event.target.id === `remove-step`){
    if ($(`.step`).length > 1){
      $(`.step:last`).remove();
    }
  }
  if (event.target.id === `remove-use`){
    if ($(`.use`).length > 1){
      $(`.use:last`).remove();
    }
  }
  if (event.target.id === `remove-type`){
    if ($(`.type`).length > 1){
      $(`.type:last`).remove();
    }
  }
}

//handle submition and store data
var makeSauce = (event) => {
  event.preventDefault();
  //console.log(event.target.form);
  //console.log($('form').serializeArray())
  let data = $(`form`).serializeArray();
  let sauce = {
    ingredients: {},
    directions: {},
    uses: [],
    types: []
  };
  let stepCount = 0;
  for (let i = 0; i < data.length; i++){
    if (data[i][`name`] === `ingredient`){
      sauce.ingredients[data[i][`value`]] = data[++i][`value`];
    }else if (data[i][`name`] === `step`){
      sauce.directions[`Step ${++stepCount}`] = data[i][`value`];
    }else if (data[i][`name`] === `use`){
      sauce.uses.push(data[i][`value`]);
    }else if (data[i][`name`] === `type`){
      sauce.types.push(data[i][`value`]);
    }else{
      sauce[data[i][`name`]] = data[i][`value`];
    } 
  }
  //console.log(sauce)
  addSauceToSelector(sauce.name);
  createItem(sauce.name, JSON.stringify(sauce))
}
//hide display elements and show sauce form
var form = false;
var sauceForm = (event) => {
  event.preventDefault();
  if (form){
    document.getElementById("createSauce").style.display = "none" ;
    document.getElementById("displaySauce").style.display = "block";
    form = false;
  }else{
    document.getElementById("displaySauce").style.display = "none" ;
    document.getElementById("createSauce").style.display = "block";
    form = true;
  }
}

//add sauce to selector
var addSauceToSelector = (sauce) => {
  $(`<option value="${sauce}"">${sauce}</option>`).appendTo($(`.select-sauce`))
}

//display sauce
var displaySauce = (event) => {
  event.preventDefault();
  //console.log(event)
  let sauce = JSON.parse(getItem(event.target.form[0].value));
  //console.log(sauce);
  $displayDescription = $(`.display-description`);
  $displayDescription.html("");
  $sauceDescription = $(`<div class="sacueDescritpion">Description</div>`)
  $description = $(`<div>${sauce.description}</div>`).appendTo($(`<div class="descriptionBox">Description</div>`));
  let useString = sauce.uses.reduce((acc, val) => `${acc}, ${val}`)
  $uses = $(`<div>Uses:${useString}</div>`).appendTo($(`<div class="useBox">Uses</div>`));
  $spice = $(`<div class="spicyBox">Spicyness: ${sauce.spicyness}</div>`);
  $prep = $(`<div class="prepTime">Prep Time: ${sauce.time}</div>`)
  console.log( $description)
  console.log($uses)
  console.log($spice)
  console.log($prep)
  $sauceDescription.append($description).append($uses).append($spice).append($prep);
  $sauceDescription.appendTo($displayDescription);




}

  


///////////////////////////////////////////
//event handlers for the buttons and ... possibly the inputboxes
  //preventdefault on button clicks
$(document).ready(function() {
  document.getElementById("createSauce").style.display = "none";
 
  $(`.add-btn`).click(addInput);
  $(`.remove-btn`).click(removeInput);
  $(`#createButton`).click(makeSauce);
  $(`.create-sauce`).click(sauceForm);
  $(`#load-sauce`).click(displaySauce);


});























