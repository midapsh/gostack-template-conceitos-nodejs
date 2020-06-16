const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");
const { reset } = require("nodemon");

const app = express();

app.use(express.json());
app.use(cors());

function validateRepositoryId(request, response, next) {
  const { id, } = request.params;
  if (!isUuid(id)) {
    return response
      .status(400)
      .json({ error: "Invalid repository ID" });
  }
  return next();
}

app.use("/repositories/:id", validateRepositoryId);

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = {
    id: uuid(),
    title,
    url,
    techs: !techs
      ? []
      : techs.constructor === Array
        ? techs
        : [techs],
    likes: 0,
  };

  repositories.push(repository);
  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  if (repositoryIndex < 0) {
    return response
      .status(400)
      .json({ error: "Project not found" });
  }
  const repository = {
    ...repositories[repositoryIndex],
    title,
    url,
    techs: !techs
      ? []
      : techs.constructor === Array
        ? techs
        : [techs],
  };
  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  if (repositoryIndex < 0) {
    return response
      .status(400)
      .json({ error: "Project not found" });
  }
  repositories.splice(repositoryIndex, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  if (repositoryIndex < 0) {
    return response
      .status(400)
      .json({ error: "Project not found" });
  }
  repositories[repositoryIndex].likes += 1;
  const repository = repositories[repositoryIndex];

  return response.json(repository);
});

module.exports = app;
