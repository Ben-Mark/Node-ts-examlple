// Create a prototype object
const Human = {
    greet: function() {
        console.log("Hello, my name is " + this.name);
    }
};

// Create two instances that inherit from Human
const john = Object.create(Human);
john.name = "John";

const steve = Object.create(Human);
steve.name = "Steve";

// Both can greet
john.greet();  // Output: "Hello, my name is John"
steve.greet(); // Output: "Hello, my name is Steve"

// Now dynamically add a new method to john,
// which will also affect steve since they share the same prototype
john.sayGoodbye = function() {
    console.log("Goodbye, from " + this.name);
};

// Link this new method back to the Human prototype
Human.sayGoodbye = john.sayGoodbye;

// Now steve can also say goodbye
steve.sayGoodbye();  // Output: "Goodbye, from Steve"

//In this example:

// We define a Person object with a method sayHello.
// We create an instance called john based on Person.
// Later, we dynamically add a new method sayGoodbye to the Person prototype.
// Because john's prototype is Person, he immediately gains access to the new sayGoodbye method without us having to modify john directly.
// This dynamic nature is unique to prototype-based inheritance.
// because we're doing this in runtime compared to class based inheritance where we cant
