#!/bin/bash

# Install frontend
cd frontend
npm install
npm run build

# Install backend
cd ../backend
npm install