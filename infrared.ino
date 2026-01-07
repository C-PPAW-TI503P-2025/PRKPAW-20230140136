#include <Arduino.h>

const int pinIR = 18;  // Pastikan kabel OUT sensor ke Pin 27 ESP32
const int pinLED = 26; // Lampu Indikator (opsional)

void setup() {
  Serial.begin(115200);
  
  // Konfigurasi Pin
  pinMode(pinIR, INPUT); 
  pinMode(pinLED, OUTPUT);
  
  Serial.println("Sistem Sensor IR Siap...");
}

void loop() {
  // Baca status sensor
  // Sensor IR: 0 (LOW) = Ada Objek, 1 (HIGH) = Kosong
  int statusSensor = digitalRead(pinIR);

  if (statusSensor == LOW) {
    Serial.println("OBJEK TERDETEKSI!");
    digitalWrite(pinLED, HIGH); // Nyalakan LED
  } else {
    // Matikan LED jika tidak ada objek
    digitalWrite(pinLED, LOW);
  }

  delay(100); // Jeda sedikit agar pembacaan stabil
}