import { read_list, read_form } from '../../utils/synthetic.js';

export function purchase_read_list(odoo, settings, trend) {
    read_list(odoo, 'purchase.order', 'Purchase/Orders/Purchase Orders', settings.purchase.read_list, trend);
    console.log("Completed purchase_read_list");
}
export function purchase_read_form(odoo, settings, trend) {
    read_form(odoo, 'purchase.order', 'Purchase/Orders/Purchase Orders', settings.purchase.read_form, trend);
    console.log("Completed purchase_read_form");
}
