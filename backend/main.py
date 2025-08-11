from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware # Import CORSMiddleware
from app.routes import sales, gate_pass, picking  # Import your routers

app = FastAPI()

# Configure CORS to allow your frontend to communicate with the backend
# Adjust origins based on where your frontend is hosted.
# For local development, this allows requests from http://localhost:3000 (common React dev server port)
origins = [
    "http://localhost:3000", # Example for React development server
    "http://127.0.0.1:3000",
    # Add any other origins where your frontend might be hosted in production
    # "https://your-frontend-domain.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Allows all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"], # Allows all headers
)

# Mount routers if available
if sales:
    app.include_router(sales.router)
if gate_pass:
    app.include_router(gate_pass.router)
if picking:
    app.include_router(picking.router)

# Basic root check
@app.get("/")
def read_root():
    return {"message": "Backend running"}