# pyroam - Python notebooks in Roam Research

Documentation: http://adamkrivka.com/roam-plugins/pyroam

## Contributing

You can create issues or pull requests in this repository or DM me on Twitter (https://twitter.com/adam_krivka)

If you want to develop this plugin, you need to clone this repository, run `npm install` or `yarn install` and then `npm run dev` `yarn run dev`. The final script will be hosted at `localhost:1234/pyroam.js` (or something else, the bundler will tell you), so you should replace the `src` of the script in Roam with that (it is `adamkrivka.com/roam-plugins/pyroam/pyroam.js` by default). Unfortunately, you need to refresh Roam each time you make a change (there are keyboard listeners which get added on each other).