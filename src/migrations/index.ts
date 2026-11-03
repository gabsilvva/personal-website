import * as migration_20261102_144836_initial from './20261102_144836_initial';
import * as migration_20261102_234521_media_storage_prefix from './20261102_234521_media_storage_prefix';

export const migrations = [
  {
    up: migration_20261102_144836_initial.up,
    down: migration_20261102_144836_initial.down,
    name: '20261102_144836_initial',
  },
  {
    up: migration_20261102_234521_media_storage_prefix.up,
    down: migration_20261102_234521_media_storage_prefix.down,
    name: '20261102_234521_media_storage_prefix'
  },
];
