
from utils import convert_to_tuples, preprocess
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def hello():
    return {"message" : "Works Fine"}


@app.post("/optimise")
async def optimise(request: Request):

    data = await request.json()
    tac = convert_to_tuples(data["tac"])
    result = preprocess(tac)
    print( result)
    return  {
        "original_tac" : tac,
        "optimised_tac" : result
    }
