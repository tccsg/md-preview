'use strict'

const serveStatic = require('serve-static')
const connect = require('connect')
const livereload = require('connect-livereload')
const lrserver = require('livereload')
const open = require('open')
const chalk = require('chalk')
const utils = require('./utils')
// eslint-disable-next-line node/no-deprecated-api
const { parse } = require('url')
const fs = require('fs')
const marked = require('marked')
const npath = require('path')
const updateNotifier = require('update-notifier')
const pkg = require('../package.json')

updateNotifier({ pkg: pkg }).notify()

var resolve = utils.resolve
var exists = utils.exists

module.exports = function(port, llport, path) {
  port = port || 4000
  llport = llport || 35729
  path = resolve(path || '.')

  var server = connect()
  server.use(
    livereload({
      port: llport
    })
  )
  server.use(serveStatic(indexTemplatePath(path)))

  server.use(function(req, res, next) {
    const parseUrl = parse(req.url, true)
    const urlpath = parseUrl.path
    if (urlpath === '/readfile') {
      var data = ''
      try {
        data = fs.readFileSync(`${path}/README.md`, 'utf-8')
      } catch (error) {
        console.log(error)
      }
      data = marked(data)
    }
    res.end(data)
  })

  server.listen(port)

  lrserver
    .createServer({
      extraExts: ['md'],
      exclusions: ['node_modules/'],
      port: llport
    })
    .watch(path)

  open(`http://localhost:${port}`)

  const msg =
    '\nServing ' +
    chalk.green(`${path}`) +
    ' now.\n' +
    'Listening at ' +
    chalk.green(`http://localhost:${port}`) +
    '\n'
  console.log(msg)
}

function indexTemplatePath(path) {
  const scriptPath = resolve(__dirname, '..')
  const nodeModulePath = npath.join(path, `/node_modules/${pkg.name}`)

  const scriptPathUnderTemplatePath = npath.join(scriptPath, 'index.html')
  const nodeModuleUnderTemplatePath = npath.join(nodeModulePath, 'index.html')
  const pathUnderTemplate = npath.join(path, 'index.html')

  if (exists(pathUnderTemplate)) {
    console.log(chalk.green('使用自定义模版'))
    return path
  }
  if (exists(scriptPathUnderTemplatePath)) {
    console.log(chalk.green('使用原始模版'))
    return scriptPath
  }
  if (exists(nodeModuleUnderTemplatePath)) {
    console.log('使用node_modules下的模版')
    return nodeModulePath
  }
  console.log(chalk.red('没有找到模版文件index.html'))
}
