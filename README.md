# hungrydemocracynuxt

## Build Setup

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

For detailed explanation on how things work, check out the [documentation](https://nuxtjs.org).

## Special Directories

You can create the following extra directories, some of which have special behaviors. Only `pages` is required; you can delete them if you don't want to use their functionality.

### `assets`

The assets directory contains your uncompiled assets such as Stylus or Sass files, images, or fonts.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/assets).

### `components`

The components directory contains your Vue.js components. Components make up the different parts of your page and can be reused and imported into your pages, layouts and even other components.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/components).

### `layouts`

Layouts are a great help when you want to change the look and feel of your Nuxt app, whether you want to include a sidebar or have distinct layouts for mobile and desktop.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/layouts).


### `pages`

This directory contains your application views and routes. Nuxt will read all the `*.vue` files inside this directory and setup Vue Router automatically.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/get-started/routing).

### `plugins`

The plugins directory contains JavaScript plugins that you want to run before instantiating the root Vue.js Application. This is the place to add Vue plugins and to inject functions or constants. Every time you need to use `Vue.use()`, you should create a file in `plugins/` and add its path to plugins in `nuxt.config.js`.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/plugins).

### `static`

This directory contains your static files. Each file inside this directory is mapped to `/`.

Example: `/static/robots.txt` is mapped as `/robots.txt`.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/static).

### `store`

This directory contains your Vuex store files. Creating a file in this directory automatically activates Vuex.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/store).



# Azure


&#35; login supports device login, username/password, and service principals
&#35; see https://docs.microsoft.com/en-us/cli/azure/?view=azure-cli-latest#az_login
az login
&#35; list all of the available subscriptions
az account list -o table
&#35; set the default subscription for subsequent operations
az account set --subscription $SUBSCRIPTION
&#35; create a resource group for your application
az group create --name $RESOURCEGROUP --location $LOCATION
&#35; create an appservice plan (a machine) where your site will run
az appservice plan create --name $PLANNAME --location $LOCATION --is-linux --sku $PLANSKU --resource-group $RESOURCEGROUP
&#35; create the web application on the plan
&#35; specify the node version your app requires
az webapp create --name $SITENAME --plan $PLANNAME --runtime $RUNTIME --resource-group $RESOURCEGROUP

&#35; To set up deployment from a local git repository, uncomment the following commands.
&#35; first, set the username and password (use environment variables!)
&#35; USERNAME=""
&#35; PASSWORD=""
&#35; az webapp deployment user set --user-name $USERNAME --password $PASSWORD

&#35; now, configure the site for deployment. in this case, we will deploy from the local git repository
&#35; you can also configure your site to be deployed from a remote git repository or set up a CI/CD workflow
&#35; az webapp deployment source config-local-git --name $SITENAME --resource-group $RESOURCEGROUP

&#35; the previous command returned the git remote to deploy to
&#35; use this to set up a new remote named "azure"
&#35; git remote add azure "https://$USERNAME@$SITENAME.scm.azurewebsites.net/$SITENAME.git"
&#35; push master to deploy the site
&#35; git push azure master

&#35; browse to the site
&#35; az webapp browse --name $SITENAME --resource-group $RESOURCEGROUP


az webapp deploy --resource-group hungrydemocracy_group --name hungrydemocracy --type zip --src-path deploy.zip

