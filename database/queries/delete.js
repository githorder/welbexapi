const deleteData = async (postgres, table, whereCondition) => {
  try {
    return await postgres(table).where(whereCondition).del();
  } catch (err) {
    throw err;
  }
};

module.exports = { deleteData };
