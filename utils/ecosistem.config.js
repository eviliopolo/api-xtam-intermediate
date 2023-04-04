module.exports = {
    apps : [{
      script    : "../server.ts",
      instances : "4",
      args:"start",
      exec_mode : "cluster"
    }]
  }