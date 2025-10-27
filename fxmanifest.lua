fx_version 'cerulean'
game 'gta5'
lua54 'yes'

ui_page 'ui/index.html'

files {
    'ui/index.html',
    'ui/style.css',
    'ui/index.js'
}

client_scripts {
    'client.lua'
}

-- <<< WAŻNE: eksport wymagany przez es_extended >>>
export 'Notify'
