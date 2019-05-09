#!/usr/bin/env node

const program = require('commander')
const chalk = require('chalk')
const utils = require('../lib/utils')
const serve = require('../lib/serve')
const path = require('path')

const resolve = utils.resolve
const exists = utils.exists

program.on('--help', () => {
  console.log(chalk.gray('no help'))
})

program.parse(process.argv)
/**
 * 参数
 */
const port = program.args[0]
const llport = program.args[1]
const fileName = 'README'

const filePathPreFix = resolve('.')

const filePath = path.join(filePathPreFix, `${fileName}.md`)

if (!exists(filePath)) {
  console.log(chalk.red(`没有README.md文件!`))
} else {
  serve(port, llport)
}
