# Use Jest and JSDoc for Unit Testing and Documentation

## Context and Problem Statement

How can we establish a consistent, easy-to-maintain approach for unit testing and inline code documentation in our greeting card web app?

## Considered Options

* Jest for testing and JSDoc for documentation
* Mocha/Chai with custom documentation scripts

## Decision Drivers
* Is it easy to use/implement?
* How familiar are we in incorporating these tools into our Github Repository?
* Doesn't interfer with deployment of Github Pages 

## Decision Outcome

Chosen option: "Jest and JSDoc", because Jest was used in our labs so most of use are at least familiar with it, JSDoc doesnt require introducing multiple new dependencies and was agreed upon from the group meeting

### Consequences

* Good, because developers can write and run tests quickly with a reference from lab as a starter 
* Good, because JSDoc comments live alongside code, ensuring documentation stays up to date  
* Good, because both tools have guides online that we can follow 
* Bad, because initial setup and learning curve for JSDoc comment standards may slow early development  
