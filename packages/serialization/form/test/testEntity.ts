import {
  AdditionalDataHolder,
  DateOnly,
  Duration,
  Parsable,
  ParseNode,
  SerializationWriter,
  TimeOnly,
} from "@microsoft/kiota-abstractions";

export class TestEntity implements Parsable, AdditionalDataHolder {
  public additionalData: Record<string, unknown> = {};
  public id?: string;
  public birthday?: DateOnly;
  public createdDateTime?: Date;
  public workDuration?: Duration;
  public startWorkTime?: TimeOnly;
  public endWorkTime?: TimeOnly;
  public officeLocation?: string;
  getFieldDeserializers(): Record<string, (node: ParseNode) => void> {
    return {
      id: (n) => {
        this.id = n.getStringValue();
      },
      birthday: (n) => {
        this.birthday = n.getDateOnlyValue();
      },
      createdDateTime: (n) => {
        this.createdDateTime = n.getDateValue();
      },
      workDuration: (n) => {
        this.workDuration = n.getDurationValue();
      },
      startWorkTime: (n) => {
        this.startWorkTime = n.getTimeOnlyValue();
      },
      endWorkTime: (n) => {
        this.endWorkTime = n.getTimeOnlyValue();
      },
      officeLocation: (n) => {
        this.officeLocation = n.getStringValue();
      },
    };
  }
  serialize(writer: SerializationWriter): void {
    writer.writeStringValue("id", this.id);
    writer.writeDateOnlyValue("birthday", this.birthday);
    writer.writeDateValue("createdDateTime", this.createdDateTime);
    writer.writeDurationValue("workDuration", this.workDuration);
    writer.writeTimeOnlyValue("startWorkTime", this.startWorkTime);
    writer.writeTimeOnlyValue("endWorkTime", this.endWorkTime);
    writer.writeStringValue("officeLocation", this.officeLocation);
    writer.writeAdditionalData(this.additionalData);
  }
}

export function createTestEntityFromDiscriminator(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  parseNode?: ParseNode
): Parsable {
  return new TestEntity();
}
