export class CostumeModel {
    id: number; // baseLayerID;
    name: string; // costumeName
    md5: string; // baseLayerID
    resolution: number; // bitmapResolution
    centerX: number; // rotationCenterX
    centerY: number; // rotationCenterY
    public extension(): string {
      let lastIndex = this.md5.lastIndexOf(".");
      let extension = this.md5.substr(lastIndex + 1);
      return extension;
    }
}
