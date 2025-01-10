#!/bin/bash

# Env name and files
ENV_NAME=".env"
EXPORT_FILE=".env.example"

# Services list
SERVICES=("auth-service" "gateway" "notification-service" "product-service")

for SERVICE in "${SERVICES[@]}"; do
    echo "Processing $SERVICE..."
    #Variables for save .env and .env.example paths 
    SERVICE_ENV_PATH="$SERVICE/$ENV_NAME"
    SERVICE_EXPORT_PATH="$SERVICE/$EXPORT_FILE"
    
    # Check for exists service
    if [ -d "$SERVICE" ]; then
        # Check for exists .env file in service 
        if [ ! -f "$SERVICE_ENV_PATH" ]; then
            # Check for exists .env.example file in service
            if [ ! -f "$SERVICE_EXPORT_PATH" ]; then
                echo "$EXPORT_FILE not found in $SERVICE"
                exit 1
            else 
                #Copy .env.example file data in .env file
                cp "$SERVICE_EXPORT_PATH" "$SERVICE_ENV_PATH"
                echo "$SERVICE_ENV_PATH file created from $SERVICE_EXPORT_PATH"
            fi
        else
            echo "$SERVICE already added $ENV_NAME"
    fi
    fi
done
