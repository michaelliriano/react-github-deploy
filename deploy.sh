#!/bin/bash

# Load environment variables from .env file
if [ -f .env ]
then
  export $(cat .env | grep -v '^#' | xargs)
fi

# Set default values if not provided in .env
: ${GITHUB_URL:=default_github_url}
: ${OUT_DIR:=dist}

# Build and deploy the application
docker-compose up -d --build

# Clean up
unset GITHUB_URL OUT_DIR
