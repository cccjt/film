/**
 * uni cloud db service demo
 */
const db = uniCloud.database();
const collection = db.collection("unicloud-test");
class UniDBService {
  async add(event) {
    const result = await collection.add(event);
    return result;
  }

  async get(event) {
    const result = await collection.limit(10).get();
    return result;
  }

  async remove(event) {
    const docList = await collection.limit(1).get();
    if (!docList.data || docList.data.length === 0) {
      return {
        status: -1,
        msg: "集合unicloud-test内没有数据",
      };
    }
    const res = await collection.doc(docList.data[0]._id).remove();
    if (res.deleted === 1) {
      return {
        status: 0,
        msg: "成功删除unicloud-test内第一条数据",
      };
    } else {
      return {
        status: -2,
        msg: "删除数据失败",
      };
    }
  }

  async update(event) {
    const docList = await collection.limit(1).get();
    if (!docList.data || docList.data.length === 0) {
      return {
        status: -1,
        msg: "集合unicloud-test内没有数据",
      };
    }
    const res = await collection.doc(docList.data[0]._id).update(event);
    if (res.updated === 1) {
      let result = Object.assign(
        {},
        {
          _id: docList.data[0]._id,
        },
        event
      );
      return {
        status: 0,
        msg: `集合第一条数据由${JSON.stringify(
          docList.data[0]
        )}修改为${JSON.stringify(result)}`,
      };
    } else {
      return {
        status: -1,
        msg: `集合unicloud-test内没有数据`,
      };
    }
  }
}

module.exports = new UniDBService();
