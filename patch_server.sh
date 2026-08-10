#!/bin/bash
sed -i 's/crossOriginEmbedderPolicy: false/crossOriginEmbedderPolicy: false,\n    xFrameOptions: false/g' server.ts
