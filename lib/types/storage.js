"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EthereumCurrentBlockStorage = void 0;
const assert_1 = __importDefault(require("assert"));
class EthereumCurrentBlockStorage {
    constructor(ctx, block) {
        block = block || ctx.block;
        this.blockHash = block.hash;
        this._chain = ctx._chain;
    }
    /**
     *  The current Ethereum block.
     */
    get isV49() {
        return this._chain.getStorageItemTypeHash('Ethereum', 'CurrentBlock') === '7b797457e46dc3169a6dccd22ee2edc1e6db93aa21ac3fb94e7ce182c7ab6573';
    }
    /**
     *  The current Ethereum block.
     */
    async getAsV49() {
        (0, assert_1.default)(this.isV49);
        return this._chain.getStorage(this.blockHash, 'Ethereum', 'CurrentBlock');
    }
    /**
     *  The current Ethereum block.
     */
    get isV900() {
        return this._chain.getStorageItemTypeHash('Ethereum', 'CurrentBlock') === 'e00016e7c205d86f63b4d834cdabba952e20551788d0a57067012bbd8d3b5385';
    }
    /**
     *  The current Ethereum block.
     */
    async getAsV900() {
        (0, assert_1.default)(this.isV900);
        return this._chain.getStorage(this.blockHash, 'Ethereum', 'CurrentBlock');
    }
    /**
     *  The current Ethereum block.
     */
    get isV1201() {
        return this._chain.getStorageItemTypeHash('Ethereum', 'CurrentBlock') === '557f002e64a7a02acc455da7da6fbb5ef3003df67793ab8f9702bcda6d0a72be';
    }
    /**
     *  The current Ethereum block.
     */
    async getAsV1201() {
        (0, assert_1.default)(this.isV1201);
        return this._chain.getStorage(this.blockHash, 'Ethereum', 'CurrentBlock');
    }
    /**
     * Checks whether the storage item is defined for the current chain version.
     */
    get isExists() {
        return this._chain.getStorageItemTypeHash('Ethereum', 'CurrentBlock') != null;
    }
}
exports.EthereumCurrentBlockStorage = EthereumCurrentBlockStorage;
//# sourceMappingURL=storage.js.map