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
    mutations: true,
    axios: null
}

const generateMutations = state => Object.keys(state).reduce((acc, key) => ({ ...acc, [`X_SET_${key.toUpperCase()}`]: new Function('state', 'val', `state.${key} = val`) }), {})

/**
 * Extend the base Vuex store class to pull window.__INITIAL_STATE__ by default
 */
export class Store extends Vuex.Store {
    constructor(vuexState = {}, SSRState = window.__INITIAL_STATE__) {
        // generate base
        if (SSRState.state) {
            SSRState.mutations = generateMutations(SSRState.state)
        }

        for (let [key, data] of Object.entries(SSRState.modules)) {
            if (data.state) {
                SSRState.modules[key].mutations = generateMutations(data.state)
            }
        }

        const newState = objectMerge(vuexState, SSRState)

        // with our data now formatted and merged, use Vuex's original constructor
        super(newState);

        // find axios
        const axios = options.axios || window.axios;

        if (axios && options.mutations) {
            // register automatic mutation interceptors
            axios.interceptors.response.use(response => {
                if (response.data && response.data.vuex) {
                    if (response.data.vuex.state) {
                        for (let [key, value] of Object.entries(response.data.vuex.state)) {
                            this.commit(`X_SET_${key.toUpperCase()}`, value)
                        }
                    }

                    if (response.data.vuex.modules) {
                        for (let [name, data] of Object.entries(response.data.vuex.modules)) {
                            if (data.state) {
                                for (let [key, value] of Object.entries(data.state)) {
                                    const mutation = newState.modules[name].namespaced ? `${name}/X_SET_${key.toUpperCase()}` : `X_SET_${key.toUpperCase()}`
                                    this.commit(mutation, value)
                                }
                            }
                        }
                    }
                }

                return response;
              }, error => {
                return Promise.reject(error);
              });
        }
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
