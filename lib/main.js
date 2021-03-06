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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github_1 = require("@actions/github");
const comment_1 = require("./comment");
function run() {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        const number = ((_c = (_b = (_a = github_1.context) === null || _a === void 0 ? void 0 : _a.payload) === null || _b === void 0 ? void 0 : _b.pull_request) === null || _c === void 0 ? void 0 : _c.number) ||
            +core.getInput("number", { required: false });
        if (isNaN(number) || number < 1) {
            core.info("no numbers given: skip step");
            return;
        }
        try {
            const repo = github_1.context.repo;
            const body = core.getInput("message", { required: true });
            const githubToken = core.getInput("GITHUB_TOKEN", { required: true });
            const octokit = new github_1.GitHub(githubToken);
            const previous = yield comment_1.findPreviousComment(octokit, repo, number);
            if (previous) {
                yield comment_1.updateComment(octokit, repo, previous.id, body);
            }
            else {
                yield comment_1.createComment(octokit, repo, number, body);
            }
        }
        catch ({ message }) {
            core.setFailed(message);
        }
    });
}
run();
