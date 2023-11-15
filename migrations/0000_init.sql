CREATE TABLE `user` (
  `id` TEXT PRIMARY KEY NOT NULL,
  `username` TEXT NOT NULL,
  `display_name` TEXT NOT NULL,
  `avatar` TEXT NOT NULL,
  `type` TEXT NOT NULL DEFAULT 'user',  -- 用户类型，管理员、VIP、禁止登录等
  `membership` INTEGER NOT NULL DEFAULT current_timestamp, -- 会员有效期
  `created_at` INTEGER NOT NULL DEFAULT current_timestamp
);

CREATE TABLE `third_user` (
  `user_id` TEXT NOT NULL,
  `third_id` TEXT NOT NULL,
  `provider` TEXT NOT NULL,
  `username` TEXT NOT NULL,
  `display_name` TEXT NOT NULL,
  `avatar` TEXT NOT NULL,
  `raw` TEXT NOT NULL,
  `created_at` INTEGER NOT NULL DEFAULT current_timestamp
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_username ON user(`username`);
CREATE UNIQUE INDEX IF NOT EXISTS idx_third_user_pk ON third_user(`user_id`, `third_id`, `provider`);
CREATE INDEX IF NOT EXISTS idx_user ON user(`id`, `created_at`);
CREATE INDEX IF NOT EXISTS idx_third_user ON third_user(`user_id`, `created_at`);
CREATE INDEX IF NOT EXISTS idx_third_search ON third_user(`third_id`, `provider`);
