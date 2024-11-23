const express = require("express");
const fetchData = require("../utils/fetchData");
const generateSchema = require("./schema.js");
const router = express.Router();

function applyFilter(item, field, operator, value) {
  switch (operator) {
    case "eq":
      return item[field] === value;
    case "lt":
      return item[field] < value;
    case "gt":
      return item[field] > value;
    case "id":
      return item[field] === id;
    default:
      return false;
  }
}

router.post("/", async (req, res) => {
  try {
    const { where, orderBy, page, pageSize } = req.body;

    const validPage = isNaN(page) || page < 1 ? 1 : page;
    const validPageSize = isNaN(pageSize) || pageSize < 1 ? 10 : pageSize;

    const data = await fetchData();
    console.log("Fetched data:", data);

    if (!where || Object.keys(where).length === 0) {
      return res.json(data);
    }

    let filteredData = data;

    const schema = await generateSchema();
    console.log("Generated Schema:", schema);

    const fieldMapping = schema.reduce((map, field) => {
      map[field.name] = field.display;
      return map;
    }, {});

    for (const field in where) {
      const condition = where[field];
      const [operator, value] = Object.entries(condition)[0];

      const dataFieldName = fieldMapping[field] || field;

      filteredData = filteredData.filter((item) => {
        return applyFilter(item, dataFieldName, operator, value);
      });
    }

    // add order by
    if (orderBy && orderBy.field && orderBy.direction) {
      const sortField = fieldMapping[orderBy.field] || orderBy.field;

      filteredData.sort((a, b) => {
        if (orderBy.direction === "asc") {
          return a[sortField] > b[sortField] ? 1 : -1;
        } else if (orderBy.direction === "desc") {
          return a[sortField] < b[sortField] ? 1 : -1;
        }
        return 0;
      });
    }

    // manage pagination
    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / validPageSize);

    const startIndex = (validPage - 1) * validPageSize;
    const endIndex = startIndex + validPageSize;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    if (validPage > totalPages) {
      return res.json({
        data: [],
        page: validPage,
        pageSize: validPageSize,
        totalItems,
        totalPages,
      });
    }

    res.json({
      data: paginatedData,
      page: validPage,
      pageSize: validPageSize,
      totalItems,
      totalPages,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

router.post("/:id", async (req, res) => {
  try {
    const { where } = req.body;
    const { id } = req.params;

    const data = await fetchData();
    console.log("Fetched data:", data);

    let filteredData = data;

    const schema = await generateSchema();
    console.log("Generated Schema:", schema);

    const fieldMapping = schema.reduce((map, field) => {
      map[field.name] = field.display;
      return map;
    }, {});

    filteredData = filteredData.filter((item) => item.id === parseInt(id, 10));

    if (where && Object.keys(where).length > 0) {
      for (const field in where) {
        const condition = where[field];
        const [operator, value] = Object.entries(condition)[0];

        const dataFieldName = fieldMapping[field] || field;

        filteredData = filteredData.filter((item) =>
          applyFilter(item, dataFieldName, operator, value)
        );
      }
    }

    res.json(filteredData);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

module.exports = router;
