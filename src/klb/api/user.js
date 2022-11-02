import { rest } from "@karpeleslab/klbfw";
import { notificationErrors } from "./../../";

export const getUser = async () => {
  return new Promise((resolve, reject) => {
    rest("User:get", "GET")
      .catch((err) => {
        reject(err);
      })
      .then((tmp) => {
        if (tmp.result == "success" && tmp.data && tmp.data.User__) {
          resolve(tmp.data);
        }
        resolve(null);
      });
  });
};

export const addGroup = async (Name) => {
  return new Promise((resolve, reject) => {
    rest(`User/Group`, "POST", { Name })
      .catch((err) => {
        notificationErrors(err);
      })
      .then((result) => resolve(result));
  });
};

export const delGroup = async (groupUuid) => {
  return new Promise((resolve, reject) => {
    rest(`User/Group/${groupUuid}`, "DELETE", {})
      .catch((err) => {
        notificationErrors(err);
      })
      .then((result) => resolve(result));
  });
};
export const delUserFromGroup = async (groupUuid, user) => {
  return new Promise((resolve, reject) => {
    rest(`User/Group/${groupUuid}:delMember`, "POST", { user: user })
      .catch((err) => {
        notificationErrors(err);
      })
      .then((result) => resolve(result));
  });
};

export const addUserToGroup = async (groupUuid, user, access = "R") => {
  return new Promise((resolve, reject) => {
    rest(`User/Group/${groupUuid}:addMember`, "POST", { user, access })
      .catch((err) => {
        notificationErrors(err);
      })
      .then((result) => resolve(result));
  });
};

export const getGroups = async (groupUuid) => {
  return new Promise((resolve, reject) => {
    rest(`User/Group${groupUuid ? "/" + groupUuid : ""}`, "GET", {})
      .catch((err) => {
        notificationErrors(err);
      })
      .then((result) => resolve(result));
  });
};

export const decodeMetaLink = async (link) => {
  return new Promise((resolve, reject) => {
    rest(`MetaObject/Link:decode`, "POST", { id: link })
      .catch((err) => {
        notificationErrors(err);
      })
      .then((result) => resolve(result));
  });
};

export const joinMetaLink = async (link) => {
  return new Promise((resolve, reject) => {
    rest(`MetaObject:linkJoin`, "POST", { id: link })
      .catch((err) => {
        notificationErrors(err);
      })
      .then((result) => resolve(result));
  });
};

export const groupLinkAccess = async (
  groupUuid,
  access = "R",
  expires = "+24 hour",
  type = "permuser"
) => {
  return new Promise((resolve, reject) => {
    rest(`MetaObject/${groupUuid}:linkAccess`, "POST", {
      access,
      expires,
      type,
    })
      .catch((err) => {
        notificationErrors(err);
      })
      .then((result) => resolve(result));
  });
};

export const userLogout = async () => {
  return new Promise((resolve, reject) => {
    rest("User:logout", "Post")
      .catch((err) => {
        notificationErrors(err);
      })
      .then((tmp) => {
        if (tmp.result == "success") {
          resolve(tmp.data);
        }
        resolve(null);
      });
  });
};

export const updatePwd = async (pwd, newPwd) => {
  return new Promise((resolve, reject) => {
    rest(`User/@:setPassword`, "POST", { old_password: pwd, password: newPwd })
      .catch((err) => {
        notificationErrors(err);
      })
      .then((result) => resolve(result));
  });
};

export const updateEmail = async (pwd, email) => {
  return new Promise((resolve, reject) => {
    rest(`User/@:setEmail`, "POST", { email: email, current_password: pwd })
      .catch((err) => {
        notificationErrors(err);
      })
      .then((result) => resolve(result));
  });
};
