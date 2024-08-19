const { collection, getDoc, doc, updateDoc } = require("firebase/firestore");
const db = require("../db/connection");

const listRef = collection(db, "lists");
const usersRef = collection(db, "users");

exports.fetchListsByUsername = (username) => {
  return getDoc(doc(usersRef, username))
    .then((user) => {
      if (!user.data()) {
        return Promise.reject({ status: 404, message: "User not found." });
      }
      const list_ids = user.data().lists;
      lists_data = list_ids.map((id) => {
        return getDoc(doc(listRef, String(id)));
      });
      return Promise.all(lists_data);
    })
    .then((lists_data) => {
      listIdAndName = lists_data.map((list) => {
        return {
          list_id: list.id,
          list_name: list.data().list_name,
          isPrivate: list.data().isPrivate,
        };
      });

      return listIdAndName;
    });
};

exports.fetchListById = (list_id) => {
  const docRef = doc(listRef, list_id);
  return getDoc(docRef).then((list) => {
    if (!list.exists()) {
      return Promise.reject({ status: 404, message: "List not found" });
    }
    const listInfo = list.data();
    listInfo.list_id = list_id;
    listItems = listInfo.list.map((item) => {
      const copy = { ...item };
      copy.amount = Number(copy.amount);
      return copy;
    });
    delete listInfo[list];
    listInfo.items = listItems;

    return listInfo;
  });
};

exports.updateList = (list_id, list_name, isPrivate) => {
  const docRef = doc(listRef, list_id);
  if (list_name && isPrivate) {
    if (!(typeof list_name === "string") || !(typeof isPrivate === "boolean")) {
      return Promise.reject({ status: 400, message: "Incorrect data type" });
    }
    return updateDoc(docRef, { list_name, isPrivate }).then(() => {
      return { list_name, list_id, isPrivate };
    });
  }
  if (list_name) {
    if (!(typeof list_name === "string")) {
      return Promise.reject({
        status: 400,
        message: "Incorrect data type for list_name",
      });
    }
    return updateDoc(docRef, { list_name }).then(() => {
      return { list_name, list_id };
    });
  }
  if (isPrivate) {
    if (!(typeof isPrivate === "boolean")) {
      return Promise.reject({
        status: 400,
        message: "Incorrect data type for isPrivate",
      });
    }
    return updateDoc(docRef, { isPrivate }).then(() => {
      return { isPrivate, list_id };
    });
  }
  return Promise.reject({
    status: 400,
    message: "Incorrect format for request body",
  });
};
