## Pre-requistes

1. Rename `"js": ["./script.min.js"]` to `"js": ["./script/script.js"]` in `manifest.json`
2. Rename `"service_worker": "./background.min.js"` to `"service_worker": "./script/background.js"` in `manifest.json`
  
## Post workdone

1. Create minified version of both scripts and rename to `*.min.js`  in root folder.
2. Rename the modified scripts location folder in  `manifest.json`.