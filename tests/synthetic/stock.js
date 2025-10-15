import { read_list, read_form } from '../../utils/synthetic.js';

export function stock_read_list(odoo, settings, trend) {
    // fetching fields from the Dropships menu because it's the only one linked to
    // an ir.actions.act_window (the other sibling menus are ir.action.server)
    read_list(odoo, 'stock.picking', 'Inventory/Operations/Transfers/Dropships', settings.stock.read_list, trend);
    console.log("Completed stock_read_list");
}
export function stock_read_form(odoo, settings, trend) {
    read_form(odoo, 'stock.picking', 'Inventory/Operations/Transfers/Dropships', settings.stock.read_form, trend);
    console.log("Completed stock_read_form");
}
