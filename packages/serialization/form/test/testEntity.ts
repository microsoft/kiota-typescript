import {
  AdditionalDataHolder,
  DateOnly,
  Duration,
  Parsable,
  ParseNode,
  SerializationWriter,
  TimeOnly,
} from "@microsoft/kiota-abstractions";

export interface TestEntity extends Parsable, AdditionalDataHolder {
  id?: string;
  birthday?: DateOnly;
  createdDateTime?: Date;
  workDuration?: Duration;
  startWorkTime?: TimeOnly;
  endWorkTime?: TimeOnly;
  officeLocation?: string;
}
export function createTestParserFromDiscriminatorValue(
  parseNode: ParseNode | undefined
) {
  if (!parseNode) throw new Error("parseNode cannot be undefined");
  return deserializeTestEntity;
}

export function deserializeTestEntity(
  testEntity: TestEntity | undefined = {}
): Record<string, (node: ParseNode) => void> {
  return {
    id: (n) => {
      testEntity.id = n.getStringValue();
    },
    birthday: (n) => {
      testEntity.birthday = n.getDateOnlyValue();
    },
    createdDateTime: (n) => {
      testEntity.createdDateTime = n.getDateValue();
    },
    workDuration: (n) => {
      testEntity.workDuration = n.getDurationValue();
    },
    startWorkTime: (n) => {
      testEntity.startWorkTime = n.getTimeOnlyValue();
    },
    endWorkTime: (n) => {
      testEntity.endWorkTime = n.getTimeOnlyValue();
    },
    officeLocation: (n) => {
      testEntity.officeLocation = n.getStringValue();
    },
  };
}

export function serializeTestEntity(
  writer: SerializationWriter,
  testEntity: TestEntity | undefined = {}
): void {
  for (const [key, value] of Object.entries(testEntity)) {
    switch (key) {
      case "id":
        writer.writeStringValue("id", testEntity.id);
        break;
      case "birthday":
        writer.writeDateOnlyValue("birthday", testEntity.birthday);
        break;
      case "createdDateTime":
        writer.writeDateValue("createdDateTime", testEntity.createdDateTime);
        break;
      case "workDuration":
        writer.writeDurationValue("workDuration", testEntity.workDuration);
        break;
      case "startWorkTime":
        writer.writeTimeOnlyValue("startWorkTime", testEntity.startWorkTime);
        break;
      case "endWorkTime":
        writer.writeTimeOnlyValue("endWorkTime", testEntity.endWorkTime);
        break;
      case "officeLocation":
        writer.writeStringValue("officeLocation", testEntity.officeLocation);
        break;
      default:
        writer.writeAdditionalData(key, value);
        break;
    }
  }
}
