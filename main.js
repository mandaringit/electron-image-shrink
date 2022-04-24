const { app, BrowserWindow, Menu } = require("electron")
const path = require("path")
process.env.NODE_ENV = "development"

const isDev = process.env.NODE_ENV !== "production"
const isMac = process.platform === "darwin"

let mainWindow
let aboutWindow

function createMainWindow() {
	mainWindow = new BrowserWindow({
		title: "Image Shrink",
		width: 600,
		height: 600,
		icon: path.join(__dirname, `assets/icons/Icon_256x256.png`),
		resizable: isDev,
		backgroundColor: "white",
	})

	mainWindow.loadFile("./app/index.html")
}

function createAboutWindow() {
	aboutWindow = new BrowserWindow({
		title: "About ImageShrink",
		width: 300,
		height: 300,
		resize: false,
		icon: path.join(__dirname, `assets/icons/Icon_256x256.png`),
		backgroundColor: "white",
	})

	aboutWindow.loadFile("./app/about.html")
}

const menu = [
	...(isMac
		? [
				{
					label: app.name,
					submenu: [
						{
							label: "About",
							click: createAboutWindow,
						},
					],
				},
		  ]
		: []),
	{
		role: "fileMenu",
		submenu: [
			{
				label: "Exit",
				accelerator: "CmdOrCtrl+W",
				click: () => app.quit(),
			},
		],
	},
	...(!isMac
		? [
				{
					label: "Help",
					submenu: [
						{
							label: "About",
							click: createAboutWindow,
						},
					],
				},
		  ]
		: []),
	...(isDev
		? [
				{
					label: "Developer",
					submenu: [
						{
							role: "reload",
						},
						{
							role: "forceReload",
						},
						{
							type: "separator",
						},
						{
							role: "toggleDevTools",
						},
					],
				},
		  ]
		: []),
]

console.log(menu)

app.on("ready", () => {
	createMainWindow()

	// 메뉴 달아보기
	const mainMenu = Menu.buildFromTemplate(menu)
	Menu.setApplicationMenu(mainMenu)

	mainWindow.on("ready", () => (mainWindow = null))
})

app.on("window-all-closed", () => {
	if (!isMac) {
		app.quit()
	}
})

app.on("activate", () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createMainWindow()
	}
})
