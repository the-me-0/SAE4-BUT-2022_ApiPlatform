<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpClient\HttpClient;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use App\Entity\Room;
use App\Module\IsTemperatureOk;
use App\Module\IsCo2Ok;

class GetRoomLastData extends AbstractController
{
    private $room;

    public function __invoke(Room $data, Request $request): ?JsonResponse
    {
        $this->room = $data;
        $type = $request->query->get('type', null);

        $result = [];

        if ($type == null) {
            // User didn't specify a type, we send him temp & co2
            $result["temperature"] = $this->getValueTemperature();
            $result["co2"] = $this->getValueCo2();

        } else if($type == "temp"){
            $result["temperature"] = $this->getValueTemperature();

        } else if ($type == "co2") {
            $result["co2"] = $this->getValueCo2();

        } else {
            // bad type given
            $result = null;
        }

        return JsonResponse::create($result);
    }

    public function getValueTemperature()
    {
        // get the last value
        $temperature = $this->room->getTemperature();

        // set the value
        $result = array(
            "value" => $temperature,
            "objective" => 0,
            "gap" => 0
        );

        // add the calculated values
        $checkTemp = new IsTemperatureOk();
        $idealTemp = $checkTemp->use($result["value"]);
        if($idealTemp != null) {
            $result["objective"] = $idealTemp["ideal"];
            $result["gap"] = $idealTemp["gap"];
        } else {
            $result["objective"] = $result["value"];
        }

        return $result;
    }

    public function getValueCo2()
    {
        // get the last value
        $co2 = $this->room->getCo2();

        // set the value
        $result = array(
            "value" => $co2,
            "objective" => 0,
            "gap" => 0
        );

        // add the calculated values
        $checkCO2 = new IsCo2Ok();
        $idealCO2 = $checkCO2->use($result["value"]);
        if($idealCO2 != null) {
            $result["objective"] = $idealCO2["limit"];
            $result["gap"] = $_ENV['CO2_ACCEPTATION_GAP'];
        } else {
            $result["objective"] = $result["value"];
        }

        return $result;
    }
}