// Setip

var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');

var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "password",
    database: "bamazon_db"
  });
  
  connection.connect(function(err) {
      if (err) throw err;
      console.log("Connection is successful");
      itemsForSale();
    });

// Array for chosen items
var chosenItem = {};

// Function to clear the chosenItem array so there are no purchases inside the array
var resetCart = function() {
    chosenItem = {};
}

// Function to show all items for sale
var itemsForSale = function() {
    connection.query(`SELECT * FROM prdoucts`, (err,res) => {
        var showTable = new Table({
            head: ['Item ID', 'Product Name', 'Price'],
            colWidths: [12,45,12]
        });

        for (var i=0; i < showTable.length;i++) {
            showTable.push([res[i].item_id, res[i].product_name, `$${res[i].price}`]);
            console.log(res);
            
        }

        // Show table
        console.log(`\n\n${showTable.toString()}\n\n`);

        // Asks user to enter ID of the item they want to purchase
        askUserForID(); 
    });
};

// Function to prompt user to enter the ID of the item they want to purchase
var askUserForID = function() {
    inquirer.prompt({
        name: 'item ID',
        type: 'input',
        message: 'Please enter the ID of the item you wish to purchase: ',
        // Validate that input is between 1 and 10
        validate: (value) => {
            if (!isNaN(value) && (value > 0 && value <= 10)) {
                return true;
            } else {
                console.log(' => Please enter a number from 1-10');
                return false;
        }
    }
// Select rows where ID = user inpt
}).then((answer) => {
    connection.query('SELECT item_id, product_name, price, stock_quantity FROM products WHERE ?', {item_id: answer.itemID}, (err, res) => {
        // Confirm with user that this is the item they'd like to purchase
        confirmItem(res[0].product_name, res);
    });
});
};

// Function to confirm if the item the user chose is correct
var confirmItem = function(product, object) {
    inquirer.prompt({
        name: 'confirmItem',
        type: 'confirm',
        message: 'You chose' + product + '.  Is this correct?'
    }).then((answer) => {
        if (answer.confirmItem){
            chosenItem = {
                item_id: object[0].item_id,
                product_name: object[0].product_name,
                price: object[0].price,
                stock_quantity: object[0].stock_quantity,
            };
            // Ask user how many of item they'd like to purchase
            askHowMany(chosenItem.item_id);
        }else{
            askUserForID();
        }
    });
}

// Function that asks user how many of the item they would like to purchase
var askHowMany = function (chosenItem){
    inquirer.prompt ({
        name: 'howMany',
        type: 'input',
        message: 'how many of the item would you like to purchase?',
        validate: (value) => {
            if (!isNaN(value) && value > 0) {
                return true;
            } else {
                console.log(' => please enter a number greater than 0');
                return false;
            }
        }

    }).then ((answer) => {
    connection.query('SELECT stock_quantity FROM products WHERE ?', { item_id: chosenItem.item_id }, (err, res) => {
        // if there are not enough products in stock
        if (res[0].stock_quantity < answer.howMany) {
            console.log('\n\tSorry, insufficient quantity in stock!\n');
            // confirm if user would still like to buy this product
            inquirer.prompt({
                name: 'proceed',
                type: 'confirm',
                message: 'Would you still like to purchase this product?'
            }).then((answer) => {
                if (answer.proceed) {
                    askHowMany(chosenItem.item_id);
                } else {
                    console.log('\n\tThanks for visiting! We hope to see you again soon.\n');
                    connection.end();
                }
            });

        // if there are enough products in stock for purchase to go through
        } else {
            chosenItem.howMany = answer.howMany;
            console.log('\n\tYou order is processing...');

            // update database to reflect new quantity
            connection.query('UPDATE products SET ? WHERE ?', [
                {
                    stock_quantity: chosenItem.stock_quantity - answer.howMany,
                    product_sales: chosenItem.product_sales + (chosenItem.price * answer.howMany)
                },
                {
                    item_id: chosenItem.item_id,
                }
            ], (err, res) => {
                console.log(chalk.blue.bold(`\n\tYour order has been completed! Your total was $${(chosenItem.price * chosenItem.howMany).toFixed(2)}.\n`));

                // ask if user would like to make another purchase
                promptNewPurchase();
            });
        }
    });
});
}

// function to ask if user would like to make another purchase
var promptNewPurchase = function() {
inquirer.prompt({
    name: 'newPurchase',
    type: 'confirm',
    message: 'Would you like to make another purchase?'
}).then((answer) => {
    if (answer.newPurchase) {
        resetCart();
        askForID();
    } else {
        console.log(chalk.blue.bold('\n\tThank you for your business. Have a great day!\n'));
        connection.end();
    }
});
};