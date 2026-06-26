CREATE TABLE `wellness_packages` (
  `id` CHAR(36) NOT NULL,
  `name` VARCHAR(120) NOT NULL,
  `description` TEXT NOT NULL,
  `price_cents` INTEGER NOT NULL,
  `duration_minutes` INTEGER NOT NULL,
  `deleted_at` DATETIME(3) NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL,

  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
