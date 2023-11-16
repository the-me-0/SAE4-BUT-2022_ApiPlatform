<?php
// src/DataFixtures/AppFixtures.php
namespace App\DataFixtures;

use App\Entity\Room;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager)
    {
        $room = new Room();
        $room->setName('D205');
        $room->setTag('1');
        $manager->persist($room);

        $room = new Room();
        $room->setName('D206');
        $room->setTag('2');
        $manager->persist($room);

        $room = new Room();
        $room->setName('D207');
        $room->setTag('3');
        $manager->persist($room);

        $room = new Room();
        $room->setName('D204');
        $room->setTag('4');
        $manager->persist($room);

        $room = new Room();
        $room->setName('D203');
        $room->setTag('5');
        $manager->persist($room);

        $manager->flush();
    }
}
