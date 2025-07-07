import os

def extract_tests(repo_path: str):
    tests = []
    for root, dirs, files in os.walk(repo_path):
        for file in files:
            if file.startswith("test_") and file.endswith(".py"):
                with open(os.path.join(root, file), encoding="utf-8", errors="ignore") as f:
                    tests.append(f.read())
    return tests
