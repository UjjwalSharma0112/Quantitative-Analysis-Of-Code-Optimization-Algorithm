from utils import convert_to_tuples, preprocess
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from compiler.parser import c_to_tac
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
   
    return  {
        "original_tac" : tac,
        "optimised_tac" : result
    }

@app.post("/optimise/ccode")
async def optimised_c_code(request: Request):

    data = await request.json()
    tac = c_to_tac(data["tac"])

    result = preprocess(tac)
   
    return  {
        "original_tac" : tac,
        "optimised_tac" : result
    }


