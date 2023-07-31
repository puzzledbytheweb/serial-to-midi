import { SerialPort } from "serialport";
import * as midi from "midi";

const arduinoPort = "/dev/cu.usbmodem1301"; // Adjust this to the serial port connected to your Arduino
const midiOutputPort = 0; // MIDI output port number (0 is usually the default output)

// Create a MIDI output port
const midiOutput = new midi.Output();

// Open the MIDI output port
try {
  midiOutput.openPort(midiOutputPort);
} catch (error) {
  const availablePorts = midiOutput.getPortCount();
  console.log("Ports available - ", availablePorts);

  throw error;
}

// Create the serial port to read data from Arduino
const port = new SerialPort({
  path: arduinoPort,
  baudRate: 9600, // Adjust this to match the baud rate set in your Arduino code
});

// Read data from the serial port
port.on("data", (data: Buffer) => {
  // Assuming the data received from the Arduino is in the format "X,Y,Z" (e.g., "100,200,300")
  const [x, y, z] = data.toString().split(",").map(parseFloat);

  // Process the data as needed
  // For example, you can send MIDI messages based on the received data
  sendMidiMessage(x, y, z);
});

// Send MIDI messages based on the received data
function sendMidiMessage(x: number, y: number, z: number) {
  // Your MIDI message generation logic goes here
  // For example, you can use the "midiOutput.sendMessage" method to send MIDI messages
  // For simplicity, let's just print the data to the console
  console.log(`X: ${x}, Y: ${y}, Z: ${z}`);
}

// Handle errors
port.on("error", (err: Error) => {
  console.error("Error:", err.message);
});

// Gracefully close MIDI and serial connections on process exit
process.on("exit", () => {
  midiOutput.closePort();
  port.close();
});
