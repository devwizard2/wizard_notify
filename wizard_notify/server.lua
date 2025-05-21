local expectedResourceName = "wizard_notify"
local currentResourceName = GetCurrentResourceName()
if currentResourceName ~= expectedResourceName then
print("^1Resource renamed! Change it as it was! |wizard_notify|^0")
return
end
