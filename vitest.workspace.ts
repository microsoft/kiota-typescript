import { defineWorkspace, configDefaults } from 'vitest/config';

const workspace = defineWorkspace([
  'packages/abstractions',
  'packages/authentication/*',
  'packages/http/fetch'
])

export default workspace;