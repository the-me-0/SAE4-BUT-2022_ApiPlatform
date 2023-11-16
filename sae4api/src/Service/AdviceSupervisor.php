<?php

namespace App\Service;

use App\Entity\Room;
use App\Entity\Advice;
use App\Module\IsTemperatureOk;
use App\Module\IsCo2Ok;
use Doctrine\ORM\EntityManagerInterface;

/*
 * AdviceSupervisor service takes a room and a parameter, then returns a valid advice.
 * The returned advice is either an advice created before-hand, or a fresh new advice, if no else valid advice existed before the use() call.
 */
class AdviceSupervisor
{
  /* main function */
  public function setAdvice(Room $room, $em)
  {
    /* We first need to verify that the room is in alert ; otherwise we set the advice to null */
    $temperatureModule = new IsTemperatureOk();
    $co2Module = new IsCo2Ok();
    $co2Data = $co2Module->use($room->requestLastData('co2'));
    $tempData = $temperatureModule->use($room->requestLastData('temp'));
    $data = ["co2" => $co2Data, "temp" => $tempData];

    if(($co2Data != null && $co2Data["ok"]) && ($tempData != null && $tempData["ok"])) {
      $room->setAdvice(null);
      return;
    }
    $advice = null;
    /* We then need to check if there is an active Advice */
    if($room->getAdvice() != null && $room->getAdvice()->getEndDate() > new \DateTime()) {
      /* Means there is an active advice already set, so we don't have to create a new one */
      return;
    } else {
      $advice = new Advice();
    }

    /* There isn't any active Advice, we need to create one */
    $advice->setEndDate(new \DateTime('+15 minutes'));
    $advice->setSentence($this->createAdviceSentence($data));
    if($co2Data != null && $tempData != null) {
      $advice->setTypes(["co2", "temp"]);
    } else if($co2Data != null) {
      $advice->setTypes(["co2"]);
    } else if($tempData != null) {
      $advice->setTypes(["temp"]);
    }
    $room->setAdvice($advice);
    $em->persist($advice);
    $em->flush();
  }

  /* This function creates a sentence according to the difference of temperature received */
  private function createAdviceSentence($data, $type= "temp") : string
  {
    $sentence = "";
    /* CO2 PROBLEM PART */
    if($data["co2"] != null) {
      /* CO2 AND TEMP PROBLEM PART */
      if($data["temp"] != null) {
        $sentence = self::sentenceTemplate["co2"]["tooHigh"]["tempProblem"];
        /* CO2 PROBLEM ONLY PART */
      } else {
        $sentence = self::sentenceTemplate["co2"]["tooHigh"]["tempOk"];
      }
      /* ONLY TEMP PROBLEM PART */
    } else {
      /**/
      if (($data['temp']['outdoor'] > $data['temp']['actual'])
        && ($data['temp']['gap'] > 0)) {
        // Means that the outdoor is warmer than the room, and the temperature is too high
        $sentence = self::sentenceTemplate["temp"]["tooHigh"]["outdoorWarmer"];
      } else if (($data['temp']['outdoor'] < $data['temp']['actual'])
        || ($data['temp']['gap'] > 0)) {
        // Means that the outdoor is colder than the room, and the temperature is too high
        $sentence = self::sentenceTemplate["temp"]["tooHigh"]["outdoorColder"];
      } else if (($data['temp']['outdoor'] > $data['temp']['actual'])
        || ($data['gap'] < 0)) {
        // Means that the outdoor is warmer than the room, and the temperature is too low
        $sentence = self::sentenceTemplate["temp"]["tooLow"]["outdoorWarmer"];
      } else if (($data['temp']['outdoor'] < $data['temp']['actual'])
        || ($data['temp']['gap'] < 0)) {
        // Means that the outdoor is colder than the room, and the temperature is too low
        $sentence = self::sentenceTemplate["temp"]["tooLow"]["outdoorColder"];
      }
      $sentence .= $data['temp']['ideal'] . "°C";
    }
    return $sentence;
  }
  const sentenceTemplate = [
    "temp" => [
      "tooLow" => [
        "outdoorWarmer" => "Il faut ouvrir les fenêtres pour atteindre une température idéale de ",
        "outdoorColder" => "Il faut fermer les fenêtres et allumer le chauffage pour atteindre une température idéale de "
      ],
      "tooHigh" => [
        "outdoorWarmer" => "Il faut ouvrir les portes et aérer la salle pour atteindre une température idéale de ",
        "outdoorColder" => "Il faut ouvrir les fenêtres et aérer la salle pour atteindre une température idéale de "
      ]
    ],
    "co2" => [
      "tooHigh" => [
        "tempOk" => "Il faut ouvrir les fenêtres et aérer la pièce. Attention pensez à éteindre le chauffage.",
        "tempProblem" => "Il faut ouvrir les fenêtres et aérer la pièce. Attention pensez à éteindre le chauffage !"
      ],
    ],
  ];
}
