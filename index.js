#!/usr/bin/env node

const fs = require('fs');
const program = require('commander');
const download = require('download-git-repo');
const handlebars = require('handlebars');
const inquirer = require('inquirer');
const ora = require('ora');
const chalk = require('chalk');
const symbols = require('log-symbols'); //（ 正确  失败 ） 图标
program.version('1.0.0', '-v, --version')
  .command('init <project>').action((project) => {
    let flag = fs.existsSync(project);
    if (flag) {
      inquirer.prompt([{
        name: "flag",
        message: "project already exists, is it covered?(yes/no ?)"
      }]).then((answers) => {
        if (answers.flag === "yes") {
          flag = false;
        };
        handle(project);
      });
    } else {
      handle(project);
    }

  })
program.parse(process.argv);

function handle(project) {
  inquirer.prompt([{
    name: 'description',
    message: 'project description'
  }, {
    name: 'author',
    message: 'author'
  }]).then((answers) => {
    const spinner = ora('loading...');
    spinner.start();
    download('direct:https://github.com/spadesk1991/fox/archive/master.zip', project, (err) => {
      if (err) {
        spinner.fail();
        console.log(symbols.error, chalk.red(err));
      } else {
        spinner.succeed();
        const fileName = `${project}/package.json`;
        const meta = {
          name: project,
          description: answers.description,
          author: answers.author
        };
        if (fs.existsSync(fileName)) {
          const content = fs.readFileSync(fileName).toString();
          const result = handlebars.compile(content)(meta);
          fs.writeFileSync(fileName, result);
        }
        console.log(symbols.success, chalk.green('inited'));
      }
    });
  });
}