import { defineWorkspace, configDefaults } from 'vitest/config';

const workspace = defineWorkspace([
  'packages/abstractions',
  'packages/authentication/*',
  'packages/http/fetch',
  'packages/serialization/*'
])

export default workspace;