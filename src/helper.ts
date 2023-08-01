export class Coordinates {
  x: number | null;
  y: number | null;
  z: number | null;

  constructor(x = null, y = null, z = null) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  cleanCoordinates() {
    this.x = null;
    this.y = null;
    this.z = null;
  }

  private hasNullValue(obj: { [key: string]: any }): boolean {
    for (const key in obj) {
      if (obj.hasOwnProperty(key) && obj[key] === null) {
        return true;
      }
    }
    return false;
  }

  extractIndividualCoordinates = (
    coordinateToExtract: string,
    dataString: string
  ) => {
    const regex = coordinateToExtract + `:(\\d+)`; // Regular expression to match "X:123," or "Y:321," format

    const match = dataString.match(regex);

    const value = match?.[0].match(/(\d+)/)?.[0];

    if (value) return parseFloat(value);

    return null;
  };

  parseDataBuffer = (data: Buffer) => {
    const dataString = data.toString();

    this.x = this.x || this.extractIndividualCoordinates("X", dataString);

    this.y = this.y || this.extractIndividualCoordinates("Y", dataString);

    this.z = this.z || this.extractIndividualCoordinates("Z", dataString);

    if (!this.hasNullValue(this)) {
      const finalCoordinates: Coordinates = Object.assign({}, this);

      this.cleanCoordinates();

      return finalCoordinates;
    } else {
      return null;
    }
  };
}
