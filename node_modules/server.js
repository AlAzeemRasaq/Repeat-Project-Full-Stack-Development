// Server-side global variables
require(`dotenv`).config({ path: `./config/.env` });

// Database
require(`./config/db`);

// Express
const express = require(`express`);
const app = express();

app.use(require(`body-parser`).json());

app.use(require(`cors`)({ credentials: true, origin: process.env.LOCAL_HOST }));

// Routers
app.use(require(`./routes/products`));
app.use(require(`./routes/users`));
app.use(require(`./routes/cart`));
app.use(require(`./routes/sales`));


//This code identifies the folder ../client/build as holding the client-side static code.
const path = require("path");
const appPath = path.join(__dirname, "..", "client", "build");
app.use(express.static(appPath));


//client-side start point is index.html inside the appPath folder (i.e. the folder ../client/build)
app.get("/", (req, res) => 
{
  res.sendFile(path.resolve(appPath, "index.html"));
});


// server listening Port
app.listen(process.env.SERVER_PORT, () => 
{
  //console.log(`Connected to port ` ${process.env.SERVER_PORT});
  console.log(`Connected to port ` + process.env.SERVER_PORT);
});

// Error 404
app.use((req, res, next) => 
{
  next(createError(404));
});

// Other errors
app.use(function (err, req, res, next)
 {
  console.error(err.message);
  if (!err.statusCode) {
    err.statusCode = 500;
  }
  res.status(err.statusCode).send(err.message);
});
