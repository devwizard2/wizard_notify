local notifyConfig = {
    sounds = {
        success = "sounds/success.mp3",
        error = "sounds/error.mp3",
        info = "sounds/info.mp3",
    },
    defaultDuration = 5000,
    defaultAnimationIn = "fadeInDown",
    defaultAnimationOut = "fadeOutUp",
    defaultPosition = "top-left",
}

local function sendNotification(data)
    SendNUIMessage({
        action = "showNotification",
        data = data
    })
end

RegisterCommand("testnoti", function()
    local notifyTypes = {
        {
            type = "success",
            message = "✔️ Operation completed successfully!",
            sound = notifyConfig.sounds.success
        },
        {
            type = "error",
            message = "❌ Something went wrong!",
            sound = notifyConfig.sounds.error
        },
        {
            type = "info",
            message = "ℹ️ Here's some useful information.",
            sound = notifyConfig.sounds.info
        }
    }

    Citizen.CreateThread(function()
        for _, data in ipairs(notifyTypes) do
            data.position = notifyConfig.defaultPosition
            data.duration = notifyConfig.defaultDuration
            data.animationIn = notifyConfig.defaultAnimationIn
            data.animationOut = notifyConfig.defaultAnimationOut
            sendNotification(data)
            Citizen.Wait(notifyConfig.defaultDuration + 500)
        end
    end)
end)

RegisterNetEvent("wizard_notify:show")
AddEventHandler("wizard_notify:show", function(data)
    data.type = data.type or "info"
    data.position = data.position or notifyConfig.defaultPosition
    data.duration = data.duration or notifyConfig.defaultDuration
    data.animationIn = data.animationIn or notifyConfig.defaultAnimationIn
    data.animationOut = data.animationOut or notifyConfig.defaultAnimationOut
    data.sound = data.sound or notifyConfig.sounds[data.type] or notifyConfig.sounds.info

    sendNotification(data)
end)
