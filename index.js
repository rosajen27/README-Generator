// required installation
const inquirer = require("inquirer");
const fs = require ("fs");
const util = require("util");
const axios = require("axios");

const writeFileAsync = util.promisify(fs.writeFile);

// user input questions/prompts
function promptUser(){
    return inquirer.prompt([
        {
            type:"input",
            name:"Title",
            message:" Project title: "
        },
        {
            type:"input",
            name:"Description",
            message:" Description (A short description explaining the what, why, and how. What was your motivation? Why did you build this project? What problem does it solve? What did you learn?): "
        },
        {
            type:"input",
            name:"Installation",
            message:" Installation (What are the steps required to install your project? Provide a step-by-step description of how to get the development environment running.): "
        },
        {
            type:"input",
            name:"Usage",
            message:" Usage (Provide instructions and examples for use. Include screenshots as needed.): "
        },
        {
            type:"input",
            name:"License",
            message:" License (This lets other developers know what they can and cannot do with your project. If you need help choosing a license, use https://choosealicense.com/): "
        },
        {
            type:"input",
            name:"Contributing",
            message:" Contributing (If you created an application or package and would like other developers to contribute it, you will want to add guidelines for how to do so.): "
        },
        {
            type:"input",
            name:"Tests",
            message:" Tests (Go the extra mile and write tests for your application. Then provide examples on how to run them.): "
        },
        {
            type:"input",
            name:"Questions",
            message:" Questions (Frequently Asked Questions and solutions.): "
        },
        {
            type: "input",
            name: "Github",
            message: " GitHub Username: ",
            validate: async function(input, answers){
                const queryUrl= `https://api.github.com/users/${input}`

                try{
                    await axios.get(queryUrl)
                    return true
                }catch{
                    return 'GITHUB USER NOT FOUND!'
                }
            }
        },
        {
            type: "input",
            name: "email",
            message: " GitHub email address: "
        },
    ])
}


// display user inputs
async function generateReadme(answers){
    let usage = "";
    if(answers.Usage !== ""){
        usage = `## Usage
        \n${answers.Usage}`
    }

    let title = "";
    if(answers.Title !== ""){
        title = `# ${answers.Title}`
    }

    let description = "";
    if(answers.Description !== ""){
        description = `## Description
        \n${answers.Description}`
    }

    let installation = "";
    if(answers.Installation !== ""){
        installation = `## Installation 
        \n${answers.Installation}`
    }

    let license = "";
    if(answers.License !== ""){
        license = `## License
        \n${answers.License}`
    }

    let contributing = "";
    if(answers.Contributing !== ""){
        contributing= `## Contributing
        \n${answers.Contributing}`
    }

    let tests = "";
    if(answers.Tests !== ""){
        tests= `## Tests
        \n${answers.Tests}`
    }

    let questions = "";
    const queryUrl= `https://api.github.com/users/${answers.Github}`
    const avatar= await axios.get(queryUrl).then(function(res){
       return res.data.avatar_url;
    })
  
    if(answers.Github !== ""){
        questions= `
## Questions?
\n${answers.Questions}
\n
More Questions? Contact: [${answers.Github}](https://github.com/${answers.Github}) 
directly at ${answers.email}.

![avatar](${avatar})
        `
    }
    
    return `
${title}
[![GitHub license](https://img.shields.io/badge/license-${encodeURIComponent(answers.License)}-blue.svg)](https://github.com/${answers.Github})

${description}
## Table of contents
${ installation !=="" ? '* [Installation](#installation)' :""}
${ usage !== "" ? '* [Usage](#usage)' : ""}
${ license !=="" ? '* [License](#license)':""}
${ contributing !=="" ? `* [Contributing](#Contributing)`: ""}
${ tests !== "" ? '* [Tests](#Tests)':""}
${ questions !== "" ? '* [Questions](#Questions)':""}

${installation}
${usage}
${license}
${contributing}
${tests}
${questions}
    `; 
}

promptUser()
  .then(async function(answers) {
    const md = await generateReadme(answers);

    return writeFileAsync("README.md", md);
  })
  .then(function() {
    console.log("Successfully created README.md");
  })
  .catch(function(err) {
    console.log(err);
  });

