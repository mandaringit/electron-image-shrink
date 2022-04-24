const { app, BrowserWindow } = require("electron")

process.env.NODE_ENV = "development"

const isDev = process.env.NODE_ENV !== "production"
const isMac = process.platform === "darwin"

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    title: "Image Shrink",
    width: 600,
    height: 600,
    icon: `${__dirname}/assets/icons/Icon_256x256.png`,
    resizable: isDev
  })

  mainWindow.loadFile("./app/index.html")
}

app.on("ready", createMainWindow)

app.on('window-all-closed', () => {
  if(!isMac) {
    app.quit()
  }
})

app.on('activate', () => {
  if(BrowserWindow.getAllWindows().length === 0) {
    createMainWindow()
  }
})