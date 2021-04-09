require('dotenv').config()
const vDisplay = require('./display/bars')
const path = require('path')

const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const routes = require('./routes')


app.use(routes)


//Define a porta de comunicação
const port = 3000

app.listen(port, () => {

  async function exibeLogo() {
    const data = await console.log(logo)
    
    let message = await vDisplay.line()
    console.log("")
    message = await console.log('\x1b[36m%s\x1b[0m', '-- Service started');
    message = await console.log('\x1b[36m%s\x1b[0m', '-- Listen at port', port);
    message = await console.log('\x1b[36m%s\x1b[0m', '-- Maintainer:', 'Michel Eliabe Moreira Dias');
    message = await console.log('\x1b[36m%s\x1b[0m', '-- Company:', process.env.COMPANY);
    message = await vDisplay.line()
  }
  exibeLogo()

})

const logo = `
                                                                                 **                                                                                               
                                                                                  **.                                                                                            
                                                                  .**              **.             ,**                                                                          
                                                                    //*            .*             **,                                                                         
                                                                     .//                        .**                                                                         
                                                                              ,*****,,,,,,                                                                                
                                                       .                ,//**,             ..                                                                           
                                                       ,////.        ///*                                   ,****                                                     
                                                            //     ///                                    ,*.                                                       
                                                                 *//                         ..,,,,,,,,***.                                                       
                                                                /**                      ....             ,***.                                                 
                                                               ,**                                            ***                                             
                                                         ,..   ,,                                              .**                                          
                                                       **.     ,.                                                //                                       
                                                     ,//       ..                                                ,//                                   
                                                     #(                                                          .//                                 
                                                     ##                                                          //*                               
                                                     ##(                                                        ///                                
                                                      (##                                                     .//,                                 
                                                        ###,                                               .((/,                                   
                                                           #####(*,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,*(((((/                                       
                                                                                                                                                                                                                                                                                     
                                                                                                                               
                                                                                                                                                                            
                                     *@@@@,     ,@@@@@                   .@@@       @@@                                      @@@                                           
                                     *@@@@@@   @@@@@@@   %@@@      @@@%  .@@@       @@@       ,@@@@@@@&       (@@@@@@@&    @@@@@@@@@                                      
                                     *@@@(@@@.@@@*@@@@    (@@@    @@@(   .@@@(((((((@@@     &@@@#   /@@@@    @@@.    /@    ..@@@....                                    
                                     *@@@  @@@@@  @@@@     *@@@  @@@/    .@@@@@@@@@@@@@    (@@@       @@@@   @@@@@@@/        @@@                                      
                                     *@@@   ,@%   @@@@       @@@@@@*     .@@@       @@@    #@@@       &@@@      %@@@@@@@     @@@                                      
                                     *@@@         @@@@        @@@@,      .@@@       @@@     @@@@#   .@@@@   *@/     *@@@     @@@&   @                               
                                     *@@@         @@@@       .@@@.       .@@@       @@@       #@@@@@@@%     ,@@@@@@@@@*       @@@@@@@              
`