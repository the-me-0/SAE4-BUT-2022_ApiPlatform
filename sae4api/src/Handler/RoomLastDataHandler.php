<?php

namespace App\Handler;

use App\Entity\Room;
use Symfony\Component\HttpClient\HttpClient;
use App\Handler\DataProvider;

class RoomLastDataHandler
{
    private DataProvider $dataProvider;

    private function handle($room, $limit=3)
    {
        $dataProvider = new DataProvider();

    }
}
