import { read_list, read_form } from '../../utils/synthetic.js';

export function partner_read_list(odoo, settings, trend) {
    read_list(odoo, 'res.partner', 'Contacts/Contacts', settings.partner.read_list, trend);
    console.log("Completed partner_read_list");
}
export function partner_read_form(odoo, settings, trend) {
    read_form(odoo, 'res.partner', 'Contacts/Contacts', settings.partner.read_form, trend);
    console.log("Completed partner_read_form");
}
