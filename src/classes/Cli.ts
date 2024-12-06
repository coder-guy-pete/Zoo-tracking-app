import inquirer from 'inquirer';
import Animal from './Animal.js';
import type Employee from './Employee.js';
import type ZooAnimals from '../interfaces/ZooAnimals.js';
import ZooKeeper from './ZooKeeper.js';
import ZooWorker from './ZooWorker.js';
// Note that the above are explicitly importing in .js files as the current tsconfig cannot correctly path to the necessary files. The classes will be referred correctly after the dist folder is generated.

class Cli {
  animals: Animal[];
  employees: Employee[];
  constructor(animals: Animal[], employees: Employee[]) {
    this.animals = animals;
    this.employees = employees;
  }

  startCli(): void {
    console.log('====================');
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'action',
          message: 'What do you want to do?',
          choices: [
            'Add Animals to Zoo',
            'Add new Employee',
            'See Animal List',
            'See Employee List',
            'Feed Animals',
            'Pay Employee',
            'Exit',
          ],
        },
      ])
      .then((res) => {
        //switch statement for the different options on inquirer.
        switch (res.action) {
          case 'Add Animals to Zoo':
            this.startAnimalCli();
            break;
          case 'Add new Employee':
            this.startEmployeeCli();
            break;
          case 'See Animal List':
            console.log(this.animals);
            this.startCli();
            break;
          case 'See Employee List':
            console.log(this.employees);
            this.startCli(); //Recursive call to go back to main menu.
            break;
          case 'Feed Animals':
            this.feedAnimals();
            break;
          case 'Pay Employee':
            this.payEmployee();
            break;
          default:
            process.exit(0);
        }
      });
  }

  startAnimalCli(): void {
    inquirer
    .prompt([
      {
        type: 'input',
        name: 'species',
        message: 'What species is the animal?',
      },
      {
        type: 'number',
        name: 'amount',
        message: 'How many animals are you adding?',
      },
      {
        type: 'confirm',
        name: 'hungry',
        message: (answers) => `Are the ${answers.amount} ${answers.species} hungry?`,
      },
      {
        type: 'number',
        name: 'weight',
        message: (answers) => `What is the average weight of the ${answers.species}?`,
      },
    ])
    .then((answers) => {
      console.log('\n');
      const newAnimal = new Animal(
        answers.species,
        answers.hungry,
        answers.amount,
        answers.weight
      );
      this.animals.push(newAnimal);
      console.log(`\nYou have added ${answers.amount} ${answers.species} to the zoo!`);

      inquirer
        .prompt([
          {
            type: 'confirm',
            name: 'addAnother',
            message: 'Do you want to add more animals?',
            default: false,
          },
        ])
        .then((answers) => {
          if (answers.addAnother) {
            this.startAnimalCli();
          } else {
            this.startCli();
          }
        });
      })
    .catch((err) => {
      console.error('Error adding animal:', err);
    });
  }

  startEmployeeCli(): void {
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'employeeChoice',
          message: 'Which employee department do you want to access?',
          choices: ['Zoo Keeper', 'Zoo Worker'],
        },
      ])
      .then((res) => {
        if (res.employeeChoice === 'Zoo Keeper') {
          this.startZooKeeperCli();
        } else {
          this.startZooWorkerCli();
        }
      })
      .catch((err) => {
        console.error('Error prompting employee choice:', err);
        this.startCli(); // Fallback to main menu on error
      });
  }

  startZooKeeperCli(): void {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'name',
          message: 'What is their name?',
        },
        {
          type: 'input',
          name: 'id',
          message: 'what is their ID number?',
        },
        {
          type: 'input',
          name: 'title',
          message: 'what is their title?',
        },
        {
          type: 'number',
          name: 'salary',
          message: 'what is their salary?',
        },
        {
          type: 'input',
          name: 'specialty',
          message: 'what is their specialty?',
        }
      ])
      .then((res) => {
        try {
          const newZooKeeper = new ZooKeeper(
            res.name,
            res.id,
            res.title,
            res.salary,
            res.specialty
          );
          console.log(`Please welcome to the team: ${newZooKeeper.name}!`);
          this.employees.push(newZooKeeper);
          this.startCli();
        } catch (err) {
          console.error('Error creating ZooKeeper:', err);
          this.startZooKeeperCli(); // Retry creating ZooKeeper on error (optional)
        }
      })
      .catch((err) => {
        console.error('Error prompting ZooKeeper details:', err);
        this.startCli(); // Fallback to main menu on error
      });
  }

  startZooWorkerCli(): void {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'name',
          message: 'What is their name?',
        },
        {
          type: 'input',
          name: 'id',
          message: 'what is their ID number?',
        },
        {
          type: 'input',
          name: 'title',
          message: 'what is their title?',
        },
        {
          type: 'number',
          name: 'salary',
          message: 'what is their salary?',
        },
        {
          type: 'confirm',
          name: 'uniform',
          message: 'Is their uniform clean?',
        },
      ])
      .then((res) => {
        const newZooWorker = new ZooWorker(
          res.name,
          res.id,
          res.title,
          res.salary,
          res.uniform
        );
        console.log(`Please welcome to the team: ${newZooWorker.name}!`);
        this.employees.push(newZooWorker);
        this.startCli();
      });
  }

  feedAnimals(): void {
    for (const animal of this.animals) {
      if (animal.hungry) {
        console.log(`Feeding ${animal.species}...`);
        animal.hungry = false; // Mark the animal as not hungry
      }
    }
    console.log('\nAll animals fed.');
    this.startCli(); // Return to main menu
  }

  payEmployee(): void {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'name',
          message: 'Who do you want to pay? Input name precisely',
        },
        {
          type: 'number',
          name: 'pay',
          message: 'How much do you want to pay?',
        },
      ])
      .then((res) => {
        const employee = this.employees.find((employee) => employee.name === res.name);
        if (employee) {
          console.log(`Paying ${employee.name}...`);
          try {
            employee.receivePay(res.pay);
            console.log(`\n${employee.name} has been paid $${res.pay}`);
          } catch (err) {
            console.error('Error paying employee:', err);
          }
        } else {
          console.log(`Employee ${res.name} not found`);
        }
        this.startCli();
      })
      .catch((err) => {
        console.error('Error prompting employee pay details:', err);
        this.startCli(); // Fallback to main menu on error
      });
  }
}
export default Cli;
