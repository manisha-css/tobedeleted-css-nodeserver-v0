/* eslint-disable prettier/prettier */
exports.UserConnectivityStatusInputValidator = async payload => {
  if (
    payload.socketId !== undefined &&
    payload.socketId !== null &&
    (payload.userId !== undefined && payload.userId > 0) &&
    (payload.status !== undefined && payload.status !== null)
  )
    return true;
  return false;
};
