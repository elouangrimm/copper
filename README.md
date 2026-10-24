# Copper

Copper turns a link from the Copernicus Browser into a large, graded Sentinel-2 image. You find a view in the official browser, paste the link, adjust the framing, bands and grading, and export a stitched PNG or JPEG at up to 12000 pixels wide.

It is meant for prints and wallpapers, not for analysis.

Live at https://copper.e5g.dev

## What you need

- A free account at https://dataspace.copernicus.eu
- An OAuth client for the Sentinel Hub APIs. In the Sentinel Hub dashboard, open User settings and create one under OAuth clients. Copy the client ID and secret into the key dialog in Copper.
- A current desktop browser. Large exports need a few gigabytes of free memory.

## Running it

There is no build step and no server code. Serve the folder with anything:

    python3 -m http.server 8000

Then open http://localhost:8000. To deploy, copy the files to any static host.

## Using it

1. Paste a Copernicus Browser link and press Load view. The position, zoom, date and layer are read from it.
2. Drag to move the view, scroll to zoom. The crosshair marks the centre of the export.
3. Pick a band combination and adjust the grading. Grading is applied in the browser, so the sliders do not trigger new downloads.
4. Choose a date. The arrows next to it step through days that have imagery for this spot.
5. Pick a width and press Download print.

For several images, paste a list of links into Batch and use Download all.

Cloud settings: the cloud limit skips scenes that are too cloudy. Cleanup (Standard or Strict) replaces cloud and shadow pixels with clear ones from other passes within the "borrow from" window. With a window of 0 only a single day is used.

## Keyboard

| Key | Action |
| --- | --- |
| [ and ] | Previous or next day with imagery |
| { and } | Previous or next day under the cloud limit |
| Arrow keys | Move the view, Shift for larger steps |
| + and - | Zoom |
| T and F | True color, false color |
| G and C | Toggle guides, crosshair |
| E and B | Download, add to batch |
| P | Full screen preview |
| , | Settings |

## How it works

- The page talks directly to Copernicus from the browser. It requests a token from identity.dataspace.copernicus.eu and images from sh.dataspace.copernicus.eu (Process API). Day lookups use the Catalog API on the same host.
- Each band preset is an evalscript generated in js/api.js. The script picks, per pixel, the first pass that is not flagged as cloud or shadow in the scene classification band.
- Exports are fetched as tiles of at most 2500 by 2500 pixels, drawn into one canvas, graded tile by tile, then encoded.
- Sentinel-2 resolves 10 m per pixel. Widths that need finer than that are smoothly enlarged by the API.

## Limits

- Browser canvases top out around 16000 pixels on a side and 200 megapixels, so the export size is capped there.
- File sizes shown in the interface are rough estimates. A 130 km wide native export is around a quarter of a gigabyte as PNG.
- Copernicus applies processing unit quotas to free accounts. Large exports use more of them.

## Privacy

The client ID and secret are stored in the browser's local storage and sent only to Copernicus. Nothing is sent to any other server, and the site has no analytics. Fonts are loaded from Google Fonts.

## Project layout

    index.html           page structure
    favicon.svg
    css/base.css         tokens, type, form controls
    css/layout.css       header, viewer, inspector
    css/components.css   chips, sliders, overlays, dialogs
    js/config.js         constants, band presets, state
    js/util.js           small DOM helpers
    js/grade.js          colour grading
    js/api.js            Copernicus requests and evalscripts
    js/link.js           Copernicus Browser link parsing
    js/view.js           view state, preview, date stepping
    js/export.js         tiled export and batch queue
    js/interaction.js    pan, zoom, keyboard
    js/dialogs.js        settings and key dialogs
    js/ui.js             control setup and startup

Scripts are plain files loaded in order and share globals, so the page also works when opened from disk.

## Data

Contains modified Copernicus Sentinel data. Use of the data is subject to the Copernicus Sentinel data terms and conditions.
