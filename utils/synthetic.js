
export function read_iterative(odoo, model, trend, options = { limit: 80, order: null, iterations: 50, domain: [], fields: [] }) {
    // read some fields from a model, a few records at a time, iterating a number of times
    // this is used as the basis for the read_list and read_form functions below

    for (let i = 0; i < options.iterations; i++) {
        const resp = odoo.search_read(
            model,
            options.domain,
            options.fields,
            { limit: options.limit, order: options.order }
        );

        trend.add(resp.timings.duration);
    }
}

export function read_list(odoo, model, menu_name, settings, trend) {
    // mimic a user paging through the Odoo list view (read a few fields for 80
    // records, then the next 80, etc)

    const options = {
        domain: settings.domain || [],
        fields: settings.fields || get_view_fields(odoo, model, menu_name, 'list', trend),
        iterations: settings.iterations || 50,
        limit: settings.limit || 80,
        order: settings.order || null,
    };

    return read_iterative(odoo, model, trend, options);
}

export function read_form(odoo, model, menu_name, settings, trend) {
    // mimic a user paging through the Odoo form view (read lots of fields for 1
    // record, then the next 1, etc)

    const options = {
        domain: settings.domain || [],
        fields: settings.fields || get_view_fields(odoo, model, menu_name, 'form'),
        iterations: settings.iterations || 50,
        limit: settings.limit || 1,
        order: settings.order || null,
    };

    return read_iterative(odoo, model, trend, options);
}

export function _get_menu_action(odoo, menu_name) {
    let domain = [];
    let parent_prefix = "";
    let menu_parts = menu_name.split('/').reverse();
    for (let part of menu_parts) {
        domain.push([`${parent_prefix}name`, '=', part]);
        parent_prefix += `parent_id.`;
    }
    const menu_resp = odoo.execute_kw(
        'ir.ui.menu',
        'search_read',
        [
            domain,
            ['action'],
        ]
    );
    if (menu_resp.result.length !== 1) {
        throw new Error(`Could not find unique menu with name ${menu_name}, found ${menu_resp.result.length}. ${JSON.stringify(menu_resp.result)}`);
    }
    return parseInt(menu_resp.result[0].action.split(',')[1]);
}
export function _get_action_views(odoo, action_id) {
    const views_resp = odoo.execute_kw(
        'ir.actions.act_window',
        'read',
        [[action_id], ['views']],
        {}
    );
    if (views_resp.result.length !== 1) {
        throw new Error(`Could not find unique action with ID ${action_id}, found ${views_resp.result.length}. ${JSON.stringify(views_resp.result)}`);
    }

    const views = views_resp.result[0].views;
    const view = views.filter(v => v[1] === 'form').map(v => v[0]);
    if (view.length !== 1) {
        console.warn(`Could not find unique form view for action ID ${action_id}, found ${view.length}. ${JSON.stringify(views)}`);
        return false;
    }
    return view[0];
}


export function get_view_fields(odoo, model, menu_name, view_type) {
    // get the fields used in a particular view (list or form) for a model
    const action_id = _get_menu_action(odoo, menu_name);
    const view_id = _get_action_views(odoo, action_id);

    const resp = odoo.execute_kw(
        model,
        'get_views',
        [],
        {
            views: [[view_id, view_type]],
        }
    );

    const fields = Object.keys(resp.result.models[model].fields);
    // console.log(model, view_type, fields);
    return fields;
}
