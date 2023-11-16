#include <Arduino.h>
#include <ArduinoJson.h>
#include "WiFi.h"
#include <HTTPClient.h>
#include <string>  
#include "time.h"
#include "DHTesp.h"
#include <Wire.h> 
#include "SparkFun_SGP30_Arduino_Library.h"
#include <Preferences.h>
#include <WebServer.h>
#include "preferences_utility.h"
//Déclaration of variables for WIFI
//const char* ssid = "eduspot";




const char* ssid_eduroam = "eduroam";
const char* host_eduroam = "arduino.php5.sk";

const char* ssid = "ESP32-X22";
const char* password = "esp32-x22";

Preferences preferences;

WebServer server(80);


#define PIN 33

String pageHTML = "<!DOCTYPE html>\n"
                  "<html>\n"
                  "<head>\n"
                  "	<title>Connexion Wi-Fi ESP32</title>\n"
                  "</head>\n"
                  "<body>\n"
                  "	<h1>Entrez les informations de connexion</h1>\n"
                  "	<form action=\"/connexion\" method=\"POST\">\n"
                  "		<label for=\"ssid\">SSID:</label>\n"
                  "		<input type=\"text\" id=\"ssid\" name=\"ssid\"><br><br>\n"
                  "		<label for=\"password\">Mot de passe:</label>\n"
                  "		<input type=\"password\" id=\"password\" name=\"password\"><br><br>\n"
                  "   <label for=\"salle\">Salle :</label>"
                  " <input type=\"text\" id=\"salle\" name=\"salle\"><br><br>"
                  "		<label for=\"identifiant\">Identifiant:</label>"
                  " <input type=\"text\" id=\"identifiant\" name=\"identifiant\"><br><br>"
                  "		<input type=\"submit\" value=\"Connecter\">\n"

                  "	</form>\n"

                      
                      
                  "</body>\n"
                 "</html>\n";

//Varible to API 
const char* serverName = "https://sae34.k8s.iut-larochelle.fr/api/captures";
//variable NTP Server
const char* ntpServer= "pool.ntp.org";
const long gmtOffset_sec= 0;
const int daylightOffset_sec= 3600;
unsigned long lastTime = 0;
unsigned long timerDelay = 5000;
//variable for date
struct tm timeinfo;
char date[200];
//varible for temp & hum
DHTesp dht;
float humidity ;
float temperature;
String salle_value;
String identifiant_value;
//variable for CO2
SGP30 mySensor;
// Get the date 
void printLocalTime(){

  while(!getLocalTime(&timeinfo)){
    Serial.println("Failed to obtain time");
  }
  strftime(date,200, "20%y-%m-%d %H:%M:%S" , &timeinfo);
 
  Serial.print(date);
  Serial.println();

}
// function to send a post to the api for temperature
void postJsonTemp()
{
  
  HTTPClient http; 
      http.begin(serverName);
   
      http.addHeader("accept" ,"application/ld+json");  // type of file who's accepted
      http.addHeader("dbname", "sae34bdx2eq1");  // name of the data base
      http.addHeader("username", "x2eq1"); // usernname
      http.addHeader("userpass", "2dxc3S45jHFUXA68"); // password
      http.addHeader("Content-Type", "application/ld+json"); // file send to the API
      StaticJsonDocument<200> doc; // create a JSON 
      doc["nom"]= "temp"; // name of the value 
      doc["valeur"]= String(temperature); // value
      doc["dateCapture"]= date; // date 
      doc["localisation"] = salle_value; // room 
      doc["description"] = "Température du système d'acquisition 4"; // descriptio,n 
      doc["tag"] = identifiant_value.toInt(); // tag SA 
      
      String httpResquestData;
     
      serializeJson(doc,httpResquestData); // convert JSon to a string
      
      Serial.println(date);
         
      int httpResponseCode = http.POST(httpResquestData); // send a String to the server 

      Serial.print("HTTP Response code: "); // reponse of the API 
      Serial.println(httpResponseCode);
      http.end();
}
// function to send a post to API for CO2
void postJsonCO2()
{
 
  HTTPClient http;
      http.begin(serverName);
   
      http.addHeader("accept" ,"application/ld+json"); 
      http.addHeader("dbname", "sae34bdx2eq1");  
      http.addHeader("username", "x2eq1"); 
      http.addHeader("userpass", "2dxc3S45jHFUXA68");
      http.addHeader("Content-Type", "application/ld+json");
      StaticJsonDocument<200> doc;
      doc["nom"]= "co2";
      doc["valeur"]= String(mySensor.CO2);
      doc["dateCapture"]= date;
      doc["localisation"] = salle_value;
      doc["description"] = "CO2 du système d'acquisition 4";
      doc["tag"] = identifiant_value.toInt();
      
      String httpResquestData;
     
      serializeJson(doc,httpResquestData);       
      int httpResponseCode = http.POST(httpResquestData);

      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
      http.end();
}

