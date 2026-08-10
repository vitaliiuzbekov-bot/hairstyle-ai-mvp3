#!/bin/bash
sed -i 's/xFrameOptions: false/xFrameOptions: false,\n    crossOriginOpenerPolicy: false,\n    crossOriginResourcePolicy: false/g' server.ts
