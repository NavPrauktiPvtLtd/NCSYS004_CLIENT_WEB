#!/bin/bash
export XAUTHORITY=/home/pi/.Xauthority
export DISPLAY=:0 
export XDG_RUNTIME_DIR=$XDG_RUNTIME_DIR

sudo systemctl enable NetworkManager

sudo systemctl start NetworkManager


# Function to check internet connectivity
check_internet() {
    # Ping Google's public DNS server to check for internet connectivity
    if ping -c 1 8.8.8.8 &> /dev/null; then
        return 0
    else
        return 1
    fi
}

# Check if Wi-Fi credentials file exists
if [ ! -f /home/pi/NCSYS004_CLIENT_WEB/wifi_credentials.txt ]; then
    echo "WiFi credential file 'wifi_credentials.txt' not found."
    exit 1
fi

readarray -t credentials < /home/pi/NCSYS004_CLIENT_WEB/wifi_credentials.txt
if [ ${#credentials[@]} -lt 2 ]; then
    echo "Invalid credential file format. It should contain SSID and password on separate lines."
    exit 1
fi

wifi_ssid="${credentials[0]}"
wifi_password="${credentials[1]}"

sleep 10

# Check if there is internet access
if ! check_internet; then
    echo "No internet connection detected. Attempting to connect to Wi-Fi..."

    sudo chmod +x /home/pi/NCSYS004_CLIENT_WEB/wifi-connector.sh

    # Loop to run the "connect_wifi.sh" script until Wi-Fi is connected
    while true; do
        # Check the connection status
        if nmcli device status | grep "$wifi_ssid" | grep -q "connected"; then
            echo "Connected to $wifi_ssid successfully."
            break
        else
            echo "Trying to connect..."
            sudo /home/pi/NCSYS004_CLIENT_WEB/wifi-connector.sh
            sleep 10
        fi
    done
else
    echo "Internet connection is already available."
fi


sleep 20

runuser -u pi -- chromium-browser --disable --disable-translate --disable-infobars --disable-suggestions-service --disable-save-password-bubble --start-maximized --noerrdialogs --disable-component-update --incognito --kiosk --no-zygote-sandbox http://localhost:5050