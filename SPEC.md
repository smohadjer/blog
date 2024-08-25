# Example URLs
- https://blog.saeidmohadjer.com/
- https://blog.saeidmohadjer.com/?response=json
- https://blog.saeidmohadjer.com/?permission=all
- https://blog.saeidmohadjer.com/tag/film

# Request-response life-cycle for https://blog.saeidmohadjer.com/

1. Browser sends a get request for `/` to the server.
1. A rewrite rule in `vercel.json` redirects request to `/api/blog` endpoint which is a [serverless Node.js function](https://vercel.com/docs/functions/runtimes/node-js) hosted on Vercel. For more info see [Rewrites on Vercel](https://vercel.com/docs/edge-network/rewrites)).
1. The blog.ts function connects to a MongoDB database and fetches all the blog posts.
1. If request has a query `response=json` the endpoint returns all blog posts as json in response, otherwise it gets all tags and generates HTML markup for the blog page and returns the result in response.

To generate markup from blog posts fetched from database, we use npm packages [Marked](https://www.npmjs.com/package/marked) and [Handlebars.js](https://www.npmjs.com/package/handlebars). The blog has two layouts, one for the listing page and one for the detail page which are stored as handlebars templates (.hbs) in folder `/templats`. The script that generates markup checks whether request has a `slug` parameter or not and if it has it uses `details.hbs` template, otherwise `listing.hbs` template. Note that slug parameter is generated via the rewrite rule in `vercel.json` and no such parameter is entered in browser address bar. For example URL `https://blog.saeidmohadjer.com/timeless-brilliance-of-citizen-kane` via the rewrite rule `{"source": "/:slug", "destination": "/api/blog"}` will redirect to `/api/blog` with a `slug=timeless-brilliance-of-citizen-kane` query.
