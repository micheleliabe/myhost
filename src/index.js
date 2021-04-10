require('dotenv').config()

const express = require('express')
const app = express()
const port = 3000
const routes = require('./routes')

const path = require('path')

const chalk = require('chalk');
const vDisplay = require('./display/bars')
const figlet = require("figlet-promised");




app.use(routes)


app.listen(port, () => {
  async function welcome() {
    const logo = await figlet("chappie");
    console.log(chalk.blueBright(logo));
    console.log(chalk.gray('                       By: Michel Dias'))
   
    console.log('')
    console.log(chalk.greenBright(chalk.bold('Service is started')))

  }
  welcome();
  
})