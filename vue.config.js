module.exports = {
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        productName: 'ToDo Always',
        mac: {
          icon: 'build/icon.png',
        },
        win: {
          target: 'nsis',
          icon: 'build/icon.png',
        },
        extraFiles: [
          'config.json'
        ]
      }
    }
  }
}