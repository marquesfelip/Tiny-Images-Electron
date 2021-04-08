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

    // Push the new elements to the array
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

    const COMPRESSED_IMGS_PATH = document.getElementById('input-selected-folder').value

    if (ARRAY_IMGS.length > 0 && COMPRESSED_IMGS_PATH) {

        ARRAY_IMGS.forEach(imgPath => {

            let imageName = imgPath.split('\\')
            imageName = imageName[imageName.length - 1]
            console.log(imageName);
            console.log(COMPRESSED_IMGS_PATH + '\\' + imageName)

            const source = tinify.fromFile(imgPath)
            source.toFile(COMPRESSED_IMGS_PATH + '\\' + imageName)
        })

    } else {
        console.log('Verique se você selecionou pelo menos uma imagem e a pasta para salvar a nova imagem');
    }
})
