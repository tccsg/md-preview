function createEventStream(heartbeat) {
  var clientId = 0
  var clients = {}
  function everyClient(fn) {
    Object.keys(clients).forEach(id => {
      fn(clients[id])
    })
  }
  var interval = setInterval(function heartbeatTick() {
    everyClient(function(client) {
      client.write('data: \uD83D\uDC93\n\n')
    })
  }, heartbeat).unref()
  return {
    close: function() {
      clearInterval(interval)
      everyClient(client => {
        if (!client.finished) client.end()
      })
      clients = {}
    },
    handler: function(req, res) {
      req.socket.setKeepAlive(true)
      res.writeHead(200, {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'text/event-stream;charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        // eslint-disable-next-line prettier/prettier
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no'
      })
      res.write('\n')
      let id = clientId++
      clients[id] = res
      res.on('close', () => {
        delete clients[id]
      })
    },
    publish: function(payload) {
      everyClient(client => {
        client.write('data:' + JSON.stringify(payload) + '\n\n')
      })
    }
  }
}
module.exports = createEventStream
