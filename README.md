# Weber Shandwick's PCT tool

A static [gulp](http://gulpjs.com/) site, running [Nunjucks](https://mozilla.github.io/nunjucks/) and [jQuery](https://jquery.com/), 

## Dependencies

* [Node.js](https://nodejs.org/en/)
    * [Install on Mac](https://treehouse.github.io/installation-guides/mac/node-mac.html)
    * [Install on Windows](http://blueashes.com/2011/web-development/install-nodejs-on-windows/)
* gulp
    * [Install on Mac](https://travismaynard.com/writing/getting-started-with-gulp)
    * [Install on Windows](http://omcfarlane.co.uk/install-gulp-js-windows/)

## Project Setup

Navigate to the source directory, and run `npm install` via command line.

## Build Process

`gulp` will build, compile, and watch any changes made to the files during development of the project. It will also start a local node server, which will auto-refresh any changes during development (using [Browsersync](https://www.browsersync.io/)).

To manually output a static build:

`gulp build && gulp move && gulp moveJS`

Followed by:

`gulp zip`

That will generate flat HTML in the ./build directory, and zip it up.

If your build directory is already complete `gulp ipg`, which is way faster.

## Git Workflow

To clone this repository:

`git clone https://github.com/northpoint/weber-shandwick.git`

Fork the repo, push to your fork, and submit pull requests. Keep your commits clean:

`git fetch upstream master && git rebase -p upstream/master`