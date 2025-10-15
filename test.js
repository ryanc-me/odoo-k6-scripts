import { Trend } from 'k6/metrics';
import Odoo from './utils/odoo_api.js';
import loadConfig from './utils/config.js';
import { sale_read_list, sale_read_form } from './tests/synthetic/sale.js';
import { purchase_read_list, purchase_read_form } from './tests/synthetic/purchase.js';
import { stock_read_list, stock_read_form } from './tests/synthetic/stock.js';
import { partner_read_list, partner_read_form } from './tests/synthetic/partner.js';
import { 
    account_inv_read_list,
    account_inv_read_form,
    account_bill_read_list,
    account_bill_read_form,
    account_report_pnl,
    account_report_bs,
    account_report_tb,
    account_report_ap,
    account_report_ar,
} from './tests/synthetic/account.js';

const trends = {
    sale: {
        read_list: new Trend('odoo_sale_read_list'),
        read_form: new Trend('odoo_sale_read_form'),
    },
    purchase: {
        read_list: new Trend('odoo_purchase_read_list'),
        read_form: new Trend('odoo_purchase_read_form'),
    },
    stock: {
        read_list: new Trend('odoo_stock_read_list'),
        read_form: new Trend('odoo_stock_read_form'),
    },
    partner: {
        read_list: new Trend('odoo_partner_read_list'),
        read_form: new Trend('odoo_partner_read_form'),
    },
    account: {
        inv_read_list: new Trend('odoo_account_inv_read_list'),
        inv_read_form: new Trend('odoo_account_inv_read_form'),
        bill_read_list: new Trend('odoo_account_bill_read_list'),
        bill_read_form: new Trend('odoo_account_bill_read_form'),

        report_pnl: new Trend('odoo_account_report_profit_and_loss'),
        report_bs: new Trend('odoo_account_report_balance_sheet'),
        report_tb: new Trend('odoo_account_report_trial_balance'),
        report_ap: new Trend('odoo_account_report_aged_payables'),
        report_ar: new Trend('odoo_account_report_aged_receivables'),
    }
}

const config = loadConfig(import.meta.resolve('./config.jsonc'));

export const options = {
    vus: 1,
    duration: '4h',
    iterations: 1,
};

export default function() {
    const odoo = new Odoo(config.odoo);

    sale_read_list(odoo, config.settings, trends.sale.read_list);
    sale_read_form(odoo, config.settings, trends.sale.read_form);

    purchase_read_list(odoo, config.settings, trends.purchase.read_list);
    purchase_read_form(odoo, config.settings, trends.purchase.read_form);

    stock_read_list(odoo, config.settings, trends.stock.read_list);
    stock_read_form(odoo, config.settings, trends.stock.read_form);

    partner_read_list(odoo, config.settings, trends.partner.read_list);
    partner_read_form(odoo, config.settings, trends.partner.read_form);

    account_inv_read_list(odoo, config.settings, trends.account.inv_read_list);
    account_inv_read_form(odoo, config.settings, trends.account.inv_read_form);
    account_bill_read_list(odoo, config.settings, trends.account.bill_read_list);
    account_bill_read_form(odoo, config.settings, trends.account.bill_read_form);

    // const account_report_options = {
	// 	"comparison": {
	// 		"date_from": "2024-04-01",
	// 		"date_to": "2025-03-31",
	// 		"filter": "no_comparison",
	// 		"number_period": 1,
	// 		"period_order": "descending",
	// 		"periods": []
	// 	},
	// 	"date": {
	// 		"date_from": "2024-04-01",
	// 		"date_to": "2025-03-31",
	// 		"filter": "previous_year",
	// 		"mode": "single",
	// 		"period": -1,
	// 		"period_type": "fiscalyear",
	// 		"string": "As of 31/03/2025"
	// 	}
	// }
    // account_report_pnl(odoo, 10, account_report_options, trends.account.report_pnl);
    // account_report_bs(odoo, 10, account_report_options, trends.account.report_bs);
    // account_report_tb(odoo, 10, account_report_options, trends.account.report_tb);
    // account_report_ap(odoo, 10, account_report_options, trends.account.report_ap);
    // account_report_ar(odoo, 10, account_report_options, trends.account.report_ar);
}
