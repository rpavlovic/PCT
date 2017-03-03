# Weber Shandwick

A static gulp site

`npm install`

`gulp` will build, compile, and watch any changes made to the files during development of the project. It will also start a proxy local server and will refresh during any changes during development of the project.

To manually output a static build for the IPG team:

`gulp ipg`

That will generate flat HTML in the ./build directory, and zip it up. If your build directory is already complete (via `gulp` or `gulp build`), you can just run `gulp zip`, which is way faster.