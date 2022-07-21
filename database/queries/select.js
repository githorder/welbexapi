const selectData = async (postgres, table, columns) => {
  try {
    const result = await postgres.from(table).select(...columns);
    return result;
  } catch (err) {
    throw err;
  }
};

const selectDataByOrder = async (postgres, table, columns, data, order) => {
  try {
    const result = await postgres
      .from(table)
      .select(...columns)
      .orderBy(data, order);
    return result;
  } catch (err) {
    throw err;
  }
};

const selectDataWhere = async (postgres, table, columns, condition) => {
  try {
    const result = await postgres
      .from(table)
      .select(...columns)
      .where(condition);
    return result;
  } catch (err) {
    throw err;
  }
};

const joinTables = async (
  postgres,
  table1,
  table2,
  onCondition,
  whereCondition
) => {
  try {
    return await postgres(table1)
      .join(table2, onCondition)
      .where(whereCondition ? whereCondition : {});
  } catch (err) {
    throw err;
  }
};

module.exports = { joinTables, selectData, selectDataWhere, selectDataByOrder };
