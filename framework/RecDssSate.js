
class RecDssState {
  constructor() {
    this.activeStep = 1;
    this.observers = [];
    this.data = []; // List of data objects for each module
    this.validators = [];
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
        console.log("continue to the next step: ", this.dataModules);
        this.notify(++this.activeStep);
    }

    return canContinue;
  }
}

var recDssState = new RecDssState();
