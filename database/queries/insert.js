const insertData = async (postgres, table, data, columns) => {
  try {
    const newData = await postgres(table).returning(columns).insert(data);
    return newData;
  } catch (err) {
    throw err;
  }
};

module.exports = { insertData };
