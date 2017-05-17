# Reads .csv, converts to JSON, connects to database, inserts into collection.
First argument should be the name of the .csv file (double quotes if there are spaces).
Second argument should be the name of the meteor method.

Example: node convert.js "Vendor Sales & Retention Sheet - Prospect Vendors.csv" Prospects.methods.create

NOTE: The .csv file must be in the current directory for the file name to work. Otherwise, a path may need to be provided.
