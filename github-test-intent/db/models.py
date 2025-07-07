from sqlalchemy import Column, Integer, String, Text
from db.database import Base, SessionLocal

class TestResult(Base):
    __tablename__ = "test_results"

    id = Column(Integer, primary_key=True, index=True)
    repo_url = Column(String, index=True)
    test_code = Column(Text)
    intent = Column(Text)
    implementation = Column(Text)

async def save_test_result(repo_url, test_code, intent, implementation):
    async with SessionLocal() as session:
        obj = TestResult(
            repo_url=repo_url,
            test_code=test_code,
            intent=intent,
            implementation=implementation
        )
        session.add(obj)
        await session.commit()
