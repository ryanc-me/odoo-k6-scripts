# Grafana k6 Scripts for Odoo

A set of Odoo performance-testing scripts for [Grafana k6](https://grafana.com/docs/k6/latest/).

**Note**: This suite was built specifically to test single-user performance, and was
used to assess various hardware options for Odoo hosting. See the companion
[blog post](https://www.ryanc.me/) on my website for more details!

Some features:

 * Mock form/list reads for sales, purchases, pickings, invoices/bills, and partners
 * Mock printing various accounting reports (P&L, BS, TB, AP/AR)
 * Mock end-to-end flow for sales and purchases: create, validate, print PDF, deliver, invoice
 * Auto-detect the fields to read based on the actual views

### Setup

**Nix users**: run `nix-shell`

**Other users**: [Install Grafana k6](https://grafana.com/docs/k6/latest/set-up/install-k6/)

### Configuration

The `config.example.jsonc` is commented to assist with configuration.

Most options, especially in the `settings` area, are optional. The minimum config only provides the Odoo connection info.

**Note**: It's highly recommended to provide some fixed max-ids to the `domain` keys in the config. That will mean k6 tests against the same records every time, even if new records have been added to the DB, and should help a lot with inter-run stability.

### Running

Running the scripts is very simple:

```bash
k6 run test.js --out json=output.json
```

This will run the full (default) set of tests, and output a large JSON file with
all of the metrics.

### Parsing the Results

Run the `parse-output.py` script to conver the large un-organised JSON file into
a CSV summarising each metric with avg/min/max/p90/etc.

From there, you can import the CSV data into your preferred graphing tool to build
some charts.

### TODO:

 - Implement the advanced cases: create, validate, print, deliver, invoice, etc for sales/purchases
