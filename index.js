// node.js is built around this concept of modules,
const fs = require("fs");
const http = require("http");
const url = require("url");

///////////////////////////////
//FILES

// Blocking, synchronous way
// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(textIn);

// const textOut = `This is what we know about the avovado: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync("./txt/output.txt", textOut);
// console.log("File written!");

//Non-blocking, asynchronous way
// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   if (err) return console.log("ERROR! 💥");
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile(`./txt/append.txt`, "utf-8", (err, data3) => {
//       console.log(data3);

//       fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", (err) => {
//         console.log("Your file has been written 😍");
//       });
//     });
//   });
// });
// console.log("Will read file!");

///////////////////////////////
//SERVER

//Top Level Code, it is blocking, but only runs once at the start
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  console.log(req.url);

  const pathName = req.url;

  if (pathName === "/" || pathName === "/overview") {
    res.end("This is the OVERVIEW");
  } else if (pathName === "/product") {
    res.end("This is the PRODUCT");
  } else if (pathName === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    // console.log(productData);
    res.end(data);
  } else {
    // a http header is a piece of info about the response we are sending back
    // the header and the status code always need to be set before we send out the response
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello-world",
    });
    res.end("<h1>Page not found</h1>");
  }
  //each time a new request hits the server, it will call the function
  //simple way of sending back a simple response
  // res.end("Hello from the server!");
});

//standard ip address for a local host
//starts listening for incoming request, starting the server
server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to request on port 8000");
});
