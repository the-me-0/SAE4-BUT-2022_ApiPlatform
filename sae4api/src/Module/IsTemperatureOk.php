<?php

namespace App\Module;

class IsTemperatureOk
{
  /* Attributes */
  private $ideal = null;
  private $outdoor = null;
  private $acceptationGap;

  public function __construct()
  {
    $this->acceptationGap = $_ENV['TEMPERATURE_ACCEPTATION_GAP'];
    $optimalTemperatureSelector = new OptimalTemperatureSelector();
    $optimal = $optimalTemperatureSelector->use();
    $this->outdoor = $optimal['outdoor'];
    $this->ideal = $optimal['ideal'];
  }

  /* main function */
  public function use($temperature)
  {
    /* first case, API call did not return http code 200 */
    if ($this->ideal == null) {
      return null;
    }
    $okay = true;
    /* Second case, we evaluate the temperature according to weather and GAP set up by user */
    /* We first vary the execution according to ideal temperature */
    if(($temperature < $this->ideal - $this->acceptationGap)
    || ($temperature > $this->ideal + $this->acceptationGap)) {
      $okay = false;
    } 
    
    /* If the return value is null, then the temperature is OK */
    return [
      "ok" => $okay,
      "outdoor" => $this->outdoor,
      "ideal" => $this->ideal,
      "actual" => $temperature,
      "gap" => $_ENV['TEMPERATURE_ACCEPTATION_GAP']
    ];
  }
}
