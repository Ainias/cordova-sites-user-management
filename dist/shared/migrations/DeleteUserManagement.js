"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class DeleteUserManagement1000000000000 {
    _isServer() {
        return (typeof document !== "object");
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.dropTable("roleAccess", true);
            yield queryRunner.dropTable("roleChildren", true);
            yield queryRunner.dropTable("userRole", true);
            if (this._isServer()) {
                yield queryRunner.dropTable("user_access", true);
            }
            yield queryRunner.dropTable("access", true);
            yield queryRunner.dropTable("role", true);
            yield queryRunner.dropTable("user", true);
        });
    }
    down(queryRunner) {
        return undefined;
    }
}
exports.DeleteUserManagement1000000000000 = DeleteUserManagement1000000000000;
//# sourceMappingURL=DeleteUserManagement.js.map