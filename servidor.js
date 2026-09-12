const http = require("http");
const servidor = http.createServer((req, res) => {
    if (req.url === "/") {
    res.writeHead(200, {"Content-type": "text/plain" });
    res.end("¡Hola mundo, desde mi primer servidor con Node.js!");
    } else if (req.url === "/nosotros") {
        res.writeHead(200, {"content-type": "text/html"});
        res.end("<h1>Sobre nosotros</h1>")
    }  else {
        res.writeHead(404, {"Content-Type": "text/html"});
        res.end("<h1>Pagina no encontrada</h1>");
    }
});

servidor.listen(3000, () => {
    console.log ("Servidor corriendo en http://localhost:3000");
});


const servidor2 = http.createServer((req, res) => {
    res.writeHead(200, {"Content-Type": "text/html" });
    res.end(
        "<h1>Mi proyecto desde el servidor</h1>" +
        "<p>Esta pagina la genero Node</p>"
    );
});

servidor2.listen(3001, () => {
    console.log("Servidor 2 corriendo en http://localhost:3001");

});
