import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db=new pg.Client({
  user:"postgres",
  host:"localhost",
  database:"permalist",
  password:"Roshini2005@",
  port:5432,
});

db.connect();

let items = [];

app.get("/", async (req, res) => {
  try{
    items=await db.query("SELECT * FROM items");
    res.render("index.ejs", {
    listTitle: "Today",
    listItems: items.rows,
  });
  }catch(err){
    console.log(err);
  }
  
});

app.post("/add", async(req, res) => {
  try{
    const item = req.body.newItem;
    await db.query("INSERT INTO items(title) VALUES($1);",[item]);
    res.redirect("/");
  }catch(err){
    console.log(err);
  }
});

app.post("/edit", async (req, res) => {
  try{
  const newitemtitle=req.body.updatedItemTitle;
  const newitemid=req.body.updatedItemId;
  await db.query("UPDATE items SET title=($1) WHERE id=($2);",[newitemtitle,newitemid]);
  res.redirect("/");
  }catch(err){
    console.log(err);
  }

});

app.post("/delete", async(req, res) => {
  try{
  const deletedId=req.body.deleteItemId;
  await db.query("DELETE FROM items WHERE id=($1);",[deletedId]);
  res.redirect("/");
  }catch(err){
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
