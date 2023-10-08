const express = require('express');
var fs = require("fs");
const app = express();

app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

function readData() {
    const rawData = fs.readFileSync("data.json");
    return JSON.parse(rawData);
}

function writeData(data){
    fs.writeFileSync("data.json", JSON.stringify(data));
}

app.get("/", function (req, res) {
//    const data =  readData();

//    res.send(data);
res.render("index", { name: "호윤길" });
});

app.get("/todoList", function (req, res) {  
    const data =  readData();

    console.log(data);


    res.render("list", { items: data });
    });

app.get("/write", function (req, res){
    const data =  readData();

    const newItemId = Date.now();

    const newItem = "집에 가기.....";

    const newItemObject = { id: newItemId, title: newItem};

    data.push(newItemObject);

    writeData(data);
    
    res.render("write");
});

app.get("/delete", function (req, res){
    console.log(req.body);
    
    const itemId = req.body.id;

    const data =  readData();

    const targetData = data.findIndex((item) => item.id == Number(itemId));

    if(targetData !== -1) {
        data.splice(targetData, 1);
        writeData(data);
        res.redirect("/todoList");
    } else{
        res.status(404).send("Item not found!");
    }   
});

app.post("/edit", function (req, res) {
    const itemId = req.body.id;
    const editedItem = req.body.editedItem;

    const data = readData();

    // 데이터를 수정합니다.
    const itemToUpdate = data.find((item) => item.id == Number(itemId));
    if (itemToUpdate) {
        itemToUpdate.title = editedItem;
        writeData(data);
        res.redirect("/todoList");
    } else {
        res.status(404).send("Item not found!");
    }
});

app.post("/write",function(req, res){
    console.log(req.body);
    console.log(req.body.title);

    const data =  readData();

    const newItemId = Date.now();

    const newItem = "집에 가기.....";

    const newItemObject = { id: newItemId, title: req.body.title};

    data.push(newItemObject);

    writeData(data);


    res.redirect("/todoList");
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});



