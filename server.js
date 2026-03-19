const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let users = [];
let games = [
  { id:1, home:"Flamengo", away:"Palmeiras", odd:2.1 },
  { id:2, home:"Barcelona", away:"Real Madrid", odd:1.9 }
];

app.get("/", (req,res)=>{
  res.send("Falconbets rodando 🦅");
});

app.get("/games",(req,res)=> res.json(games));

app.post("/register",(req,res)=>{
  users.push({ username:req.body.username, balance:100 });
  res.json({ ok:true });
});

app.post("/bet",(req,res)=>{
  const { username, amount, gameId } = req.body;

  let user = users.find(u=>u.username===username);
  let game = games.find(g=>g.id===gameId);

  if(!user || !game) return res.sendStatus(400);
  if(user.balance < amount) return res.send("Saldo insuficiente");

  user.balance -= amount;
  res.json({ ok:true, balance:user.balance });
});

app.listen(3000,()=>console.log("rodando"));
