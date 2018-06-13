#!/usr/bin/env node
const Listr = require('listr');
const execa = require('execa');
const rimraf = require('rimraf');
const {promisify} = require("util");
const rimrafAsync = promisify(rimraf);

const steps = () => [
  {
    title: 'Removing package-lock',
    task: () => rimrafAsync('package-lock.json')
  },
  {
    title: 'Running npm install',
    task: () => execa('npm', ['install'])
  },
  {
    title: 'Adding package-lock to git',
    task: (ctx, task) => execa('git', ['add', 'package-lock.json'])
      .catch(() => task.skip("No need to 'git add'"))
  }
];

function main() {
  return new Listr(steps()).run();
}

main()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
