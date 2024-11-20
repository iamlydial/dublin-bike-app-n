const express = require("express");
const router = express.Router();
const _ = require("lodash");
const fetchData = require("../utils/fetchData");
const dayjs = require("dayjs");

function defineType(values) {
  const uniqueValues = [...new Set(values)];

  if (
    uniqueValues.every(
      (v) =>
        v === null ||
        v === true ||
        v === false ||
        v === "true" ||
        v === "false" ||
        v === "banking" ||
        v === "bonus"
    )
  ) {
    return "BOOLEAN";
  }

  if (
    uniqueValues.every(
      (v) =>
        v === null ||
        Number.isInteger(v) ||
        (typeof v === "string" && !isNaN(v) && Number.isInteger(parseFloat(v)))
    )
  ) {
    return "INTEGER";
  }

  if (
    uniqueValues.every((v) => {
      if (v === null) return true;
      const floatPattern = /^[+-]?(\d+\.\d*|\.\d+)$/;
      return floatPattern.test(v);
    })
  ) {
    return "FLOAT";
  }

  if (
    uniqueValues.length <= 10 &&
    uniqueValues.every((val) => typeof val === "string")
  ) {
    return "OPTION";
  }

  console.log("Unique Values:", uniqueValues);
  if (
    uniqueValues.every(
      (v) =>
        (v === null) ||
        /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]{3})?$/.test(v) || // ISO 8601 format with optional milliseconds
        /^[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]{3})?$/.test(v) || // YYYY-MM-DD HH:mm:ss with optional milliseconds
        dayjs(v, "YYYY-MM-DD").isValid() ||
        dayjs(v, "YYYY-MM-DD HH:mm:ss").isValid()
    )
  ) {
    return "DATETIME";
  }
  

  return "STRING";
}

async function generateSchema() {
  try {
    const data = await fetchData();
    console.log("Fetched data:", data);

    if (!data || data.length === 0) {
      throw new Error("No data fetched");
    }

    const fields = Object.keys(data[0]);
    const schema = fields.map((field) => {
      const values = data.map((item) => item[field]);
      const type = defineType(values);

      return {
        display: field,
        name: _.camelCase(field),
        type: type,
        options: type === "OPTION" ? [...new Set(values)] : [],
      };
    });

    return schema;
  } catch (error) {
    console.error("Error generating schema:", error);
    throw error;
  }
}

router.get("/", async (req, res) => {
  try {
    const schema = await generateSchema();
    res.json(schema);
  } catch (error) {
    res.status(500).json({ error: "Error generating schema" });
  }
});

module.exports = router;
