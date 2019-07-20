# Vuexcellent

A Vuex preloader for Laravel.

![Excellent](https://giphygifs.s3.amazonaws.com/media/kUFlw7XaGE36w/giphy.gif)

Vuexcellent is a set of libraries to help load data from your laravel backend to your Vue app during the initial page load. The general idea is to set your desired vuex state from within Controllers or Models, and have it instantly available without needing to juggle passing the data in through props, or make extra api calls to load the initial data. Once installed, usage is designed to be quite straight forward.

```php
// PostController.php

public function index() {
    // Set the initial vue state
    Vuex::store(function($store) {
        $store->state([
            'posts' => Posts::paginate(15)
        ]);
    });

    // Navigate to the view as
    // you normally would
    return view('blogPosts');
}
```

```html
<template>
    <div v-for="post in $store.state.posts" :key="post.id">
        <a :href="`/posts/${post.slug}`">{{ post.title }}</a>
    </div>
</template>
```

And thats it! ...sort of.

---
## Installation
Installation is a two step process. Theres the Laravel component, then there is the Vue.js component.

### Laravel installation

```sh
composer require reed-jones/vuexcellent
```

Out of the box, `ReedJones\Vuexcellent\VuexcellentServiceProvider` should be automatically registered, and `ReedJones\Vuexcellent\Facades\Vuex` should be aliased as `Vuex`.

All thats left before moving to the javascript is to add the injection point. Go to the `<head>` section of your blade file and add the blade directive `@vuex`

```html
<head>
  <title>Vuexcellent Docs</title>
  @vuex
</head>
```

### Vue.js installation

```sh
npm install @j0nz/vuexcellent
yarn add @j0nz/vuexcellent
```

Now just use `@j0nz/vuexcellent` instead of `vuex` when you are creating your store.

```js
import Vuex, { Store } from '@j0nz/vuexcellent'

const store = new Store({
    //...
```

All vuex options are re-exported from vuexcellent for ease of use. For example:

```js
import { mapState } from '@j0nz/vuexcellent'
```

---

## Usage

The `Vuex` facade has a simple API.

```php
// Creating or adding to the current store instance
Vuex::store(function($store) {

    // To add data to the root state object
    $store->state([
        // Array's and Collections are acceptable
        'count' => 5,
        'numbers' => [
            'even' => [0, 2, 4, 6, 8],
            'odd' => [1, 3, 5, 7, 9]
        ]
    ]);

    // To add or update modules state
    $store->module('moduleName', [
        'data' => 'goes here'
    ]);
});
```

Assuming you have used the `@vuex` directive, and everything is installed properly, your vuex state should already be in place. If not, you will need to set `window.__INITIAL_STATE__` the `Vuex::asArray()` or `Vuex::asJson()` accessors may be of use. Again, this should not be needed if you are using the `@vuex` directive.

```html
<script>window.__INITIAL_STATE__ = {!! Vuex::asJson() !!}</script>
```
