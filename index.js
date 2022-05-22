require("dotenv").config();
require("./mongo");

const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");
const express = require("express");
const app = express();
const cors = require("cors");
const Note = require("./models/Note");
const logger = require("./middlewre/loggerMiddleware");
const { response } = require("express");
const notFound = require("./middlewre/notFound");
const handelError = require("./middlewre/handelError");

app.use(cors());
app.use(express.json());

Sentry.init({
  dsn: "https://41642b75817741c2aa46716ca75dd561@o1258159.ingest.sentry.io/6431922",
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app }),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

app.use(logger);
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server runin on port ${PORT}`));

app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

app.get("/", (req, res, next) => {
  res.send("<h1/>Hello World</h1>").catch((error) => next(error));
});
app.get("/api/notes", (req, res, next) => {
  Note.find({})
    .then((notes) => {
      res.json(notes);
    })
    .catch((error) => next(error));
});

app.post("/api/notes", (req, res, next) => {
  const note = req.body;
  console.log(note.content);
  if (!note || !note.content) {
    return res.status(400).json({
      error: "note.body is missing",
    });
  }

  const newNote = new Note({
    content: note.content,
    important: typeof note.important !== "undefined" ? note.important : false,
    date: new Date().toISOString(),
  });

  newNote
    .save()
    .then((savedNote) => {
      res.json(savedNote);
    })
    .catch((error) => next(error));
});

app.get("/api/notes/:id", (req, res, next) => {
  const { id } = req.params;

  Note.findById(id)
    .then((note) => {
      if (note) {
        return res.json(note);
      } else {
        res.status(404).end();
      }
    })
    .catch((err) => {
      next(err);
    });
});

app.put("/api/notes/:id", (req, res, next) => {
  const { id } = req.params;
  const note = req.body;

  const newNoteInfo = {
    content: note.content,
    important: typeof note.important !== "undefined" ? note.important : false,
  };

  Note.findByIdAndUpdate(id, newNoteInfo, { new: true })
    .then((result) => {
      res.json(result);
    })
    .catch((error) => next(error));
});

app.delete("/api/notes/:id", (req, res, next) => {
  const { id } = req.params;

  Note.findByIdAndDelete(id)
    .then(() => {
      res.status(204).end();
    })
    .catch((error) => next(error));

  res.send({ message: "Note has been eliminated" });
  res.status(204).end();
});

app.get("/api/notes", (req, res, next) => {
  res.json(notes).catch((error) => next(error));
});

//middlewares sino encuentra nada tengo las respuestas

app.use(notFound);
app.use(Sentry.Handlers.errorHandler());
app.use(handelError);
