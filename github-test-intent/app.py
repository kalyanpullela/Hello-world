from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.responses import JSONResponse
from sqlalchemy import select, desc
from clone import clone_repo
from extract import extract_tests
from llm_handler import analyze_test
from db.database import init_db, SessionLocal
from db.models import save_test_result, TestResult
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev server origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RepoRequest(BaseModel):
    github_url: str

@app.on_event("startup")
async def startup_event():
    await init_db()

@app.post("/process-repo")
async def process_repo(request: RepoRequest):
    repo_path = clone_repo(request.github_url)
    test_files = extract_tests(repo_path)
    results = []

    for test_code in test_files:
        intent, impl = analyze_test(test_code)
        await save_test_result(request.github_url, test_code, intent, impl)
        results.append({
            "test": test_code,
            "intent": intent,
            "implementation": impl
        })

    return {"results": results}

@app.get("/results")
async def get_latest_results():
    async with SessionLocal() as session:
        result = await session.execute(
            select(TestResult.repo_url).order_by(desc(TestResult.id)).limit(1)
        )
        latest_repo_url = result.scalar()

        if not latest_repo_url:
            return JSONResponse(content={"results": []})

        result = await session.execute(
            select(TestResult).where(TestResult.repo_url == latest_repo_url)
        )
        records = result.scalars().all()

        return {
            "repo_url": latest_repo_url,
            "results": [
                {
                    "test_code": r.test_code,
                    "intent": r.intent,
                    "implementation": r.implementation
                } for r in records
            ]
        }
