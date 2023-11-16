<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use App\Module\RoomsInAlert;
use App\Entity\Room;

class GetRoomsAlerts extends AbstractController
{
    public function __invoke()
    {
      $roomsInAlert = new RoomsInAlert($this->getDoctrine()->getRepository(Room::class));
      return $this->json($roomsInAlert->use());
    }
}