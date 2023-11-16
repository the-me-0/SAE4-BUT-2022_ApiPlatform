<?php

namespace App\Module;

use App\Entity\Room;
use App\Repository\RoomRepository;

class RoomsInAlert
{
  var $roomsRepository;
  var $temperatureJudge;
  var $co2Judge;

  public function __construct($roomsRepository)
  {
    $this->roomsRepository = $roomsRepository;
    $this->temperatureJudge = new IsTemperatureOk();
    $this->co2Judge = new IsCo2Ok();
  }

  /* main function */
  public function use()
  {
    $rooms = $this->roomsRepository->findAll();
    $return = ["rooms" => []];
    /* For each room, we check it's temperature and send it to the judge, then return the judgement */
    foreach ($rooms as $room) {
      $temperature = $room->requestLastData('temp');
      $co2 = $room->requestLastData('co2');
      $tempJudgement = $this->temperatureJudge->use($temperature);
      $co2Judgement = $this->co2Judge->use($co2);
      $temperatureData = null;
      $co2Data = null;

      /* Safeguard */
      if ($temperature == null
      || $co2 == null
      || ($tempJudgement["ok"] && $co2Judgement["ok"])) {
        /* FAILED TO FETCH TEMPERATURE OR VALUES ARE OK (not in alert) */
      } else {
        if($temperature != null) {
          /* returned judgement is an array containing a message & the diff between ideal temperature & real temperature */
          if(!$tempJudgement["ok"]) {
            $tempVariation = $this->checkVariation($room, 'temp');
            $temperatureData = ["value" => $temperature, "variation" => $tempVariation, "difference_target" => round($temperature - $tempJudgement["ideal"], 2)];
          }
        }
        if($co2 != null) {
          /* returned judgement is an array containing a message & the diff between ideal temperature & real temperature */
          if(!$co2Judgement["ok"]) {
            $co2Variation = $this->checkVariation($room, 'co2');
            $co2Data = ["value" => $co2, "variation" => $co2Variation, "difference_target" => round($co2 - $co2Judgement["limit"])];
          }
        }
  
        /* We add the room to the return array */
        $return["rooms"][] = ["room_id" => $room->getId(), "room_name" => $room->getName(), "advice" => $room->getAdvice(), "temperature" => $temperatureData, "co2" => $co2Data];  
      }
    }
    return $return;
  }
  private function checkVariation($room, $type) : ?string
  {
    if(($type != 'temp' && $type != 'co2') || $room == null) {
      return null;
    } else {
      $lastData = $room->requestLastData($type, 5);
      if ($lastData == null) {
        return null;
      } else {
        $variation = "";
        if ($lastData[0] > $lastData[4]) {
          $variation = "en hausse";
        } else if ($lastData[0] < $lastData[4]) {
          $variation = "en baisse";
        } else {
          $variation = "stable";
        }
      }
    }
    return $variation;
  }
}