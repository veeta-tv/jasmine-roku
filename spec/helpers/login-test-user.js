module.exports = {
  response: function (ctx) {
    if (ctx.request.body.username === "test") {
      ctx.status = 200
    } 
    else {
      ctx.status = 401
    }
  }
}
