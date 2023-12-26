# Netlify CMS

**A simple read me description on how to implement the netlify cms**

A CMS for static site generators. Give non-technical users a simple way to edit
and add content to any site built with a static site generator.

Try the UI demo here: [cms.netlify.com](https://cms.netlify.com).

## How it works

Netlify CMS is a single-page app that you pull into the `/admin` part of your site.

It presents a clean UI for editing content stored in a Git repository.

You setup a YAML config to describe the content model of your site, and typically
tweak the main layout of the CMS a bit to fit your own site.

When a user navigates to `/admin` she'll be prompted to login, and once authenticated
she'll be able to create new content or edit existing content.

## Quick Start

The easiest way to get started playing around with netlify CMS, is to clone one of
our starter templates and start hacking:

- [Jekyll + netlify CMS](https://github.com/netlify-templates/jekyll-netlify-cms)
- [Roots + netlify CMS](https://github.com/netlify-templates/roots-cms-example)
- [Hexo + netlify CMS](https://github.com/netlify-templates/hexo-cms-example)
- [Pelican + netlify CMS](https://github.com/netlify-templates/pelican-netlify-cms)

## Installing

Netlify CMS is an Ember app. To install it in your site, add an `/admin` folder in
your source directory and use this `index.html` as a template:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <title>Content Manager</title>
    <!-- Include the stylesheets from your site here -->
    <link rel="stylesheet" href="//cms.netlify.com/assets/cms.css" />
    <!-- Include a CMS specific stylesheet here -->

    <base href="/admin/" />
  </head>
  <body>
    <script src="//cms.netlify.com/assets/vendor.js"></script>
    <script src="//cms.netlify.com/assets/cms.js"></script>
  </body>
</html>
```

Add a `config.yml` file to the `/admin` folder and configure your content model:

```yaml
backend:
  name: github-api
  repo: owner/repo # Path to your Github repository
  branch: master # Branch to update (master by default)

media_folder: "img/uploads" # Folder where user uploaded files should go

collections: # A list of collections the CMS should be able to edit
  - name: "post" # Used in routes, ie.: /admin/collections/:slug/edit
    label: "Post" # Used in the UI, ie.: "New Post"
    folder: "_posts" # The path to the folder where the documents are stored
    create: true # Allow users to create new documents in this collection
    fields: # The fields each document in this collection have
      - { label: "Title", name: "title", widget: "string", tagname: "h1" }
      - { label: "Body", name: "body", widget: "markdown" }
      - { label: "Foo", name: "foo", widget: "foo" }
    meta: # Meta data fields. Just like fields, but without any preview element
      - { label: "Publish Date", name: "date", widget: "datetime" }
  - name: "settings"
    label: "Settings"
    files:
      - name: "general"
        label: "General settings"
        file: "_settings/general.json"
        fields:
          - { label: "Main site title", name: "site_title", widget: "string" }
          - {
              label: "Number of fronpage posts",
              name: "post_count",
              widget: "number",
            }
          - { label: "Site cover image", name: "cover", widget: "image" }
```

Netlify CMS works with the concept of collections of documents that a user can edit.

Collections basically comes in three forms:

1. A `folder`. Set the `folder` attribute on the collection. Each document will be a
   file in this folder. Each document will have the same format, fields and meta fields.
2. A list of `files`. Set the `files` attribute on the collection. You can set fields that
   all files in the folder shares directly on the collection, and set specific fields for
   each file. This is great when you have files with a different structure.
3. A `file`. **Warning, not implemented yet**. This is a collection stored in a single file.
   Typically a YAML file or a CSV with an array of items.

Each collection has a list of fields (or files with their individual fields). Each field has a `label`, a `name` and a `widget`.

Setting up the right collections is the main part of integrating netlify CMS with your site. It's
where you decide exactly what content editors can work with, and what widgets should be used to
edit each field of your various files or content types.

## Environments

Often it's useful to have a few different environments defined in your config. By default the config
will be loaded as is, but if you set a global CMS_ENV variable in a script tag in your admin/index.html,
any attributes in that environment will take precedence over the default attributes.

Example:

```yaml
backend:
  name: netlify-api
  url: http://localhost:8080

production:
  backend: github-api
  repo: netlify/netlify-home
  branch: master
# rest of the config here...
```

Now when working locally, the CMS will use a local instance of the [netlify git API](https://github.com/netlify/netlify-git-api), but if you make sure to set `window.CMS_ENV="production"` in your production builds, then the CMS will work on Github's API in production.

## Defining the config directly in your admin/index.html

Some Static Site Generators (looking at you Hexo) won't copy a config.yml from
the admin folder into the build when generating a site. As an alternative you can
embed the config.yml directly in the `admin/index.html` file like this:

```html
<script type="application/x-yaml" id="cms-yaml-config">
  # Config YAML goes here...
</script>
```

## GitHub as a Backend

The default Github-based authenticator integrates with Netlify's [Authentication Provider feature](https://www.netlify.com/docs/authentication-providers) and the repository
backend integrates directly with Github's API.

To get everything hooked up, setup continuous deployment from Github to Netlify
and then follow [the documentation](https://www.netlify.com/docs/authentication-providers)
to setup Github as an authentication provider.

That's it, now you should be able to go to the `/admin` section of your site and
log in.

## Local git backend

If you don't have a Github repo or just wan't to work locally, netlify CMS also
has a local version of the Github api that you can run from any repo on your machine.

Grab it from [the netlify-git-api repo](https://github.com/netlify/netlify-git-api/releases),
follow the installation instructions, then CD into the repo with your site and run:

```bash
netlify-git-api users add
netlify-git-api serve
```

This will add a new user and start serving an API for your repo.

Configure the backend like this in your `config.yml`:

```yaml
backend:
  name: netlify-api
  url: http://localhost:8080
```

## Media folder and Public folder

Most static file generators, except from Jekyll, don't keep the files that'll be
copied into the build folder when generating in their root folder.

This can create a problem for image and file paths when uploaded through the CMS.

Use the `public_folder` setting in `config.yml` to tell the CMS where the public
folder is located in the sources. A typical Middleman setup would look like this:

```yml
media_folder: "source/uploads" # Media files will be stored in the repo under source/uploads
public_folder: "source" # CMS now knows 'source' is the public folder and will strip this from the path
```

## Widgets

Actual content editing happens with a side by side view where each `widget` has
a control for editing and a preview to give the content editor an idea of how the
content will look in the context of the published site.

Currently these widgets are built-in:

- **string** A basic text input
- **markdown** A markdown editor
- **checkbox** A simple checkbox
- **date** A date input
- **datetime** A date and time input
- **number** A number
- **hidden** Useful for setting a default value with a hidden field
- **image** An uploaded image
- **object** An object with it's own set of fields
- **list** A list of objects, takes it's own array of fields describing the individual objects

## Customizing the preview

You can customize how entries in a collection are previewed easily by adding a handlebars template in your `/admin/index.html`:

```html
<script type="text/x-handlebars" data-template-name="cms/preview/my-collection">
  <h1>{{cms-preview field='title'}}</h1>
  <div class="photo">{{cms-preview field='image'}}</div>
  <div class="body">{{cms-preview field='body'}}</div>
</script>
```

The name of the template should be prefixed 'cms/preview/' and have the same name
as the collection you want to preview.

User the `{{cms-preview field='fieldname'}}` to insert the preview widget for a field.

You can use `{{entry.fieldname}}` to access the actual value of a field in the template.

For widgets like markdown fields or images, you'll typically always want to use the {{cms-preview field='body'}} format, since otherwise you'll get the raw value of the field, rather than the
HTML value.

## List or Object Widgets and Custom Previews

The list widget is very powerful and allow you to have a list of structured object within an entry, that can be reordered via drag and drop.

Here's a basic example of an entry in a file based collection that lets the user edit a list of authors.

**config.yml**

```yaml
collections:
  - name: "settings"
    label: "Settings"
      - name: "authors"
        label: "Authors"
        file: "_data/authors.yml"
        description: "Author descriptions"
        fields:
          - name: authors
            label: Authors
            widget: list
            fields:
              - {label: "Name", name: "name", widget: "string"}
              - {label: "Description", name: "description", widget: "markdown"}
```

This will let the user edit a list of authors that each have a Name and a Description.

for more info visit the docs https://preview-auth-doc--netlify-cms-www.netlify.app/docs/

# Eleventy js

follow this link to learn eleventy from scratch
https://learneleventyfromscratch.com/
