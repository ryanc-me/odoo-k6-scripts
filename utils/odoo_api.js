import http from 'k6/http';

export default class Odoo {
    static RPC_ENDPOINT = "/jsonrpc";
    static RPC_VERSION = "2.0";
    static RPC_ID = 1;

    constructor(config) {
        this.config = config;
        this.host = config.host;
        this.db = config.database;
        this.password = config.pass;

        if (typeof config.user === 'integer') {
            this.uid = config.user;
        } else {
            // note that the Odoo API requires a uid rather than the username
            // so, if we are give a username here, we need to perform a login
            // to get the corresponding uid
            this.uid = this.login(config.user);
        }
    };

    _jsonrpc(service, method, args, options = { http_method: 'POST', throw_errors: true, parse_json: true }) {
        options = { ...{ http_method: 'POST', throw_errors: true, parse_json: true }, ...options };
        const url = `${this.host}/${Odoo.RPC_ENDPOINT}`;
        const payload = JSON.stringify({
            jsonrpc: Odoo.RPC_VERSION,
            method: "call",
            params: {
                service: service,
                method: method,
                args: args,
            },
            id: Odoo.RPC_ID,
        });
        const params = {
            headers: {
                "Content-Type": "application/json",
            },
        };
        const resp = http.request(options.http_method, url, payload, params);
        const timings = resp.timings;

        if (!options.parse_json) {
            return resp;
        }
        
        let resp_json = resp.json();
        if (options.throw_errors) {
            if (resp_json.error) {
                if (resp_json.error.data && resp_json.error.data.debug) {
                    console.error(`Odoo API error debug info: \n\n${resp_json.error.data.debug}\n\n${JSON.stringify(resp_json, null, 2)}`);
                }
                else {
                    console.error(`Odoo API error: ${JSON.stringify(resp_json, null, 2)}`);
                }
            }
            if (!resp_json.result) {
                throw new Error(`Odoo API call failed: ${JSON.stringify(resp_json, null, 2)}`);
            }
        }
        resp_json.timings = timings;
        return resp_json;
    }

    login(username) {
        console.debug(`Username provided, performing a login to get 'uid'...`);
        const rpc_args = [
            this.db,
            username,
            this.password,
        ];
        const uid = this._jsonrpc("common", "login", rpc_args, { http_method: 'GET' }).result;
        console.debug(`Login successful, uid = ${uid}`);
        if (!uid) {
            throw new Error(`Login failed for user ${username}`);
        }
        return uid;
    }

    execute(model, method, args, options = {}) {
        const rpc_args = [
            this.db, this.uid, this.password,
            model,
            method,
            ...args,
        ]
        return this._jsonrpc("object", "execute", rpc_args, options);
    }
    execute_kw(model, method, args, kwargs, options = {}) {
        const rpc_args = [
            this.db, this.uid, this.password,
            model,
            method,
            args,
            kwargs,
        ]
        return this._jsonrpc("object", "execute_kw", rpc_args, options);
    }

    search(model, domain, options = { offset: 0, limit: null, order: null }) {
        options = { ...{ offset: 0, limit: null, order: null }, ...options };
        return this.execute_kw(model, 'search', [domain], options);
    }
    read(model, ids, fields, options = {}) {
        return this.execute_kw(model, 'read', [ids], { fields: fields, ...options });
    }
    search_read(model, domain, fields, options = { offset: 0, limit: null, order: null }) {
        options = { ...{ offset: 0, limit: null, order: null }, ...options };
        return this.execute_kw(model, 'search_read', [domain], { fields: fields, ...options });
    }
    search_count(model, domain, options = {}) {
        return this.execute_kw(model, 'search_count', [domain], options);
    }
    create(model, vals, options = {}) {
        return this.execute_kw(model, 'create', [vals], options);
    }
    write(model, ids, vals, options = {}) {
        return this.execute_kw(model, 'write', [ids, vals], options);
    }
    unlink(model, ids, options = {}) {
        return this.execute_kw(model, 'unlink', [ids], options);
    }

}
