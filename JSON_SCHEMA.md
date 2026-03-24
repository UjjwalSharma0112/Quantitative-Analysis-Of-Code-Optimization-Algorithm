post method
/optimise

{
tac : {instr}
}

response
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
