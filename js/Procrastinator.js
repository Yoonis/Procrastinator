// createForm() is called from a script in Procrastinator.html. It takes in 2 arguments:
//  1) The CSS selector that will contain the reusable form component "Procrastinator"
//  2) The URL which the form will POST to
// It will instantiate a new instance of Procrastinator for each DOM element with the given CSS selector.
var createForm = function(selector, postURL){
  allSelectors = document.querySelectorAll(selector);
  for (var i = 0; i < allSelectors.length; i++) {
    var myForm = new Procrastinator(allSelectors[i], postURL);
    myForm.initialize();
  }
}

// Procrastinator is a constructor function with 4 properties:
//  1) A parent property to reference the given DOM node
//  2) A urlToPostTo property to reference the given POST URL
//  3) A boolean noiceDisplayed property to control the display/removal of error/success notices
//  4) A formItems array to hold all final form items to be sent in an XHR POST request
var Procrastinator = function(parentNode, postURL){
  this.parent = parentNode;
  this.urlToPostTo = postURL;
  this.noticeDisplayed = false;
  this.formItems = [];
}

Procrastinator.prototype.initialize = function(){
  // Create the following DOM elements: form, ul, input, add button, and submit button
  this.formNode = document.createElement('form');
  this.formNode.method = 'post';
  this.formNode.onsubmit = this.submitArr.bind(this);

  this.ulNode = document.createElement('ul');

  this.inputNode = document.createElement('input');
  // Allow user to add input by pressing the Enter key.
  this.inputNode.onkeydown = this.checkKey.bind(this);

  this.addBtnNode = document.createElement('button');
  this.addBtnNode.appendChild(document.createTextNode(' + '));
  this.addBtnNode.type = 'button';
  // Allow user to add input by clicking the Add button.
  this.addBtnNode.addEventListener('click', this.addItem.bind(this));

  this.submitNode = document.createElement('button');
  this.submitNode.appendChild(document.createTextNode('Submit'));

  // Connect the DOM elements and contain them under the parent element
  this.parent.appendChild(this.formNode);
  this.formNode.appendChild(this.ulNode);
  this.formNode.appendChild(this.inputNode);
  this.formNode.appendChild(this.addBtnNode);
  this.formNode.appendChild(this.submitNode);
}

// addNotice() is triggered by user actions. It takes in 2 arguments:
//  1) A custom message to be displayed above the form
//  2) A CSS selector that styles the custom message
// After the notice is set, the noticeDisplayed property is set to true.
Procrastinator.prototype.addNotice = function(msg, cssSelector){
  if (!this.noticeDisplayed) {
    var noticeDiv = document.createElement('div');
    noticeDiv.classList.add(cssSelector);
    noticeDiv.appendChild(document.createTextNode(msg));
    this.parent.insertBefore(noticeDiv, this.formNode);
    this.noticeDisplayed = true;
  }
}

// delNotice() removes the notice and sets noticeDisplayed back to false.
Procrastinator.prototype.delNotice = function(){
  if (this.noticeDisplayed) {
    this.parent.childNodes[0].remove();
    this.noticeDisplayed = false;
  }
}

// checkKey() verifies if user pressed Enter on the input field, then calls addItem().
Procrastinator.prototype.checkKey = function(event){
  if (event.keyCode == 13){
    event.preventDefault();
    this.addItem();
  }
}

// addItem() clears any existing notice before considering input validity.
// If user attempts to add empty input, an error notice is displayed.
// If user input is valid, addItem() will: 
//  1) Create an li node containing the input value
//  2) Append a delete button wired with delItem() after the new li node
//  3) Append the new li node after the form's ul node
//  4) Clear the input field
Procrastinator.prototype.addItem = function(){
  this.delNotice();
  if (this.inputNode.value) {
    var listItemNode = document.createElement('li');
    listItemNode.appendChild(document.createTextNode(this.inputNode.value));

    var delBtnNode = document.createElement('button');
    delBtnNode.appendChild(document.createTextNode(' - '));
    delBtnNode.type = 'button';
    delBtnNode.addEventListener('click', this.delItem);
    listItemNode.appendChild(delBtnNode); 

    this.ulNode.appendChild(listItemNode);
    this.inputNode.value = "";
  } else {
    this.addNotice('Alas, the input cannot be empty!', 'error');
  }
}

Procrastinator.prototype.delItem = function(){
  this.parentNode.remove();
}

// submitArr() clears any existing notice and prevents page refresh before considering submission validity.
// If user attempts to submit an empty form, an error notice is displayed.
// If the form contains input data, submitArr() will:
//  1) Remove any existing error notice
//  2) Collect all added li nodes
//  3) Populate the formItems array with data from each li node
//  4) Call xhrPost()
Procrastinator.prototype.submitArr = function(){
  this.delNotice();
  event.preventDefault();  
  var ulItems = this.formNode.childNodes[0].getElementsByTagName('li');
  if (ulItems.length == 0) {
    this.addNotice('Alas, the form cannot be empty!', 'error');
  } else {
    for (var i = 0; i < ulItems.length; i++) {
      this.formItems.push(ulItems[i].firstChild.data);
    }
    this.xhrPost();
  }
}

// xhrPost() will:
//  1) Create var objInstance to maintain the context of this
//  2) Open a new XHR POST request to the initially given postURL
//  3) Set the appropriate request header
//  4) Send the formItems array
// If POST succeeds, the form is cleared and a success notice is displayed.
// If POST fails, an error notice is displayed.
Procrastinator.prototype.xhrPost = function(){
  var objInstance = this;
  var xhr = new XMLHttpRequest();
  xhr.open('post', objInstance.urlToPostTo, true);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.onreadystatechange = function(){
    if (xhr.status == 200){
      objInstance.addNotice('Form successfully submitted!', 'success');
      while (objInstance.ulNode.firstChild){
        objInstance.ulNode.removeChild(objInstance.ulNode.firstChild);
      }
    } else {
      objInstance.addNotice('Uhoh, something went wrong!', 'error');
    }
  }
  xhr.send(objInstance.formItems);
}
