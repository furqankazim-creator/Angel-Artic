# Illustrations

Put one PNG (transparent background, 512x512, same style for all) per word in this folder.
The file name is the word in lower case with underscores: `pig.png`, `ice_cream.png`, `ladybird.png`.

Then run:  `node scripts/import-art.mjs`

The app uses an illustration when one exists, and the emoji when it does not, so you can add
pictures a few at a time. The full list with notes is in `store/briefs/illustration-list.csv`.
