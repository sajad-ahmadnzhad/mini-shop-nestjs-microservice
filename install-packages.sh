#!/bin/bash


BASE_DIR=$(dirname "$0")


SERVICES=("auth-service" "notification-service" "product-service" "gateway")

for SERVICE in "${SERVICES[@]}"; do
    echo "Installing dependencies for $SERVICE...."
    cd "$BASE_DIR/$SERVICE" || exit
    npx yarn install
    if [$? -ne 0]; then
        echo "Failed to install dependencies for $SERVICE"
        exit 1
    fi
    echo "Dependencies installed for $SERVICE"
done

echo "All dependencies isntalled successfully !!"