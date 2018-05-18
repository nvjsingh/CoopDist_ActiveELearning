/**
 * User SO object
 * @param psUrl URL to the problem solver service of the SO
 * @param psPort Port number of the problem solver service
 * @param localdb URL to the local db of the SO
 * @param globaldb URL to the global db
 * @constructor
 */
function UserSo(uuid, psUrl, psPort, localdb, globaldb) {
    this.uuid = uuid;
    this.psUrl = psUrl;
    this.psPort = psPort;
    this.localdb = localdb;
    this.globaldb = globaldb;
    this.active = false;
}

UserSo.prototype.GetPS = function() {
    return psUrl;
};

UserSo.prototype.GetLocalDb = function() {
    return localdb;
};

UserSo.prototype.GetGlobalDb = function() {
    return globaldb;
};

UserSo.prototype.GetPsPort = function() {
    return psPort;
};

UserSo.prototype.SetPsPort = function(port) {
    psPort = port;
};

module.exports = UserSo;