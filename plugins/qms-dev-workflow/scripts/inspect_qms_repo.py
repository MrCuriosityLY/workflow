#!/usr/bin/env python3
"""Inspect a qms-lab-control repository and print a compact JSON summary."""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path


MODULES = ["qms-lab-client", "qms-lab-core", "qms-lab-entity", "qms-lab-manage"]


def count_files(root: Path, pattern: str) -> int:
    return sum(1 for _ in root.rglob(pattern))


def next_sql_version(sql_dir: Path) -> str | None:
    versions: list[int] = []
    for path in sql_dir.glob("V1.0.*_*.sql"):
        match = re.match(r"V1\.0\.(\d+)_", path.name)
        if match:
            versions.append(int(match.group(1)))
    if not versions:
        return None
    return f"V1.0.{max(versions) + 1}"


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--repo", default=".", help="Path to qms-lab-control repository")
    args = parser.parse_args()

    repo = Path(args.repo).resolve()
    sql_dir = repo / "qms-lab-manage" / "src" / "main" / "resources" / "sql"

    summary = {
        "repo": str(repo),
        "rootPom": (repo / "pom.xml").exists(),
        "modules": {
            module: {
                "exists": (repo / module).exists(),
                "pom": (repo / module / "pom.xml").exists(),
                "javaFiles": count_files(repo / module, "*.java") if (repo / module).exists() else 0,
            }
            for module in MODULES
        },
        "sql": {
            "exists": sql_dir.exists(),
            "fullSql": (sql_dir / "full.sql").exists(),
            "builder": (sql_dir / "_build_init.py").exists(),
            "nextVersion": next_sql_version(sql_dir) if sql_dir.exists() else None,
        },
        "memory": {
            "exists": (repo / ".dev-flow" / "memory").exists(),
            "files": sorted(p.name for p in (repo / ".dev-flow" / "memory").glob("*.md"))
            if (repo / ".dev-flow" / "memory").exists()
            else [],
        },
        "openspec": {
            "exists": (repo / ".openspec").exists(),
            "changes": str(repo / ".openspec" / "changes"),
            "specs": str(repo / ".openspec" / "specs"),
        },
    }

    print(json.dumps(summary, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
