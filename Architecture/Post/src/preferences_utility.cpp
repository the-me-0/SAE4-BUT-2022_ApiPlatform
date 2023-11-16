#include "preferences_utility.h"
#include "nvs_flash.h"
#include "nvs.h"

void erase_preferences(void) {
    esp_err_t err = nvs_flash_init();
    if (err == ESP_ERR_NVS_NO_FREE_PAGES || err == ESP_ERR_NVS_NEW_VERSION_FOUND) {
        // Gérer les erreurs
    }
    
    nvs_handle_t my_handle;
    err = nvs_open("storage_namespace", NVS_READWRITE, &my_handle);
    if (err != ESP_OK) {
        // Gérer les erreurs
    }
    
    err = nvs_erase_all(my_handle);
    if (err != ESP_OK) {
        // Gérer les erreurs
    }
    
    nvs_close(my_handle);
    
    err = nvs_flash_erase();
    if (err != ESP_OK) {
        // Gérer les erreurs
    }
}
