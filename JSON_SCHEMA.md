post method
/optimise
{
"tac": [
{ "result": "t1", "arg1": "5", "op": null, "arg2": null },
{ "result": "t2", "arg1": "t1", "op": "+", "arg2": "3" },
{ "result": "t3", "arg1": "t2", "op": "*", "arg2": "2" },
{ "result": "t4", "arg1": "t3", "op": "-", "arg2": "t1" },
{ "result": "t5", "arg1": "t4", "op": "+", "arg2": "10" }
]
}

/response
{
original_tac :{};
optimised : {
const_folded:{
tac : {instr},
score : int ,
execution_time: ,
},
const_prop : { original_tac :{};
optimised : {
const_folded:{
tac : {instr},
score : int ,
execution_time: ,
},},
dce : { original_tac :{};
optimised : {
const_folded:{
tac : {instr},
score : int ,
execution_time: ,
},},
cse : { original_tac :{};
optimised : {
const_folded:{
tac : {instr},
score : int ,
execution_time: ,
},}
pipelined:{ original_tac :{};
optimised : {
const_folded:{
tac : {instr},
score : int ,
execution_time: ,
},},
}

}
