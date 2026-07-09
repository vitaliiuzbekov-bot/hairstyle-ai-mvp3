/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-afac4cd2'], (function (workbox) { 'use strict';

  self.skipWaiting();
  workbox.clientsClaim();
  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  workbox.precacheAndRoute([{
    "url": "test-before.jpg",
    "revision": "5932b890b1d4a55b5e5035ab7a561d38"
  }, {
    "url": "test-after.jpg",
    "revision": "7eb15b5fc4c3ec5d06eb7a421625b4a6"
  }, {
    "url": "split.jpg",
    "revision": "9ac923b51ec2ba92d1616ae17e4dc228"
  }, {
    "url": "split-right.jpg",
    "revision": "01190cf8d4d228be1f10713207287c8c"
  }, {
    "url": "split-right-blended.jpg",
    "revision": "b57f291261d85fb72b5f727bad3107d2"
  }, {
    "url": "split-left.jpg",
    "revision": "1b7505c32c4aea1e899c24d430da8b10"
  }, {
    "url": "split-left-blended.jpg",
    "revision": "128230fb838fefac4daa6cf82dd1ae1e"
  }, {
    "url": "split-gen.jpg",
    "revision": "1733392e83158884c26321a5b8e686c5"
  }, {
    "url": "source-half-half.jpg",
    "revision": "d5b6fa6cfb323d4ab97905f1bd4a5d81"
  }, {
    "url": "slider-result.jpg",
    "revision": "1728829054fb12035a16debbb0920ea0"
  }, {
    "url": "slider-original.jpg",
    "revision": "f1877a7b9840b10a2bb7fb8b94ca3ab8"
  }, {
    "url": "slider-before.jpg",
    "revision": "2fcb539698331a7c9f8a09149cc68cc4"
  }, {
    "url": "slider-after.jpg",
    "revision": "2159be1349817c7f7ee2e8e8715034c5"
  }, {
    "url": "registerSW.js",
    "revision": "402b66900e731ca748771b6fc5e7a068"
  }, {
    "url": "pwa-512x512.png",
    "revision": "bfbdf57b4912f5bea8534d039958f282"
  }, {
    "url": "pwa-192x192.png",
    "revision": "b540bbdfe6e26471c97e099df6691b38"
  }, {
    "url": "favicon.svg",
    "revision": "609fa2e1e681cc288a09041c939083ff"
  }, {
    "url": "apple-touch-icon.png",
    "revision": "b1b15803e546e5bf7abbe0c1b9d707a3"
  }, {
    "url": "assets/watermark-r0U12FvZ.js",
    "revision": null
  }, {
    "url": "assets/useScrollLock-UrQEUFCQ.js",
    "revision": null
  }, {
    "url": "assets/react-vendor-DzFnkff0.js",
    "revision": null
  }, {
    "url": "assets/lucide-vendor-CBHcS01K.js",
    "revision": null
  }, {
    "url": "assets/index-Cd4hW05w.css",
    "revision": null
  }, {
    "url": "assets/index-BwrFgGWV.js",
    "revision": null
  }, {
    "url": "assets/imageWorker-KSUt5yhc.js",
    "revision": null
  }, {
    "url": "assets/firebase-vendor-DByxIi_k.js",
    "revision": null
  }, {
    "url": "assets/fallbackAnalysis-Daf5OmZE.js",
    "revision": null
  }, {
    "url": "assets/face-api.esm-DMaQY5kn.js",
    "revision": null
  }, {
    "url": "assets/downloadImage-aLFE7CaM.js",
    "revision": null
  }, {
    "url": "assets/WelcomeModal-BQ0ny8Mo.js",
    "revision": null
  }, {
    "url": "assets/StylistChat-Dd1KlaWU.js",
    "revision": null
  }, {
    "url": "assets/ShareModal-CoHr3RSB.js",
    "revision": null
  }, {
    "url": "assets/RotatingFactsLoader-b7o3f_Lm.js",
    "revision": null
  }, {
    "url": "assets/RotatingFactsLoader-DOfe2hmq.css",
    "revision": null
  }, {
    "url": "assets/QuickTutorial-BVwA3gIq.js",
    "revision": null
  }, {
    "url": "assets/ProfileModal-DKJ6A6MX.js",
    "revision": null
  }, {
    "url": "assets/PWAPrompt-DoLt7q7_.js",
    "revision": null
  }, {
    "url": "assets/HistoryPage-4vKKs1hU.js",
    "revision": null
  }, {
    "url": "assets/FaqPage-DQFcmT0p.js",
    "revision": null
  }, {
    "url": "assets/DailyRewardModal-k4gAJj6C.js",
    "revision": null
  }, {
    "url": "assets/CameraModal-Bk1d0AXk.js",
    "revision": null
  }, {
    "url": "assets/BuyModal-CF9cL8wo.js",
    "revision": null
  }, {
    "url": "assets/BarberBlueprintModal-VfrYSyMm.js",
    "revision": null
  }, {
    "url": "assets/AnalysisResults-CiAXGvhv.js",
    "revision": null
  }, {
    "url": "app/applet/index.html",
    "revision": "40d68ae76f8d9083debc420967c8f907"
  }, {
    "url": "manifest.webmanifest",
    "revision": "7d94a2c5043b6e80e7abb221594a57fa"
  }], {});
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute(new workbox.NavigationRoute(workbox.createHandlerBoundToURL("index.html")));
  workbox.registerRoute(/^https:\/\/(cdn\.jsdelivr\.net|storage\.googleapis\.com)\/.*/i, new workbox.CacheFirst({
    "cacheName": "ml-models-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 50,
      maxAgeSeconds: 2592000
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');

}));
