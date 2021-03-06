import * as core from "@actions/core";
import { context, GitHub } from "@actions/github";
import { findPreviousComment, createComment, updateComment } from "./comment";

async function run() {
  const number =
    context?.payload?.pull_request?.number ||
    +core.getInput("number", { required: false });
  if (isNaN(number) || number < 1) {
    core.info("no numbers given: skip step");
    return;
  }

  try {
    const repo = context.repo;
    const body = core.getInput("message", { required: true });
    const githubToken = core.getInput("GITHUB_TOKEN", { required: true });
    const octokit = new GitHub(githubToken);
    const previous = await findPreviousComment(octokit, repo, number);
    if (previous) {
      await updateComment(octokit, repo, previous.id, body);
    } else {
      await createComment(octokit, repo, number, body);
    }
  } catch ({ message }) {
    core.setFailed(message);
  }
}

run();
