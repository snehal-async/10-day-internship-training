"""
main.py - CLI driver for CSV employee data quality auditing and reporting.
"""
import sys
import os
from analyzer import CSVAnalyzer, AnalysisError


def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    default_csv = os.path.join(base_dir, "data", "sample_employees.csv")
    reports_dir = os.path.join(base_dir, "reports")

    # Allow custom path via command line argument
    csv_file = sys.argv[1] if len(sys.argv) > 1 else default_csv

    print(f"Loading and analyzing: {csv_file}")
    try:
        analyzer = CSVAnalyzer(csv_file)
        summary = analyzer.run_analysis()
        report_text = analyzer.format_terminal_report(summary)
        print(report_text)

        # Persist report
        json_out, txt_out = analyzer.save_report(summary, reports_dir)
        print(f"\n[REPORT SAVED] JSON   : {os.path.relpath(json_out, base_dir)}")
        print(f"[REPORT SAVED] Summary: {os.path.relpath(txt_out, base_dir)}")
    except AnalysisError as err:
        print(f"\n[ANALYSIS ERROR] {err}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()