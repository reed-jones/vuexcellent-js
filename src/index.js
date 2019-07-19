import Vuex, * as vuexImports from 'vuex';
import { objectMerge } from './objectMerge';
export * from 'vuex'

/**
 * Default options. override using
 * Vue.use(Vuex, {
 *   namespacedModules: false
 * })
 */
let options = {
    // no options available
}


/**
 * Extend the base Vuex store class to pull window.__INITIAL_STATE__ by default
 */
export class Store extends Vuex.Store {
    constructor(vuexState = {}, SSRState = window.__INITIAL_STATE__) {
        let newState = objectMerge(vuexState, SSRState)

        // with our data now formatted and merged, use Vuex's original constructor
        super(newState);
    }
}

/**
 * Drop-in replacement for vuex that adds a handy static mergeState function.
 *
 * Merges initial vuex store (from .js files) with Laravel supplied data,
 * likely passed to window.__INITIAL_STATE__
 */
export default {
    // re-export all vuex api's
    ...vuexImports,

    // overwrite as needed
    Store,

    // install & auto install the plugin
    install(Vue, _options = {}) {
        // set available options
        options = {
            // defaults to all namespaced modules
            ...options,

            // overrides
            ..._options,
        };

        // install base Vuex package
        Vue.use(Vuex);
    }
};
