<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230404120428 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE advice ADD sentence VARCHAR(1000) DEFAULT NULL, ADD types LONGTEXT NOT NULL COMMENT \'(DC2Type:array)\', DROP temp_sentence, DROP hum_sentence');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE advice ADD hum_sentence VARCHAR(1000) DEFAULT NULL, DROP types, CHANGE sentence temp_sentence VARCHAR(1000) DEFAULT NULL');
    }
}
