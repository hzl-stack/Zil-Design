function getVarType(obj: any) {
  let type = typeof obj;
  if (type !== 'object') {
    // typeof
    return type;
  }
  // typeof object
  return Object.prototype.toString
    .call(obj)
    .replace(/^\[object (\S+)\]$/, '$1');
}

export default getVarType;
