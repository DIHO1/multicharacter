local TYPES = {success=true, error=true, info=true, warning=true}

local function sendNUI(o)
    SendNUIMessage({
        action   = 'notify',
        type     = o.type or 'info',
        title    = o.title or 'Powiadomienie',
        message  = o.message or '',
        length   = tonumber(o.length) or 3000,
        position = o.position or 'top-right',
        sound    = (o.sound ~= false)
    })
end

local function isDigits(s) return type(s)=='string' and s:match('^%d+$') ~= nil end

function Notify(a1, a2, a3, a4, a5, a6)
    local o = {}

    if type(a1) == 'table' then
        o = a1

    elseif type(a1) == 'number' then
        o.length   = a1
        o.message  = a2 or ''
        o.type     = TYPES[a3] and a3 or 'info'
        o.title    = a4 or 'Powiadomienie'
        o.position = a5 or 'top-right'
        o.sound    = (a6 ~= false)

    elseif TYPES[a1] then
        o.type     = a1
        o.title    = a2 or 'Powiadomienie'
        o.message  = a3 or ''
        o.length   = tonumber(a4) or 3000
        o.position = a5 or 'top-right'
        o.sound    = (a6 ~= false)

    else
        -- message, type, length, title, position, sound
        -- DODATKOWO: jeżeli a1 to "5000" (same cyfry) i nie ma innych danych → potraktuj jako length
        if isDigits(a1) and a2 == nil then
            o.length   = tonumber(a1)
            o.message  = ''                 -- nie pokazuj „5000” w treści
            o.type     = 'info'
            o.title    = 'Powiadomienie'
        else
            o.message  = a1 or ''
            o.type     = TYPES[a2] and a2 or 'info'
            o.length   = tonumber(a3) or (isDigits(a1) and tonumber(a1)) or 3000
            o.title    = a4 or 'Powiadomienie'
            o.position = a5 or 'top-right'
            o.sound    = (a6 ~= false)
        end
    end

    sendNUI(o)
end
exports('Notify', Notify)

RegisterNetEvent('esx_notify:Notify', function(...) Notify(...) end)
RegisterNetEvent('esx_notify:notify', function(...) Notify(...) end)
