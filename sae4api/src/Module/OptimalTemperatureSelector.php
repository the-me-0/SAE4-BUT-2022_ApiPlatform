<?php

namespace App\Module;

use Symfony\Component\HttpClient\HttpClient;

class OptimalTemperatureSelector
{
  /* Attributes */
  var $outdoor;
  private $httpClient;
  private $weatherLink;

  public function __construct()
  {
    $this->weatherLink = $_ENV['TEMPERATURE_LINK'];

    /* Create the http client */
    $this->httpClient = HttpClient::create();

    /* Complete the links with the api key */
    $weather_link = $this->weatherLink . "&appid=" . $_ENV['WEATHER_API_KEY'];

    /* Get the datafrom the api */
    $weatherResponse = $this->httpClient->request('GET', $weather_link);
        
    /* Get the status code */
    $weatherCode = $weatherResponse->getStatusCode();

    /* Decode the data */
    $weatherData = json_decode($weatherResponse->getContent(), true);

    /* Convert the temperature from Kelvin to Celsius */
    $weatherData['main']['temp'] = round($weatherData['main']['temp']-273.15);

    /* Set the objective is the API responded greatfully */
    if ($weatherCode != 200) {
      $this->outdoor = null;
    } else {
      $this->outdoor = $weatherData['main']['temp'];
    }
  }

  /* main function */
  public function use()
  {
    /* Safety check */
    if ($this->outdoor == null) {
      return null;
    }
    $return = ["outdoor" => $this->outdoor];
    if($this->outdoor <= $_ENV["TEMPERATURE_LOW"]) {
      $return["ideal"] = $_ENV['TEMPERATURE_IDEAL_LOW'];
    } else if ($this->outdoor <= $_ENV['TEMPERATURE_HIGH']) {
      $return["ideal"] = $_ENV['TEMPERATURE_IDEAL_MEDIUM'];
    } else {
      $return["ideal"] = $_ENV['TEMPERATURE_IDEAL_HIGH'];
    }
    return $return;
  }
}
