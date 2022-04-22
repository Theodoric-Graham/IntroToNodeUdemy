// node.js is built around this concept of modules,
const fs = require("fs");
const http = require("http");
const url = require("url");
//a slug is the last part of the url that contains a unique string
const slugify = require("slugify");
const replaceTemplate = require("./modules/replaceTemplate");

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
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

// console.log(slugify("Fresh Avocados", { lower: true }));
dataObj.map((el) => (el["slug"] = slugify(el.productName, { lower: true })));

const server = http.createServer((req, res) => {
  // parsing the variables out of the url, needs to be true to parse the query into an object
  const pathname = req.url;

  console.log(pathname);

  // Overview Page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });
    //loop over dataObj, each iteration we replace the placeholder in the template card with the current product
    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    // console.log(cardsHtml);
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
    res.end(output);

    //Product Page
  } else if (pathname.includes("/product")) {
    res.writeHead(200, { "Content-type": "text/html" });
    const slug = pathname.replace("/product/", "");
    const product = dataObj.filter((element) => {
      return element.slug === slug;
    })[0];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);

    //API
  } else if (pathname === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    // console.log(productData);
    res.end(data);

    //Not found
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
