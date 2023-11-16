<?php

namespace App\Listener;

use App\Entity\Room;
use Doctrine\ORM\Event\LifecycleEventArgs;

use App\Service\AdviceSupervisor;

class RoomListener
{
  public function __construct(AdviceSupervisor $adviceSupervisor)
  {
    $this->adviceSupervisor = $adviceSupervisor;
  }

  public function postLoad(Room $room, LifecycleEventArgs $event)
  {
    $this->adviceSupervisor->setAdvice($room, $event->getEntityManager());
  }
}