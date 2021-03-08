#!/usr/bin/env node

const core = require('@actions/core')
const github = require('@actions/github')
const { createLogger } = require('@generates/logger')
const dot = require('@ianwalter/dot')
const execa = require('execa')

const logger = createLogger()

async function run () {
  // Commit to the branch specified in inputs.
  let branch = process.env.INPUT_BRANCH

  // If no branch was specified, try to set it to the PR branch.
  if (!branch) branch = dot.get(github.context, 'payload.pull_request.head.ref')

  // If this is not a PR, use the current branch.
  if (!branch) branch = process.env.GITHUB_REF

  // Output the branch that will be used.
  logger.info('Using branch:', branch)

  // TODO: check if branch exists and create it if necessary.

  // Check if there are local changes.
  const { stdout: hasChanges } = await execa('git', ['status', '--porcelain'])
  if (hasChanges) {
    // Add specified files or all changes.
    const files = process.env.INPUT_FILES
      ? process.env.INPUT_FILES.split('\n')
      : '.'
    await execa('git', ['add', files])

    // Check if there are staged changes.
    const args = ['diff', '--staged', '--name-only']
    const { stdout: hasStaged } = await execa('git', args)
    if (hasStaged) {
      // Configure the git user.
      const author = 'github-actions[bot]'
      await execa('git', ['config', '--global', 'user.name', author])
      const email = 'github-actions[bot]@users.noreply.github.com'
      await execa('git', ['config', '--global', 'user.email', email])

      // Commit the changes.
      const message = process.env.INPUT_MESSAGE || 'Automated commit'
      await execa('git', ['commit', '-m', message])

      // Push the changes back to the branch.
      const actor = process.env.INPUT_ACTOR || process.env.GITHUB_ACTOR
      const token = process.env.INPUT_TOKEN
      const repo = process.env.GITHUB_REPOSITORY
      const origin = token
        ? `https://${actor}:${token}@github.com/${repo}.git`
        : 'origin'
      await execa('git', ['push', origin, `HEAD:${branch}`])
    } else {
      logger.info('No staged files', { hasStaged })
    }
  } else {
    logger.info('No local changes', { hasChanges })
  }
}

run().catch(err => {
  logger.error(err)
  core.setFailed(err.message)
})
