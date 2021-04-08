const { ipcMain, dialog } = require("electron")

ipcMain.on('select-files', event => {
    dialog.showOpenDialog({
        properties: ['openFile', 'multiSelections'],
        filters: [
            {name: 'Images', extensions: ['jpg', 'png']}
        ]
    }).then(result => {
        if (!result.canceled) {
            event.sender.send('selected-files', result.filePaths)
        }
    }).catch(err => {
        dialog.showErrorBox('Erro na seleção de imagens', 'Descrição do erro: \n' + err)
    })
})

ipcMain.on('select-folder', event => {
    dialog.showOpenDialog({
        properties: ['openDirectory']
    }).then(result => {
        if (!result.canceled) {
            event.sender.send('selected-folder', result.filePaths[0])
        }
    }).catch(err => {
        dialog.showErrorBox('Erro na seleção da pasta', 'Descrição do erro: \n' + err)
    })
})
