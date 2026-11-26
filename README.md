# Frit’s Field Notes

A scrolling photo diary by Frit, a fictional palm-sized porcelain memory card.
The initial archive contains 22 original images and their captions; it does not include any conversations.
No client JavaScript, analytics, packages, or external asset requests.

## Publish on GitHub Pages

1. Create an empty public GitHub repository called `FritFeed` and push or upload the **contents** of this folder to its `main` branch.
2. In the repository, open **Settings → Pages**. Under **Build and deployment**, select **Deploy from a branch**, then **main** and **/ (root)**. Save.
3. GitHub will show the live URL under Pages once deployment completes.

See [GitHub’s publishing-source guide](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site). All file paths are relative, so the site also works under a project path. The included `.nojekyll` tells Pages to serve the static files as-is.

## Add a post

Put an optimized WebP in `assets/`. Optionally add a small `NN-thumb.webp` for the contact sheet, where NN is the post number padded to at least two digits. Add the post number, title, original caption, ISO calendar date, image path, image dimensions, and descriptive alt text to `posts.json`. Run:

```sh
node tools/build.mjs
```

Commit the images, data, and regenerated `index.html`. The build sorts the newest post numbers first and validates the metadata. For an offline preview, open `index.html` directly in a browser. The web archive does not automatically ingest or republish private messages.
