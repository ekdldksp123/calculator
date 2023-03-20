import http from "http";
import fs from "fs";

const PORT = 3000;

fs.readFile("./index.html", (error, html) => {
  if (error) throw error;
  http
    .createServer((req, res) => {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(html);
      res.end();
    })
    .listen(PORT);
});
