"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BalancesDepositEvent = void 0;
const assert_1 = __importDefault(require("assert"));
class BalancesDepositEvent {
    constructor(ctx, event) {
        event = event || ctx.event;
        (0, assert_1.default)(event.name === 'Balances.Deposit');
        this._chain = ctx._chain;
        this.event = event;
    }
    /**
     *  Some amount was deposited (e.g. for transaction fees). \[who, deposit\]
     */
    get isV49() {
        return this._chain.getEventHash('Balances.Deposit') === 'e4f02aa7cee015102b6cbc171f5d7e84370e60deba2166a27195187adde0407f';
    }
    /**
     *  Some amount was deposited (e.g. for transaction fees). \[who, deposit\]
     */
    get asV49() {
        (0, assert_1.default)(this.isV49);
        return this._chain.decodeEvent(this.event);
    }
    /**
     * Some amount was deposited (e.g. for transaction fees).
     */
    get isV1201() {
        return this._chain.getEventHash('Balances.Deposit') === '43e3321e3408ebd2b7d4c70d42ffa076463495043e47ddb0fb1fbe3e105f5b2f';
    }
    /**
     * Some amount was deposited (e.g. for transaction fees).
     */
    get asV1201() {
        (0, assert_1.default)(this.isV1201);
        return this._chain.decodeEvent(this.event);
    }
}
exports.BalancesDepositEvent = BalancesDepositEvent;
//# sourceMappingURL=events.js.map