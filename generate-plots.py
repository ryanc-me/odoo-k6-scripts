#!/usr/bin/env python3

import json
import os
import re
import numpy as np
import seaborn as sns
import pandas as pd
import matplotlib.pyplot as plt
from collections import defaultdict


filename_re = re.compile(r'(.*)\.json')


metric_name_mapping = {
    'odoo_sale_read_list': 'Sale (List)',
    'odoo_sale_read_form': 'Sale (Form)',
    'odoo_purchase_read_list': 'Purchase (List)',
    'odoo_purchase_read_form': 'Purchase (Form)',
    'odoo_account_inv_read_list': 'Invoice (List)',
    'odoo_account_inv_read_form': 'Invoice (Form)',
    'odoo_account_bill_read_list': 'Bill (List)',
    'odoo_account_bill_read_form': 'Bill (Form)',
    'odoo_stock_read_list': 'Picking (List)',
    'odoo_stock_read_form': 'Picking (Form)',
    'odoo_partner_read_list': 'Contact (List)',
    'odoo_partner_read_form': 'Contact (Form)',
    
    'odoo_account_report_profit_and_loss': 'Profit & Loss',
    'odoo_account_report_balance_sheet': 'Balance Sheet',
    'odoo_account_report_trial_balance': 'Trial Balance',
    'odoo_account_report_aged_payables': 'Aged Payables',
    'odoo_account_report_aged_receivables': 'Aged Receivables',
}
plots_to_render = [
    {
        'title': 'Basic List/Form',
        'filename': 'basic_list_form',
        'metrics': [
            'odoo_sale_read_list',
            'odoo_sale_read_form',
            'odoo_stock_read_list',
            'odoo_stock_read_form',
            'odoo_purchase_read_list',
            'odoo_purchase_read_form',
        ],
        'tick_step': 100,
        'tick_max': 1800,
    },
    {
        'title': 'Basic List/Form #2',
        'filename': 'basic_list_form_2',
        'metrics': [
            'odoo_partner_read_list',
            'odoo_partner_read_form',
            'odoo_account_inv_read_list',
            'odoo_account_inv_read_form',
            'odoo_account_bill_read_list',
            'odoo_account_bill_read_form',
        ],
        'tick_step': 100,
        'tick_max': 1800,
    },
    {
        'title': 'Accounting\nReports',
        'filename': 'accounting_reports',
        'metrics': [
            'odoo_account_report_profit_and_loss',
            'odoo_account_report_balance_sheet',
            'odoo_account_report_trial_balance',
            'odoo_account_report_aged_payables',
            'odoo_account_report_aged_receivables',
        ]
    }
]

def load_metrics():
    output_files = filter(lambda x: x.endswith('.json'), os.listdir('./outputs'))
    data_by_metric = defaultdict(list)
    for file in output_files:
        data = []
        with open(os.path.join('./outputs', file)) as f:
            for line in f:
                data.append(json.loads(line))
        
        export_name = filename_re.match(file).group(1)
        for record in data:
            if record.get('type') != 'Point':
                continue
            if not record.get('metric').startswith('odoo_'):
                continue
            metric = record['metric']
            value = record['data']['value']
            data_by_metric[metric].append({
                'deployment': export_name,
                'metric': metric_name_mapping.get(metric, metric),
                'value': value
            })

    return data_by_metric

def get_metric_dataframes(data_by_metric):
    df_by_metric = {}
    for metric, entries in data_by_metric.items():
        df_by_metric[metric] = pd.DataFrame(entries)
    return df_by_metric

def render_plot(plot):
    title = plot['title']
    filename = plot['filename']
    metrics = plot['metrics']
    tick_step = plot.get('tick_step', False)
    tick_max = plot.get('tick_max', False)
    
    test = pd.concat([df_by_metric[metric] for metric in metrics], ignore_index=True)

    tick_count = 12
    if not tick_step:
        max_value = test['value'].quantile(0.99)
        tick_step = max(100, int(max_value / tick_count))
    if not tick_max:
        tick_max = test['value'].max() + tick_step
    
    os.makedirs('plots', exist_ok=True)
    g = sns.catplot(
        data=test,
        x='metric',
        y='value',
        hue='deployment',
        kind='bar',
        # errorbar="sd",
        # palette="dark",
        # alpha=.8,
        height=6,
        aspect=2,
        native_scale=True,
        legend_out=False,
    )
    # g.despine(left=True)
    g.set_axis_labels("", "Response Time (ms)")
    g.legend.set_title(title)
    for ax in g.axes.flat:
        ax.set_yticks(np.arange(0, tick_max + tick_step, tick_step))
        # ax.set(xticklabels=[])
        # ax.tick_params(axis='y', labelsize=6)
        
    g.savefig(f'plots/{filename}.svg', format='svg')


if __name__ == '__main__':
    data_by_metric = load_metrics()
    df_by_metric = get_metric_dataframes(data_by_metric)
    sns.set_style("darkgrid")

    for plot in plots_to_render:
        render_plot(plot)
