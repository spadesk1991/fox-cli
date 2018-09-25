#!/usr/bin/env node

const fs = require('fs');
const program = require('commander');
const download = require('download-git-repo');
const handlebars = require('handlebars');
const inquirer = require('inquirer');
const ora = require('ora');
const chalk = require('chalk');
const symbols = require('log-symbols'); //（ 正确  失败 ） 图标
program.version('1.0.0', '-v, --version').command('init <name>').action((name) => {
    let flag = fs.existsSync(name);
    if (flag) {
        inquirer.prompt([{
            name: "flag",
            message: "project already exists, is it covered?(yes/no ?)"
        }]).then((answers) => {
            if (answers.flag === "yes") {
                flag = false;
            };
            if (!flag) { // 项目不存在
                inquirer.prompt([{
                    name: 'description',
                    message: 'project description'
                }, {
                    name: 'author',
                    message: 'author'
                }]).then((answers) => {
                    const spinner = ora('loading...');
                    spinner.start();
                    download('direct:https://github.com/spadesk1991/fox/archive/master.zip', name, (err) => {
                        if (err) {
                            spinner.fail();
                            console.log(symbols.error, chalk.red(err));
                        } else {
                            spinner.succeed();
                            const fileName = `${name}/package.json`;
                            const meta = {
                                name,
                                description: answers.description,
                                author: answers.author
                            }
                            if (fs.existsSync(fileName)) {
                                const content = fs.readFileSync(fileName).toString();
                                const result = handlebars.compile(content)(meta);
                                fs.writeFileSync(fileName, result);
                            }
                            console.log(symbols.success, chalk.green('inited'));
                        }
                    })
                })
            }
        });
    }

})
program.parse(process.argv);