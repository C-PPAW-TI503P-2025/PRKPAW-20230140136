#include <Arduino.h>

const uint8_t led = 26;
const uint8_t motionSensor = 27;

unsigned long now;
volatile unsigned long lastTrigger = 0;
volatile bool startTimer = false;
bool printMotion = false;

const unsigned long timeSeconds = 20 * 1000UL; // Waktu nyala lampu

// --- DEBOUNCE LOGIC ---
// Mencegah trigger berulang dalam waktu singkat (misal: 2 detik)
const unsigned long debounceTime = 2000; 
volatile unsigned long lastInterruptTime = 0;

void ARDUINO_ISR_ATTR motionISR() {
  unsigned long interruptTime = millis();
  // Jika trigger baru terjadi kurang dari 2 detik dari trigger sebelumnya, ABAIKAN.
  if (interruptTime - lastInterruptTime > debounceTime) {
    lastTrigger = millis();
    startTimer = true;
    lastInterruptTime = interruptTime;
  }
}

void setup() {
  Serial.begin(115200);
  
  // PENTING: Gunakan INPUT biasa
  pinMode(motionSensor, INPUT);
  
  // Pastikan kabel Data masuk ke GPIO 27
  attachInterrupt(digitalPinToInterrupt(motionSensor), motionISR, RISING);

  pinMode(led, OUTPUT);
  digitalWrite(led, LOW);
  
  Serial.println("Sistem Siap. Menunggu Gerakan...");
}

void loop() {
  now = millis();

  // Nyalakan LED
  if (startTimer && !printMotion) {
    digitalWrite(led, HIGH);
    Serial.println("MOTION DETECTED!!!");
    printMotion = true;
  }

  // Matikan LED setelah 20 detik
  if (startTimer && (now - lastTrigger > timeSeconds)) {
    Serial.println("Motion stopped...");
    digitalWrite(led, LOW);
    startTimer = false;
    printMotion = false;
  }
}