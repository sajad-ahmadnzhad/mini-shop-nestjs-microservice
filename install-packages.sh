#!/bin/bash

SERVICES=("auth-service" "notification-service" "product-service" "gateway")

for SERVICE in "${SERVICES[@]}"; do
    echo "Installing dependencies for $SERVICE...."

    if [ ! -d "$SERVICE" ]; then
        echo "Directory $SERVICE not found"
        exit 1
    fi
    cd $SERVICE
    npx yarn install
    if [$? -ne 0]; then
        echo "Failed to install dependencies for $SERVICE"
        exit 1
    fi
    echo "Dependencies installed for $SERVICE"
done

echo "All dependencies installed successfully !!"