#!/usr/bin/env python3
"""Lightweight guard for QMS SQL/full.sql synchronization."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--repo", default=".", help="Path to qms-lab-control repository")
    args = parser.parse_args()

    repo = Path(args.repo).resolve()
    sql_dir = repo / "qms-lab-manage" / "src" / "main" / "resources" / "sql"
    full_sql = sql_dir / "full.sql"
    builder = sql_dir / "_build_init.py"

    errors: list[str] = []
    warnings: list[str] = []

    if not sql_dir.exists():
        errors.append(f"SQL directory not found: {sql_dir}")
    if not full_sql.exists():
        errors.append(f"full.sql not found: {full_sql}")
    if not builder.exists():
        warnings.append(f"_build_init.py not found: {builder}")

    if sql_dir.exists() and full_sql.exists():
        newer = [
            path.name
            for path in sql_dir.glob("V1.0.*_*.sql")
            if path.stat().st_mtime > full_sql.stat().st_mtime
        ]
        if newer:
            warnings.append(
                "Incremental SQL scripts are newer than full.sql: " + ", ".join(sorted(newer))
            )

    for message in errors:
        print(f"ERROR: {message}", file=sys.stderr)
    for message in warnings:
        print(f"WARNING: {message}", file=sys.stderr)

    if errors:
        return 1

    print("SQL/full.sql guard completed. Review warnings before delivery.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
