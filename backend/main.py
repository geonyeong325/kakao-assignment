import os
from dotenv import load_dotenv
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel

load_dotenv(".env.local")

# --- DB 설정 ---
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./todos.db")
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# --- DB 모델 (테이블 구조 정의) ---
class Todo(Base):
    __tablename__ = "todos"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    completed = Column(Boolean, default=False)

# --- Pydantic 스키마 (데이터 검증 및 직렬화) ---
class TodoCreate(BaseModel):
    title: str
    completed: bool = False

class TodoResponse(TodoCreate):
    id: int

    class Config:
        from_attributes = True # ORM 모델을 Pydantic 모델로 변환 허용

# --- 테이블 생성 ---
Base.metadata.create_all(bind=engine)

# --- FastAPI 앱 생성 ---
app = FastAPI(title="Todo API")

# --- 미들웨어 (CORS 설정) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # 실제 운영시에는 특정 도메인만 허용하는 것이 좋습니다.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- DB 세션 의존성 주입 ---
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- API 엔드포인트 구현 ---

@app.get("/")
def root():
    return {"message": "Todo API is running"}

# 1. 전체 Todo 목록 조회
@app.get("/todos", response_model=list[TodoResponse])
def get_todos(db: Session = Depends(get_db)):
    return db.query(Todo).all()

# 2. 새 Todo 생성
@app.post("/todos", response_model=TodoResponse)
def create_todo(todo: TodoCreate, db: Session = Depends(get_db)):
    # Pydantic 모델을 딕셔너리로 변환 후 DB 모델에 언패킹
    new_todo = Todo(**todo.model_dump()) 
    db.add(new_todo)
    db.commit()
    db.refresh(new_todo)
    return new_todo

# 3. 단일 Todo 조회
@app.get("/todos/{id}", response_model=TodoResponse)
def get_todo(id: int, db: Session = Depends(get_db)):
    db_todo = db.query(Todo).filter(Todo.id == id).first()
    if not db_todo:
        raise HTTPException(status_code=404, detail="해당 Todo를 찾을 수 없습니다.")
    return db_todo

# 4. Todo 수정
@app.put("/todos/{id}", response_model=TodoResponse)
def update_todo(id: int, todo: TodoCreate, db: Session = Depends(get_db)):
    db_todo = db.query(Todo).filter(Todo.id == id).first()
    if not db_todo:
        raise HTTPException(status_code=404, detail="해당 Todo를 찾을 수 없습니다.")
    
    db_todo.title = todo.title
    db_todo.completed = todo.completed
    db.commit()
    db.refresh(db_todo)
    return db_todo

# 4. Todo 삭제
@app.delete("/todos/{id}")
def delete_todo(id: int, db: Session = Depends(get_db)):
    db_todo = db.query(Todo).filter(Todo.id == id).first()
    if not db_todo:
        raise HTTPException(status_code=404, detail="해당 Todo를 찾을 수 없습니다.")
    
    db.delete(db_todo)
    db.commit()
    return {"message": "Todo가 성공적으로 삭제되었습니다."}