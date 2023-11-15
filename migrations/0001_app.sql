CREATE TABLE `app` (
  `id` TEXT PRIMARY KEY NOT NULL, -- 20 位 GUID
  `name` TEXT NOT NULL,
  `description` TEXT NOT NULL DEFAULT '',
  `logo` TEXT NOT NULL,
  `secret` TEXT NOT NULL, -- JSON 数组 {创建时间，密钥}
  `redirect_uris` TEXT NOT NULL, -- JSON 字串数组
  `homepage` TEXT NOT NULL,
  `forbidden` BOOLEAN NOT NULL DEFAULT false, -- 是否禁止登录
  `created_at` INTEGER NOT NULL DEFAULT current_timestamp,
  `updated_at` INTEGER NOT NULL DEFAULT current_timestamp
);

CREATE INDEX IF NOT EXISTS idx_app ON app(`id`, `forbidden`, `created_at`);
