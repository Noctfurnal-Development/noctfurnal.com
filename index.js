const website = require("express");
const app = website();
const http = require("http").Server(app);
const path = require("path");

const Discord = require("discord.js");
const client = new Discord.Client();

const config = require("./config.json");
client.config = config;

client.on("ready", function () {
  console.log(`[READY] Bot user: ${client.user.tag}.`);

  client.user.setActivity("➟ noctfurnal.com", {
    type: "WATCHING"
  });
});

http.port = process.env.PORT || config.port || 3001;

app
    .engine("html", require("ejs").renderFile)
    .use(website.static(path.join(__dirname, "/public")))
    .use("/", website.static(__dirname + "/media"))
    .set("view engine", "ejs")
    .set("views", path.join(__dirname, "views"))
    .use("*", (req, res, next) => {
        req.client = client;
        next();
    })
    .use("/", require("./router"))
    .get("*", function(req, res) {
        res.redirect("/");
    });

http.listen(http.port, function(err) {
    if (err) {
        throw err;
    }
    console.log(`[READY] Website is online at the port: ${http.port}`);
});

process.on("unhandledRejection", (e) => {
    console.log(e);
});

client.login(config.token);
