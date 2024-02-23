# Serverless Blog

Demo:
https://blog-node-mongodb.vercel.app/

Admin page:
https://blog-node-mongodb.vercel.app/admin

## Runnig on localhost at: http://localhost:3000
````
vercel dev
````

This blog uses Vercel's serverless platform and reads and writes to a MongoDB instance on the cloud. Posts are read from database, injected to Handlebar template to generate HTML markup which is then sent inside response body to browser. It supports markdown and filtering using tags. No JavaScript in frontend.


## Features
### Permissions
Blog posts have a `permission` property which you can set to `private`. Private posts won't be listed on listing pages such as blog's home page or when filted by tags, however you can still open them in browser using their slug or direct url. Here is an example of a private post which won't show up on blog's homepage:
https://blog-node-mongodb.vercel.app/my-private-post

To display all posts on homepage you can use `?permission=all` in url:
https://blog-node-mongodb.vercel.app/?permission=all
### JSON vs HTML
By default get requests to blog api return HTML markup, however you can fetch the response as json by adding parameter `response=json` to URL, for example:
https://blog-node-mongodb.vercel.app/?response=json


