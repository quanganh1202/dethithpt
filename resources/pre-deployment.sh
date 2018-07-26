#!/bin/bash

# Install deploy tool
npm install

# Install frontend
cd frontend
npm install
npm run build

# Install backend
cd ../backend
npm install