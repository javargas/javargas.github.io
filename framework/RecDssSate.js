

/* ============================
// HO TO USE IN MODULES
==============================
/* * /

//  pass to nex step in the process
recDssState.nextStep();

// register an observer
recDssState.subscribe((step) => {
    // handler code here
});

// add a validation function
recDssState.addValidator(step, validateFunction );

// Save data in global object
recDssState.data[data_variable] = { 
    vbl1 : data1,
    vbl2 : data2
}; 

/* */

/* ==========================
// Framework global object
===========================*/

class RecDssState {
  constructor() {
    this.activeStep = ${initial_step}; // current step in the checkout process
    this.observers = []; // observers modules
    this.data = []; // List of data objects for each module
    this.validators = []; // Validator functions per step
  }

  subscribe(f) {
    this.observers.push(f);
  }

  unsubscribe(f) {
    this.observers = this.observers.filter((subscriber) => subscriber !== f);
  }

  notify(data) {
    this.observers.forEach((observer) => observer(data));
  }

  addValidator(step, validate){
    if (typeof this.validators[step] == "undefined") {
        this.validators[step] = [];
    }

    this.validators[step].push(validate);
  }

  nextStep() {
    let canContinue = true;

    this.validators[this.activeStep]
    .forEach(
        (validator) => {
            if (!validator()) {
                canContinue = false;
            }
        }
    );

    if (canContinue) {
        console.log("continue to the next step: ", this.data);
        this.notify(++this.activeStep);
    }

    return canContinue;
  }
}

var recDssState = new RecDssState();

