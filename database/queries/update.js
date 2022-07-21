const updateTo = async (postgres, table, columns, value, condition) => {
  try {
    return await postgres(table).where(condition).update(value, columns);
  } catch (err) {
    throw err;
  }
};

module.exports = { updateTo };
