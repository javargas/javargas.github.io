
/* ============================
// HO TO USE IN MODULES
==============================
/* * /

//  Pass to nex step in the process
recDssState.nextStep();

// Register an observer
recDssState.subscribe((step) => {
    // handler code here
});

// Add a validation function
recDssState.addValidator(step, validateFunction );

// Save data in global object
recDssState.setData( key ,  localDataObject); 

// Get data from global object
recDssState.getData( key = null); 
/* */

/* ==========================
// Framework global object
===========================*/

const RecDssState = function() {
  // Private variables
  var activeStep = 1; // current step in the checkout process
  var observers = []; // observers modules
  var validators = []; // Validator functions per step

  // Get the existing data
  var existing = sessionStorage.getItem("recDssState");

  // If no existing data, use the value by itself
  // Otherwise, add the new value to it
  var data = existing ? JSON.parse(existing) : {};

  /* Private functions */
  function saveData() {
    console.log("saving data ", data);
    sessionStorage.setItem("recDssState", JSON.stringify(data));
  }

  function notify(data) {
    observers.forEach((observer) => observer(data));
  }
  
  /* Public functions */
  function subscribe(f) {
    observers.push(f);
  }

  function unsubscribe(f) {
    observers = observers.filter((subscriber) => subscriber !== f);
  }

  function addValidator(step, validate){
    if (typeof validators[step] == "undefined") {
        validators[step] = [];
    }

    validators[step].push(validate);
  }

  function nextStep() {
    let canContinue = true;

    if (typeof validators[activeStep] != "undefined") {
      validators[activeStep]
      .forEach(
          (validator) => {
              if (!validator()) {
                  canContinue = false;
              }
          }
      );
    }

    if (canContinue) {
        console.log("continue to the next step: ", data);
        saveData();
        notify(++activeStep);
    }

    return canContinue;
  }

  function getData(key = null) {
    if (key == null) {
      return data;
    }
    
    if (typeof data[key] != "undefined") {
      return data[key];
    } else {
      return null;
    }
  }

  function setData(key, value) {
    data[key] = value;
  }

  return {
    subscribe: subscribe,
    unsubscribe: unsubscribe,
    addValidator: addValidator,
    nextStep: nextStep,
    getData: getData,
    setData: setData
  };
};

recDssState = RecDssState();
