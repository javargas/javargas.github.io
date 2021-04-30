
class RecDssState {
  constructor() {
    this.activeStep = ${initial_step}; // current step in the checkout process
    this.observers = []; // observers modules
    this.validators = []; // Validator functions per step

    // Get the existing data
    let existing = sessionStorage.getItem("recDssState");

    // If no existing data, use the value by itself
	  // Otherwise, add the new value to it
    this.data = existing ? JSON.parse(existing) : {};
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

    if (typeof this.validators[this.activeStep] != "undefined") {
      this.validators[this.activeStep]
      .forEach(
          (validator) => {
              if (!validator()) {
                  canContinue = false;
              }
          }
      );
    }

    if (canContinue) {
        console.log("continue to the next step: ", this.data);
        this.saveData();
        this.notify(++this.activeStep);
    }

    return canContinue;
  }

  saveData() {
    console.log("saving data ", this.data);
    sessionStorage.setItem("recDssState", JSON.stringify(this.data));
  }
}

var recDssState = new RecDssState();
