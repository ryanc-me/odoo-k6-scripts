#!/usr/bin/env python3

import json
import csv
import statistics
from collections import defaultdict

# load data
with open('output.json') as f:
    data = []
    for line in f:
        data.append(json.loads(line))

# extract the metrics we care about
metrics = defaultdict(list)
for record in data:
    if record.get('type') != 'Point':
        continue
    if not record.get('metric').startswith('odoo_'):
        continue
    name = record['metric']
    value = record['data']['value']
    metrics[name].append(value)

# build CSV (with stats)
csv_data = [
    ['metric', 'avg', 'min', 'max', 'med', 'p10', 'p90', 'p95', 'p99']
]
for metric, values in metrics.items():
    val_avg = sum(values) / len(values)
    val_min = min(values)
    val_max = max(values)
    val_med = statistics.median(values)
    val_p10 = statistics.quantiles(values, n=10)[0]  # 10th percentile
    val_p90 = statistics.quantiles(values, n=10)[8]  # 90th percentile
    val_p95 = statistics.quantiles(values, n=100)[94]  # 95th percentile
    val_p99 = statistics.quantiles(values, n=100)[98]  # 99th percentile
    csv_data.append([
        metric,
        f'{val_avg:.4f}',
        f'{val_min:.4f}',
        f'{val_max:.4f}',
        f'{val_med:.4f}',
        f'{val_p10:.4f}',
        f'{val_p90:.4f}',
        f'{val_p95:.4f}',
        f'{val_p99:.4f}',
    ])

# write out
with open('output.csv', 'w') as f:
    writer = csv.writer(f)
    writer.writerows(csv_data)
