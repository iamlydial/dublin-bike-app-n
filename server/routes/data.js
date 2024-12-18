const express = require("express");
const fetchData = require("../utils/fetchData");
const { router, generateSchema } = require("./schema");

router.get("/get-data", async (req, res) => {
  try {
    // Fetch the actual data
    const data = await fetchData();

    // Generate the schema
    const schema = await generateSchema();
    console.log("Generated Schema:", schema);

    const fieldMapping = schema.reduce((map, field) => {
      map[field.display] = field.name;
      return map;
    }, {});

    const transformedData = data.map((item) => {
      const transformedItem = {};

      for (const field in item) {
        if (fieldMapping[field]) {
          transformedItem[fieldMapping[field]] = item[field];
        } else {
          transformedItem[field] = item[field];
        }
      }
      return transformedItem;
    });

    res.json(transformedData);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

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
      map[field.display] = field.name;
      return map;
    }, {});

    filteredData = data.map((item) => {
      const transformedItem = {};

      for (const field in item) {
        if (fieldMapping[field]) {
          transformedItem[fieldMapping[field]] = item[field];
        } else {
          transformedItem[field] = item[field];
        }
      }
      return transformedItem;
    });

    console.log(fieldMapping, "fieldMapping from post / ");

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
    const { id } = req.params;
    const { where } = req.body;

    const data = await fetchData();
    console.log("Fetched data:", data);

    let filteredData = data;

    const schema = await generateSchema();
    console.log("Generated Schema:", schema);

    const fieldMapping = schema.reduce((map, field) => {
      map[field.display] = field.name;
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
    
    filteredData = data.map((item) => {
      const transformedItem = {};

      for (const field in item) {
        if (fieldMapping[field]) {
          transformedItem[fieldMapping[field]] = item[field];
        } else {
          transformedItem[field] = item[field];
        }
      }
      return transformedItem;
    });

    res.json(filteredData);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

async function deleteBikeStationById(id, schema) {
  const bikeStations = await fetchData();
  const fieldMapping = schema.reduce((map, field) => {
    map[field.name] = field.display;
    return map;
  }, {});

  const idField = fieldMapping["id"] || "id";

  const index = bikeStations.findIndex((station) => station[idField] == id);

  if (index !== -1) {
    bikeStations.splice(index, 1);
    return true;
  }

  return false;
}

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const schema = await generateSchema();
    console.log("Generated Schema:", schema);

    const result = await deleteBikeStationById(id, schema);

    if (result) {
      res.status(200).json({ message: `Station ${id} deleted successfully.` });
    } else {
      res.status(404).json({ error: `Station with id ${id} not found.` });
    }
  } catch (error) {
    console.error("Error deleting station:", error);
    res.status(500).json({ error: "Failed to delete station." });
  }
});

async function updateBikeStationById(id, updatedData, schema) {
  const bikeStations = await fetchData();

  const fieldMapping = schema.reduce((map, field) => {
    map[field.name] = field.display;
    return map;
  }, {});

  const idField = fieldMapping["id"] || "id";

  const index = bikeStations.findIndex((station) => station[idField] == id);

  if (index === -1) {
    return { error: `Station with id ${id} not found.` };
  }

  const bikeStation = bikeStations[index];

  for (let key in updatedData) {
    const fieldName = fieldMapping[key] || key;
    if (bikeStation[fieldName] !== undefined) {
      bikeStation[fieldName] = updatedData[key];
    }
  }

  console.log("Updated bikeStations:", bikeStations);

  return {
    message: `Station ${id} updated successfully.`,
    updatedData: bikeStation,
  };
}

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const schema = await generateSchema();
    console.log("Schema generated:", schema);
    if (!schema || !Array.isArray(schema)) {
      throw new Error("Schema is invalid or not an array");
    }

    const result = await updateBikeStationById(id, updatedData, schema);

    if (result.error) {
      return res.status(404).json({ error: result.error });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Error updating station:", error);
    res.status(500).json({ error: "Failed to update station." });
  }
});

module.exports = router;
