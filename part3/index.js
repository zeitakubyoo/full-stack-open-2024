const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("dist"));

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const getMorgan = morgan("tiny");

app.get("/", getMorgan, (request, response) => {
  response.send("<h1>Phonebook Backend</h1>");
});

app.get("/api/persons", getMorgan, (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", getMorgan, (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  person = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

app.get("/info", getMorgan, (request, response) => {
  const date = new Date();
  const personCount = persons.length;
  response.send(`
    <p>Phonebook has info for ${personCount} people.</p>
    <p>${date}</p>
  `);
});

const generateRandomId = () => {
  const id = Math.floor(Math.random() * (10000 - 5 + 1)) + 5;
  return String(id);
};

const postMorgan = morgan(
  ":method :url :status :res[content-length] - :response-time ms :request-body"
);

morgan.token("request-body", (req, res) => {
  return JSON.stringify(req.body);
});

app.post("/api/persons", postMorgan, (request, response) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({
      Error: "Name cannot be empty!",
    });
  } else if (!body.number) {
    return response.status(400).json({
      Error: "Number cannot be empty!",
    });
  }

  const numberExist = persons.find((person) => person.number === body.number);

  if (numberExist) {
    return response.status(400).json({
      Error: "Number already exists in the phonebook!",
    });
  }

  const nameExist = persons.find((person) => person.name === body.name);

  if (nameExist) {
    return response.status(400).json({
      Error: "Name already exists in the phonebook!",
    });
  }

  const person = {
    id: generateRandomId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);

  response.json(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
