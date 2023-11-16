const alerts = {
  rooms: [
  {
    "advice": {
      "id": 135,
      "acted": false,
      "sentence": "Il faut fermer les fenêtres et allumer le chauffage pour atteindre une température idéale de 19°C"
    },
    "room_id": 14,
    "room_name": "D206",
    "temperature": {
      "value": 15,
      "variation": "en hausse",
      "difference_target": -4
    },
    "co2": null
  },
  {
    "advice": {
      "id": 136,
      "acted": false,
      "sentence": "Il faut ouvrir les fenêtres pour atteindre une température idéale de 19°C"
    },
    "room_id": 15,
    "room_name": "D207",
    "temperature": {
      "value": 28,
      "variation": "en baisse",
      "difference_target": 3
    },
    "co2": null
  }
]};

const rooms = [
  {
    "id": 13,
    "name": "D205",
    "tag": "1",
    "advice": null
  },
  {
    "id": 14,
    "name": "D206",
    "tag": "2",
    "advice": {
      "id": 86,
      "acted": false,
      "sentence": "Il faut fermer les fenêtres et allumer le chauffage pour atteindre une température idéale de 19°C"
    }
  },
  {
    "id": 15,
    "name": "D207",
    "tag": "3",
    "advice": {
      "id": 87,
      "acted": false,
      "sentence": "Il faut ouvrir les fenêtres pour atteindre une température idéale de 19°C"
    }
  }
];

export { alerts, rooms };