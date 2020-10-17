const core = require('@actions/core')
const github = require('@actions/github')
const { createLogger } = require('@generates/logger')
const dot = require('@ianwalter/dot')
const execa = require('execa')

const logger = createLogger()

async function run () {
  // Commit to the branch specified in inputs.
  let branch = process.env.INPUT_COMMIT_BRANCH

  // If no branch was specified, try to set it to the PR branch.
  if (!branch) branch = dot.get(github.context, 'payload.pull_request.head.ref')

  // If this is not a PR, use the current branch.
  if (!branch) branch = process.env.GITHUB_REF

  // TODO: check if branch exists and create it if necessary.

  // Add specified files or all changes.
  const files = process.env.INPUT_COMMIT_FILES
    ? process.env.INPUT_COMMIT_FILES.split('\n')
    : '.'
  await execa('git', ['add', files])

  // Commit the changes.
  const message = process.env.INPUT_COMMIT_MESSAGE || 'Automated commit'
  await execa('git', ['commit', '-m', message])

  // Push the changes back to the branch.
  const actor = process.env.INPUT_GITHUB_ACTOR || process.env.GITHUB_ACTOR
  const token = process.env.INPUT_GITHUB_TOKEN
  const repo = process.env.GITHUB_REPOSITORY
  const origin = token
    ? `https://${actor}:${token}@github.com/${repo}.git`
    : 'origin'
  await execa('git', ['push', origin, `HEAD:${branch}`])
}

run().catch(err => {
  logger.error(err)
  core.setFailed(err.message)
})
