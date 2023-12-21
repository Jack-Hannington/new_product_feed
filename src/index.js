import express from "express";
const app = express();


import { ExampleRouter } from "./routes/router_example.js";
app.use("/", ExampleRouter);

app.use((req, res, next) => {
  // try it out at http://localhost:3000/?query=hello+world and check the console
  const start = Date.now();
  res.on("finish", () => {
    const responseTime = Date.now() - start;
    const contentLength = res.get("Content-Length");
    console.log({
      method: req.method,
      url: req.originalUrl,
      query: req.query,
      responseTime: `${responseTime} ms`,
      contentLength: `${contentLength} bytes`,
      status: res.statusCode,
    });
  });
  // the next function is a callback that tells express to move on to the next middleware or route handler
  next();
});


app.get("/", (req, res) => {
  res.send("Choo Choo! Welcome to your Express app 🚅");
});

app.get("/json", (req, res) => {
  res.json({ "Choo Choo": "Welcome to your Express app 🚅" });
});

app.post("/post", (req, res) => {
  res.json({ "Choo Choo": "Welcome to your Express app 🚅", body: req.body });
});

app.get('/downloadproductfeed', async (req, res) => {
  try {
    const response = await fetch('https://www.applianceworldonline.com/media/feeds/feed_15.txt', {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

    const data = await response.text();
    const lines = data.split('\n');

    // Check specific product ID
    lines.forEach(line => {
      const fields = line.split('\t'); // Assuming tab-separated values
      if (fields[0] === '33242') { // Assuming the ID is in the first field
        console.log('Line with ID 33242:', line);
      }
    });

    res.setHeader('Content-Type', 'text/plain');
    res.send(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});


const port = process.env.PORT || 3000;

// the final step is to start your app using the following code:
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
