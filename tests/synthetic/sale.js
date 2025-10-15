import { read_list, read_form } from '../../utils/synthetic.js';

export function sale_read_list(odoo, settings, trend) {
    read_list(odoo, 'sale.order', 'Sales/Orders/Orders', settings.sale.read_list, trend);
    console.log("Completed sale_read_list");
}

export function sale_read_form(odoo, settings, trend) {
    read_form(odoo, 'sale.order', 'Sales/Orders/Orders', settings.sale.read_form, trend);
    console.log("Completed sale_read_form");
}

export function sale_create_confirm(odoo, trend, iterations) {
    // todo: create a sale order and confirm it
}

export function sale_create_complete(odoo, trend, iterations) {
    // todo: create a sale order, confirm it, create an invoice, validate the invoice, create delivery, validate delivery
}