//function to send a post to the api 
void postJsonHum()
{
 
  HTTPClient http;
      http.begin(serverName);
   
      http.addHeader("accept" ,"application/ld+json"); 
      http.addHeader("dbname", "sae34bdx2eq1");  
      http.addHeader("username", "x2eq1"); 
      http.addHeader("userpass", "2dxc3S45jHFUXA68");
      http.addHeader("Content-Type", "application/ld+json");
      StaticJsonDocument<200> doc;
      doc["nom"]= "hum";
      doc["valeur"]= String(humidity);
      doc["dateCapture"]= date;
      doc["localisation"] = salle_value;
      doc["description"] = "Humidité du système d'acquisition 4";
      doc["tag"] = identifiant_value.toInt();
      
      String httpResquestData;
     
      serializeJson(doc,httpResquestData);       
      int httpResponseCode = http.POST(httpResquestData);

      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
      http.end();
}





void setup() {
  Serial.begin(9600); // speed of communication between ESP and labtop 
  configTime(daylightOffset_sec, 3600, "pool.ntp.org"); // configure times zone
  Wire.begin();
  preferences.begin("wifi_settings", false); // false indique que nous n'utilisons pas la partition SPIFFS

  //Récupérer les valeurs des préférences
  String ssid_value = preferences.getString("wifi_ssid", "");
  String password_value = preferences.getString("wifi_password", "");
  salle_value = preferences.getString("salle",""); 
  identifiant_value = preferences.getString("identifiant","");
  identifiant_value = identifiant_value.toInt();
  
  if (ssid_value == "" && password_value == "" ) 
  {
    // Si les préférences sont vides, initialiser le point d'accès WiFi
    Serial.println("Initialisation du point d'accès WiFi...");
    WiFi.mode(WIFI_AP);
    WiFi.softAP(ssid, password);

    IPAddress IP = WiFi.softAPIP();
    Serial.print("Point d'accès WiFi initialisé. Adresse IP: ");
    Serial.println(IP);
    
    
  } 
  else 
  {
    // Sinon, se connecter au réseau WiFi
   
    
  
  String type = server.arg("bouton");
  Serial.printf("le type est %s",type);
if (type.isEmpty()) {
  type = "WPA";
}

if (type == "WPA") {
  Serial.printf("Connecting to %s ", ssid_value.c_str());
  WiFi.begin(ssid_value.c_str(), password_value.c_str());
}
else {
  // Type de connexion invalide
  Serial.println("Type de connexion invalide");
}
    int counter = 0;
    while (WiFi.status() != WL_CONNECTED) {
      delay(1000);
      Serial.print(".");
      
      if (counter == 60)
      {
        break;
      }
      counter++;
    }
    Serial.println("");
    Serial.println("WiFi connected");
    Serial.println("IP address: ");
    Serial.println(WiFi.localIP());
     if (WiFi.status() != WL_CONNECTED)
  {
    return;
  }
  }
 
  server.on("/", []() {
    server.send(200, "text/html", pageHTML);
  });

  server.on("/connexion", []() {
    // Récupérer les valeurs du formulaire
    String ssid_value = server.arg("ssid");
    String password_value = server.arg("password");
    String salle = server.arg("salle");
    String identifiant = server.arg("identifiant");
    Serial.printf("identifant2 %S", identifiant);
    

    // Stocker les valeurs dans les préférences
    preferences.putString("wifi_ssid", ssid_value);
    preferences.putString("wifi_password", password_value);
    preferences.putString("salle", salle );
    preferences.putString("identifiant", identifiant );
    


    // Envoyer la réponse HTML
    server.send(200, "text/html", pageHTML);

    // Redémarrer l'ESP32 pour se connecter au nouveau réseau Wi-Fi
    ESP.restart();
    Serial.print("restart");
  });

  server.begin();
  dht.setup(17, DHTesp::DHT22); // initialize the pin of sensor temp & hum
    if (mySensor.begin() == false) {// check if the sensor of co2 is connected
    Serial.println("No SGP30 Detected. Check connections.");
    while (1);
  }
  mySensor.initAirQuality(); // initialize sensor CO2
}

void loop() {

if (digitalRead(PIN) == HIGH) {
    erase_preferences();
    Serial.print("on est dans la pin");
    delay(1000);
    ESP.restart();
  }
  server.handleClient();
if (WiFi.status() == WL_CONNECTED)
{
  mySensor.measureAirQuality(); // get the data of CO2
  printLocalTime(); // get the date
  delay(dht.getMinimumSamplingPeriod());
  
  

 humidity = dht.getHumidity(); // get the humidity 
 temperature = dht.getTemperature();// get the temperature
}
  
  {//Check WiFi connection status
    if(WiFi.status()== WL_CONNECTED){
      postJsonTemp();// call function to send temperature post to the api 
      postJsonHum();// call function to send humidity  post to the api 
      postJsonCO2();// call function to send  CO2 post  to the api 
      
      delay(900000); // send a post all the 15 minutes 
      
    }
    else{
      Serial.println("WiFi Disconnected");
    }
 
}
}