import { defineWorkspace, configDefaults } from 'vitest/config';

const workspace = defineWorkspace([
  'packages/abstractions',
  'packages/authentication/*',
])

export default workspace;