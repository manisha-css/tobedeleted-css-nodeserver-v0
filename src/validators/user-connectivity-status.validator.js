/* eslint-disable prettier/prettier */
exports.UserConnectivityStatusInputValidator = async payload => {
  if (
    payload.socketId !== undefined &&
    payload.socketId !== null &&
    (payload.user_Id !== undefined && payload.user_Id > 0) &&
    (payload.status !== undefined && payload.status !== null)
  )
    return true;
  return false;
};
