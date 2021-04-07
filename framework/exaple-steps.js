new Vue({
    el: '#app',
    data: {
      activeStep: 0,
      animation: 'animate-in',
      formSteps: [
        {
          title: "HTML Quiz",
          fields: [
            { label: "What does HTML stand for?", value: '', valid: true, pattern: /.+/ },
            { label: "Who is making the Web standards?", value: '', valid: true, pattern: /.+/ },
            { label: "Element for the largest heading?", value: '', valid: true, pattern: /.+/ }
          ]
        },
        {
          title: "CSS Quiz",
          fields: [
            { label: "What does CSS stand for?", value: '', valid: true, pattern: /.+/ },
            { label: "HTML tag for an internal style sheet?", value: '', valid: true, pattern: /.+/ },
            { label: "Property for the background color?", value: '', valid: true, pattern: /.+/ }
          ]
        },
        {
          title: "Your data",
          fields: [
            { label: "Your first name?", value: '', valid: true, pattern: /.+/ },
            { label: "Your last name?", value: '', valid: true, pattern: /.+/ },
            { label: "Your email?", value: '', valid: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }
          ]
        },
        {
          title: "Thank you for participating!",
        }
      ],
    },
    methods: {
      nextStep() {
        this.animation = 'animate-out';
        setTimeout(() => {
          this.animation = 'animate-in';
          this.activeStep += 1;
        }, 600);
      },
      checkFields() {
        let valid = true;
        this.formSteps[this.activeStep].fields.forEach(field => {
          if (!field.pattern.test(field.value)) {
            valid = false;
            field.valid = false;
          }
          else {
            field.valid = true;
          }
        });
  
        if(valid) {
          this.nextStep();
        }
        else {
          this.animation = 'animate-wrong';
          setTimeout(() => {
            this.animation = '';
          }, 400);
        }
      }
    }
  })