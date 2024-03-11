import { defineWorkspace, configDefaults } from 'vitest/config';

const workspace = defineWorkspace([
  'packages/abstractions',
  'packages/authentication/azure'
])

export default workspace;