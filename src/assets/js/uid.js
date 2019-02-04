let uid = '';
/**
 * qq music uid
 * @returns {string} uid
 */
export function getUid() {
  if (!uid) {
    const t = (new Date()).getUTCMilliseconds();
    uid = '' + Math.round(2147483647 * Math.random()) * t % 1e10;
  }
  return uid;
}
