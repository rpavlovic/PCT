# Weber Shandwick's PCT tool

A static [gulp](http://gulpjs.com/) site, running [Nunjucks](https://mozilla.github.io/nunjucks/) and [jQuery](https://jquery.com/), that interfaces with SAP using oData services.

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

## Git Config

Git comes preinstalled on many systems. If it’s not already installed you can get it (and other tools) by installing XCode for free from the AppStore or by visiting http://git-scm.com.

To identify you and your work, on the command line, tell git who you are:

```
git config --global user.name "Your Name"
git config --global user.email "user@domain.com"
```

You should also setup your SSH key: https://help.github.com/articles/generating-ssh-keys/

## Cloning

To clone this repository:

```
git clone https://github.com/northpoint/weber-shandwick.git
```

That will download a local copy of the source code, under a default branch called `master`:

```
git remote -v
origin  https://github.com/northpoint/weber-shandwick.git (push)
origin  https://github.com/northpoint/weber-shandwick.git (fetch)
```

This means you can now fetch and push code from/to a remote location named "origin," under a branch called "master":

```
git fetch origin master
git merge origin/master
```

Those two commands can be simplified with `git pull`:

```
git pull origin master
```

For each repository, you can create however many remotes and branches as you desire. (More on that later.)

## Basic Git Etiquette

Make sure to always pull the latest code before you start work, and after you commit your changes; i.e.:

```
git pull origin master

# do your work

git commit file1 file2 file3 file4 -m 'a message related to the changes you introduced'

git pull origin master
```

At this point, once everything is clean (no merge conflicts), you can push your changes back up:

```
git push origin master
```

## Forking Workflow

If you're going to have multiple developers working on the code repository, and the number of developers will be variable (people come, people go), then consider using a forking workflow.

A fork is, essentially, a clone of the repository that lives in the cloud. Each individual developer would have its own fork, which would become the repository's `origin`.

To fork the repo, click "Fork" on the top right of your screen, then select the account to fork the code to (i.e. your own account). Once forked, you can either clone the repo, if you haven't already:

```
git clone https://github.com/rpavlovic/weber-shandwick.git
```

However, if you've already cloned the repo, then you simply need to repoint your local repo to your fork:

```
git remote set-url origin https://github.com/rpavlovic/weber-shandwick.git
```

Either way, you'll now have a remote called "origin" which points to your fork:

```
git remote -v
origin  https://github.com/rpavlovic/weber-shandwick.git (push)
origin  https://github.com/rpavlovic/weber-shandwick.git (fetch)
```

At this point, you want to create a remote called "upstream," which points to the source of your fork:

```
git remote add upstream https://github.com/northpoint/weber-shandwick.git 
```

You'll now have two remotes:

```
git remote -v 
origin  https://github.com/rpavlovic/weber-shandwick.git (push)
origin  https://github.com/rpavlovic/weber-shandwick.git (fetch)
upstream    https://github.com/northpoint/weber-shandwick.git (fetch)
upstream    https://github.com/northpoint/weber-shandwick.git (push)
```

Using the forking workflow, you pull from `upstream` and push to `origin`:

```
git pull upstream master
# do your work
git commit file1 file2 file3 -m 'a commit message pertaining to your work'
git pull upstream master
git push origin master
```

Once your code is pushed to origin, your fork will be up-to-date. At that point, you can create a pull request from your fork to the source repository. A pull request essentially asks the account owner to accept your newly introduced code. They may; they may not. If not, changes are typically asked for by way of comments. It could be an overall comment, on the entire pull request, or it could contain line-by-line granularity. Either way, add those changes, then push those changes up the way you normally would:

```
git pull upstream master
# do your work
git commit file1 file2 file3 -m 'a commit message pertaining to your changes'
git pull upstream master
git push origin master
```

# Further Reading

With the basics covered you can now fork an existing repository, contribute to your project, and keep in sync with the rest of the team. Here are some next steps you can take to learn more and explore some tools commonly used:

Git: http://git-scm.com/
* GitHub Help: https://help.github.com/
* GitHub Setup: https://help.github.com/articles/set-up-git/
* GitHub Fork-a-Repo: https://help.github.com/articles/fork-a-repo/
* GitHub SSH Keys: https://help.github.com/articles/generating-ssh-keys/
* Atlassian Git Guide: https://www.atlassian.com/git/
* Git Tower Guide: http://www.git-tower.com/learn/
* Free Pro Git Book: https://progit.org/
* Git Tower App: http://www.git-tower.com/
* SourceTree App: https://www.sourcetreeapp.com/
* For Windows Developers: 
    * https://msysgit.github.io/
    * Bitbucket SSH setup: https://confluence.atlassian.com/display/BITBUCKET/Set+up+SSH+for+Git 
