import * as migration_20261102_144836_initial from './20261102_144836_initial';
import * as migration_20261102_234521_media_storage_prefix from './20261102_234521_media_storage_prefix';
import * as migration_20261103_194507_links_life_no_blog from './20261103_194507_links_life_no_blog';
import * as migration_20261103_214405_media_alt_no_schedule from './20261103_214405_media_alt_no_schedule';

export const migrations = [
  {
    up: migration_20261102_144836_initial.up,
    down: migration_20261102_144836_initial.down,
    name: '20261102_144836_initial',
  },
  {
    up: migration_20261102_234521_media_storage_prefix.up,
    down: migration_20261102_234521_media_storage_prefix.down,
    name: '20261102_234521_media_storage_prefix',
  },
  {
    up: migration_20261103_194507_links_life_no_blog.up,
    down: migration_20261103_194507_links_life_no_blog.down,
    name: '20261103_194507_links_life_no_blog',
  },
  {
    up: migration_20261103_214405_media_alt_no_schedule.up,
    down: migration_20261103_214405_media_alt_no_schedule.down,
    name: '20261103_214405_media_alt_no_schedule'
  },
];
