# Trajectory Postprocessing

A static portfolio case study based on `improving-golf-swing-pose-estimation`, with snapshot comparisons from `enhancing-blurry-club-recall`.

## Run locally

```sh
node scripts/serve.mjs
```

Open http://127.0.0.1:8004. Requires Node.js 22+ and FFmpeg (including ffprobe) on PATH. The server generates previews and metadata when the catalog is first requested, and supports byte ranges for video seeking.

## Edit content and materials

- `materials/content.json`: page title, the Abstract, Introduction, Methods, Results, Discussion, and Conclusion; metric boxes; navigation; and shared viewer labels.
- `materials/data/vidoes/{face-on,down-the-line}/*.MP4`: original videos. The existing `vidoes` spelling is retained.
- `materials/data/poses/{before,after}/{view}/{id}.json`: matching frame-based predictions, using `joints` and `pred` arrays.
- `materials/data/snapshot.json`: snapshot ranges with inclusive zero-based `[start, end]` indices, a selected `joint`, and Before/After `message_box` text. Optional `highlight_index` is a single zero-based frame inside the range. The background and message connectors use this frame (or the end frame when omitted); two fading trajectories show the selected joint throughout the range.
- `materials/data/snapshots/{view}/{video-id}/{frame-index}.jpg`: extracted images, prepared on server startup and page refresh when missing or stale. Existing `.jpg`, `.jpeg`, `.png`, and `.webp` images are supported. Frame indices in filenames are zero-based.
- `materials/data/snapshot-catalog.json`: generated lightweight snapshot metadata, separate from the video catalog.
- `materials/data/credits.json`: optional source credits.
- `materials/data/catalog.json` and `.generated/`: disposable generated metadata and previews; ignored by Git.

Videos need both matching pose files to appear. Source materials stay in place; no source media is copied from the reference repos. Abstract snapshots load images and compact pose data only; no browser video decoding or extraction is used. The first snapshot starts immediately, and the remaining snapshots and Results videos warm after the banner leaves view. Snapshots share one image with toggleable overlays; videos use synchronized Before/After panels, a frame slider, centered controls, and a video list.

## Check and build

```sh
node --test tests/*.test.mjs
node scripts/build-site.mjs
node scripts/verify-site.mjs
node scripts/serve.mjs --dist
node scripts/check-media.mjs
```

Builds include only referenced assets and use visible `media/` paths for generated delivery assets. Original videos receive lossless fast-start preparation; optional re-encoding is configured in `scripts/media-options.json`.

## GitHub Pages workflow

`.github/workflows/pages.yml` tests, builds, verifies asset paths, and deploys on pushes to `main` or `master`, or manual dispatch. Set the repository's **Settings → Pages → Source** to **GitHub Actions**. Commit the source materials along with the page files; generated caches and `dist/` stay ignored. No push or deployment is performed by local setup.
