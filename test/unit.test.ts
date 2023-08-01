import { sendMidiMessage } from "../src"; // Assuming your sendMidiMessage function is exported from app.ts
import { Coordinates } from "../src/helper";

const coordinates = new Coordinates();

// Your test cases
test("Test sendMidiMessage function", () => {
  // Mock your MIDI output here (if needed) or use a spy to check the output behavior
  // For now, let's just check if the function does not throw an error

  // Test case 1: Function should not throw an error
  expect(() => sendMidiMessage(100, 200, 300)).not.toThrow();
  // Add more test cases as needed
});

describe("parseDataBuffer", () => {
  // Test case 1: Complete message with normal format
  test("should parse a complete message with normal format", () => {
    const dataBuffer = Buffer.from("X:123,Y:321,Z:221");
    const result = coordinates.parseDataBuffer(dataBuffer);
    expect(result).toMatchObject({ x: 123, y: 321, z: 221 });
  });

  // Test case 2: Partial messages that combine to form a complete message
  test("should parse partial messages that combine to form a complete message", () => {
    const dataBuffer1 = Buffer.from("X:10");
    const dataBuffer2 = Buffer.from("0,Y:20");
    const dataBuffer3 = Buffer.from(",Z:30");

    let result = coordinates.parseDataBuffer(dataBuffer1);
    expect(result).toBeNull; // Incomplete message

    result = coordinates.parseDataBuffer(dataBuffer2);
    expect(result).toBeNull; // Incomplete message

    result = coordinates.parseDataBuffer(dataBuffer3);
    expect(result).toMatchObject({ x: 10, y: 20, z: 30 });
  });

  // Test case 3: Messages with different lengths
  test("should parse messages with different lengths", () => {
    const dataBuffer1 = Buffer.from("X:123,Y:321,Z:221");
    const dataBuffer2 = Buffer.from("X:444,Y:365,Z:112,X:8");

    let result = coordinates.parseDataBuffer(dataBuffer1);
    expect(result).toMatchObject({ x: 123, y: 321, z: 221 }); // Incomplete message

    result = coordinates.parseDataBuffer(dataBuffer2);
    expect(result).toMatchObject({ x: 444, y: 365, z: 112 }); // Incomplete message
  });

  // Test case 4: Incorrect messages
  test("should handle incorrect messages", () => {
    const dataBuffer1 = Buffer.from("X:123, Y:321, Z:221");
    const dataBuffer2 = Buffer.from("X:abc,Y:321,Z:221");
    const dataBuffer3 = Buffer.from("X:123,Y:def,Z:221");
    const dataBuffer4 = Buffer.from("X:123,Y:321,Z:ghi");
    const dataBuffer5 = Buffer.from("Invalid data format");

    let result = coordinates.parseDataBuffer(dataBuffer1);
    expect(result).toBeNull; // Extra spaces after commas

    result = coordinates.parseDataBuffer(dataBuffer2);
    expect(result).toBeNull; // Non-numeric value for X

    result = coordinates.parseDataBuffer(dataBuffer3);
    expect(result).toBeNull; // Non-numeric value for Y

    result = coordinates.parseDataBuffer(dataBuffer4);
    expect(result).toBeNull; // Non-numeric value for Z

    result = coordinates.parseDataBuffer(dataBuffer5);
    expect(result).toBeNull; // Completely invalid data
  });
});

describe("extractIndividualCoordinates", () => {
  test("Should parse individual coordinates", () => {
    const s = "X:123";
    const s2 = "Y:321";
    const s3 = "Z:222";

    expect(coordinates.extractIndividualCoordinates("X", s)).toBe(123);
    expect(coordinates.extractIndividualCoordinates("Y", s2)).toBe(321);
    expect(coordinates.extractIndividualCoordinates("Z", s3)).toBe(222);
  });

  test("Should parse individual coordinates when string is funky", () => {
    const s = "X:123Y:321";
    const s2 = "Z:222Y";
    const s3 = ":222Y";

    expect(coordinates.extractIndividualCoordinates("X", s)).toBe(123);
    expect(coordinates.extractIndividualCoordinates("Z", s2)).toBe(222);
    expect(coordinates.extractIndividualCoordinates("X", s3)).toBeNull;
  });
});
