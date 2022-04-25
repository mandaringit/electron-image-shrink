const path = require("path")
const os = require("os")
const { app, BrowserWindow, Menu, ipcMain, shell } = require("electron")
const imagemin = require("imagemin")
const imageminMozjpeg = require("imagemin-mozjpeg")
const imageminPngquant = require("imagemin-pngquant")
const slash = require("slash")

process.env.NODE_ENV = "development"

const isDev = process.env.NODE_ENV !== "production"
const isMac = process.platform === "darwin"

let mainWindow
let aboutWindow

function createMainWindow() {
	mainWindow = new BrowserWindow({
		title: "Image Shrink",
		width: isDev ? 700 : 500,
		height: 600,
		icon: path.join(__dirname, `assets/icons/Icon_256x256.png`),
		resizable: isDev,
		backgroundColor: "white",
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
		},
	})

	if (isDev) {
		mainWindow.webContents.openDevTools()
	}

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

ipcMain.on("image:minimize", (e, options) => {
	options.dest = path.join(os.homedir(), "imageshrink")
	shrinkImage(options)
})

async function shrinkImage({ imgPath, quality, dest }) {
	try {
		const pngQuality = quality / 100
		const files = await imagemin([slash(imgPath)], {
			destination: dest,
			plugins: [
				imageminMozjpeg({ quality }),
				imageminPngquant({
					quality: [pngQuality, pngQuality],
				}),
			],
		})

		console.log(files)
		shell.openPath(dest)
	} catch (e) {
		console.log(e)
	}
}

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
