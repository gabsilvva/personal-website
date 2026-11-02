import * as migration_20261102_144836_initial from './20261102_144836_initial';

export const migrations = [
  {
    up: migration_20261102_144836_initial.up,
    down: migration_20261102_144836_initial.down,
    name: '20261102_144836_initial'
  },
];
