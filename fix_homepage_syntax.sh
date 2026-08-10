#!/bin/bash
sed -i '232s/.*/        {!imageBase64 \&\& !isProMode \&\& (/' src/components/HomePage.tsx
sed -i '254s/.*/        {!imageBase64 \&\& history \&\& history.length > 0 \&\& (/' src/components/HomePage.tsx
sed -i '266s/.*/        {!imageBase64 \&\& isProMode \&\& (/' src/components/HomePage.tsx
sed -i '278s/.*/        {isProMode \&\& !imageBase64 \&\& (/' src/components/HomePage.tsx
