;(function() {
  function get(reqUrl, params, callback, async) {
    var xhr = null
    if (window.XMLHttpRequest) {
      xhr = new XMLHttpRequest()
    }
    if (!xhr) {
      return false
    }
    if (async && callback) {
      xhr.addEventListener('readystatechange', function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
          callback(xhr.responseText)
        }
      })
    }
    reqUrl = reqUrl + (params ? '?' + params : '')
    params = null
    xhr.open('get', reqUrl, async)
    xhr.send(params)
    if (!async) {
      return xhr.responseText
    }
  }
  get(
    `${window.location.origin}/readfile`,
    '',
    function(res) {
      document.getElementById('content').innerHTML = res
    },
    () => {}
  )
})()
