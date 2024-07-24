#!/bin/bash
export XAUTHORITY=/home/pi/.Xauthority
export DISPLAY=:0 
export XDG_RUNTIME_DIR=$XDG_RUNTIME_DIR
sleep 20

runuser -u pi -- chromium-browser --disable --disable-translate --disable-infobars --disable-suggestions-service --disable-save-password-bubble --start-maximized --noerrdialogs --disable-component-update --incognito --kiosk --no-zygote-sandbox http://localhost:5050