import { read_list, read_form } from '../../utils/synthetic.js';

// basic list/form read tests
export function account_inv_read_list(odoo, settings, trend) {
    read_list(odoo, 'account.move', "Accounting/Customers/Invoices", settings.account.inv_read_list, trend);
    console.log("Completed account_inv_read_list");
}
export function account_inv_read_form(odoo, settings, trend) {
    read_form(odoo, 'account.move', "Accounting/Customers/Invoices", settings.account.inv_read_form, trend);
    console.log("Completed account_inv_read_form");
}
export function account_bill_read_list(odoo, settings, trend) {
    read_list(odoo, 'account.move', "Accounting/Vendors/Bills", settings.account.bill_read_list, trend);
    console.log("Completed account_bill_read_list");
}
export function account_bill_read_form(odoo, settings, trend) {
    read_form(odoo, 'account.move', "Accounting/Vendors/Bills", settings.account.bill_read_form, trend);
    console.log("Completed account_bill_read_form");
}

// helpers for accounting reports
export function _get_report_id(odoo, report_name) {
    const report_id = odoo.execute_kw('account.report', 'search', [[['name', '=', report_name]]], { limit: 1 }).result[0];
    if (!report_id) {
        throw new Error(`Could not find report with name ${report_name}`);
    }
    return report_id;
}
export function _get_report_options(odoo, report_id, data) {
    // fetch the default options for the report
    return odoo.execute_kw('account.report', 'get_options', [report_id, data], {}).result;
}
export function _get_report_information(odoo, report_id, options, trend) {
    // run account.report.get_report_informations_readonly
    const response = odoo.execute_kw('account.report', 'get_report_information_readonly', [report_id, options], {});
    trend.add(response.timings.duration);
    return response.result;
}
export function run_account_report(odoo, report_name, data, trend) {
    const report_id = _get_report_id(odoo, report_name);
    const options = _get_report_options(odoo, report_id, data);

    return _get_report_information(odoo, report_id, options, trend);
}

// actual report tests
export function account_report_pnl(odoo, iterations, data, trend) {
    const report_name = 'Profit and Loss';

    for (let i = 0; i < iterations; i++) {
        run_account_report(odoo, report_name, data, trend);
    }
    print("Completed account_report_pnl");
}
export function account_report_bs(odoo, iterations, data, trend) {
    const report_name = 'Balance Sheet';

    for (let i = 0; i < iterations; i++) {
        run_account_report(odoo, report_name, data, trend);
    }
    print("Completed account_report_bs");
}
export function account_report_tb(odoo, iterations, data, trend) {
    const report_name = 'Trial Balance';

    for (let i = 0; i < iterations; i++) {
        run_account_report(odoo, report_name, data, trend);
    }
    print("Completed account_report_tb");
}
export function account_report_ap(odoo, iterations, data, trend) {
    const report_name = 'Aged Payable';

    for (let i = 0; i < iterations; i++) {
        run_account_report(odoo, report_name, data, trend);
    }
    print("Completed account_report_ap");
}
export function account_report_ar(odoo, iterations, data, trend) {
    const report_name = 'Aged Receivable';

    for (let i = 0; i < iterations; i++) {
        run_account_report(odoo, report_name, data, trend);
    }
    print("Completed account_report_ar");
}