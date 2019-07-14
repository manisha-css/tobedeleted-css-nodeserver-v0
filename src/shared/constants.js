const CONSTANTS = {};

CONSTANTS.SECRETKEY_PATTERN = '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9\\s]).{8,16}$';
CONSTANTS.DEFAULT_PUBLIC_PROFILE = 'No public profile is set.';

module.exports = CONSTANTS;
