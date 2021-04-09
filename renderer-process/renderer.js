const { ipcRenderer } = require("electron")
const tinify = require('tinify')

const BTN_SELECT_FILES = document.getElementById('btn-select-files')
const BTN_SELECT_FOLDER = document.getElementById('btn-select-folder')
const BTN_COMPRESS_IMAGES = document.getElementById('btn-compress-images')

const ARRAY_IMGS = []

BTN_SELECT_FILES.addEventListener('click', event => {
    ipcRenderer.send('select-files')
})

ipcRenderer.on('selected-files', (event, paths) => {
    // Remove all elements of the array
    ARRAY_IMGS.splice(0, ARRAY_IMGS.length)

    document.getElementById('input-selected-files').setAttribute('placeholder', `${paths.length} arquivo(s) selecionado(s)`)

    // Push the new elements
    paths.forEach(path => {
        ARRAY_IMGS.push(path)
    })
})

BTN_SELECT_FOLDER.addEventListener('click', event => {
    ipcRenderer.send('select-folder')
})

ipcRenderer.on('selected-folder', (event, path) => {
    document.getElementById('input-selected-folder').setAttribute('placeholder', `${path}`)
    document.getElementById('input-selected-folder').setAttribute('value', `${path}`)
})

BTN_COMPRESS_IMAGES.addEventListener('click', event => {
    tinify.key = document.getElementById('user-api-key').value

    tinify.validate(err => {
        if(err) {
            ipcRenderer.send('alert-message', err.message, 'error', 'Validação da chave de API')
        } else {
            const PATH_TO_SAVE_IMGS = document.getElementById('input-selected-folder').value
            if (ARRAY_IMGS.length > 0 && PATH_TO_SAVE_IMGS) {
                compressImages(ARRAY_IMGS, PATH_TO_SAVE_IMGS)
            } else {
                ipcRenderer.send('alert-message', 'Verifique se você selecionou pelo menos uma imagem e a pasta para salvar as novas imagens.', 'info', 'Atenção!')
            }
        }
    })
})

function compressImages(array, path) {
    array.forEach(imgPath => {

        let imageName = imgPath.split('\\')
        imageName = imageName[imageName.length - 1]

        ipcRenderer.sendSync()

        const source = tinify.fromFile(imgPath)

        source.toFile(`${path}\\${imageName}`)
            .then(result => {
                console.log(`Imagem '${imageName}' comprimida com sucesso!`)
            }).catch(reject => {
                console.log(`Whoops! Ocorreu algum problema ao comprimir a imagem ${imageName} \n Verifique a mensagem abaixo: \n ${reject}`);
            })

    })
}
