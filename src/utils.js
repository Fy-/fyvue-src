export const formatBytes = (bytes, decimals = 2) => {
  if (!+bytes) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

export const cropText = (str, ml = 100) => {
  if (str && typeof str == "string") {
    if (str.length > ml) {
      return `${str.slice(0, ml)}...`;
    }
  }
  return str;
};

export const isPathActive = (paths, path) => {
  if (paths.includes(path)) return true;
  let foundPath = false;
  for (let _path of paths) {
    if (_path.includes("*") && path.includes(_path.replace("*", ""))) {
      foundPath = true;
      break;
    }
  }
  return foundPath;
};
