const open = require('open')
const chalk = require('chalk')
const utils = require('./utils')
// eslint-disable-next-line node/no-deprecated-api
const { parse } = require('url')
const updateNotifier = require('update-notifier')
const pkg = require('../package.json')
const connect = require('connect')
const serveStatic = require('serve-static')
const npath = require('path')
const fs = require('fs')
const chokidar = require('chokidar')
const marked = require('marked')
const SSE = require('./eventStream')(2000)

updateNotifier({ pkg: pkg }).notify()

var resolve = utils.resolve
var exists = utils.exists

function readFile(path) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      fs.readFile(path, 'utf-8', (err, data) => {
        if (err) reject(err)
        resolve(data)
      })
    }, 100)
  })
}

module.exports = function(port, llport, path) {
  port = port || 4000
  path = resolve(path || '.')
  var server = connect()
  server.use(serveStatic(indexTemplatePath(path)))

  server.use(function(req, res, next) {
    const parseUrl = parse(req.url, true)
    const urlpath = parseUrl.path
    if (urlpath === '/__dg_hmr') {
      SSE.handler(req, res)
      getMDFileContent(`${path}/README.md`).then(data => {
        SSE.publish({ action: 'sync', data })
      })
    }
  })

  server.listen(port)

  chokidar.watch(`${path}/README.md`, { persistent: true }).on('change', (path, stats) => {
    if (path) {
      getMDFileContent(path).then(data => {
        SSE.publish({ action: 'change', data })
      })
    }
  })
  open(`http://localhost:${port}`)

  console.log('\nServing ' + chalk.green(`${path}`))
}

async function getMDFileContent(path) {
  var data = ''
  try {
    data = await readFile(path)
  } catch (error) {
    console.log(error)
  }
  data = marked(data)
  return data
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
