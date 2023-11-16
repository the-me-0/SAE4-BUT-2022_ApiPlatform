<?php

namespace App\Module;

/*
Module that checks whether a given CO2 level respects the recommended values.
Returns :
- Nothing if the rate is ok
- The difference if the rate is higher.
*/
class IsCo2Ok
{
    private $acceptationGap; // margin of error
    private $co2Limit; // co2 limit recommended
    public function __construct()
    {
        $this->acceptationGap = $_ENV['CO2_ACCEPTATION_GAP'];
        $this->co2Limit = $_ENV['CO2_LIMIT'];
    }
    /* Main function */
    public function use($co2)
    {
      $return = null;
      $okay = true;
      if ($co2 > $this->co2Limit + $this->acceptationGap) {
        $okay = false;
      }
      /* If the return value is null, then the temperature is OK */
      return [
        "ok" => $okay,
        "actual" => $co2,
        "limit" => $this->co2Limit,
        "gap" => $_ENV['CO2_ACCEPTATION_GAP']
      ];
    }
}